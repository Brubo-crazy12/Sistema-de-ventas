interface Segment {
  label: string;
  color: string;
  value: number;
}

export function OrderDonut({ data }: { data: Segment[] }) {
  const total = data.reduce((a, c) => a + c.value, 0) || 1;

  const r = 56;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 150, height: 150 }}>
        <svg width={150} height={150} className="-rotate-90">
          <circle cx={75} cy={75} r={r} fill="none" stroke="#1e1e2e" strokeWidth={16} />
          {data.map((s) => {
            const len = (s.value / total) * c;
            const dash = `${len} ${c - len}`;
            const el = (
              <circle
                key={s.label}
                cx={75}
                cy={75}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={16}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                style={{ transition: "stroke-dasharray 0.4s" }}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: "#e2e8f0" }}>
            {data.reduce((a, c) => a + c.value, 0)}
          </span>
          <span className="text-xs" style={{ color: "#64748b" }}>
            Total
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 w-full">
        {data.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2" style={{ color: "#e2e8f0" }}>
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="font-medium" style={{ color: "#e2e8f0" }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
