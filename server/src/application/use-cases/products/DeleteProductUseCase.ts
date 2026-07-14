import { IProductRepository } from "../../../domain/interfaces/IProductRepository.js";

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new Error("Product not found");
    }
    await this.productRepository.delete(id);
  }
}
