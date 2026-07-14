import { trpc } from "../infrastructure/api/trpc";
import { Shield } from "../components/icons";

const fmt = (n: number) => `$${Math.round(n).toLocaleString("es-MX")}`;
const fmtDate = (v: unknown) => {
  const d = v ? new Date(v as string) : null;
  return d ? d.toLocaleDateString("es-MX") : "—";
};

export function Admin() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();
  const { data: list, isLoading: loadingUsers } = trpc.admin.listUsers.useQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-avatar flex items-center justify-center text-white">
          <Shield size={20} />
        </div>
        <div>
          <h1 className="text-title" style={{ color: "#e2e8f0" }}>
            Administración
          </h1>
          <p className="text-xs" style={{ color: "#64748b" }}>
            Panel global de super-administrador
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card-glow p-5">
          <div className="label">Usuarios</div>
          <div className="text-2xl font-bold mt-1" style={{ color: "#e2e8f0" }}>
            {isLoading ? "…" : stats?.users ?? 0}
          </div>
        </div>
        <div className="card-glow p-5">
          <div className="label">Productos</div>
          <div className="text-2xl font-bold mt-1" style={{ color: "#e2e8f0" }}>
            {isLoading ? "…" : stats?.products ?? 0}
          </div>
        </div>
        <div className="card-glow p-5">
          <div className="label">Pedidos</div>
          <div className="text-2xl font-bold mt-1" style={{ color: "#e2e8f0" }}>
            {isLoading ? "…" : stats?.orders ?? 0}
          </div>
        </div>
        <div className="card-glow p-5">
          <div className="label">Invertido (total)</div>
          <div className="text-2xl font-bold mt-1" style={{ color: "#e2e8f0" }}>
            {isLoading ? "…" : fmt(stats?.invested ?? 0)}
          </div>
        </div>
      </div>

      <div className="card-glow p-5">
        <h2 className="text-subtitle mb-4" style={{ color: "#e2e8f0" }}>
          Usuarios registrados
        </h2>
        {loadingUsers ? (
          <p className="text-sm" style={{ color: "#64748b" }}>
            Cargando…
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "#64748b" }} className="text-left">
                  <th className="py-2 pr-4 font-medium">Nombre</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Rol</th>
                  <th className="py-2 pr-4 font-medium">Registro</th>
                </tr>
              </thead>
              <tbody>
                {(list?.users ?? []).map((u) => (
                  <tr key={u.id} style={{ borderTop: "1px solid #1e1e2e" }}>
                    <td className="py-2.5 pr-4" style={{ color: "#e2e8f0" }}>
                      {u.name}
                    </td>
                    <td className="py-2.5 pr-4" style={{ color: "#94a3b8" }}>
                      {u.email}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={
                          u.role === "admin"
                            ? { color: "#a78bfa", background: "rgba(139,92,246,0.15)" }
                            : { color: "#64748b", background: "rgba(100,116,139,0.15)" }
                        }
                      >
                        {u.role === "admin" ? "Admin" : "Usuario"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4" style={{ color: "#94a3b8" }}>
                      {fmtDate(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
