import { eq, and } from "drizzle-orm";
import { db } from "../config/database.js";
import { products } from "./schema.js";
import { IProductRepository } from "../../domain/interfaces/IProductRepository.js";
import { Product, type Category } from "../../domain/entities/Product.js";

function toDomain(row: any): Product {
  return Product.fromPersistence({
    id: row.id,
    userId: row.userId,
    name: row.name ?? "",
    sku: row.sku ?? "",
    category: row.category ?? "Sudaderas",
    price: row.price ?? 0,
    qty: row.qty ?? 0,
    stockStatus: row.stockStatus ?? "En stock",
    createdAt: row.createdAt ?? new Date(),
    updatedAt: row.updatedAt ?? new Date(),
  });
}

export class ProductRepository implements IProductRepository {
  async findAll(userId: number): Promise<Product[]> {
    const rows = await db.select().from(products).where(eq(products.userId, userId));
    return rows.map(toDomain);
  }

  async findByCategory(userId: number, category: Category): Promise<Product[]> {
    const rows = await db
      .select()
      .from(products)
      .where(and(eq(products.userId, userId), eq(products.category, category)));
    return rows.map(toDomain);
  }

  async findById(id: number): Promise<Product | null> {
    const rows = await db.select().from(products).where(eq(products.id, id));
    return rows.length > 0 ? toDomain(rows[0]) : null;
  }

  async save(product: Product): Promise<Product> {
    const rows = await db
      .insert(products)
      .values({
        userId: product.userId,
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        qty: product.qty,
        stockStatus: product.stockStatus,
      })
      .returning();
    return toDomain(rows[0]);
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.qty !== undefined) updateData.qty = data.qty;
    if (data.stockStatus !== undefined) updateData.stockStatus = data.stockStatus;
    updateData.updatedAt = new Date();
    const rows = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
    return toDomain(rows[0]);
  }

  async delete(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
}
