import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./store";
import { AppLayout } from "./components/layout/AppLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Ventas } from "./pages/Ventas";
import { Pedidos } from "./pages/Pedidos";
import { Stock } from "./pages/Stock";
import { Ganancias } from "./pages/Ganancias";
import { Inversion } from "./pages/Inversion";
import { Configuracion } from "./pages/Configuracion";

export default function App() {
  const { authed } = useAuth();

  if (!authed) return <Login />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/ganancias" element={<Ganancias />} />
        <Route path="/inversion" element={<Inversion />} />
        <Route path="/config" element={<Configuracion />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
