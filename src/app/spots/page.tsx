"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SAMPLE_PLACES } from "@/lib/sample-data";
import { Category, CATEGORIES, Place } from "@/lib/types";
import PlaceCard from "@/components/PlaceCard";

type SearchHit = { venue: { slug: string }; score: number };

export default function SpotsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  );
  const [search, setSearch] = useState("");
  const [semanticHits, setSemanticHits] = useState<SearchHit[] | null>(null);
  const [searching, setSearching] = useState(false);

  const placesBySlug = useMemo(() => {
    const map = new Map<string, Place>();
    for (const p of SAMPLE_PLACES) map.set(p.id, p);
    return map;
  }, []);

  // Semantic search via HydraDB (debounced) when query is non-empty.
  useEffect(() => {
    const q = search.trim();
    if (q.length < 2) {
      setSemanticHits(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        setSemanticHits(Array.isArray(data.results) ? data.results : []);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setSemanticHits([]);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [search]);

  const approvedPlaces = useMemo(() => {
    const hasQuery = search.trim().length >= 2;

    if (hasQuery && semanticHits) {
      // HydraDB-driven semantic results, hydrated from local data for full Place shape.
      return semanticHits
        .map((h) => placesBySlug.get(h.venue.slug))
        .filter((p): p is Place => !!p && p.status === "approved")
        .filter(
          (p) => selectedCategory === "all" || p.category === selectedCategory
        );
    }

    return SAMPLE_PLACES.filter((p) => {
      if (p.status !== "approved") return false;
      return selectedCategory === "all" || p.category === selectedCategory;
    }).sort((a, b) => b.vote_count - a.vote_count);
  }, [selectedCategory, search, semanticHits, placesBySlug]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-white font-bold text-[10px]">
                SF
              </div>
              <span className="font-semibold text-sm text-foreground">
                BudgetSF
              </span>
            </Link>
            <span className="text-muted text-xs">/ Spots</span>
          </div>
          <Link href="/" className="text-xs text-accent hover:underline">
            Back to Map
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search spots..."
            className="flex-1 px-4 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-foreground text-white"
                  : "bg-white text-muted border border-border"
              }`}
            >
              All ({SAMPLE_PLACES.filter((p) => p.status === "approved").length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = SAMPLE_PLACES.filter(
                (p) => p.status === "approved" && p.category === cat.value
              ).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                    selectedCategory === cat.value
                      ? "bg-foreground text-white"
                      : "bg-white text-muted border border-border"
                  }`}
                >
                  {cat.icon} {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {approvedPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onClick={() => {
                window.location.href = `/place/${place.id}`;
              }}
            />
          ))}
        </div>

        {approvedPlaces.length === 0 && (
          <div className="text-center py-16">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm text-muted">
              {searching ? "Searching..." : "No spots found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
