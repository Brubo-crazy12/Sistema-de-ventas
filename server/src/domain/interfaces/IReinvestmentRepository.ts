import { Reinvestment } from "../entities/Reinvestment.js";

export interface IReinvestmentRepository {
  findAll(userId: number): Promise<Reinvestment[]>;
  findById(id: number): Promise<Reinvestment | null>;
  save(reinvestment: Reinvestment): Promise<Reinvestment>;
  update(id: number, data: Partial<Reinvestment>): Promise<Reinvestment>;
  delete(id: number): Promise<void>;
}
