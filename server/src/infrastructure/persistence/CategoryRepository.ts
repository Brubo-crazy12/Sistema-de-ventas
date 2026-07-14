import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { categories } from "./schema.js";
import { ICategoryRepository } from "../../domain/interfaces/ICategoryRepository.js";
import { Category } from "../../domain/entities/Category.js";
import { CategoryMapper } from "../../application/mappers/CategoryMapper.js";

export class CategoryRepository implements ICategoryRepository {
  async findAll(): Promise<Category[]> {
    const rows = await db.select().from(categories);
    return rows.map((row) =>
      CategoryMapper.toDomain({
        ...row,
        createdAt: row.createdAt ?? new Date(),
      })
    );
  }

  async findById(id: number): Promise<Category | null> {
    const rows = await db.select().from(categories).where(eq(categories.id, id));
    if (rows.length === 0) return null;
    const row = rows[0];
    return CategoryMapper.toDomain({
      ...row,
      createdAt: row.createdAt ?? new Date(),
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug));
    if (rows.length === 0) return null;
    const row = rows[0];
    return CategoryMapper.toDomain({
      ...row,
      createdAt: row.createdAt ?? new Date(),
    });
  }

  async save(category: Category): Promise<Category> {
    const data = CategoryMapper.toPersistence(category);
    const rows = await db
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl,
      })
      .returning();
    const row = rows[0];
    return CategoryMapper.toDomain({
      ...row,
      createdAt: row.createdAt ?? new Date(),
    });
  }

  async update(id: number, data: Partial<Category>): Promise<Category> {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    const rows = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    const row = rows[0];
    return CategoryMapper.toDomain({
      ...row,
      createdAt: row.createdAt ?? new Date(),
    });
  }

  async delete(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }
}
