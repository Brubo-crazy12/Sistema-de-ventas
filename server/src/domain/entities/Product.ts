export interface ProductData {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl: string | null;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl: string | null;
  active: number;
  createdAt: Date;
  updatedAt: Date;

  private constructor(data: ProductData) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.stock = data.stock;
    this.categoryId = data.categoryId;
    this.imageUrl = data.imageUrl;
    this.active = data.active;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(
    data: Omit<ProductData, "id" | "createdAt" | "updatedAt">
  ): Product {
    if (data.price <= 0) {
      throw new Error("Price must be greater than zero");
    }
    if (data.stock < 0) {
      throw new Error("Stock cannot be negative");
    }
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Product name is required");
    }

    return new Product({
      ...data,
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(data: ProductData): Product {
    return new Product(data);
  }

  isActive(): boolean {
    return this.active === 1;
  }

  hasStock(quantity: number = 1): boolean {
    return this.stock >= quantity;
  }

  reduceStock(quantity: number): void {
    if (!this.hasStock(quantity)) {
      throw new Error("Insufficient stock");
    }
    this.stock -= quantity;
    this.updatedAt = new Date();
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be positive");
    }
    this.stock += quantity;
    this.updatedAt = new Date();
  }

  toJSON() {
    return { ...this };
  }
}
