"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SAMPLE_PLACES } from "@/lib/sample-data";
import { Category, CATEGORIES } from "@/lib/types";
import VoteButton from "@/components/VoteButton";

export default function PendingPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  );

  const pendingPlaces = useMemo(() => {
    return SAMPLE_PLACES.filter((p) => {
      const isPending = p.status === "pending";
      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      return isPending && matchesCategory;
    });
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="text-muted hover:text-foreground transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="font-semibold text-foreground">Vote on spots</h1>
          <span className="ml-auto text-xs bg-pending/20 text-pending-dark px-2 py-1 rounded-full font-medium">
            {SAMPLE_PLACES.filter((p) => p.status === "pending").length} pending
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* How it works */}
        <div className="flex items-center gap-6 mb-6 py-4 px-5 bg-white border border-border rounded-xl">
          {["Submit", "5 votes", "Goes live"].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              {i > 0 && (
                <svg
                  className="w-4 h-4 text-muted/30 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent-light text-accent-dark font-bold text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-xs font-medium text-foreground whitespace-nowrap">
                  {step}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-foreground text-white"
                : "bg-white text-muted border border-border"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? "bg-foreground text-white"
                  : "bg-white text-muted border border-border"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pending cards */}
        {pendingPlaces.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-2">🗳️</p>
            <p className="text-sm text-muted font-medium">
              No pending spots
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPlaces.map((place) => {
              const cat = CATEGORIES.find((c) => c.value === place.category);
              return (
                <div
                  key={place.id}
                  className="bg-white border border-border rounded-xl p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-xl">{cat?.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {place.name}
                      </h3>
                      <p className="text-xs text-muted">
                        {place.neighborhood} · {place.address}
                      </p>
                    </div>
                    <span className="text-accent font-bold">
                      {"$".repeat(place.price_tier)}
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed mb-3">
                    {place.description}
                  </p>
                  {place.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {place.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-gray-50 text-[10px] text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <VoteButton place={place} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
