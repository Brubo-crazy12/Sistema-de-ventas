export interface InvestmentData {
  id: number;
  description: string;
  amount: number;
  date: Date;
  createdAt: Date;
}

export class Investment {
  id: number;
  description: string;
  amount: number;
  date: Date;
  createdAt: Date;

  private constructor(data: InvestmentData) {
    this.id = data.id;
    this.description = data.description;
    this.amount = data.amount;
    this.date = data.date;
    this.createdAt = data.createdAt;
  }

  static create(
    data: Omit<InvestmentData, "id" | "createdAt">
  ): Investment {
    if (!data.description || data.description.trim().length === 0) {
      throw new Error("Investment description is required");
    }
    if (data.amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    return new Investment({
      ...data,
      id: 0,
      createdAt: new Date(),
    });
  }

  static fromPersistence(data: InvestmentData): Investment {
    return new Investment(data);
  }

  toJSON() {
    return { ...this };
  }
}
