import { IProductRepository } from "../../../domain/interfaces/IProductRepository.js";
import { Product } from "../../../domain/entities/Product.js";
import { CreateProductDTO } from "../../dto/CreateProductDTO.js";
import { ProductMapper } from "../../mappers/ProductMapper.js";

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    const productData = ProductMapper.fromCreateDTO(data);
    const product = Product.create(productData);
    return this.productRepository.save(product);
  }
}
