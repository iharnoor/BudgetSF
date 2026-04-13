"use client";

import { Category, CATEGORIES } from "@/lib/types";
import { SAMPLE_PLACES } from "@/lib/sample-data";

interface CategoryFilterProps {
  selected: Category | "all";
  onChange: (category: Category | "all") => void;
}

export default function CategoryFilter({
  selected,
  onChange,
}: CategoryFilterProps) {
  const categoriesWithData = CATEGORIES.filter((cat) =>
    SAMPLE_PLACES.some(
      (p) => p.status === "approved" && p.category === cat.value
    )
  );

  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => onChange("all")}
        className={`px-3.5 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all duration-200 press border ${
          selected === "all"
            ? "bg-foreground text-white border-foreground shadow-sm"
            : "glass text-muted border-border/60 hover:border-border hover:text-foreground"
        }`}
      >
        All
      </button>
      {categoriesWithData.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all duration-200 press border ${
            selected === cat.value
              ? "bg-foreground text-white border-foreground shadow-sm"
              : "glass text-muted border-border/60 hover:border-border hover:text-foreground"
          }`}
        >
          <span className="text-xs">{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
