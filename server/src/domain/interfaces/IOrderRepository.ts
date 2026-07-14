import { Order } from "../entities/Order.js";

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: number): Promise<Order | null>;
  findByUserId(userId: number): Promise<Order[]>;
  save(order: Order): Promise<Order>;
  update(id: number, data: Partial<Order>): Promise<Order>;
  delete(id: number): Promise<void>;
}
