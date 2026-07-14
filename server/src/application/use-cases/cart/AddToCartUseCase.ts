import { ICartRepository } from "../../../domain/interfaces/ICartRepository.js";
import { IProductRepository } from "../../../domain/interfaces/IProductRepository.js";
import { CartItem } from "../../../domain/entities/CartItem.js";
import { AddToCartDTO } from "../../dto/AddToCartDTO.js";

export class AddToCartUseCase {
  constructor(
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(userId: number, data: AddToCartDTO): Promise<CartItem> {
    const product = await this.productRepository.findById(data.productId);
    if (!product) {
      throw new Error("Product not found");
    }
    if (!product.isActive()) {
      throw new Error("Product is not available");
    }
    if (!product.hasStock(data.quantity)) {
      throw new Error("Insufficient stock");
    }

    const existingItem = await this.cartRepository.findByUserAndProduct(
      userId,
      data.productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + data.quantity;
      if (!product.hasStock(newQuantity)) {
        throw new Error("Insufficient stock");
      }
      existingItem.updateQuantity(newQuantity);
      return this.cartRepository.update(existingItem.id, {
        quantity: newQuantity,
      });
    }

    const cartItem = CartItem.create({
      userId,
      productId: data.productId,
      quantity: data.quantity,
    });

    return this.cartRepository.save(cartItem);
  }
}
