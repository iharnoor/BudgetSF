"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import { SAMPLE_PLACES } from "@/lib/sample-data";
import { Category, CATEGORIES, NEIGHBORHOODS } from "@/lib/types";
import VoteButton from "@/components/VoteButton";

type Tab = "vote" | "add";

export default function CommunityPage() {
  const [tab, setTab] = useState<Tab>("vote");
  const { user, isLoaded, isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white sticky top-0 z-10">
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
          <h1 className="font-semibold text-foreground">Community</h1>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 flex gap-0">
          <button
            onClick={() => setTab("vote")}
            className={`flex-1 py-3 text-[13px] font-medium text-center border-b-2 transition-colors ${
              tab === "vote"
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            Vote on Spots
            <span className="ml-1.5 text-[11px] bg-pending/20 text-pending-dark px-1.5 py-0.5 rounded-full">
              {SAMPLE_PLACES.filter((p) => p.status === "pending").length}
            </span>
          </button>
          <button
            onClick={() => setTab("add")}
            className={`flex-1 py-3 text-[13px] font-medium text-center border-b-2 transition-colors ${
              tab === "add"
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            Add a Spot
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {tab === "vote" ? (
          <VoteTab />
        ) : (
          <AddTab user={user} isLoaded={isLoaded} isSignedIn={isSignedIn} />
        )}
      </div>
    </div>
  );
}

/* ─── Vote Tab ─── */

function VoteTab() {
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
    <>
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
          <p className="text-sm text-muted font-medium">No pending spots</p>
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
    </>
  );
}

/* ─── Add Tab ─── */

function AddTab({
  user,
  isLoaded,
  isSignedIn,
}: {
  user: ReturnType<typeof useUser>["user"];
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "" as Category | "",
    subcategory: "",
    address: "",
    neighborhood: "",
    description: "",
    price_tier: 1,
    avg_price: "",
    tags: "",
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          submitted_by:
            user?.primaryEmailAddress?.emailAddress ||
            user?.fullName ||
            "anonymous",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 slide-up">
        <div className="text-5xl mb-4">🎉</div>
        <h2
          className="text-xl text-foreground mb-2"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          Spot submitted!
        </h2>
        <p className="text-[13px] text-muted mb-6">
          Your spot has been indexed and is available for the community to
          discover via search.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({
              name: "",
              category: "",
              subcategory: "",
              address: "",
              neighborhood: "",
              description: "",
              price_tier: 1,
              avg_price: "",
              tags: "",
              website: "",
            });
          }}
          className="px-5 py-2.5 bg-accent text-white font-medium rounded-xl text-[13px] hover:bg-accent-dark transition-colors press shadow-sm"
        >
          Add Another
        </button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="text-center py-16">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Signed in banner */}
      {isSignedIn ? (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-accent-light/40 border border-accent/10 rounded-xl">
          {user?.imageUrl && (
            <img
              src={user.imageUrl}
              alt=""
              className="w-6 h-6 rounded-full"
              referrerPolicy="no-referrer"
            />
          )}
          <span className="text-[12px] text-accent-dark font-medium">
            Submitting as {user?.fullName}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-3 bg-warm border border-border/60 rounded-xl">
          <span className="text-[12px] text-muted">
            Submitting anonymously
          </span>
          <SignInButton>
            <button className="text-[12px] text-accent font-medium hover:underline">
              Sign in instead
            </button>
          </SignInButton>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-700">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="form-label">Place name *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g., Taqueria El Farolito"
          className="w-full px-4 py-2.5 bg-surface-warm border border-border/60 rounded-xl text-[13px]"
        />
      </div>

      {/* Category + Subcategory */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Category *</label>
          <select
            required
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as Category })
            }
            className="w-full px-4 py-2.5 bg-surface-warm border border-border/60 rounded-xl text-[13px]"
          >
            <option value="">Select</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Subcategory</label>
          <input
            type="text"
            value={form.subcategory}
            onChange={(e) =>
              setForm({ ...form, subcategory: e.target.value })
            }
            placeholder="Mexican, Thai..."
            className="w-full px-4 py-2.5 bg-surface-warm border border-border/60 rounded-xl text-[13px]"
          />
        </div>
      </div>

      {/* Address + Neighborhood */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Address *</label>
          <input
            type="text"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="2779 Mission St"
            className="w-full px-4 py-2.5 bg-surface-warm border border-border/60 rounded-xl text-[13px]"
          />
        </div>
        <div>
          <label className="form-label">Neighborhood *</label>
          <select
            required
            value={form.neighborhood}
            onChange={(e) =>
              setForm({ ...form, neighborhood: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-surface-warm border border-border/60 rounded-xl text-[13px]"
          >
            <option value="">Select</option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="form-label">Why is this spot great? *</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Mention prices, what to order, tips..."
          className="w-full px-4 py-2.5 bg-surface-warm border border-border/60 rounded-xl text-[13px] resize-none"
        />
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Price range *</label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setForm({ ...form, price_tier: tier })}
                className={`flex-1 py-2.5 rounded-lg text-[13px] font-bold transition-all press ${
                  form.price_tier === tier
                    ? "bg-accent text-white shadow-sm"
                    : "bg-surface-warm border border-border/60 text-muted hover:border-border"
                }`}
              >
                {"$".repeat(tier)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="form-label">Avg price ($)</label>
          <input
            type="text"
            value={form.avg_price}
            onChange={(e) => setForm({ ...form, avg_price: e.target.value })}
            placeholder="$8-12"
            className="w-full px-4 py-2.5 bg-surface-warm border border-border/60 rounded-xl text-[13px]"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="form-label">Tags (comma-separated)</label>
        <input
          type="text"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="late-night, cash-only, BYOB"
          className="w-full px-4 py-2.5 bg-surface-warm border border-border/60 rounded-xl text-[13px]"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark press disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm text-[14px]"
      >
        {submitting ? "Submitting..." : "Submit Spot"}
      </button>
    </form>
  );
}
