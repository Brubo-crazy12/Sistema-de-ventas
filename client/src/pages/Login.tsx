import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Diamond, Mail, Lock } from "../components/icons";
import { useAuth } from "../store";
import { trpc } from "../infrastructure/api/trpc";

type Mode = "login" | "register";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMut = trpc.auth.login.useMutation();
  const registerMut = trpc.auth.register.useMutation();
  const pending = loginMut.isPending || registerMut.isPending;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result =
        mode === "login"
          ? await loginMut.mutateAsync({ email, password })
          : await registerMut.mutateAsync({ name, email, password });
      login(
        {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.role,
        },
        result.token
      );
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error. Intenta de nuevo.");
    }
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
            {mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h1>
          <p className="mt-2 mb-8 text-sm" style={{ color: "#64748b" }}>
            {mode === "login"
              ? "Monitorea ventas, pedidos, stock e inversión de tu emprendimiento."
              : "Registra tu emprendimiento y empieza a monitorear todo en un solo lugar."}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre"
                  className="field !pl-3"
                />
              </div>
            )}
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
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="field"
              />
            </div>

            {error && (
              <div
                className="text-sm rounded-lg px-3 py-2"
                style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-soft hover:opacity-90 disabled:opacity-60"
              style={{ background: "#e2e8f0", color: "#0a0a0f" }}
            >
              {mode === "login" ? "Iniciar sesión" : "Registrarse"}
            </button>

            <p className="text-center text-sm" style={{ color: "#64748b" }}>
              {mode === "login" ? (
                <>
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    className="font-medium hover:underline"
                    style={{ color: "#8b5cf6" }}
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                  >
                    Regístrate
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tienes cuenta?{" "}
                  <button
                    type="button"
                    className="font-medium hover:underline"
                    style={{ color: "#8b5cf6" }}
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                  >
                    Inicia sesión
                  </button>
                </>
              )}
            </p>
          </form>

          <p className="mt-6 text-xs text-center" style={{ color: "#475569" }}>
            Demo: demo@monitor.io / demo1234
          </p>
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
