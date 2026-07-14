import { useState } from "react";
import { trpc } from "../../infrastructure/api/trpc";
import { type SaleCategory, type Sale, type BusinessSettings, PERFUME_SIZES, calcCost, getPriceForSize, fmt, today } from "../../domain/types";
import { PageHeader } from "../components/PageHeader";

interface Props {
  category: SaleCategory;
}

const emptyForm = {
  date: today(),
  client: "",
  item: "",
  perfume: "",
  size: "10ml",
  qty: 1,
  price: 0,
  status: "pagado" as "pagado" | "pendiente",
  paidAmount: 0,
  dueDate: "",
  refillMl: 0,
};

export function SalesPage({ category }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: settings } = trpc.settings.get.useQuery();
  const { data: sales = [], refetch } = trpc.sales.listByCategory.useQuery({ category });

  const createSale = trpc.sales.create.useMutation({ onSuccess: () => { setForm(emptyForm); refetch(); } });
  const updateSale = trpc.sales.update.useMutation({ onSuccess: () => { setForm(emptyForm); setEditingId(null); refetch(); } });
  const deleteSale = trpc.sales.delete.useMutation({ onSuccess: () => refetch() });
  const addPayment = trpc.sales.addPayment.useMutation({ onSuccess: () => refetch() });

  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const s = settings as BusinessSettings | undefined;

  const handleSizeChange = (size: string) => {
    if (s && category === "perfumes") {
      setForm({ ...form, size, price: getPriceForSize(s, size) });
    } else {
      setForm({ ...form, size });
    }
  };

  const handleSubmit = () => {
    const cost = s ? calcCost(s, category, form.size, form.refillMl) : 0;
    const payload = {
      category,
      date: form.date,
      client: form.client,
      item: form.item,
      perfume: form.perfume,
      size: form.size,
      qty: form.qty,
      price: form.price,
      cost,
      status: form.status,
      paidAmount: form.status === "pagado" ? form.price * form.qty : form.paidAmount,
      dueDate: form.dueDate,
      refillMl: form.refillMl,
    };
    if (editingId) {
      updateSale.mutate({ id: editingId, ...payload });
    } else {
      createSale.mutate(payload);
    }
  };

  const startEdit = (sale: Sale) => {
    setEditingId(sale.id);
    setForm({
      date: sale.date,
      client: sale.client,
      item: sale.item,
      perfume: sale.perfume,
      size: sale.size,
      qty: sale.qty,
      price: sale.price,
      status: sale.status,
      paidAmount: sale.paidAmount,
      dueDate: sale.dueDate,
      refillMl: sale.refillMl,
    });
  };

  const isPerfume = category === "perfumes";

  return (
    <div className="space-y-6">
      <PageHeader
        title={category.charAt(0).toUpperCase() + category.slice(1)}
        subtitle="Registro y seguimiento de ventas"
      />

      <div className="rounded-xl border p-4 card">
        <h2 className="text-sm font-semibold mb-4" style={{ color: "#A1A1AA" }}>
          {editingId ? "EDITAR VENTA" : "NUEVA VENTA"}
        </h2>
        <div className="flex flex-wrap gap-3">
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-40" />
          <input placeholder="Cliente" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-40" />
          {isPerfume ? (
            <>
              <input placeholder="Perfume" value={form.perfume} onChange={(e) => setForm({ ...form, perfume: e.target.value })} className="w-40" />
              <select value={form.size} onChange={(e) => handleSizeChange(e.target.value)} className="w-36">
                {PERFUME_SIZES.map((sz: string) => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>
              {form.size === "Relleno" && (
                <input type="number" placeholder="ML" value={form.refillMl || ""} onChange={(e) => setForm({ ...form, refillMl: Number(e.target.value) })} className="w-24" />
              )}
            </>
          ) : (
            <>
              <input placeholder="Detalle" value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} className="w-40" />
              <input type="number" placeholder="Cant." value={form.qty || ""} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} className="w-24" />
            </>
          )}
          <input type="number" placeholder="Precio" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-28" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-32">
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
          </select>
          {form.status === "pendiente" && (
            <>
              <input type="number" placeholder="Anticipo" value={form.paidAmount || ""} onChange={(e) => setForm({ ...form, paidAmount: Number(e.target.value) })} className="w-28" />
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-40" />
            </>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white rounded-lg" style={{ background: "#EF4444" }}>
            {editingId ? "Actualizar" : "Registrar"}
          </button>
          {editingId && (
            <button onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-4 py-2 text-sm rounded-lg" style={{ background: "#27272A", color: "#A1A1AA" }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border p-4" style={{ background: "#18181B", borderColor: "#27272A" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: "#A1A1AA" }}>VENTAS ({(sales as Sale[]).length})</h2>
        </div>
        {(sales as Sale[]).length === 0 ? (
          <p className="text-center py-8 text-sm" style={{ color: "#71717A" }}>Sin registros</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "#71717A" }}>
                  <th className="text-left py-2 px-2 text-xs font-medium">Fecha</th>
                  <th className="text-left py-2 px-2 text-xs font-medium">Cliente</th>
                  <th className="text-left py-2 px-2 text-xs font-medium">Articulo</th>
                  <th className="text-right py-2 px-2 text-xs font-medium">Monto</th>
                  <th className="text-center py-2 px-2 text-xs font-medium">Estado</th>
                  <th className="text-right py-2 px-2 text-xs font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(sales as Sale[]).map((sale) => {
                  const rev = sale.price * sale.qty;
                  const profit = rev - sale.cost * sale.qty;
                  return (
                    <tr key={sale.id} className="border-t" style={{ borderColor: "#27272A" }}>
                      <td className="py-2 px-2 text-xs" style={{ color: "#A1A1AA" }}>{sale.date}</td>
                      <td className="py-2 px-2 text-xs" style={{ color: "#FAFAFA" }}>{sale.client}</td>
                      <td className="py-2 px-2 text-xs" style={{ color: "#A1A1AA" }}>
                        {isPerfume ? `${sale.perfume} ${sale.size}` : sale.item}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <div className="text-xs font-bold" style={{ color: "#FAFAFA" }}>{fmt(rev)}</div>
                        <div className="text-xs" style={{ color: profit >= 0 ? "#22C55E" : "#EF4444" }}>
                          {profit >= 0 ? "+" : ""}{fmt(profit)}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center">
                        {sale.status === "pagado" ? (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#22C55E20", color: "#22C55E" }}>Pagado</span>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xs font-bold" style={{ color: "#EF4444" }}>
                              {fmt(rev - sale.paidAmount)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {sale.status === "pendiente" && (
                            paymentId === sale.id ? (
                              <div className="flex items-center gap-1">
                                <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-20 text-xs" placeholder="Monto" />
                                <button onClick={() => { if (paymentAmount) addPayment.mutate({ id: sale.id, amount: Number(paymentAmount) }); }} className="w-6 h-6 rounded text-xs text-white" style={{ background: "#22C55E" }}>OK</button>
                                <button onClick={() => { setPaymentId(null); setPaymentAmount(""); }} className="w-6 h-6 rounded text-xs" style={{ background: "#27272A", color: "#A1A1AA" }}>X</button>
                              </div>
                            ) : (
                              <button onClick={() => setPaymentId(sale.id)} className="w-6 h-6 rounded flex items-center justify-center text-xs text-white" style={{ background: "#22C55E" }}>+</button>
                            )
                          )}
                          <button onClick={() => startEdit(sale)} className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ background: "#27272A", color: "#A1A1AA" }}>&#9998;</button>
                          <button onClick={() => deleteSale.mutate({ id: sale.id })} className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ background: "#27272A", color: "#EF4444" }}>&#10005;</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
