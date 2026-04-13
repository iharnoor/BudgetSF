"use client";

import { useState, useRef, useCallback } from "react";
import { Place } from "@/lib/types";

type Message = {
  role: "user" | "assistant";
  text: string;
  places?: Place[];
};

export default function ChatBubble({
  onPlaceClick,
}: {
  onPlaceClick?: (place: Place) => void;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hey! Ask me anything about budget spots in SF. Powered by HydraDB. Try \"cheap tacos\" or \"free coworking\" or \"best coffee in Hayes Valley\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const search = useCallback(
    async (query: string) => {
      setLoading(true);
      setMessages((prev) => [...prev, { role: "user", text: query }]);

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`
        );
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          const places: Place[] = data.results
            .slice(0, 5)
            .map(
              (
                r: { venue: Record<string, unknown>; score: number },
                i: number
              ) => ({
                id: `chat_${i}`,
                name: r.venue.name,
                category: r.venue.category || "other",
                subcategory: r.venue.subcategory || undefined,
                address: r.venue.address || "",
                neighborhood: r.venue.neighborhood || "",
                description: r.venue.description || "",
                price_tier: r.venue.price_tier || 1,
                avg_price: r.venue.avg_price || undefined,
                tags: (r.venue.tags as string[]) || [],
                lat: (r.venue.lat as number) || 37.7749,
                lng: (r.venue.lng as number) || -122.4194,
                status: "approved" as const,
                vote_count: 0,
                votes_needed: 5,
                submitted_by: "hydra",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
            );

          const topNames = places
            .slice(0, 3)
            .map((p) => `**${p.name}** (${p.neighborhood}, ${"$".repeat(Math.min(Math.max(p.price_tier, 1), 4))})`)
            .join(", ");

          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: `Found ${places.length} spots! Top picks: ${topNames}. Tap any to see on map.`,
              places,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: "Hmm, didn't find anything for that. Try something like \"cheap burritos\", \"budget gym\", or \"coffee mission district\".",
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Something went wrong. Try again?",
          },
        ]);
      } finally {
        setLoading(false);
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          });
        }, 100);
      }
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const query = input.trim();
    setInput("");
    search(query);
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="absolute bottom-20 left-4 z-40 w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-xl border border-border/60 overflow-hidden animate-in flex flex-col"
          style={{ maxHeight: "min(500px, calc(100vh - 160px))" }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center text-white text-[9px] font-bold">
                SF
              </div>
              <span className="text-[13px] font-semibold text-foreground">
                BudgetSF Search
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted hover:text-foreground p-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          >
            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  className={`text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "text-right"
                      : "text-left text-muted"
                  }`}
                >
                  {msg.role === "user" ? (
                    <span className="inline-block bg-accent text-white px-3 py-1.5 rounded-xl rounded-br-sm max-w-[85%]">
                      {msg.text}
                    </span>
                  ) : (
                    <span className="inline-block bg-background px-3 py-1.5 rounded-xl rounded-bl-sm max-w-[85%] text-foreground">
                      {msg.text}
                    </span>
                  )}
                </div>
                {msg.places && msg.places.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {msg.places.map((place) => (
                      <button
                        key={place.id + place.name}
                        onClick={() => onPlaceClick?.(place)}
                        className="w-full text-left bg-background hover:bg-accent-light/40 rounded-lg px-3 py-2 transition-colors border border-border/40"
                      >
                        <span className="text-xs font-medium text-foreground">
                          {place.name}
                        </span>
                        <span className="text-[10px] text-muted block">
                          {place.neighborhood} ·{" "}
                          {"$".repeat(
                            Math.min(Math.max(place.price_tier, 1), 4)
                          )}{" "}
                          · {place.subcategory || place.category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted">
                <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="px-3 py-2.5 border-t border-border/60 shrink-0"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about budget spots..."
                className="flex-1 text-xs px-3 py-2 bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-accent text-white rounded-lg text-xs font-medium disabled:opacity-40 hover:bg-accent-dark transition-colors"
              >
                Ask
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setOpen(!open)}
        className={`absolute bottom-6 left-4 z-40 w-12 h-12 rounded-full shadow-lg transition-all press flex items-center justify-center ${
          open
            ? "bg-foreground text-white"
            : "bg-accent text-white hover:shadow-xl hover:scale-105"
        }`}
      >
        {open ? (
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>
    </>
  );
}
