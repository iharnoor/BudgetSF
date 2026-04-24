"use client";

import Link from "next/link";
import { Place, CATEGORIES } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface PlaceDetailProps {
  place: Place;
  onClose: () => void;
}

export default function PlaceDetail({ place, onClose }: PlaceDetailProps) {
  const category = CATEGORIES.find((c) => c.value === place.category);
  const priceLabel = formatPrice(place.avg_price);

  return (
    <div className="bg-surface-warm border border-border/60 rounded-2xl overflow-hidden mb-3 animate-in shadow-lg shadow-black/[0.04]">
      {/* Accent bar */}
      <div className="h-1 bg-accent/80" />

      {/* Header with close */}
      <div className="flex items-center justify-between px-5 pt-3.5 pb-1">
        <span className="text-[10px] uppercase tracking-[0.08em] text-muted font-semibold">
          Selected
        </span>
        <button
          onClick={onClose}
          className="text-muted hover:text-foreground p-1 rounded-md hover:bg-warm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-5 pb-5">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-warm flex items-center justify-center text-lg shrink-0">
              {category?.icon}
            </div>
            <h3
              className="text-[17px] text-foreground truncate leading-tight"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              {place.name}
            </h3>
          </div>
          <span className="text-accent font-bold text-base shrink-0">
            {"$".repeat(place.price_tier)}
          </span>
        </div>

        <p className="text-[11px] text-muted mb-3 pl-[52px]">
          {place.address} · {place.neighborhood}
        </p>

        {/* Description */}
        <p className="text-[13px] text-foreground/80 leading-relaxed mb-3.5">
          {place.description}
        </p>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {place.subcategory && (
            <span className="badge badge-green">{place.subcategory}</span>
          )}
          {priceLabel && (
            <span className="badge badge-green">{priceLabel}</span>
          )}
          {place.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full bg-warm text-[10px] text-muted font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            href={`/place/${place.id}`}
            className="flex-1 min-w-[120px] text-center py-2.5 bg-accent text-white text-[12px] font-semibold rounded-xl hover:bg-accent-dark transition-colors press shadow-sm"
          >
            View Details
          </Link>
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-warm text-foreground text-[12px] font-semibold rounded-xl hover:bg-warm-dark/40 transition-colors press"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Website
            </a>
          )}
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(place.address + ", San Francisco, CA")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-warm text-foreground text-[12px] font-semibold rounded-xl hover:bg-warm-dark/40 transition-colors press"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Directions
          </a>
        </div>
      </div>
    </div>
  );
}
