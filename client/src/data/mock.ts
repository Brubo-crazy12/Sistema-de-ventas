export type Category = "Sudaderas" | "Perfumes" | "Accesorios";
export type OrderStatus = "Pagado" | "Pendiente" | "Adeudo";
export type StockStatus = "En stock" | "Stock bajo" | "Sin stock";

export interface TrendPoint {
  label: string;
  ventas: number;
  ganancias: number;
}

export interface Order {
  id: string;
  client: string;
  products: string;
  date: string;
  total: number;
  status: OrderStatus;
}

export interface Product {
  name: string;
  sku: string;
  category: Category;
  price: number;
  qty: number;
  stock: StockStatus;
}

export const trend: TrendPoint[] = [
  { label: "1", ventas: 1200, ganancias: 420 },
  { label: "3", ventas: 1800, ganancias: 640 },
  { label: "5", ventas: 1500, ganancias: 520 },
  { label: "7", ventas: 2400, ganancias: 880 },
  { label: "9", ventas: 2100, ganancias: 760 },
  { label: "12", ventas: 3000, ganancias: 1120 },
  { label: "14", ventas: 2700, ganancias: 980 },
  { label: "16", ventas: 3500, ganancias: 1320 },
  { label: "19", ventas: 3100, ganancias: 1180 },
  { label: "22", ventas: 4200, ganancias: 1640 },
  { label: "26", ventas: 3800, ganancias: 1450 },
  { label: "30", ventas: 4900, ganancias: 1920 },
];

export const orders: Order[] = [
  { id: "ORD-1042", client: "María López", products: "Sudadera Oversize x2", date: "12 Jul", total: 640, status: "Pagado" },
  { id: "ORD-1041", client: "Carlos Ruiz", products: "Perfume 30ml x1", date: "12 Jul", total: 320, status: "Pendiente" },
  { id: "ORD-1040", client: "Ana Torres", products: "Anillo acero x3", date: "11 Jul", total: 450, status: "Pagado" },
  { id: "ORD-1039", client: "Luis Vega", products: "Sudadera Básica x1", date: "11 Jul", total: 280, status: "Adeudo" },
  { id: "ORD-1038", client: "Sofía Ramos", products: "Perfume 60ml x2", date: "10 Jul", total: 720, status: "Pagado" },
  { id: "ORD-1037", client: "Diego Cruz", products: "Collar x1", date: "10 Jul", total: 190, status: "Pendiente" },
  { id: "ORD-1036", client: "Elena Díaz", products: "Sudadera Oversize x1", date: "09 Jul", total: 320, status: "Pagado" },
  { id: "ORD-1035", client: "Pablo Soto", products: "Perfume 100ml x1", date: "09 Jul", total: 480, status: "Pagado" },
];

export const products: Product[] = [
  { name: "Sudadera Oversize", sku: "SUD-OVS-01", category: "Sudaderas", price: 320, qty: 48, stock: "En stock" },
  { name: "Sudadera Básica", sku: "SUD-BAS-02", category: "Sudaderas", price: 280, qty: 7, stock: "Stock bajo" },
  { name: "Perfume 30ml", sku: "PER-030-01", category: "Perfumes", price: 320, qty: 32, stock: "En stock" },
  { name: "Perfume 60ml", sku: "PER-060-02", category: "Perfumes", price: 360, qty: 0, stock: "Sin stock" },
  { name: "Perfume 100ml", sku: "PER-100-03", category: "Perfumes", price: 480, qty: 19, stock: "En stock" },
  { name: "Anillo Acero", sku: "ACC-ANI-01", category: "Accesorios", price: 150, qty: 5, stock: "Stock bajo" },
  { name: "Collar Cadena", sku: "ACC-COL-02", category: "Accesorios", price: 190, qty: 24, stock: "En stock" },
  { name: "Pulsera Cuero", sku: "ACC-PUL-03", category: "Accesorios", price: 130, qty: 0, stock: "Sin stock" },
];

export const investment = {
  total: 18500,
  recovered: 14200,
  pending: 4300,
  history: [
    { month: "Ene", amount: 3000 },
    { month: "Feb", amount: 2500 },
    { month: "Mar", amount: 4000 },
    { month: "Abr", amount: 2000 },
    { month: "May", amount: 3500 },
    { month: "Jun", amount: 3500 },
  ],
};

export const profits = {
  net: 24800,
  margin: 38,
  byCategory: [
    { name: "Sudaderas", value: 11200 },
    { name: "Perfumes", value: 8700 },
    { name: "Accesorios", value: 4900 },
  ],
};

export const kpis = {
  ventas: { value: 31840, trend: 12.4, up: true },
  pedidos: { value: 248, trend: 8.1, up: true },
  stock: { value: 155, trend: -3.2, up: false },
  ganancias: { value: 24800, trend: 15.7, up: true },
};

export const categoryGradient: Record<Category, string> = {
  Sudaderas: "linear-gradient(135deg,#3b82f6,#6366f1)",
  Perfumes: "linear-gradient(135deg,#8b5cf6,#a855f7)",
  Accesorios: "linear-gradient(135deg,#22c55e,#10b981)",
};

export function categoryInitials(cat: Category): string {
  if (cat === "Sudaderas") return "SU";
  if (cat === "Perfumes") return "PE";
  return "AC";
}
