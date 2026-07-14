export interface UserData {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  role: "admin" | "user";
  createdAt: Date;
}

export class User {
  id!: number;
  email!: string;
  name!: string;
  passwordHash!: string;
  role!: "admin" | "user";
  createdAt!: Date;

  private constructor(data: UserData) {
    Object.assign(this, data);
  }

  static create(data: Omit<UserData, "id" | "createdAt"> & { role?: "admin" | "user" }): User {
    if (!data.email || !data.email.includes("@")) throw new Error("Invalid email");
    if (!data.name) throw new Error("Name is required");
    return new User({
      ...data,
      role: data.role ?? "user",
      id: 0,
      createdAt: new Date(),
    });
  }

  static fromPersistence(data: UserData): User {
    return new User(data);
  }

  toJSON() {
    const { passwordHash, ...rest } = this;
    return rest;
  }
}
