export interface CartItemData {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;

  private constructor(data: CartItemData) {
    this.id = data.id;
    this.userId = data.userId;
    this.productId = data.productId;
    this.quantity = data.quantity;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(
    data: Omit<CartItemData, "id" | "createdAt" | "updatedAt">
  ): CartItem {
    if (data.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    return new CartItem({
      ...data,
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(data: CartItemData): CartItem {
    return new CartItem(data);
  }

  updateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }
    this.quantity = quantity;
    this.updatedAt = new Date();
  }

  toJSON() {
    return { ...this };
  }
}
