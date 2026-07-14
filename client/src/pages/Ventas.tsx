import { KpiCard } from "../components/ui/KpiCard";
import { SalesBarChart } from "../components/charts/SalesBarChart";
import { SalesIcon, ProfitIcon, OrdersIcon } from "../components/icons";
import { trpc } from "../infrastructure/api/trpc";

const fmt = (n: number) => `$${Math.round(n).toLocaleString("es-MX")}`;

export function Ventas() {
  const { data: stats } = trpc.dashboard.stats.useQuery();
  const ventas = stats?.ventas ?? 0;
  const pedidos = stats?.pedidos ?? 0;
  const ticket = pedidos > 0 ? ventas / pedidos : 0;

  const cats = (stats?.byCategory ?? []).map((c, i) => ({
    name: c.category,
    value: c.ventas,
    color: ["#3b82f6", "#8b5cf6", "#22c55e"][i],
  }));
  const max = Math.max(...cats.map((c) => c.value), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-title" style={{ color: "#e2e8f0" }}>
        Ventas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <KpiCard label="Ventas totales" value={fmt(ventas)} trend={0} up glow="blue" icon={<SalesIcon size={18} />} />
        <KpiCard label="Ganancias" value={fmt(stats?.ganancias ?? 0)} trend={0} up glow="orange" icon={<ProfitIcon size={18} />} />
        <KpiCard label="Ticket promedio" value={fmt(ticket)} trend={0} up glow="purple" icon={<OrdersIcon size={18} />} />
      </div>

      <div className="card-glow p-5">
        <h2 className="text-subtitle" style={{ color: "#e2e8f0" }}>
          Ventas por período
        </h2>
        <p className="text-xs mb-4" style={{ color: "#64748b" }}>
          Comparativa diaria de ventas y ganancias
        </p>
        <SalesBarChart height={320} />
      </div>

      <div className="card-glow p-5">
        <h2 className="text-subtitle mb-4" style={{ color: "#e2e8f0" }}>
          Ventas por categoría
        </h2>
        <div className="space-y-4">
          {cats.map((c) => (
            <div key={c.name}>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: "#e2e8f0" }}>{c.name}</span>
                <span style={{ color: "#64748b" }}>{fmt(c.value)}</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: "#1e1e2e" }}>
                <div className="h-full rounded-full" style={{ width: `${(c.value / max) * 100}%`, background: c.color }} />
              </div>
            </div>
          ))}
          {cats.length === 0 && (
            <p className="text-sm" style={{ color: "#64748b" }}>Sin ventas registradas</p>
          )}
        </div>
      </div>
    </div>
  );
}
