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
        className="flex items-center gap-1 px-4 py-2 border-b sticky top-0 z-50"
        style={{ background: "#09090B", borderColor: "#27272A" }}
      >
        <span className="text-lg font-bold mr-4" style={{ color: "#3B82F6" }}>
          HH
        </span>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-3 py-1.5 text-sm rounded-lg transition-colors"
            style={{
              background: tab === t.id ? "#3B82F6" : "transparent",
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
