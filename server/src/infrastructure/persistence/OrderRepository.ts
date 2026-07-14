import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { orders, orderItems } from "./schema.js";
import { IOrderRepository } from "../../domain/interfaces/IOrderRepository.js";
import { Order } from "../../domain/entities/Order.js";
import { OrderMapper } from "../../application/mappers/OrderMapper.js";

export class OrderRepository implements IOrderRepository {
  async findAll(): Promise<Order[]> {
    const rows = await db.select().from(orders);
    const result: Order[] = [];
    for (const row of rows) {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, row.id));
      result.push(
        OrderMapper.toDomain({
          ...row,
          status: row.status ?? "pending",
          total: row.total ?? 0,
          createdAt: row.createdAt ?? new Date(),
          updatedAt: row.updatedAt ?? new Date(),
          items: items.map((i) => ({
            ...i,
            quantity: i.quantity ?? 1,
            price: i.price ?? 0,
          })),
        })
      );
    }
    return result;
  }

  async findById(id: number): Promise<Order | null> {
    const rows = await db.select().from(orders).where(eq(orders.id, id));
    if (rows.length === 0) return null;
    const row = rows[0];
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));
    return OrderMapper.toDomain({
      ...row,
      status: row.status ?? "pending",
      total: row.total ?? 0,
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
      items: items.map((i) => ({
        ...i,
        quantity: i.quantity ?? 1,
        price: i.price ?? 0,
      })),
    });
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId));
    const result: Order[] = [];
    for (const row of rows) {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, row.id));
      result.push(
        OrderMapper.toDomain({
          ...row,
          status: row.status ?? "pending",
          total: row.total ?? 0,
          createdAt: row.createdAt ?? new Date(),
          updatedAt: row.updatedAt ?? new Date(),
          items: items.map((i) => ({
            ...i,
            quantity: i.quantity ?? 1,
            price: i.price ?? 0,
          })),
        })
      );
    }
    return result;
  }

  async save(order: Order): Promise<Order> {
    const data = OrderMapper.toPersistence(order);
    const rows = await db
      .insert(orders)
      .values({
        userId: data.userId,
        status: data.status,
        total: data.total,
        shippingAddress: data.shippingAddress,
      })
      .returning();
    const row = rows[0];
    return OrderMapper.toDomain({
      ...row,
      status: row.status ?? "pending",
      total: row.total ?? 0,
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
      items: [],
    });
  }

  async update(id: number, data: Partial<Order>): Promise<Order> {
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.total !== undefined) updateData.total = data.total;
    if (data.shippingAddress !== undefined)
      updateData.shippingAddress = data.shippingAddress;
    updateData.updatedAt = new Date();

    const rows = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    const row = rows[0];

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    return OrderMapper.toDomain({
      ...row,
      status: row.status ?? "pending",
      total: row.total ?? 0,
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
      items: items.map((i) => ({
        ...i,
        quantity: i.quantity ?? 1,
        price: i.price ?? 0,
      })),
    });
  }

  async delete(id: number): Promise<void> {
    await db.delete(orderItems).where(eq(orderItems.orderId, id));
    await db.delete(orders).where(eq(orders.id, id));
  }
}
