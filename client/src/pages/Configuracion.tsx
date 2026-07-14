import { useEffect, useState } from "react";
import { Diamond, Github } from "../components/icons";
import { trpc } from "../infrastructure/api/trpc";

export function Configuracion() {
  const { data: settings } = trpc.settings.get.useQuery();
  const update = trpc.settings.update.useMutation();
  const [form, setForm] = useState({ businessName: "", email: "", currency: "MXN" });

  useEffect(() => {
    if (settings) setForm({ businessName: settings.businessName, email: settings.email, currency: settings.currency });
  }, [settings]);

  const save = () => update.mutate(form);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-title" style={{ color: "#e2e8f0" }}>Configuración</h1>

      <div className="card-glow p-5 space-y-4">
        <h2 className="text-subtitle" style={{ color: "#e2e8f0" }}>Perfil del negocio</h2>
        <div className="space-y-3">
          <div>
            <label className="label block mb-1">Nombre</label>
            <input className="field" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
          </div>
          <div>
            <label className="label block mb-1">Email de contacto</label>
            <input className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label block mb-1">Moneda</label>
            <select className="field" style={{ paddingLeft: 12 }} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option>MXN ($)</option><option>USD ($)</option><option>EUR (€)</option>
            </select>
          </div>
        </div>
        <button onClick={save} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#3b82f6", color: "#fff" }}>Guardar cambios</button>
      </div>

      <div className="card-glow p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-avatar flex items-center justify-center text-white">
          <Diamond size={20} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium" style={{ color: "#e2e8f0" }}>Monitor</div>
          <div className="text-xs" style={{ color: "#64748b" }}>Sistema de monitoreo para emprendedores</div>
        </div>
        <span className="flex items-center gap-1 text-xs" style={{ color: "#64748b" }}>
          <Github size={14} /> v0.1.0
        </span>
      </div>
    </div>
  );
}
