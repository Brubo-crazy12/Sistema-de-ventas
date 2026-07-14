import { InvestmentIcon } from "../components/icons";
import { trpc } from "../infrastructure/api/trpc";

const fmt = (n: number) => `$${Math.round(n).toLocaleString("es-MX")}`;

export function Inversion() {
  const { data: investments = [] } = trpc.investments.list.useQuery();
  const total = investments.reduce((a, i) => a + i.amount, 0);
  const max = Math.max(...investments.map((i) => i.amount), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-title" style={{ color: "#e2e8f0" }}>Inversión</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-glow blue p-5"><span className="label">Capital invertido</span><div className="mt-2 text-[28px] font-bold" style={{ color: "#e2e8f0" }}>{fmt(total)}</div></div>
        <div className="card-glow green p-5"><span className="label">Recuperado (ventas)</span><div className="mt-2 text-[28px] font-bold" style={{ color: "#22c55e" }}>{fmt(total)}</div></div>
        <div className="card-glow orange p-5"><span className="label">Movimientos</span><div className="mt-2 text-[28px] font-bold" style={{ color: "#f59e0b" }}>{investments.length}</div></div>
      </div>

      <div className="card-glow p-5">
        <h2 className="text-subtitle mb-4" style={{ color: "#e2e8f0" }}>Histórico de inversión</h2>
        {investments.length === 0 ? (
          <p className="text-sm" style={{ color: "#64748b" }}>Sin registros de inversión</p>
        ) : (
          <div className="flex items-end gap-3 h-40">
            {investments.map((h) => (
              <div key={h.id} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg" style={{ height: `${(h.amount / max) * 140}px`, background: "linear-gradient(180deg,#8b5cf6,#3b82f6)" }} />
                <span className="text-xs" style={{ color: "#64748b" }}>{h.month}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
