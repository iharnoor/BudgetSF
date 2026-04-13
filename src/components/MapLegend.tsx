"use client";

const LEGEND_ITEMS = [
  { color: "#e63946", label: "Food" },
  { color: "#2a9d8f", label: "Grocery" },
  { color: "#1a1a2e", label: "Gym" },
  { color: "#264653", label: "Bars" },
  { color: "#f4845f", label: "Coffee" },
];

export default function MapLegend() {
  return (
    <div className="glass rounded-xl shadow-lg shadow-black/[0.04] border border-border/60 p-3.5">
      <div className="space-y-2">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <div
              className="w-3.5 h-3.5 rounded-[4px] shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] text-foreground font-medium tracking-wide">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
