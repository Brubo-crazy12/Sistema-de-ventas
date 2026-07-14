import { Product, type Category } from "../entities/Product.js";

export interface IProductRepository {
  findAll(userId: number): Promise<Product[]>;
  findByCategory(userId: number, category: Category): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  save(product: Product): Promise<Product>;
  update(id: number, data: Partial<Product>): Promise<Product>;
  delete(id: number): Promise<void>;
}
