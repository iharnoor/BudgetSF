"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Category, CATEGORIES, NEIGHBORHOODS } from "@/lib/types";
import { getUser, User } from "@/lib/auth";
import LoginModal from "@/components/LoginModal";

export default function SubmitPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowLogin(true);
      return;
    }

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
          submitted_by: user.id,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            Spot submitted!
          </h1>
          <p className="text-sm text-muted mb-6">
            Your spot has been indexed and is available for the community to
            discover via search.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="px-5 py-2.5 bg-accent text-white font-medium rounded-xl text-sm hover:bg-accent-dark transition-colors"
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
              className="px-5 py-2.5 bg-white text-foreground font-medium rounded-xl text-sm border border-border hover:bg-gray-50 transition-colors"
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
      {showLogin && (
        <LoginModal
          onLogin={(u) => {
            setUser(u);
            setShowLogin(false);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center gap-3">
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
          <h1 className="font-semibold text-foreground">Add a cheap spot</h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        {!user && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              You need to{" "}
              <button
                onClick={() => setShowLogin(true)}
                className="font-medium underline hover:no-underline"
              >
                sign in
              </button>{" "}
              to submit a spot.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
              Place name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Taqueria El Farolito"
              className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
          </div>

          {/* Category + Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Category *
              </label>
              <select
                required
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as Category })
                }
                className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
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
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Subcategory
              </label>
              <input
                type="text"
                value={form.subcategory}
                onChange={(e) =>
                  setForm({ ...form, subcategory: e.target.value })
                }
                placeholder="Mexican, Thai..."
                className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
          </div>

          {/* Address + Neighborhood */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Address *
              </label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="2779 Mission St"
                className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Neighborhood *
              </label>
              <select
                required
                value={form.neighborhood}
                onChange={(e) =>
                  setForm({ ...form, neighborhood: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
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
            <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
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
              className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Price range *
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setForm({ ...form, price_tier: tier })}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      form.price_tier === tier
                        ? "bg-accent text-white"
                        : "bg-white border border-border text-muted hover:border-gray-300"
                    }`}
                  >
                    {"$".repeat(tier)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
                Avg price ($)
              </label>
              <input
                type="number"
                min="0"
                value={form.avg_price}
                onChange={(e) =>
                  setForm({ ...form, avg_price: e.target.value })
                }
                placeholder="12"
                className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="late-night, cash-only, BYOB"
              className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !user}
            className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? "Submitting..." : "Submit Spot"}
          </button>
        </form>
      </div>
    </div>
  );
}
