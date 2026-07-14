import { KpiCard } from "../components/ui/KpiCard";
import { ProfitIcon, SalesIcon, StockIcon } from "../components/icons";
import { trpc } from "../infrastructure/api/trpc";

const fmt = (n: number) => `$${Math.round(n).toLocaleString("es-MX")}`;

export function Ganancias() {
  const { data: stats } = trpc.dashboard.stats.useQuery();
  const ventas = stats?.ventas ?? 0;
  const ganancias = stats?.ganancias ?? 0;
  const inversion = stats?.inversionTotal ?? 0;
  const margin = ventas > 0 ? (ganancias / ventas) * 100 : 0;
  const roi = inversion > 0 ? (ganancias / inversion) * 100 : 0;

  const cats = (stats?.byCategory ?? []).map((c, i) => ({
    name: c.category,
    value: c.ventas,
    color: ["#3b82f6", "#8b5cf6", "#22c55e"][i],
  }));
  const max = Math.max(...cats.map((c) => c.value), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-title" style={{ color: "#e2e8f0" }}>Ganancias</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label="Ganancia neta" value={fmt(ganancias)} trend={0} up glow="green" icon={<ProfitIcon size={18} />} />
        <KpiCard label="Margen" value={`${margin.toFixed(1)}%`} trend={0} up glow="blue" icon={<SalesIcon size={18} />} />
        <KpiCard label="ROI" value={`${roi.toFixed(1)}%`} trend={0} up glow="orange" icon={<StockIcon size={18} />} />
      </div>

      <div className="card-glow p-5">
        <h2 className="text-subtitle mb-4" style={{ color: "#e2e8f0" }}>Rentabilidad por categoría</h2>
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
          {cats.length === 0 && <p className="text-sm" style={{ color: "#64748b" }}>Sin datos</p>}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { l: "Ingresos", v: fmt(ventas), c: "#3b82f6" },
            { l: "Inversión", v: fmt(inversion), c: "#ef4444" },
            { l: "Neto", v: fmt(ganancias), c: "#22c55e" },
          ].map((x) => (
            <div key={x.l} className="rounded-lg p-3" style={{ background: "#15151f", border: "1px solid #1e1e2e" }}>
              <div className="text-xs" style={{ color: "#64748b" }}>{x.l}</div>
              <div className="text-lg font-bold mt-1" style={{ color: x.c }}>{x.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
