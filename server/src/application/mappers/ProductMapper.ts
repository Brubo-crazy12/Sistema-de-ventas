import { Product, ProductData } from "../../domain/entities/Product.js";
import { CreateProductDTO } from "../dto/CreateProductDTO.js";

export class ProductMapper {
  static toDomain(row: ProductData): Product {
    return Product.fromPersistence({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }

  static toPersistence(product: Product): ProductData {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static fromCreateDTO(dto: CreateProductDTO): Omit<ProductData, "id" | "createdAt" | "updatedAt"> {
    return {
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      stock: dto.stock,
      categoryId: dto.categoryId,
      imageUrl: dto.imageUrl ?? null,
      active: 1,
    };
  }
}
