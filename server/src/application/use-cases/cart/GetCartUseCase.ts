import { ICartRepository } from "../../../domain/interfaces/ICartRepository.js";
import { IProductRepository } from "../../../domain/interfaces/IProductRepository.js";
import { Product } from "../../../domain/entities/Product.js";

export interface CartItemWithProduct {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

export class GetCartUseCase {
  constructor(
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(userId: number): Promise<CartItemWithProduct[]> {
    const cartItems = await this.cartRepository.findByUserId(userId);

    const itemsWithProducts: CartItemWithProduct[] = [];

    for (const item of cartItems) {
      const product = await this.productRepository.findById(item.productId);
      if (product) {
        itemsWithProducts.push({
          id: item.id,
          userId: item.userId,
          productId: item.productId,
          quantity: item.quantity,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          product,
        });
      }
    }

    return itemsWithProducts;
  }
}
