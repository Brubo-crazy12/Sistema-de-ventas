import { IProductRepository } from "../../../domain/interfaces/IProductRepository.js";
import { Product } from "../../../domain/entities/Product.js";

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async executeById(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async executeByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository.findByCategoryId(categoryId);
  }
}
