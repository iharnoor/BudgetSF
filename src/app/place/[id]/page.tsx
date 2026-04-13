"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SAMPLE_PLACES } from "@/lib/sample-data";
import { CATEGORIES } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import VoteButton from "@/components/VoteButton";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const place = SAMPLE_PLACES.find((p) => p.id === id);

  const similarPlaces = useMemo(() => {
    if (!place) return [];
    return SAMPLE_PLACES.filter(
      (p) =>
        p.id !== place.id &&
        p.category === place.category &&
        p.status === "approved"
    ).slice(0, 3);
  }, [place]);

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-3xl mb-2">😕</p>
          <p className="text-sm text-muted mb-3">Place not found</p>
          <Link href="/" className="text-sm text-accent hover:underline">
            Back to map
          </Link>
        </div>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.value === place.category);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
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
          <span className="text-sm text-muted truncate">{place.name}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main */}
          <div className="lg:col-span-3 space-y-5">
            {/* Header card */}
            <div className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                {place.status === "pending" && (
                  <span className="px-2 py-0.5 rounded-full bg-pending/20 text-pending-dark text-xs font-medium">
                    Pending
                  </span>
                )}
                {place.status === "approved" && (
                  <span className="px-2 py-0.5 rounded-full bg-accent-light text-accent-dark text-xs font-medium">
                    Approved
                  </span>
                )}
              </div>

              <div className="flex items-start justify-between gap-3 mb-3">
                <h1 className="text-xl font-bold text-foreground">
                  {place.name}
                </h1>
                <span className="text-2xl font-bold text-accent shrink-0">
                  {"$".repeat(place.price_tier)}
                </span>
              </div>

              <p className="text-xs text-muted mb-4">{place.address}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-xs font-medium">
                  {category?.icon} {category?.label}
                </span>
                {place.subcategory && (
                  <span className="px-2.5 py-1 rounded-full bg-gray-50 text-xs text-muted">
                    {place.subcategory}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full bg-gray-50 text-xs text-muted">
                  {place.neighborhood}
                </span>
                {formatPrice(place.avg_price) && (
                  <span className="px-2.5 py-1 rounded-full bg-accent-light text-xs text-accent-dark font-medium">
                    {formatPrice(place.avg_price)}
                  </span>
                )}
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-4">
                {place.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {place.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-gray-50 text-[11px] text-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Voting */}
            {place.status === "pending" && (
              <div className="bg-white border border-border rounded-xl p-5">
                <h2 className="font-medium text-sm text-foreground mb-3">
                  Community Approval
                </h2>
                <VoteButton place={place} />
              </div>
            )}

            {/* Similar */}
            {similarPlaces.length > 0 && (
              <div>
                <h2 className="font-medium text-sm text-foreground mb-3">
                  Similar spots
                </h2>
                <div className="space-y-2">
                  {similarPlaces.map((sp) => (
                    <Link
                      key={sp.id}
                      href={`/place/${sp.id}`}
                      className="flex items-center gap-3 bg-white border border-border rounded-xl p-3 hover:shadow-sm transition-all"
                    >
                      <span className="text-base">
                        {CATEGORIES.find((c) => c.value === sp.category)?.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {sp.name}
                        </p>
                        <p className="text-xs text-muted">{sp.neighborhood}</p>
                      </div>
                      <span className="text-accent font-bold text-sm">
                        {"$".repeat(sp.price_tier)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar map */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <Map places={[place]} className="h-[250px] rounded-xl" />
              <p className="text-xs text-muted text-center mt-2">
                {place.vote_count} upvotes · Added{" "}
                {new Date(place.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
