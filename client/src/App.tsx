import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./store";
import { trpc } from "./infrastructure/api/trpc";
import { AppLayout } from "./components/layout/AppLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Ventas } from "./pages/Ventas";
import { Pedidos } from "./pages/Pedidos";
import { Stock } from "./pages/Stock";
import { Ganancias } from "./pages/Ganancias";
import { Inversion } from "./pages/Inversion";
import { Configuracion } from "./pages/Configuracion";
import { Admin } from "./pages/Admin";

function SessionGuard({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const me = trpc.auth.me.useQuery(undefined, { retry: false });
  useEffect(() => {
    if (me.isError) logout();
  }, [me.isError, logout]);
  if (me.isLoading) return null;
  return <>{children}</>;
}

export default function App() {
  const { authed, user } = useAuth();

  if (!authed) return <Login />;

  return (
    <SessionGuard>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/ganancias" element={<Ganancias />} />
          <Route path="/inversion" element={<Inversion />} />
          <Route path="/config" element={<Configuracion />} />
          {user?.role === "admin" && <Route path="/admin" element={<Admin />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </SessionGuard>
  );
}
