export type UserRole = "user" | "admin";

export interface UserData {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  private constructor(data: UserData) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.passwordHash = data.passwordHash;
    this.role = data.role;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(data: Omit<UserData, "id" | "createdAt" | "updatedAt">): User {
    if (!data.email || !data.email.includes("@")) {
      throw new Error("Invalid email address");
    }
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Name is required");
    }
    if (!data.passwordHash || data.passwordHash.length === 0) {
      throw new Error("Password hash is required");
    }

    return new User({
      ...data,
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(data: UserData): User {
    return new User(data);
  }

  isAdmin(): boolean {
    return this.role === "admin";
  }

  toJSON() {
    const { passwordHash, ...rest } = this;
    return rest;
  }
}
