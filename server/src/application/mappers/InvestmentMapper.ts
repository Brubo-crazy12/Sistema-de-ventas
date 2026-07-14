import { Investment, InvestmentData } from "../../domain/entities/Investment.js";

export class InvestmentMapper {
  static toDomain(row: InvestmentData): Investment {
    return Investment.fromPersistence({
      ...row,
      createdAt: new Date(row.createdAt),
    });
  }

  static toPersistence(investment: Investment): InvestmentData {
    return {
      id: investment.id,
      description: investment.description,
      amount: investment.amount,
      date: investment.date,
      createdAt: investment.createdAt,
    };
  }
}
