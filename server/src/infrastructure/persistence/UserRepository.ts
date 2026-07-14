import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { users } from "./schema.js";
import { IUserRepository } from "../../domain/interfaces/IUserRepository.js";
import { User } from "../../domain/entities/User.js";

export class UserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const rows = await db.select().from(users).where(eq(users.id, id));
    return rows.length > 0
      ? User.fromPersistence({ ...rows[0], createdAt: rows[0].createdAt ?? new Date() })
      : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await db.select().from(users).where(eq(users.email, email));
    return rows.length > 0
      ? User.fromPersistence({ ...rows[0], createdAt: rows[0].createdAt ?? new Date() })
      : null;
  }

  async save(user: User): Promise<User> {
    const rows = await db
      .insert(users)
      .values({ email: user.email, name: user.name, passwordHash: user.passwordHash })
      .returning();
    return User.fromPersistence({ ...rows[0], createdAt: rows[0].createdAt ?? new Date() });
  }
}
