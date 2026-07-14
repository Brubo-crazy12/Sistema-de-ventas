export type Category = "Sudaderas" | "Perfumes" | "Accesorios";
export type StockStatus = "En stock" | "Stock bajo" | "Sin stock";

export interface ProductData {
  id: number;
  userId: number;
  name: string;
  sku: string;
  category: Category;
  price: number;
  qty: number;
  stockStatus: StockStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  id!: number;
  userId!: number;
  name!: string;
  sku!: string;
  category!: Category;
  price!: number;
  qty!: number;
  stockStatus!: StockStatus;
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(data: ProductData) {
    Object.assign(this, data);
  }

  static create(data: Omit<ProductData, "id" | "createdAt" | "updatedAt">): Product {
    if (!data.name || !data.name.trim()) throw new Error("Product name is required");
    if (!data.sku || !data.sku.trim()) throw new Error("SKU is required");
    return new Product({ ...data, id: 0, createdAt: new Date(), updatedAt: new Date() });
  }

  static fromPersistence(data: ProductData): Product {
    return new Product(data);
  }

  toJSON() {
    return { ...this };
  }
}
