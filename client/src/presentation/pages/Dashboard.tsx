import { useState } from "react";
import { trpc } from "../../infrastructure/api/trpc";
import { fmt, type Sale } from "../../domain/types";

export function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
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
          <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: "#18181B" }} />
        ))}
      </div>
    );
  }

  const s = stats as any;

  const cards = [
    { label: "VENTAS", value: fmt(s?.totalRevenue || 0), color: "#3B82F6" },
    { label: "CAJA", value: fmt(s?.cashOnHand || 0), color: "#22C55E" },
    { label: "POR COBRAR", value: fmt(s?.totalPending || 0), color: "#EF4444" },
    { label: "GANANCIA", value: fmt(s?.liquidProfit || 0), color: (s?.liquidProfit || 0) >= 0 ? "#22C55E" : "#EF4444" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl p-4 border" style={{ background: "#18181B", borderColor: "#27272A" }}>
            <div className="text-xs font-medium mb-2" style={{ color: "#71717A" }}>{c.label}</div>
            <div className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-4" style={{ background: "#18181B", borderColor: "#27272A" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: "#A1A1AA" }}>POR COBRAR</h2>
          {(s?.pendingSales || []).length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#EF444420", color: "#EF4444" }}>
              {(s?.pendingSales || []).length}
            </span>
          )}
        </div>

        {!s?.pendingSales || s.pendingSales.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-2xl mb-2">&#10003;</div>
            <p className="text-sm" style={{ color: "#22C55E" }}>Sin deudas pendientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {s.pendingSales.map((sale: Sale) => {
              const pending = (sale.revenue || sale.price * sale.qty) - sale.paidAmount;
              return (
                <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ background: "#111113", borderColor: "#27272A" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style={{ background: "#3B82F620", color: "#3B82F6" }}>
                      {sale.category === "sudaderas" ? "S" : sale.category === "perfumes" ? "P" : "A"}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "#FAFAFA" }}>{sale.client}</div>
                      <div className="text-xs" style={{ color: "#71717A" }}>
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
                          style={{ background: "#111113" }}
                        />
                        <button
                          onClick={() => {
                            if (paymentAmount) {
                              addPayment.mutate({ id: sale.id, amount: Number(paymentAmount) });
                            }
                          }}
                          className="px-2 py-1 text-xs rounded-lg"
                          style={{ background: "#22C55E", color: "#fff" }}
                        >
                          OK
                        </button>
                        <button
                          onClick={() => { setPaymentId(null); setPaymentAmount(""); }}
                          className="px-2 py-1 text-xs rounded-lg"
                          style={{ background: "#27272A", color: "#A1A1AA" }}
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setPaymentId(sale.id)}
                        className="px-3 py-1 text-xs rounded-full"
                        style={{ background: "#22C55E", color: "#fff" }}
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
