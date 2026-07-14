import { IOrderRepository } from "../../../domain/interfaces/IOrderRepository.js";
import { IProductRepository } from "../../../domain/interfaces/IProductRepository.js";
import { ICartRepository } from "../../../domain/interfaces/ICartRepository.js";
import { Order } from "../../../domain/entities/Order.js";
import { OrderItem } from "../../../domain/entities/OrderItem.js";
import { CreateOrderDTO } from "../../dto/CreateOrderDTO.js";
import { OrderMapper } from "../../mappers/OrderMapper.js";

export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private cartRepository: ICartRepository
  ) {}

  async execute(userId: number, data: CreateOrderDTO): Promise<Order> {
    const productIds = data.items.map((item) => item.productId);
    const products = await Promise.all(
      productIds.map((id) => this.productRepository.findById(id))
    );

    const invalidProducts = products.filter((p) => !p || !p.isActive());
    if (invalidProducts.length > 0) {
      throw new Error("Some products are not available");
    }

    for (let i = 0; i < data.items.length; i++) {
      const product = products[i]!;
      const quantity = data.items[i].quantity;
      if (!product.hasStock(quantity)) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }

    const total = data.items.reduce((sum, item, index) => {
      const product = products[index]!;
      return sum + product.price * item.quantity;
    }, 0);

    const order = Order.create({
      userId,
      status: "pending",
      total,
      shippingAddress: data.shippingAddress ?? null,
    });

    const savedOrder = await this.orderRepository.save(order);

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const product = products[i]!;
      const orderItem = OrderItem.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
      await this.productRepository.updateStock(product.id, -item.quantity);
    }

    await this.cartRepository.clearByUserId(userId);

    return savedOrder;
  }
}
