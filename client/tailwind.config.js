/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0a0a0f",
        card: "#111118",
        input: "#15151f",
        hover: "#1e1e2e",
        primary: "#e2e8f0",
        secondary: "#64748b",
        tertiary: "#475569",
        line: "#1e1e2e",
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
        accent: "#8b5cf6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        title: ["24px", { lineHeight: "32px", fontWeight: "600", letterSpacing: "-0.5px" }],
        subtitle: ["16px", { lineHeight: "24px", fontWeight: "600" }],
        label: ["12px", { lineHeight: "16px", fontWeight: "400", letterSpacing: "0.5px" }],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.25)",
        float: "0 20px 60px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};
