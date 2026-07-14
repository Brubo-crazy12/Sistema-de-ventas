import { Category } from "../entities/Category.js";

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  save(category: Category): Promise<Category>;
  update(id: number, data: Partial<Category>): Promise<Category>;
  delete(id: number): Promise<void>;
}
