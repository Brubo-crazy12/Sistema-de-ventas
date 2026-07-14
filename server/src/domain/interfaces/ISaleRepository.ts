import { Sale, SaleCategory } from "../entities/Sale.js";

export interface ISaleRepository {
  findAll(userId: number): Promise<Sale[]>;
  findByCategory(userId: number, category: SaleCategory): Promise<Sale[]>;
  findById(id: number): Promise<Sale | null>;
  save(sale: Sale): Promise<Sale>;
  update(id: number, data: Partial<Sale>): Promise<Sale>;
  delete(id: number): Promise<void>;
}
