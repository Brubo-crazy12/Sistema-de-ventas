import { IProductRepository } from "../../../domain/interfaces/IProductRepository.js";
import { Product } from "../../../domain/entities/Product.js";
import { UpdateProductDTO } from "../../dto/UpdateProductDTO.js";

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: number, data: UpdateProductDTO): Promise<Product> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new Error("Product not found");
    }
    return this.productRepository.update(id, data as Partial<Product>);
  }
}
