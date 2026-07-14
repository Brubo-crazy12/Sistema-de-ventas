import { KpiCard } from "../components/ui/KpiCard";
import { SalesBarChart } from "../components/charts/SalesBarChart";
import { OrderDonut } from "../components/charts/OrderDonut";
import { StatusBadge } from "../components/ui/StatusBadge";
import { SalesIcon, OrdersIcon, StockIcon, ProfitIcon } from "../components/icons";
import { trpc } from "../infrastructure/api/trpc";

const fmt = (n: number) => `$${Math.round(n).toLocaleString("es-MX")}`;

export function Dashboard() {
  const { data: stats } = trpc.dashboard.stats.useQuery();
  const { data: orders = [] } = trpc.orders.list.useQuery();

  const donutData = [
    { label: "Pagado", color: "#22c55e", value: stats?.orderStatus.Pagado ?? 0 },
    { label: "Pendiente", color: "#f59e0b", value: stats?.orderStatus.Pendiente ?? 0 },
    { label: "Adeudo", color: "#ef4444", value: stats?.orderStatus.Adeudo ?? 0 },
  ];

  const recent = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-title" style={{ color: "#e2e8f0" }}>
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Ventas" value={fmt(stats?.ventas ?? 0)} trend={0} up glow="blue" icon={<SalesIcon size={18} />} />
        <KpiCard label="Pedidos" value={`${stats?.pedidos ?? 0}`} trend={0} up glow="purple" icon={<OrdersIcon size={18} />} />
        <KpiCard label="Stock" value={`${stats?.stock ?? 0} u`} trend={0} up={false} glow="green" icon={<StockIcon size={18} />} />
        <KpiCard label="Ganancias" value={fmt(stats?.ganancias ?? 0)} trend={0} up glow="orange" icon={<ProfitIcon size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-glow p-5 lg:col-span-2">
          <h2 className="text-subtitle" style={{ color: "#e2e8f0" }}>
            Tendencia de Ventas
          </h2>
          <p className="text-xs mb-4" style={{ color: "#64748b" }}>
            Ventas vs ganancias — últimos 30 días
          </p>
          <SalesBarChart />
        </div>

        <div className="card-glow p-5">
          <h2 className="text-subtitle" style={{ color: "#e2e8f0" }}>
            Estado de Pedidos
          </h2>
          <p className="text-xs mb-4" style={{ color: "#64748b" }}>
            Distribución por estatus
          </p>
          <OrderDonut data={donutData} />
        </div>
      </div>

      <div className="card-glow p-5">
        <h2 className="text-subtitle mb-4" style={{ color: "#e2e8f0" }}>
          Pedidos Recientes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="label">
                <th className="text-left py-2 px-2">ID</th>
                <th className="text-left py-2 px-2">Cliente</th>
                <th className="text-left py-2 px-2 hidden sm:table-cell">Productos</th>
                <th className="text-left py-2 px-2">Fecha</th>
                <th className="text-right py-2 px-2">Total</th>
                <th className="text-left py-2 px-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} style={{ borderTop: "1px solid #1e1e2e" }}>
                  <td className="py-3 px-2 font-mono text-xs" style={{ color: "#64748b" }}>{o.orderCode}</td>
                  <td className="py-3 px-2" style={{ color: "#e2e8f0" }}>{o.client}</td>
                  <td className="py-3 px-2 hidden sm:table-cell" style={{ color: "#94a3b8" }}>{o.products}</td>
                  <td className="py-3 px-2" style={{ color: "#64748b" }}>{o.date}</td>
                  <td className="py-3 px-2 text-right font-medium" style={{ color: "#e2e8f0" }}>{fmt(o.total)}</td>
                  <td className="py-3 px-2"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-sm" style={{ color: "#64748b" }}>
                    Sin pedidos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
