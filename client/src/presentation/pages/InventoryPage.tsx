import { useState } from "react";
import { trpc } from "../../infrastructure/api/trpc";
import { type SaleCategory, type BusinessSettings, type Reinvestment, fmt, today } from "../../domain/types";

type InvTab = "sudaderas" | "perfumes" | "accesorios";

export function InventoryPage() {
  const [invTab, setInvTab] = useState<InvTab>("sudaderas");
  const [form, setForm] = useState({ date: today(), models: "", amount: 0, qty: 0, qtyMl: 0, qty10: 0, qty30: 0, qty60: 0, qty100: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: settings } = trpc.settings.get.useQuery();
  const { data: allReinvestments = [], refetch: refetchR } = trpc.reinvestments.list.useQuery();
  const { data: allSales = [] } = trpc.sales.list.useQuery();

  const createR = trpc.reinvestments.create.useMutation({ onSuccess: () => { setForm({ date: today(), models: "", amount: 0, qty: 0, qtyMl: 0, qty10: 0, qty30: 0, qty60: 0, qty100: 0 }); refetchR(); } });
  const updateR = trpc.reinvestments.update.useMutation({ onSuccess: () => { setForm({ date: today(), models: "", amount: 0, qty: 0, qtyMl: 0, qty10: 0, qty30: 0, qty60: 0, qty100: 0 }); setEditingId(null); refetchR(); } });
  const deleteR = trpc.reinvestments.delete.useMutation({ onSuccess: () => refetchR() });

  const s = settings as BusinessSettings | undefined;
  const reinvestments = (allReinvestments as Reinvestment[]).filter((r) => r.category === invTab);
  const sales = allSales as any[];

  const totalInvested = invTab === "sudaderas"
    ? (s?.sInvested || 0) + reinvestments.reduce((sum, r) => sum + r.amount, 0)
    : invTab === "perfumes"
    ? (s?.calcPInvested || 0) + reinvestments.reduce((sum, r) => sum + r.amount, 0)
    : (s?.aInvested || 0) + reinvestments.reduce((sum, r) => sum + r.amount, 0);

  const totalCollected = sales
    .filter((sl: any) => sl.category === invTab)
    .reduce((sum: number, sl: any) => sum + (sl.paidAmount || 0), 0);

  const totalCost = sales
    .filter((sl: any) => sl.category === invTab)
    .reduce((sum: number, sl: any) => sum + (sl.cost || 0) * (sl.qty || 1), 0);

  const profit = totalCollected - totalCost;
  const recovered = totalInvested > 0 ? Math.min((totalCollected / totalInvested) * 100, 100) : 0;
  const remaining = Math.max(totalInvested - totalCollected, 0);

  const getStock = () => {
    if (invTab === "sudaderas") {
      const initial = s?.sStock || 0;
      const bought = reinvestments.reduce((sum, r) => sum + r.qty, 0);
      const sold = sales.filter((sl: any) => sl.category === "sudaderas").reduce((sum: number, sl: any) => sum + (sl.qty || 0), 0);
      return { initial, bought, sold, current: initial + bought - sold };
    }
    if (invTab === "perfumes") {
      return {
        ml: (s?.pStockMl || 0) + reinvestments.reduce((sum, r) => sum + r.qtyMl, 0) - sales.filter((sl: any) => sl.category === "perfumes" && sl.size === "Relleno").reduce((sum: number, sl: any) => sum + (sl.refillMl || 0), 0),
        qty10: (s?.pStock10 || 0) + reinvestments.reduce((sum, r) => sum + r.qty10, 0) - sales.filter((sl: any) => sl.category === "perfumes" && sl.size === "10ml").reduce((sum: number, sl: any) => sum + (sl.qty || 0), 0),
        qty30: (s?.pStock30 || 0) + reinvestments.reduce((sum, r) => sum + r.qty30, 0) - sales.filter((sl: any) => sl.category === "perfumes" && sl.size === "30ml").reduce((sum: number, sl: any) => sum + (sl.qty || 0), 0),
        qty60: (s?.pStock60 || 0) + reinvestments.reduce((sum, r) => sum + r.qty60, 0) - sales.filter((sl: any) => sl.category === "perfumes" && sl.size === "60ml").reduce((sum: number, sl: any) => sum + (sl.qty || 0), 0),
        qty100: (s?.pStock100 || 0) + reinvestments.reduce((sum, r) => sum + r.qty100, 0) - sales.filter((sl: any) => sl.category === "perfumes" && sl.size === "100ml").reduce((sum: number, sl: any) => sum + (sl.qty || 0), 0),
      };
    }
    const initial = s?.aStock || 0;
    const bought = reinvestments.reduce((sum, r) => sum + r.qty, 0);
    const sold = sales.filter((sl: any) => sl.category === "accesorios").reduce((sum: number, sl: any) => sum + (sl.qty || 0), 0);
    return { initial, bought, sold, current: initial + bought - sold };
  };

  const stock = getStock();

  const startEdit = (r: Reinvestment) => {
    setEditingId(r.id);
    setForm({ date: r.date, models: r.models, amount: r.amount, qty: r.qty, qtyMl: r.qtyMl, qty10: r.qty10, qty30: r.qty30, qty60: r.qty60, qty100: r.qty100 });
  };

  const handleSubmit = () => {
    const payload = { ...form, category: invTab as SaleCategory };
    if (editingId) {
      updateR.mutate({ id: editingId, ...payload });
    } else {
      createR.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-1">
        {(["sudaderas", "perfumes", "accesorios"] as InvTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setInvTab(tab)}
            className="px-3 py-1.5 text-xs rounded-lg capitalize"
            style={{ background: invTab === tab ? "#3B82F6" : "#18181B", color: invTab === tab ? "#fff" : "#A1A1AA" }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-xl border p-4" style={{ background: "#18181B", borderColor: "#27272A" }}>
        <h2 className="text-xs font-semibold mb-3" style={{ color: "#71717A" }}>RECUPERACION</h2>
        <div className="w-full h-2 rounded-full mb-3" style={{ background: "#27272A" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${recovered}%`, background: recovered >= 100 ? "#22C55E" : "#3B82F6" }} />
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs" style={{ color: "#71717A" }}>Inversion</div>
            <div className="text-sm font-bold" style={{ color: "#FAFAFA" }}>{fmt(totalInvested)}</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: "#71717A" }}>Falta</div>
            <div className="text-sm font-bold" style={{ color: "#EF4444" }}>{fmt(remaining)}</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: "#71717A" }}>Ganancia</div>
            <div className="text-sm font-bold" style={{ color: profit >= 0 ? "#22C55E" : "#EF4444" }}>{fmt(profit)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border p-4" style={{ background: "#18181B", borderColor: "#27272A" }}>
          <h2 className="text-xs font-semibold mb-3" style={{ color: "#A1A1AA" }}>{editingId ? "EDITAR COMPRA" : "NUEVA COMPRA"}</h2>
          <div className="space-y-2">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <input placeholder="Detalle" value={form.models} onChange={(e) => setForm({ ...form, models: e.target.value })} />
            {invTab === "perfumes" ? (
              <>
                <input type="number" placeholder="ML esencia" value={form.qtyMl || ""} onChange={(e) => setForm({ ...form, qtyMl: Number(e.target.value) })} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="+10ml" value={form.qty10 || ""} onChange={(e) => setForm({ ...form, qty10: Number(e.target.value) })} />
                  <input type="number" placeholder="+30ml" value={form.qty30 || ""} onChange={(e) => setForm({ ...form, qty30: Number(e.target.value) })} />
                  <input type="number" placeholder="+60ml" value={form.qty60 || ""} onChange={(e) => setForm({ ...form, qty60: Number(e.target.value) })} />
                  <input type="number" placeholder="+100ml" value={form.qty100 || ""} onChange={(e) => setForm({ ...form, qty100: Number(e.target.value) })} />
                </div>
              </>
            ) : (
              <input type="number" placeholder="Unidades" value={form.qty || ""} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} />
            )}
            <input type="number" placeholder="Costo" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="px-4 py-2 text-xs font-medium text-white rounded-lg" style={{ background: "#3B82F6" }}>
                {editingId ? "Actualizar" : "Guardar"}
              </button>
              {editingId && (
                <button onClick={() => { setEditingId(null); setForm({ date: today(), models: "", amount: 0, qty: 0, qtyMl: 0, qty10: 0, qty30: 0, qty60: 0, qty100: 0 }); }} className="px-4 py-2 text-xs rounded-lg" style={{ background: "#27272A", color: "#A1A1AA" }}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ background: "#18181B", borderColor: "#27272A" }}>
          <h2 className="text-xs font-semibold mb-3" style={{ color: "#A1A1AA" }}>HISTORIAL ({reinvestments.length})</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {reinvestments.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: "#71717A" }}>Sin registros</p>
            ) : (
              reinvestments.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-2 rounded-lg border" style={{ background: "#111113", borderColor: "#27272A" }}>
                  <div>
                    <div className="text-xs font-medium" style={{ color: "#FAFAFA" }}>{r.models}</div>
                    <div className="text-xs" style={{ color: "#71717A" }}>{r.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: "#EF4444" }}>-{fmt(r.amount)}</span>
                    <button onClick={() => startEdit(r)} className="w-5 h-5 rounded flex items-center justify-center text-xs" style={{ background: "#27272A", color: "#A1A1AA" }}>&#9998;</button>
                    <button onClick={() => deleteR.mutate({ id: r.id })} className="w-5 h-5 rounded flex items-center justify-center text-xs" style={{ background: "#27272A", color: "#EF4444" }}>&#10005;</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ background: "#18181B", borderColor: "#27272A" }}>
          <h2 className="text-xs font-semibold mb-3" style={{ color: "#A1A1AA" }}>INVENTARIO ACTUAL</h2>
          {invTab === "perfumes" ? (
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: "#3B82F6" }}>{(stock as any).ml || 0}</div>
                <div className="text-xs" style={{ color: "#71717A" }}>ML esencia</div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "10ml", val: (stock as any).qty10 },
                  { label: "30ml", val: (stock as any).qty30 },
                  { label: "60ml", val: (stock as any).qty60 },
                  { label: "100ml", val: (stock as any).qty100 },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center p-2 rounded-lg" style={{ background: "#111113" }}>
                    <span className="text-xs" style={{ color: "#A1A1AA" }}>{item.label}</span>
                    <span className="text-sm font-bold" style={{ color: "#FAFAFA" }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: "#3B82F6" }}>{(stock as any).current || 0}</div>
                <div className="text-xs" style={{ color: "#71717A" }}>Unidades</div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Inicial", val: (stock as any).initial },
                  { label: "Compras", val: `+${(stock as any).bought}` },
                  { label: "Vendidas", val: `-${(stock as any).sold}` },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center p-2 rounded-lg" style={{ background: "#111113" }}>
                    <span className="text-xs" style={{ color: "#A1A1AA" }}>{item.label}</span>
                    <span className="text-sm font-bold" style={{ color: "#FAFAFA" }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
