import { NavLink } from "react-router-dom";
import {
  DashboardIcon,
  SalesIcon,
  OrdersIcon,
  StockIcon,
  ProfitIcon,
  InvestmentIcon,
  SettingsIcon,
  Shield,
  Diamond,
  Logout,
  X,
} from "../icons";
import { useAuth } from "../../store";

const items = [
  { to: "/", label: "Dashboard", icon: DashboardIcon, end: true },
  { to: "/ventas", label: "Ventas", icon: SalesIcon },
  { to: "/pedidos", label: "Pedidos", icon: OrdersIcon },
  { to: "/stock", label: "Inventario", icon: StockIcon },
  { to: "/ganancias", label: "Ganancias", icon: ProfitIcon },
  { to: "/inversion", label: "Inversión", icon: InvestmentIcon },
];

interface Props {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onCloseMobile }: Props) {
  const { logout, user } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-soft ${
      isActive ? "bg-hover text-primary" : "text-secondary hover:bg-input hover:text-primary"
    }`;

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={`fixed md:static top-0 left-0 h-full z-50 flex flex-col transition-all duration-200
          ${collapsed ? "md:w-[72px]" : "md:w-60"} w-60
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: "#0f0f16", borderRight: "1px solid #1e1e2e" }}
      >
        <div className="flex items-center justify-between px-4 h-16" style={{ borderBottom: "1px solid #1e1e2e" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-avatar flex items-center justify-center text-white">
              <Diamond size={18} />
            </div>
            {!collapsed && (
              <span className="text-base font-semibold" style={{ color: "#e2e8f0" }}>
                Monitor
              </span>
            )}
          </div>
          <button className="md:hidden text-secondary" onClick={onCloseMobile}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink key={it.to} to={it.to} end={it.end} onClick={onCloseMobile} className={linkClass} title={collapsed ? it.label : undefined}>
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span className="font-medium">{it.label}</span>}
              </NavLink>
            );
          })}
          {user?.role === "admin" && (
            <NavLink to="/admin" onClick={onCloseMobile} className={linkClass} title={collapsed ? "Administración" : undefined}>
              <Shield size={20} className="shrink-0" />
              {!collapsed && <span className="font-medium">Administración</span>}
            </NavLink>
          )}
        </nav>

        <div className="px-3 pb-4" style={{ borderTop: "1px solid #1e1e2e" }}>
          <NavLink to="/config" onClick={onCloseMobile} className={linkClass} title={collapsed ? "Configuración" : undefined}>
            <SettingsIcon size={20} className="shrink-0" />
            {!collapsed && <span className="font-medium">Configuración</span>}
          </NavLink>
          <button
            onClick={logout}
            className="mt-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-soft text-secondary hover:bg-input hover:text-primary"
            title={collapsed ? "Salir" : undefined}
          >
            <Logout size={20} className="shrink-0" />
            {!collapsed && <span className="font-medium">Salir</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
