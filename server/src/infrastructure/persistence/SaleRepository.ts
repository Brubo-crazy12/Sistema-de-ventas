import { eq, and } from "drizzle-orm";
import { db } from "../config/database.js";
import { sales } from "./schema.js";
import { ISaleRepository } from "../../domain/interfaces/ISaleRepository.js";
import { Sale, SaleCategory } from "../../domain/entities/Sale.js";

function toDomain(row: any): Sale {
  return Sale.fromPersistence({
    id: row.id,
    userId: row.userId,
    category: row.category,
    date: row.date,
    client: row.client,
    item: row.item ?? "",
    perfume: row.perfume ?? "",
    size: row.size ?? "",
    qty: row.qty ?? 1,
    price: row.price ?? 0,
    cost: row.cost ?? 0,
    status: row.status ?? "pagado",
    paidAmount: row.paidAmount ?? 0,
    dueDate: row.dueDate ?? "",
    refillMl: row.refillMl ?? 0,
    createdAt: row.createdAt ?? new Date(),
    updatedAt: row.updatedAt ?? new Date(),
  });
}

export class SaleRepository implements ISaleRepository {
  async findAll(userId: number): Promise<Sale[]> {
    const rows = await db.select().from(sales).where(eq(sales.userId, userId));
    return rows.map(toDomain);
  }

  async findByCategory(userId: number, category: SaleCategory): Promise<Sale[]> {
    const rows = await db
      .select()
      .from(sales)
      .where(and(eq(sales.userId, userId), eq(sales.category, category)));
    return rows.map(toDomain);
  }

  async findById(id: number): Promise<Sale | null> {
    const rows = await db.select().from(sales).where(eq(sales.id, id));
    return rows.length > 0 ? toDomain(rows[0]) : null;
  }

  async save(sale: Sale): Promise<Sale> {
    const rows = await db
      .insert(sales)
      .values({
        userId: sale.userId,
        category: sale.category,
        date: sale.date,
        client: sale.client,
        item: sale.item,
        perfume: sale.perfume,
        size: sale.size,
        qty: sale.qty,
        price: sale.price,
        cost: sale.cost,
        status: sale.status,
        paidAmount: sale.paidAmount,
        dueDate: sale.dueDate,
        refillMl: sale.refillMl,
      })
      .returning();
    return toDomain(rows[0]);
  }

  async update(id: number, data: Partial<Sale>): Promise<Sale> {
    const updateData: Record<string, any> = {};
    if (data.client !== undefined) updateData.client = data.client;
    if (data.item !== undefined) updateData.item = data.item;
    if (data.perfume !== undefined) updateData.perfume = data.perfume;
    if (data.size !== undefined) updateData.size = data.size;
    if (data.qty !== undefined) updateData.qty = data.qty;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.cost !== undefined) updateData.cost = data.cost;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.paidAmount !== undefined) updateData.paidAmount = data.paidAmount;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.date !== undefined) updateData.date = data.date;
    updateData.updatedAt = new Date();
    const rows = await db.update(sales).set(updateData).where(eq(sales.id, id)).returning();
    return toDomain(rows[0]);
  }

  async delete(id: number): Promise<void> {
    await db.delete(sales).where(eq(sales.id, id));
  }
}
