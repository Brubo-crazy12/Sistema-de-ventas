import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { products } from "./schema.js";
import { IProductRepository } from "../../domain/interfaces/IProductRepository.js";
import { Product } from "../../domain/entities/Product.js";
import { ProductMapper } from "../../application/mappers/ProductMapper.js";

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    const rows = await db.select().from(products);
    return rows.map((row) =>
      ProductMapper.toDomain({
        ...row,
        active: row.active ?? 1,
        createdAt: row.createdAt ?? new Date(),
        updatedAt: row.updatedAt ?? new Date(),
      })
    );
  }

  async findById(id: number): Promise<Product | null> {
    const rows = await db.select().from(products).where(eq(products.id, id));
    if (rows.length === 0) return null;
    const row = rows[0];
    return ProductMapper.toDomain({
      ...row,
      active: row.active ?? 1,
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
    });
  }

  async findByCategoryId(categoryId: number): Promise<Product[]> {
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.categoryId, categoryId));
    return rows.map((row) =>
      ProductMapper.toDomain({
        ...row,
        active: row.active ?? 1,
        createdAt: row.createdAt ?? new Date(),
        updatedAt: row.updatedAt ?? new Date(),
      })
    );
  }

  async save(product: Product): Promise<Product> {
    const data = ProductMapper.toPersistence(product);
    const rows = await db
      .insert(products)
      .values({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
        active: data.active,
      })
      .returning();
    const row = rows[0];
    return ProductMapper.toDomain({
      ...row,
      active: row.active ?? 1,
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
    });
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.active !== undefined) updateData.active = data.active;
    updateData.updatedAt = new Date();

    const rows = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    const row = rows[0];
    return ProductMapper.toDomain({
      ...row,
      active: row.active ?? 1,
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
    });
  }

  async delete(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async updateStock(id: number, quantity: number): Promise<void> {
    const rows = await db
      .update(products)
      .set({
        stock: quantity,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    if (rows.length === 0) {
      throw new Error("Product not found");
    }
  }
}
