import { Menu, Search, Bell } from "../icons";
import { useAuth } from "../../store";

interface Props {
  onOpenMobile: () => void;
  onToggleCollapse: () => void;
}

export function Header({ onOpenMobile }: Props) {
  const { user } = useAuth();
  return (
    <header
      className="flex items-center gap-3 px-4 sm:px-6 h-16 shrink-0"
      style={{ borderBottom: "1px solid #1e1e2e", background: "#0a0a0f" }}
    >
      <button className="md:hidden text-secondary" onClick={onOpenMobile}>
        <Menu size={20} />
      </button>

      <div className="relative hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
        <input
          placeholder="Buscar..."
          className="field !pl-9 !py-2 !pr-3"
          style={{ width: 280, background: "#15151f" }}
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="relative p-2 rounded-lg transition-soft hover:bg-input" style={{ color: "#64748b" }}>
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
        </button>
        {user?.role === "admin" && (
          <span
            className="hidden sm:inline px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ color: "#a78bfa", background: "rgba(139,92,246,0.15)" }}
          >
            Admin
          </span>
        )}
        <div
          className="w-9 h-9 rounded-full gradient-avatar flex items-center justify-center text-white text-sm font-semibold"
          title={user?.name ?? ""}
        >
          {user?.initials ?? ""}
        </div>
      </div>
    </header>
  );
}
