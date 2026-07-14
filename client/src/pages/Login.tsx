import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Diamond, Mail, Lock, Github } from "../components/icons";
import { useAuth } from "../store";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "emprendedor@monitor.io");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#0a0a0f" }}>
      {/* Left: form 45% */}
      <div
        className="flex items-center justify-center p-6 w-full md:w-[45%]"
        style={{ background: "#0a0a0f" }}
      >
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-avatar flex items-center justify-center text-white">
              <Diamond size={22} />
            </div>
            <span className="text-xl font-semibold" style={{ color: "#e2e8f0" }}>
              Monitor
            </span>
          </div>

          <h1 className="text-title" style={{ color: "#e2e8f0" }}>
            Bienvenido de nuevo
          </h1>
          <p className="mt-2 mb-8 text-sm" style={{ color: "#64748b" }}>
            Monitorea ventas, pedidos, stock e inversión de tu emprendimiento.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="field"
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
              <input type="password" required placeholder="Contraseña" className="field" />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-sm transition-soft hover:opacity-90"
              style={{ background: "#e2e8f0", color: "#0a0a0f" }}
            >
              Iniciar sesión
            </button>

            <div className="flex items-center gap-3 my-2">
              <span className="h-px flex-1" style={{ background: "#1e1e2e" }} />
              <span className="text-xs" style={{ color: "#475569" }}>
                o
              </span>
              <span className="h-px flex-1" style={{ background: "#1e1e2e" }} />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-soft hover:bg-input"
              style={{ background: "#111118", color: "#e2e8f0", border: "1px solid #1e1e2e" }}
            >
              <Github size={18} /> Continuar con GitHub
            </button>
          </form>
        </div>
      </div>

      {/* Right: preview 55% */}
      <div
        className="hidden md:flex flex-1 items-center justify-center p-10 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(700px circle at 20% 20%, rgba(59,130,246,0.12), transparent 45%), radial-gradient(700px circle at 80% 80%, rgba(139,92,246,0.12), transparent 45%), #0a0a0f",
        }}
      >
        <div className="w-full max-w-md rounded-card shadow-float p-5" style={{ background: "#111118", border: "1px solid #1e1e2e" }}>
          <div className="label mb-3">Resumen</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Ventas", v: "$31.8k", c: "#3b82f6" },
              { l: "Pedidos", v: "248", c: "#8b5cf6" },
              { l: "Stock", v: "155 u", c: "#22c55e" },
              { l: "Ganancias", v: "$24.8k", c: "#f59e0b" },
            ].map((k) => (
              <div key={k.l} className="rounded-lg p-3" style={{ background: "#15151f", border: "1px solid #1e1e2e" }}>
                <div className="text-xs" style={{ color: "#64748b" }}>
                  {k.l}
                </div>
                <div className="text-lg font-bold mt-1" style={{ color: k.c }}>
                  {k.v}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg p-3" style={{ background: "#15151f", border: "1px solid #1e1e2e" }}>
            <div className="text-xs mb-2" style={{ color: "#64748b" }}>
              Tendencia de ventas
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {[40, 60, 50, 75, 65, 90, 80, 100, 88, 70, 95, 110].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${h}px`,
                    background: "linear-gradient(180deg,#3b82f6,#8b5cf6)",
                    opacity: 0.85,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
