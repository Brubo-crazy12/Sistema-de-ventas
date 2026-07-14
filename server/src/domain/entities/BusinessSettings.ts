export interface BusinessSettingsData {
  id: number;
  userId: number;
  sInvested: number;
  sStock: number;
  sCost: number;
  pStockMl: number;
  pStock10: number;
  pStock30: number;
  pStock60: number;
  pStock100: number;
  pCostMl: number;
  pCost10: number;
  pCost30: number;
  pCost60: number;
  pCost100: number;
  pPrice10: number;
  pPrice30: number;
  pPrice60: number;
  pPrice100: number;
  pPriceRelleno: number;
  aInvested: number;
  aStock: number;
  aCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export class BusinessSettings {
  id!: number;
  userId!: number;
  sInvested!: number;
  sStock!: number;
  sCost!: number;
  pStockMl!: number;
  pStock10!: number;
  pStock30!: number;
  pStock60!: number;
  pStock100!: number;
  pCostMl!: number;
  pCost10!: number;
  pCost30!: number;
  pCost60!: number;
  pCost100!: number;
  pPrice10!: number;
  pPrice30!: number;
  pPrice60!: number;
  pPrice100!: number;
  pPriceRelleno!: number;
  aInvested!: number;
  aStock!: number;
  aCost!: number;
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(data: BusinessSettingsData) {
    Object.assign(this, data);
  }

  static create(userId: number): BusinessSettings {
    return new BusinessSettings({
      id: 0,
      userId,
      sInvested: 4900,
      sStock: 7,
      sCost: 700,
      pStockMl: 0,
      pStock10: 0,
      pStock30: 0,
      pStock60: 0,
      pStock100: 0,
      pCostMl: 2,
      pCost10: 15,
      pCost30: 25,
      pCost60: 35,
      pCost100: 45,
      pPrice10: 120,
      pPrice30: 205,
      pPrice60: 295,
      pPrice100: 420,
      pPriceRelleno: 5,
      aInvested: 0,
      aStock: 0,
      aCost: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(data: BusinessSettingsData): BusinessSettings {
    return new BusinessSettings(data);
  }

  get calcPInvested(): number {
    return (
      this.pStock10 * this.pCost10 +
      this.pStock30 * this.pCost30 +
      this.pStock60 * this.pCost60 +
      this.pStock100 * this.pCost100 +
      this.pStockMl * this.pCostMl
    );
  }

  getPriceForSize(size: string): number {
    switch (size) {
      case "10ml": return this.pPrice10;
      case "30ml": return this.pPrice30;
      case "60ml": return this.pPrice60;
      case "100ml": return this.pPrice100;
      case "Relleno": return this.pPriceRelleno;
      default: return 0;
    }
  }

  getCostForSize(size: string): number {
    switch (size) {
      case "10ml": return 10 * this.pCostMl + this.pCost10;
      case "30ml": return 30 * this.pCostMl + this.pCost30;
      case "60ml": return 60 * this.pCostMl + this.pCost60;
      case "100ml": return 100 * this.pCostMl + this.pCost100;
      case "Relleno": return this.pCostMl;
      default: return 0;
    }
  }

  toJSON() {
    return { ...this };
  }
}
