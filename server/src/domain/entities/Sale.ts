export type SaleCategory = "sudaderas" | "perfumes" | "accesorios";
export type SaleStatus = "pagado" | "pendiente";

export interface SaleData {
  id: number;
  userId: number;
  category: SaleCategory;
  date: string;
  client: string;
  item: string;
  perfume: string;
  size: string;
  qty: number;
  price: number;
  cost: number;
  status: SaleStatus;
  paidAmount: number;
  dueDate: string;
  refillMl: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Sale {
  id!: number;
  userId!: number;
  category!: SaleCategory;
  date!: string;
  client!: string;
  item!: string;
  perfume!: string;
  size!: string;
  qty!: number;
  price!: number;
  cost!: number;
  status!: SaleStatus;
  paidAmount!: number;
  dueDate!: string;
  refillMl!: number;
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(data: SaleData) {
    Object.assign(this, data);
  }

  static create(data: Omit<SaleData, "id" | "createdAt" | "updatedAt">): Sale {
    if (!data.client || data.client.trim().length === 0) {
      throw new Error("Client name is required");
    }
    if (data.price < 0) throw new Error("Price cannot be negative");
    if (data.qty <= 0) throw new Error("Quantity must be positive");
    return new Sale({ ...data, id: 0, createdAt: new Date(), updatedAt: new Date() });
  }

  static fromPersistence(data: SaleData): Sale {
    return new Sale(data);
  }

  get revenue(): number {
    return this.qty * this.price;
  }

  get costTotal(): number {
    return this.qty * this.cost;
  }

  get profit(): number {
    return this.revenue - this.costTotal;
  }

  get pending(): number {
    return this.revenue - this.paidAmount;
  }

  get isPending(): boolean {
    return this.status === "pendiente";
  }

  get displayName(): string {
    if (this.category === "perfumes") {
      return `${this.perfume} ${this.size}`.trim();
    }
    return this.item;
  }

  toJSON() {
    return { ...this };
  }
}
