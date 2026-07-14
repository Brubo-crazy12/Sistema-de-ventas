import type { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "../icons";

type Glow = "blue" | "purple" | "green" | "orange";

interface Props {
  label: string;
  value: string;
  trend: number;
  up: boolean;
  glow: Glow;
  icon?: ReactNode;
}

export function KpiCard({ label, value, trend, up, glow, icon }: Props) {
  return (
    <div className={`card-glow ${glow} p-5`}>
      <div className="flex items-start justify-between">
        <span className="label">{label}</span>
        {icon && <span className="text-secondary">{icon}</span>}
      </div>
      <div className="mt-3 text-[28px] font-bold leading-none" style={{ color: "#e2e8f0" }}>
        {value}
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs font-medium">
        {up ? (
          <span style={{ color: "#22c55e" }} className="flex items-center gap-0.5">
            <ArrowUp size={14} /> {trend}%
          </span>
        ) : (
          <span style={{ color: "#ef4444" }} className="flex items-center gap-0.5">
            <ArrowDown size={14} /> {trend}%
          </span>
        )}
        <span style={{ color: "#64748b" }}>vs mes anterior</span>
      </div>
    </div>
  );
}
