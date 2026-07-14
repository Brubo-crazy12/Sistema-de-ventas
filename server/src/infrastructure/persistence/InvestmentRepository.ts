import { eq, sql } from "drizzle-orm";
import { db } from "../config/database.js";
import { investments } from "./schema.js";
import { IInvestmentRepository } from "../../domain/interfaces/IInvestmentRepository.js";
import { Investment } from "../../domain/entities/Investment.js";
import { InvestmentMapper } from "../../application/mappers/InvestmentMapper.js";

export class InvestmentRepository implements IInvestmentRepository {
  async findAll(): Promise<Investment[]> {
    const rows = await db.select().from(investments);
    return rows.map((row) =>
      InvestmentMapper.toDomain({
        ...row,
        createdAt: row.createdAt ?? new Date(),
      })
    );
  }

  async findById(id: number): Promise<Investment | null> {
    const rows = await db
      .select()
      .from(investments)
      .where(eq(investments.id, id));
    if (rows.length === 0) return null;
    const row = rows[0];
    return InvestmentMapper.toDomain({
      ...row,
      createdAt: row.createdAt ?? new Date(),
    });
  }

  async save(investment: Investment): Promise<Investment> {
    const data = InvestmentMapper.toPersistence(investment);
    const rows = await db
      .insert(investments)
      .values({
        description: data.description,
        amount: data.amount,
        date: data.date,
      })
      .returning();
    const row = rows[0];
    return InvestmentMapper.toDomain({
      ...row,
      createdAt: row.createdAt ?? new Date(),
    });
  }

  async delete(id: number): Promise<void> {
    await db.delete(investments).where(eq(investments.id, id));
  }

  async getTotalInvestments(): Promise<number> {
    const result = await db
      .select({ total: sql<number>`COALESCE(SUM(${investments.amount}), 0)` })
      .from(investments);
    return Number(result[0]?.total ?? 0);
  }
}
