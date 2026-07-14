import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { trend } from "../../data/mock";

export function SalesBarChart({ height = 280 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={trend} barGap={6}>
          <defs>
            <linearGradient id="gVentas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="gGanancias" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis dataKey="label" stroke="#475569" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#1e1e2e" }} tickLine={false} />
          <YAxis stroke="#475569" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={42} />
          <Tooltip
            cursor={{ fill: "rgba(30,30,46,0.4)" }}
            contentStyle={{
              background: "#111118",
              border: "1px solid #1e1e2e",
              borderRadius: 8,
              color: "#e2e8f0",
              fontSize: 12,
            }}
          />
          <Legend
            iconType="square"
            wrapperStyle={{ fontSize: 12, color: "#64748b", paddingTop: 8 }}
          />
          <Bar dataKey="ventas" name="Ventas" fill="url(#gVentas)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="ganancias" name="Ganancias" fill="url(#gGanancias)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
