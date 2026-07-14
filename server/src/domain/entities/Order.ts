import { type Category } from "./Product.js";

export type OrderStatus = "Pagado" | "Pendiente" | "Adeudo";

export interface OrderData {
  id: number;
  userId: number;
  orderCode: string;
  client: string;
  category: Category;
  products: string;
  date: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Order {
  id!: number;
  userId!: number;
  orderCode!: string;
  client!: string;
  category!: Category;
  products!: string;
  date!: string;
  total!: number;
  status!: OrderStatus;
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(data: OrderData) {
    Object.assign(this, data);
  }

  static create(data: Omit<OrderData, "id" | "createdAt" | "updatedAt" | "orderCode"> & { orderCode?: string }): Order {
    if (!data.client || !data.client.trim()) throw new Error("Client name is required");
    if (data.total < 0) throw new Error("Total cannot be negative");
    return new Order({
      ...data,
      orderCode: data.orderCode ?? "",
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(data: OrderData): Order {
    return new Order(data);
  }

  get isPending(): boolean {
    return this.status !== "Pagado";
  }

  toJSON() {
    return { ...this };
  }
}
