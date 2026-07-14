import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { users } from "./schema.js";
import { IUserRepository } from "../../domain/interfaces/IUserRepository.js";
import { User } from "../../domain/entities/User.js";
import { UserMapper } from "../../application/mappers/UserMapper.js";

export class UserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const rows = await db.select().from(users);
    return rows.map((row) =>
      UserMapper.toDomain({
        ...row,
        role: row.role ?? "user",
        createdAt: row.createdAt ?? new Date(),
        updatedAt: row.updatedAt ?? new Date(),
      })
    );
  }

  async findById(id: number): Promise<User | null> {
    const rows = await db.select().from(users).where(eq(users.id, id));
    if (rows.length === 0) return null;
    const row = rows[0];
    return UserMapper.toDomain({
      ...row,
      role: row.role ?? "user",
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await db.select().from(users).where(eq(users.email, email));
    if (rows.length === 0) return null;
    const row = rows[0];
    return UserMapper.toDomain({
      ...row,
      role: row.role ?? "user",
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
    });
  }

  async save(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const rows = await db
      .insert(users)
      .values({
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        role: data.role,
      })
      .returning();
    const row = rows[0];
    return UserMapper.toDomain({
      ...row,
      role: row.role ?? "user",
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
    });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const updateData: Record<string, unknown> = {};
    if (data.email !== undefined) updateData.email = data.email;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.passwordHash !== undefined)
      updateData.passwordHash = data.passwordHash;
    if (data.role !== undefined) updateData.role = data.role;
    updateData.updatedAt = new Date();

    const rows = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    const row = rows[0];
    return UserMapper.toDomain({
      ...row,
      role: row.role ?? "user",
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
    });
  }

  async delete(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}
