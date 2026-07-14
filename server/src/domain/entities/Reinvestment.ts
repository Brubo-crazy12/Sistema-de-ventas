import { SaleCategory } from "./Sale.js";

export interface ReinvestmentData {
  id: number;
  userId: number;
  date: string;
  models: string;
  amount: number;
  category: SaleCategory;
  qty: number;
  qtyMl: number;
  qty10: number;
  qty30: number;
  qty60: number;
  qty100: number;
  createdAt: Date;
}

export class Reinvestment {
  id!: number;
  userId!: number;
  date!: string;
  models!: string;
  amount!: number;
  category!: SaleCategory;
  qty!: number;
  qtyMl!: number;
  qty10!: number;
  qty30!: number;
  qty60!: number;
  qty100!: number;
  createdAt!: Date;

  private constructor(data: ReinvestmentData) {
    Object.assign(this, data);
  }

  static create(data: Omit<ReinvestmentData, "id" | "createdAt">): Reinvestment {
    if (!data.models || data.models.trim().length === 0) {
      throw new Error("Description is required");
    }
    if (data.amount < 0) throw new Error("Amount cannot be negative");
    return new Reinvestment({ ...data, id: 0, createdAt: new Date() });
  }

  static fromPersistence(data: ReinvestmentData): Reinvestment {
    return new Reinvestment(data);
  }

  toJSON() {
    return { ...this };
  }
}
