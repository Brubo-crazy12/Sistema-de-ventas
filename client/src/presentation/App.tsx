import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar, type Tab } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { SalesPage } from "./pages/SalesPage";
import { InventoryPage } from "./pages/InventoryPage";

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#0A0A0B" }}>
      <Sidebar
        active={tab}
        onSelect={setTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className="flex items-center gap-3 px-4 h-16 border-b sticky top-0 z-30 backdrop-blur md:hidden"
          style={{ background: "#0A0A0BEE", borderColor: "#26262A" }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg"
            style={{ color: "#A1A1AA", background: "#151517" }}
          >
            <Menu size={20} />
          </button>
          <span className="text-lg font-bold tracking-tight">
            <span style={{ color: "#EF4444" }}>H</span>
            <span style={{ color: "#FAFAFA" }}>H</span>
            <span className="text-xs ml-2 font-normal" style={{ color: "#6B6B70" }}>Ventas</span>
          </span>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {tab === "dashboard" && <Dashboard />}
          {tab === "inventory" && <InventoryPage />}
          {tab === "sudaderas" && <SalesPage category="sudaderas" />}
          {tab === "perfumes" && <SalesPage category="perfumes" />}
          {tab === "accesorios" && <SalesPage category="accesorios" />}
        </main>
      </div>
    </div>
  );
}
