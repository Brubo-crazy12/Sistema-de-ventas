import { Investment } from "../entities/Investment.js";

export interface IInvestmentRepository {
  findAll(userId: number): Promise<Investment[]>;
  save(investment: Investment): Promise<Investment>;
  update(id: number, data: Partial<Investment>): Promise<Investment>;
  delete(id: number): Promise<void>;
}
