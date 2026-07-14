import { OrderItem, OrderItemData } from "./OrderItem.js";

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface OrderData {
  id: number;
  userId: number;
  status: OrderStatus;
  total: number;
  shippingAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItemData[];
}

export class Order {
  id: number;
  userId: number;
  status: OrderStatus;
  total: number;
  shippingAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];

  private constructor(data: OrderData) {
    this.id = data.id;
    this.userId = data.userId;
    this.status = data.status;
    this.total = data.total;
    this.shippingAddress = data.shippingAddress;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.items = data.items
      ? data.items.map((item) => OrderItem.fromPersistence(item))
      : [];
  }

  static create(
    data: Omit<OrderData, "id" | "createdAt" | "updatedAt" | "items"> & {
      items?: OrderItemData[];
    }
  ): Order {
    if (data.total < 0) {
      throw new Error("Total cannot be negative");
    }

    return new Order({
      ...data,
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(data: OrderData): Order {
    return new Order(data);
  }

  updateStatus(newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ["shipped", "cancelled"],
      shipped: ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[this.status].includes(newStatus)) {
      throw new Error(
        `Cannot transition from ${this.status} to ${newStatus}`
      );
    }

    this.status = newStatus;
    this.updatedAt = new Date();
  }

  calculateTotal(): number {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  toJSON() {
    return { ...this, items: this.items.map((item) => item.toJSON()) };
  }
}
