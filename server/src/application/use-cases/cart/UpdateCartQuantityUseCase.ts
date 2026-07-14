import { ICartRepository } from "../../../domain/interfaces/ICartRepository.js";
import { IProductRepository } from "../../../domain/interfaces/IProductRepository.js";
import { CartItem } from "../../../domain/entities/CartItem.js";

export class UpdateCartQuantityUseCase {
  constructor(
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(id: number, quantity: number): Promise<CartItem> {
    const item = await this.cartRepository.findById(id);
    if (!item) {
      throw new Error("Cart item not found");
    }

    const product = await this.productRepository.findById(item.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.hasStock(quantity)) {
      throw new Error("Insufficient stock");
    }

    item.updateQuantity(quantity);
    return this.cartRepository.update(id, { quantity });
  }
}
