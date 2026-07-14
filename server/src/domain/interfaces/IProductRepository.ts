import { Product } from "../entities/Product.js";

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findByCategoryId(categoryId: number): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  update(id: number, data: Partial<Product>): Promise<Product>;
  delete(id: number): Promise<void>;
  updateStock(id: number, quantity: number): Promise<void>;
}
