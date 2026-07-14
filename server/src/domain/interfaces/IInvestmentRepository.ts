import { Investment } from "../entities/Investment.js";

export interface IInvestmentRepository {
  findAll(): Promise<Investment[]>;
  findById(id: number): Promise<Investment | null>;
  save(investment: Investment): Promise<Investment>;
  delete(id: number): Promise<void>;
  getTotalInvestments(): Promise<number>;
}
