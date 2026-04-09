"use client";

import { Place, CATEGORIES } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface PlaceCardProps {
  place: Place;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export default function PlaceCard({
  place,
  isSelected,
  onClick,
  compact,
}: PlaceCardProps) {
  const category = CATEGORIES.find((c) => c.value === place.category);
  const priceLabel = formatPrice(place.avg_price);

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 press ${
          isSelected
            ? "bg-accent-light/60 border border-accent/20 shadow-sm"
            : "bg-surface-warm border border-border/60 hover:border-border hover:shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 ${
              isSelected ? "bg-accent/10" : "bg-warm"
            }`}
          >
            {category?.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[13px] text-foreground truncate leading-tight">
              {place.name}
            </p>
            <p className="text-[11px] text-muted mt-0.5 truncate">
              {place.neighborhood}
              {priceLabel && ` · ${priceLabel}`}
            </p>
          </div>
          <span className="text-accent font-bold text-[13px] shrink-0 tracking-tight">
            {"$".repeat(place.price_tier)}
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl card-hover press ${
        isSelected
          ? "bg-accent-light/40 border border-accent/20 shadow-sm"
          : "bg-surface-warm border border-border/60"
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-warm flex items-center justify-center text-base shrink-0">
              {category?.icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[13px] text-foreground truncate leading-tight">
                {place.name}
              </h3>
              <p className="text-[11px] text-muted mt-0.5">
                {place.neighborhood}
              </p>
            </div>
          </div>
          <span className="text-accent font-bold text-sm shrink-0 tracking-tight">
            {"$".repeat(place.price_tier)}
          </span>
        </div>

        {/* Description */}
        <p className="text-[12px] text-muted leading-relaxed line-clamp-2 mb-2.5">
          {place.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {place.subcategory && (
            <span className="badge badge-green text-[10px]">
              {place.subcategory}
            </span>
          )}
          {place.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-warm text-[10px] text-muted"
            >
              {tag}
            </span>
          ))}
          {priceLabel && (
            <span className="badge badge-green text-[10px]">{priceLabel}</span>
          )}
        </div>

        {/* Vote status for pending */}
        {place.status === "pending" && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-warm rounded-full overflow-hidden">
              <div
                className="h-full bg-pending rounded-full vote-progress-fill"
                style={{
                  width: `${(place.vote_count / place.votes_needed) * 100}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-muted whitespace-nowrap font-medium">
              {place.vote_count}/{place.votes_needed}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
