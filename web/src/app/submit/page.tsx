"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Category, CATEGORIES, NEIGHBORHOODS } from "@/lib/types";

export default function SubmitPage() {
  const { user, isLoaded, isSignedIn } = useUser();
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
          submitted_by: user?.primaryEmailAddress?.emailAddress || user?.fullName || "anonymous",
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
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm slide-up">
          <div className="text-5xl mb-4">🎉</div>
          <h1
            className="text-xl text-foreground mb-2"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Spot submitted!
          </h1>
          <p className="text-[13px] text-muted mb-6">
            Your spot has been indexed and is available for the community to
            discover via search.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="px-5 py-2.5 bg-accent text-white font-medium rounded-xl text-[13px] hover:bg-accent-dark transition-colors press shadow-sm"
            >
              Back to Map
            </Link>
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
              className="px-5 py-2.5 bg-surface-warm text-foreground font-medium rounded-xl text-[13px] border border-border/60 hover:bg-warm transition-colors press"
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/60 glass sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-5 h-[52px] flex items-center gap-3">
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
          <h1
            className="text-[17px] text-foreground"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Add a cheap spot
          </h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 py-8">
        {!isLoaded ? (
          <div className="text-center py-16">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Signed in banner */}
            {isSignedIn ? (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-accent-light/40 border border-accent/10 rounded-xl">
                {user.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt=""
                    className="w-6 h-6 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span className="text-[12px] text-accent-dark font-medium">
                  Submitting as {user.fullName}
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
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
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
              <label className="form-label">
                Why is this spot great? *
              </label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
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
                  onChange={(e) =>
                    setForm({ ...form, avg_price: e.target.value })
                  }
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
        )}
      </div>
    </div>
  );
}
