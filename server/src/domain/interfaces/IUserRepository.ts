import { User } from "../entities/User.js";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}
