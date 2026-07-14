import type { OrderStatus, StockStatus } from "../../data/mock";

const map: Record<OrderStatus, { bg: string; color: string }> = {
  Pagado: { bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
  Pendiente: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  Adeudo: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = map[status];
  return (
    <span
      className="inline-flex items-center px-2 py-1 text-xs font-medium"
      style={{ background: s.bg, color: s.color, borderRadius: 4 }}
    >
      {status}
    </span>
  );
}

const stockMap: Record<StockStatus, string> = {
  "En stock": "#22c55e",
  "Stock bajo": "#f59e0b",
  "Sin stock": "#ef4444",
};

export function StockDot({ status }: { status: StockStatus }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm" style={{ color: "#e2e8f0" }}>
      <span className="w-2 h-2 rounded-full" style={{ background: stockMap[status] }} />
      {status}
    </span>
  );
}
