import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { investments } from "./schema.js";
import { IInvestmentRepository } from "../../domain/interfaces/IInvestmentRepository.js";
import { Investment } from "../../domain/entities/Investment.js";

function toDomain(row: any): Investment {
  return Investment.fromPersistence({
    id: row.id,
    userId: row.userId,
    month: row.month ?? "",
    amount: row.amount ?? 0,
    createdAt: row.createdAt ?? new Date(),
  });
}

export class InvestmentRepository implements IInvestmentRepository {
  async findAll(userId: number): Promise<Investment[]> {
    const rows = await db.select().from(investments).where(eq(investments.userId, userId));
    return rows.map(toDomain);
  }

  async save(investment: Investment): Promise<Investment> {
    const rows = await db
      .insert(investments)
      .values({ userId: investment.userId, month: investment.month, amount: investment.amount })
      .returning();
    return toDomain(rows[0]);
  }

  async update(id: number, data: Partial<Investment>): Promise<Investment> {
    const updateData: Record<string, any> = {};
    if (data.month !== undefined) updateData.month = data.month;
    if (data.amount !== undefined) updateData.amount = data.amount;
    const rows = await db.update(investments).set(updateData).where(eq(investments.id, id)).returning();
    return toDomain(rows[0]);
  }

  async delete(id: number): Promise<void> {
    await db.delete(investments).where(eq(investments.id, id));
  }
}
