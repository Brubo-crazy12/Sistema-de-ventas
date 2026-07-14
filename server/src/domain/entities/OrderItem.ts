export interface OrderItemData {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

export class OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;

  private constructor(data: OrderItemData) {
    this.id = data.id;
    this.orderId = data.orderId;
    this.productId = data.productId;
    this.quantity = data.quantity;
    this.price = data.price;
  }

  static create(
    data: Omit<OrderItemData, "id">
  ): OrderItem {
    if (data.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }
    if (data.price < 0) {
      throw new Error("Price cannot be negative");
    }

    return new OrderItem({
      ...data,
      id: 0,
    });
  }

  static fromPersistence(data: OrderItemData): OrderItem {
    return new OrderItem(data);
  }

  getSubtotal(): number {
    return this.price * this.quantity;
  }

  toJSON() {
    return { ...this };
  }
}
