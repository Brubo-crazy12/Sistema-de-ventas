import { useState } from "react";
import { Tabs } from "../components/ui/Tabs";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Edit, Plus, X } from "../components/icons";
import { trpc } from "../infrastructure/api/trpc";
import type { OrderStatus } from "../data/mock";

const fmt = (n: number) => `$${Math.round(n).toLocaleString("es-MX")}`;

export function Pedidos() {
  const [filter, setFilter] = useState("Todos");
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data: orders = [] } = trpc.orders.list.useQuery();
  const create = trpc.orders.create.useMutation({ onSuccess: () => { setOpen(false); utils.orders.list.invalidate(); } });
  const remove = trpc.orders.delete.useMutation({ onSuccess: () => utils.orders.list.invalidate() });

  const tabs = ["Todos", "Pagado", "Pendiente", "Adeudo"];
  const rows = orders.filter((o) => filter === "Todos" || o.status === (filter as OrderStatus));

  const [form, setForm] = useState({ client: "", category: "Sudaderas", products: "", date: "", total: 0, status: "Pendiente" });

  const submit = () => {
    if (!form.client || !form.date || form.total <= 0) return;
    create.mutate({
      client: form.client,
      category: form.category as any,
      products: form.products,
      date: form.date,
      total: form.total,
      status: form.status as any,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-title" style={{ color: "#e2e8f0" }}>Pedidos</h1>
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-soft hover:opacity-90" style={{ background: "#3b82f6", color: "#fff" }}>
          {open ? <X size={16} /> : <Plus size={16} />} {open ? "Cerrar" : "Nuevo pedido"}
        </button>
      </div>

      {open && (
        <div className="card-glow p-5 space-y-3">
          <div className="flex flex-wrap gap-3">
            <input className="field !py-2" placeholder="Cliente" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
            <select className="field !py-2 !pl-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Sudaderas</option><option>Perfumes</option><option>Accesorios</option>
            </select>
            <input className="field !py-2" placeholder="Productos" value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} />
            <input type="date" className="field !py-2" placeholder="Fecha" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <input type="number" className="field !py-2" placeholder="Total" value={form.total || ""} onChange={(e) => setForm({ ...form, total: Number(e.target.value) })} />
            <select className="field !py-2 !pl-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Pagado</option><option>Pendiente</option><option>Adeudo</option>
            </select>
          </div>
          <button onClick={submit} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#22c55e", color: "#fff" }}>Guardar pedido</button>
        </div>
      )}

      <Tabs tabs={tabs} active={filter} onChange={setFilter} />

      <div className="card-glow p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="label">
                <th className="text-left py-2 px-2">ID</th>
                <th className="text-left py-2 px-2">Cliente</th>
                <th className="text-left py-2 px-2">Productos</th>
                <th className="text-left py-2 px-2">Fecha</th>
                <th className="text-right py-2 px-2">Total</th>
                <th className="text-left py-2 px-2">Estado</th>
                <th className="text-right py-2 px-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} style={{ borderTop: "1px solid #1e1e2e" }}>
                  <td className="py-3 px-2 font-mono text-xs" style={{ color: "#64748b" }}>{o.orderCode}</td>
                  <td className="py-3 px-2 font-medium" style={{ color: "#e2e8f0" }}>{o.client}</td>
                  <td className="py-3 px-2" style={{ color: "#94a3b8" }}>{o.products}</td>
                  <td className="py-3 px-2" style={{ color: "#64748b" }}>{o.date}</td>
                  <td className="py-3 px-2 text-right font-medium" style={{ color: "#e2e8f0" }}>{fmt(o.total)}</td>
                  <td className="py-3 px-2"><StatusBadge status={o.status} /></td>
                  <td className="py-3 px-2">
                    <div className="flex justify-end">
                      <button onClick={() => remove.mutate({ id: o.id })} className="flex items-center justify-center transition-soft hover:bg-input" style={{ width: 28, height: 28, border: "1px solid #1e1e2e", background: "#0a0a0f", borderRadius: 6, color: "#64748b" }}>
                        <Edit size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="py-6 text-center text-sm" style={{ color: "#64748b" }}>Sin pedidos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
