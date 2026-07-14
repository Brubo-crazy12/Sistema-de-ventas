import { IProductRepository } from "../../../domain/interfaces/IProductRepository.js";

export class UpdateStockUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: number, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    if (quantity < 0 && product.stock + quantity < 0) {
      throw new Error("Insufficient stock");
    }
    await this.productRepository.updateStock(id, quantity);
  }
}
