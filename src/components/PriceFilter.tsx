"use client";

export type PriceFilter = "all" | "free" | "under_10" | "under_20";

const OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: "all", label: "Any price" },
  { value: "free", label: "Free" },
  { value: "under_10", label: "Under $10" },
  { value: "under_20", label: "Under $20" },
];

interface PriceFilterProps {
  selected: PriceFilter;
  onChange: (v: PriceFilter) => void;
}

export default function PriceFilterPills({ selected, onChange }: PriceFilterProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={selected === o.value}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-200 press border ${
            selected === o.value
              ? "bg-accent text-white border-accent shadow-sm"
              : "glass text-muted border-border/60 hover:border-border hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
