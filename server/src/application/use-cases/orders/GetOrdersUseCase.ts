import { IOrderRepository } from "../../../domain/interfaces/IOrderRepository.js";
import { Order } from "../../../domain/entities/Order.js";

export class GetOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async executeById(id: number): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  async executeByUserId(userId: number): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }
}
