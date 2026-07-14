export interface InvestmentData {
  id: number;
  userId: number;
  month: string;
  amount: number;
  createdAt: Date;
}

export class Investment {
  id!: number;
  userId!: number;
  month!: string;
  amount!: number;
  createdAt!: Date;

  private constructor(data: InvestmentData) {
    Object.assign(this, data);
  }

  static create(data: Omit<InvestmentData, "id" | "createdAt">): Investment {
    if (!data.month || !data.month.trim()) throw new Error("Month is required");
    if (data.amount < 0) throw new Error("Amount cannot be negative");
    return new Investment({ ...data, id: 0, createdAt: new Date() });
  }

  static fromPersistence(data: InvestmentData): Investment {
    return new Investment(data);
  }

  toJSON() {
    return { ...this };
  }
}
