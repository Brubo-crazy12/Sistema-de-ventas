import { OrderStatus } from "../entities/Order.js";

export class OrderStatusVO {
  readonly value: OrderStatus;

  private static readonly VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    pending: ["shipped", "cancelled"],
    shipped: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
  };

  private constructor(value: OrderStatus) {
    this.value = value;
  }

  static create(value: OrderStatus): OrderStatusVO {
    const validStatuses: OrderStatus[] = ["pending", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid order status: ${value}`);
    }
    return new OrderStatusVO(value);
  }

  canTransitionTo(next: OrderStatusVO): boolean {
    return OrderStatusVO.VALID_TRANSITIONS[this.value].includes(next.value);
  }

  isTerminal(): boolean {
    return this.value === "delivered" || this.value === "cancelled";
  }

  equals(other: OrderStatusVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static pending(): OrderStatusVO {
    return new OrderStatusVO("pending");
  }

  static shipped(): OrderStatusVO {
    return new OrderStatusVO("shipped");
  }

  static delivered(): OrderStatusVO {
    return new OrderStatusVO("delivered");
  }

  static cancelled(): OrderStatusVO {
    return new OrderStatusVO("cancelled");
  }
}
