export type SaleCategory = "sudaderas" | "perfumes" | "accesorios";
export type SaleStatus = "pagado" | "pendiente";

export interface Sale {
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
  revenue?: number;
  costTotal?: number;
  profit?: number;
  pending?: number;
}

export interface Reinvestment {
  id: number;
  userId: number;
  date: string;
  models: string;
  amount: number;
  category: SaleCategory;
  qty: number;
  qtyMl: number;
  qty10: number;
  qty30: number;
  qty60: number;
  qty100: number;
}

export interface BusinessSettings {
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
  calcPInvested?: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalCollected: number;
  totalPending: number;
  totalCost: number;
  totalReinvested: number;
  cashOnHand: number;
  liquidProfit: number;
  pendingSales: Sale[];
  salesCount: number;
}

export const PERFUME_SIZES = ["10ml", "30ml", "60ml", "100ml", "Relleno"] as const;

export function calcCost(settings: BusinessSettings, category: SaleCategory, size?: string, refillMl?: number): number {
  if (category === "sudaderas") return settings.sCost;
  if (category === "accesorios") return settings.aCost;
  if (category === "perfumes") {
    if (size === "Relleno") return (refillMl || 0) * settings.pCostMl;
    if (size === "10ml") return 10 * settings.pCostMl + settings.pCost10;
    if (size === "30ml") return 30 * settings.pCostMl + settings.pCost30;
    if (size === "60ml") return 60 * settings.pCostMl + settings.pCost60;
    if (size === "100ml") return 100 * settings.pCostMl + settings.pCost100;
  }
  return 0;
}

export function getPriceForSize(settings: BusinessSettings, size: string): number {
  switch (size) {
    case "10ml": return settings.pPrice10;
    case "30ml": return settings.pPrice30;
    case "60ml": return settings.pPrice60;
    case "100ml": return settings.pPrice100;
    case "Relleno": return settings.pPriceRelleno;
    default: return 0;
  }
}

export function fmt(n: number): string {
  return `$${Math.round(n).toLocaleString("es-MX")}`;
}

export function today(): string {
  return new Date().toISOString().split("T")[0];
}
