import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { SalesPage } from "./pages/SalesPage";
import { InventoryPage } from "./pages/InventoryPage";

type Tab = "dashboard" | "inventory" | "sudaderas" | "perfumes" | "accesorios";

const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Inicio" },
  { id: "inventory", label: "Inventario" },
  { id: "sudaderas", label: "Sudaderas" },
  { id: "perfumes", label: "Perfumes" },
  { id: "accesorios", label: "Accesorios" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen" style={{ background: "#09090B" }}>
      <nav
        className="flex items-center gap-1 px-4 py-2 border-b sticky top-0 z-50 backdrop-blur"
        style={{ background: "#0A0A0BEE", borderColor: "#26262A" }}
      >
        <span className="text-lg font-bold mr-4 tracking-tight">
          <span style={{ color: "#EF4444" }}>H</span>
          <span style={{ color: "#FAFAFA" }}>H</span>
        </span>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-3 py-1.5 text-sm rounded-lg transition-colors"
            style={{
              background: tab === t.id ? "#EF4444" : "transparent",
              color: tab === t.id ? "#fff" : "#A1A1AA",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {tab === "dashboard" && <Dashboard />}
        {tab === "inventory" && <InventoryPage />}
        {tab === "sudaderas" && <SalesPage category="sudaderas" />}
        {tab === "perfumes" && <SalesPage category="perfumes" />}
        {tab === "accesorios" && <SalesPage category="accesorios" />}
      </main>
    </div>
  );
}
