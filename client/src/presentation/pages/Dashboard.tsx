import { useState } from "react";
import { trpc } from "../../infrastructure/api/trpc";
import { fmt, type Sale, type SaleCategory } from "../../domain/types";

const CATS: { id: SaleCategory; label: string }[] = [
  { id: "sudaderas", label: "Sudaderas" },
  { id: "perfumes", label: "Perfumes" },
  { id: "accesorios", label: "Accesorios" },
];

export function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  const { data: allSales = [] } = trpc.sales.list.useQuery();
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const addPayment = trpc.sales.addPayment.useMutation({
    onSuccess: () => {
      setPaymentId(null);
      setPaymentAmount("");
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl animate-pulse card" />
        ))}
      </div>
    );
  }

  const s = stats as any;
  const sales = allSales as Sale[];

  const byCat = CATS.map((c) => ({
    ...c,
    revenue: sales.filter((sl) => sl.category === c.id).reduce((sum, sl) => sum + sl.price * sl.qty, 0),
  }));
  const maxRev = Math.max(...byCat.map((c) => c.revenue), 1);

  const cards = [
    { label: "VENTAS", value: fmt(s?.totalRevenue || 0), color: "#EF4444" },
    { label: "CAJA", value: fmt(s?.cashOnHand || 0), color: "#22C55E" },
    { label: "POR COBRAR", value: fmt(s?.totalPending || 0), color: "#EF4444" },
    { label: "GANANCIA", value: fmt(s?.liquidProfit || 0), color: (s?.liquidProfit || 0) >= 0 ? "#22C55E" : "#EF4444" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5 relative overflow-hidden">
            <div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20"
              style={{ background: c.color }}
            />
            <div className="text-xs font-medium mb-3 tracking-wide" style={{ color: "#6B6B70" }}>
              {c.label}
            </div>
            <div className="text-2xl font-bold tracking-tight" style={{ color: c.color }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold tracking-wide" style={{ color: "#A1A1AA" }}>
            INGRESOS POR CATEGORÍA
          </h2>
          <span className="text-xs" style={{ color: "#6B6B70" }}>Último periodo</span>
        </div>
        <div className="flex items-end justify-around gap-6 h-44">
          {byCat.map((c) => (
            <div key={c.id} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-sm font-semibold" style={{ color: "#FAFAFA" }}>
                {fmt(c.revenue)}
              </span>
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${(c.revenue / maxRev) * 140}px`,
                  background: "linear-gradient(180deg, #EF4444, #EF444455)",
                  minHeight: c.revenue > 0 ? "4px" : "2px",
                }}
              />
              <span className="text-xs" style={{ color: "#6B6B70" }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-wide" style={{ color: "#A1A1AA" }}>
            POR COBRAR
          </h2>
          {(s?.pendingSales || []).length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#EF444420", color: "#EF4444" }}>
              {(s?.pendingSales || []).length}
            </span>
          )}
        </div>

        {!s?.pendingSales || s.pendingSales.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-2xl mb-2" style={{ color: "#22C55E" }}>✓</div>
            <p className="text-sm" style={{ color: "#22C55E" }}>Sin deudas pendientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {s.pendingSales.map((sale: Sale) => {
              const pending = (sale.revenue || sale.price * sale.qty) - sale.paidAmount;
              return (
                <div key={sale.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "#0F0F11", border: "1px solid #26262A" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: "#EF444420", color: "#EF4444" }}>
                      {sale.category === "sudaderas" ? "S" : sale.category === "perfumes" ? "P" : "A"}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "#FAFAFA" }}>{sale.client}</div>
                      <div className="text-xs" style={{ color: "#6B6B70" }}>
                        {sale.category === "perfumes" ? `${sale.perfume} ${sale.size}` : sale.item}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold" style={{ color: "#EF4444" }}>{fmt(pending)}</span>
                    {paymentId === sale.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="Monto"
                          className="w-24 text-xs"
                          style={{ background: "#0F0F11" }}
                        />
                        <button
                          onClick={() => {
                            if (paymentAmount) addPayment.mutate({ id: sale.id, amount: Number(paymentAmount) });
                          }}
                          className="px-2 py-1 text-xs rounded-lg text-white"
                          style={{ background: "#22C55E" }}
                        >
                          OK
                        </button>
                        <button
                          onClick={() => { setPaymentId(null); setPaymentAmount(""); }}
                          className="px-2 py-1 text-xs rounded-lg"
                          style={{ background: "#26262A", color: "#A1A1AA" }}
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setPaymentId(sale.id)}
                        className="px-3 py-1 text-xs rounded-full text-white"
                        style={{ background: "#22C55E" }}
                      >
                        Abonar
                      </button>
                    )}
                    {sale.dueDate && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#EF444420", color: "#EF4444" }}>
                        {sale.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
