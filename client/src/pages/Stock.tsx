import { useState } from "react";
import { Tabs } from "../components/ui/Tabs";
import { ProductAvatar } from "../components/ui/ProductAvatar";
import { StockDot } from "../components/ui/StatusBadge";
import { Plus, X, Edit } from "../components/icons";
import { trpc } from "../infrastructure/api/trpc";
import type { Category } from "../data/mock";

const fmt = (n: number) => `$${Math.round(n).toLocaleString("es-MX")}`;

export function Stock() {
  const [filter, setFilter] = useState("Todos");
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data: products = [] } = trpc.products.list.useQuery();
  const create = trpc.products.create.useMutation({ onSuccess: () => { setOpen(false); utils.products.list.invalidate(); } });
  const remove = trpc.products.delete.useMutation({ onSuccess: () => utils.products.list.invalidate() });

  const tabs = ["Todos", "Sudaderas", "Perfumes", "Accesorios"];
  const rows = products.filter((p) => filter === "Todos" || p.category === (filter as Category));

  const totalUnits = products.reduce((a, p) => a + p.qty, 0);
  const low = products.filter((p) => p.stockStatus !== "En stock").length;

  const [form, setForm] = useState({ name: "", sku: "", category: "Sudaderas", price: 0, qty: 0, stockStatus: "En stock" });

  const submit = () => {
    if (!form.name || !form.sku) return;
    create.mutate({
      name: form.name,
      sku: form.sku,
      category: form.category as any,
      price: form.price,
      qty: form.qty,
      stockStatus: form.stockStatus as any,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-title" style={{ color: "#e2e8f0" }}>Inventario</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-glow green p-5"><span className="label">Unidades totales</span><div className="mt-2 text-[28px] font-bold" style={{ color: "#e2e8f0" }}>{totalUnits}</div></div>
        <div className="card-glow orange p-5"><span className="label">Productos</span><div className="mt-2 text-[28px] font-bold" style={{ color: "#e2e8f0" }}>{products.length}</div></div>
        <div className="card-glow purple p-5"><span className="label">Stock bajo / sin stock</span><div className="mt-2 text-[28px] font-bold" style={{ color: "#e2e8f0" }}>{low}</div></div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <Tabs tabs={tabs} active={filter} onChange={setFilter} />
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#3b82f6", color: "#fff" }}>
          {open ? <X size={16} /> : <Plus size={16} />} {open ? "Cerrar" : "Nuevo producto"}
        </button>
      </div>

      {open && (
        <div className="card-glow p-5 space-y-3">
          <div className="flex flex-wrap gap-3">
            <input className="field !py-2" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="field !py-2" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <select className="field !py-2 !pl-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Sudaderas</option><option>Perfumes</option><option>Accesorios</option>
            </select>
            <input type="number" className="field !py-2" placeholder="Precio" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <input type="number" className="field !py-2" placeholder="Cantidad" value={form.qty || ""} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} />
            <select className="field !py-2 !pl-3" value={form.stockStatus} onChange={(e) => setForm({ ...form, stockStatus: e.target.value })}>
              <option>En stock</option><option>Stock bajo</option><option>Sin stock</option>
            </select>
          </div>
          <button onClick={submit} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#22c55e", color: "#fff" }}>Guardar producto</button>
        </div>
      )}

      <div className="card-glow p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="label">
                <th className="text-left py-2 px-2">Producto</th>
                <th className="text-left py-2 px-2">Categoría</th>
                <th className="text-right py-2 px-2">Precio</th>
                <th className="text-right py-2 px-2">Cantidad</th>
                <th className="text-left py-2 px-2">Estado</th>
                <th className="text-right py-2 px-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid #1e1e2e" }}>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <ProductAvatar category={p.category} />
                      <div>
                        <div className="font-medium" style={{ color: "#e2e8f0" }}>{p.name}</div>
                        <div className="font-mono text-xs" style={{ color: "#64748b" }}>{p.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2" style={{ color: "#94a3b8" }}>{p.category}</td>
                  <td className="py-3 px-2 text-right font-medium" style={{ color: "#e2e8f0" }}>{fmt(p.price)}</td>
                  <td className="py-3 px-2 text-right" style={{ color: "#e2e8f0" }}>{p.qty}</td>
                  <td className="py-3 px-2"><StockDot status={p.stockStatus} /></td>
                  <td className="py-3 px-2">
                    <div className="flex justify-end">
                      <button onClick={() => remove.mutate({ id: p.id })} className="flex items-center justify-center transition-soft hover:bg-input" style={{ width: 28, height: 28, border: "1px solid #1e1e2e", background: "#0a0a0f", borderRadius: 6, color: "#64748b" }}>
                        <Edit size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-sm" style={{ color: "#64748b" }}>Sin productos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
