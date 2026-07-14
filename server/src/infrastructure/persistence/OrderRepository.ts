import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { orders } from "./schema.js";
import { IOrderRepository } from "../../domain/interfaces/IOrderRepository.js";
import { Order } from "../../domain/entities/Order.js";

function toDomain(row: any): Order {
  return Order.fromPersistence({
    id: row.id,
    userId: row.userId,
    orderCode: row.orderCode ?? "",
    client: row.client ?? "",
    category: row.category ?? "Sudaderas",
    products: row.products ?? "",
    date: row.date ?? "",
    total: row.total ?? 0,
    status: row.status ?? "Pendiente",
    createdAt: row.createdAt ?? new Date(),
    updatedAt: row.updatedAt ?? new Date(),
  });
}

export class OrderRepository implements IOrderRepository {
  async findAll(userId: number): Promise<Order[]> {
    const rows = await db.select().from(orders).where(eq(orders.userId, userId));
    return rows.map(toDomain);
  }

  async findById(id: number): Promise<Order | null> {
    const rows = await db.select().from(orders).where(eq(orders.id, id));
    return rows.length > 0 ? toDomain(rows[0]) : null;
  }

  async save(order: Order): Promise<Order> {
    const inserted = await db
      .insert(orders)
      .values({
        userId: order.userId,
        orderCode: order.orderCode || `ORD-${Date.now()}`,
        client: order.client,
        category: order.category,
        products: order.products,
        date: order.date,
        total: order.total,
        status: order.status,
      })
      .returning();
    const row = inserted[0];
    const code = `ORD-${1000 + row.id}`;
    const updated = await db
      .update(orders)
      .set({ orderCode: code, updatedAt: new Date() })
      .where(eq(orders.id, row.id))
      .returning();
    return toDomain(updated[0]);
  }

  async update(id: number, data: Partial<Order>): Promise<Order> {
    const updateData: Record<string, any> = {};
    if (data.client !== undefined) updateData.client = data.client;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.products !== undefined) updateData.products = data.products;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.total !== undefined) updateData.total = data.total;
    if (data.status !== undefined) updateData.status = data.status;
    updateData.updatedAt = new Date();
    const rows = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    return toDomain(rows[0]);
  }

  async delete(id: number): Promise<void> {
    await db.delete(orders).where(eq(orders.id, id));
  }
}
