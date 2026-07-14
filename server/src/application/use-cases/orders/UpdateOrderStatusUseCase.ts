import { IOrderRepository } from "../../../domain/interfaces/IOrderRepository.js";
import { Order } from "../../../domain/entities/Order.js";
import { UpdateOrderStatusDTO } from "../../dto/UpdateOrderStatusDTO.js";

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: number, data: UpdateOrderStatusDTO): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    order.updateStatus(data.status);
    return this.orderRepository.update(id, { status: data.status });
  }
}
