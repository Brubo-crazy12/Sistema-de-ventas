import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { reinvestments } from "./schema.js";
import { IReinvestmentRepository } from "../../domain/interfaces/IReinvestmentRepository.js";
import { Reinvestment } from "../../domain/entities/Reinvestment.js";

function toDomain(row: any): Reinvestment {
  return Reinvestment.fromPersistence({
    id: row.id,
    userId: row.userId,
    date: row.date,
    models: row.models ?? "",
    amount: row.amount ?? 0,
    category: row.category ?? "sudaderas",
    qty: row.qty ?? 0,
    qtyMl: row.qtyMl ?? 0,
    qty10: row.qty10 ?? 0,
    qty30: row.qty30 ?? 0,
    qty60: row.qty60 ?? 0,
    qty100: row.qty100 ?? 0,
    createdAt: row.createdAt ?? new Date(),
  });
}

export class ReinvestmentRepository implements IReinvestmentRepository {
  async findAll(userId: number): Promise<Reinvestment[]> {
    const rows = await db.select().from(reinvestments).where(eq(reinvestments.userId, userId));
    return rows.map(toDomain);
  }

  async findById(id: number): Promise<Reinvestment | null> {
    const rows = await db.select().from(reinvestments).where(eq(reinvestments.id, id));
    return rows.length > 0 ? toDomain(rows[0]) : null;
  }

  async save(reinvestment: Reinvestment): Promise<Reinvestment> {
    const rows = await db
      .insert(reinvestments)
      .values({
        userId: reinvestment.userId,
        date: reinvestment.date,
        models: reinvestment.models,
        amount: reinvestment.amount,
        category: reinvestment.category,
        qty: reinvestment.qty,
        qtyMl: reinvestment.qtyMl,
        qty10: reinvestment.qty10,
        qty30: reinvestment.qty30,
        qty60: reinvestment.qty60,
        qty100: reinvestment.qty100,
      })
      .returning();
    return toDomain(rows[0]);
  }

  async update(id: number, data: Partial<Reinvestment>): Promise<Reinvestment> {
    const updateData: Record<string, any> = {};
    if (data.date !== undefined) updateData.date = data.date;
    if (data.models !== undefined) updateData.models = data.models;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.qty !== undefined) updateData.qty = data.qty;
    if (data.qtyMl !== undefined) updateData.qtyMl = data.qtyMl;
    if (data.qty10 !== undefined) updateData.qty10 = data.qty10;
    if (data.qty30 !== undefined) updateData.qty30 = data.qty30;
    if (data.qty60 !== undefined) updateData.qty60 = data.qty60;
    if (data.qty100 !== undefined) updateData.qty100 = data.qty100;
    const rows = await db.update(reinvestments).set(updateData).where(eq(reinvestments.id, id)).returning();
    return toDomain(rows[0]);
  }

  async delete(id: number): Promise<void> {
    await db.delete(reinvestments).where(eq(reinvestments.id, id));
  }
}
