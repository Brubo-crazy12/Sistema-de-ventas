import { User, UserData } from "../../domain/entities/User.js";

export class UserMapper {
  static toDomain(row: UserData): User {
    return User.fromPersistence({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }

  static toPersistence(user: User): UserData {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
