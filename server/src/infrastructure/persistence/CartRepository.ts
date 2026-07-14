import { eq, and } from "drizzle-orm";
import { db } from "../config/database.js";
import { cartItems } from "./schema.js";
import { ICartRepository } from "../../domain/interfaces/ICartRepository.js";
import { CartItem } from "../../domain/entities/CartItem.js";
import { CartMapper } from "../../application/mappers/CartMapper.js";

export class CartRepository implements ICartRepository {
  async findByUserId(userId: number): Promise<CartItem[]> {
    const rows = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId));
    return rows.map((row) =>
      CartMapper.toDomain({
        ...row,
        quantity: row.quantity ?? 1,
        createdAt: row.createdAt ?? new Date(),
        updatedAt: row.updatedAt ?? new Date(),
      })
    );
  }

  async findById(id: number): Promise<CartItem | null> {
    const rows = await db.select().from(cartItems).where(eq(cartItems.id, id));
    if (rows.length === 0) return null;
    const row = rows[0];
    return CartMapper.toDomain({
      ...row,
      quantity: row.quantity ?? 1,
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
    });
  }

  async findByUserAndProduct(
    userId: number,
    productId: number
  ): Promise<CartItem | null> {
    const rows = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
      );
    if (rows.length === 0) return null;
    const row = rows[0];
    return CartMapper.toDomain({
      ...row,
      quantity: row.quantity ?? 1,
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
    });
  }

  async save(cartItem: CartItem): Promise<CartItem> {
    const data = CartMapper.toPersistence(cartItem);
    const rows = await db
      .insert(cartItems)
      .values({
        userId: data.userId,
        productId: data.productId,
        quantity: data.quantity,
      })
      .returning();
    const row = rows[0];
    return CartMapper.toDomain({
      ...row,
      quantity: row.quantity ?? 1,
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
    });
  }

  async update(id: number, data: Partial<CartItem>): Promise<CartItem> {
    const updateData: Record<string, unknown> = {};
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    updateData.updatedAt = new Date();

    const rows = await db
      .update(cartItems)
      .set(updateData)
      .where(eq(cartItems.id, id))
      .returning();
    const row = rows[0];
    return CartMapper.toDomain({
      ...row,
      quantity: row.quantity ?? 1,
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
    });
  }

  async delete(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearByUserId(userId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }
}
