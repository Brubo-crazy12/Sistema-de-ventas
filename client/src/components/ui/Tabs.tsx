interface Props {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}

export function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className="transition-soft"
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            background: active === t ? "#1e1e2e" : "#15151f",
            border: "1px solid #1e1e2e",
            color: active === t ? "#e2e8f0" : "#64748b",
            fontSize: 13,
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
