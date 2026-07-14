import {
  LayoutDashboard,
  Package,
  Shirt,
  Droplets,
  Gem,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

export type Tab = "dashboard" | "inventory" | "sudaderas" | "perfumes" | "accesorios";

const NAV: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Inicio", icon: LayoutDashboard },
  { id: "inventory", label: "Inventario", icon: Package },
  { id: "sudaderas", label: "Sudaderas", icon: Shirt },
  { id: "perfumes", label: "Perfumes", icon: Droplets },
  { id: "accesorios", label: "Accesorios", icon: Gem },
];

interface Props {
  active: Tab;
  onSelect: (t: Tab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  active,
  onSelect,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: Props) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-full z-50
          flex flex-col transition-all duration-200
          ${collapsed ? "w-[72px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          background: "#0F0F11",
          borderRight: "1px solid #26262A",
        }}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b" style={{ borderColor: "#26262A" }}>
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight">
              <span style={{ color: "#EF4444" }}>H</span>
              <span style={{ color: "#FAFAFA" }}>H</span>
              <span className="text-xs ml-2 font-normal" style={{ color: "#6B6B70" }}>Ventas</span>
            </span>
          )}
          <button
            className="md:hidden p-1 rounded-lg"
            style={{ color: "#A1A1AA" }}
            onClick={onCloseMobile}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  onCloseMobile();
                }}
                title={collapsed ? item.label : undefined}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
                style={{
                  background: isActive ? "#EF4444" : "transparent",
                  color: isActive ? "#fff" : "#A1A1AA",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: "#26262A" }}>
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:opacity-80"
            style={{ color: "#6B6B70", justifyContent: collapsed ? "center" : "flex-start" }}
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            {!collapsed && <span>Colapsar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
