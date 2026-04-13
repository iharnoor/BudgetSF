"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type WorkspaceType =
  | "all"
  | "free"
  | "coworking"
  | "library"
  | "hotel-lobby"
  | "cafe";

type Workspace = {
  name: string;
  type: WorkspaceType;
  neighborhood: string;
  description: string;
  price: string;
  wifi: boolean;
  outlets: boolean;
  hours: string;
  vibe: string;
  address?: string;
  url?: string;
  tip?: string;
};

const WORKSPACES: Workspace[] = [
  // Free coworking
  {
    name: "Founders Cafe",
    type: "free",
    neighborhood: "SoMa",
    description:
      "Free coworking for founders and builders. Community-driven space where you can work, network, and collaborate.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Check @founders_cafe on X",
    vibe: "Startup energy, collaborative",
    url: "https://x.com/founders_cafe",
    tip: "Follow @founders_cafe on X for hours and events. Great for meeting other founders.",
  },
  {
    name: "Mechanics' Institute",
    type: "coworking",
    neighborhood: "FiDi",
    description:
      "Historic library and chess room since 1854. Beautiful reading rooms with fast wifi, perfect for deep work.",
    price: "$120/year",
    wifi: true,
    outlets: true,
    hours: "Mon-Fri 9am-9pm, Sat 10am-5pm, Sun 1pm-5pm",
    vibe: "Quiet, scholarly, historic",
    address: "57 Post St",
    url: "https://www.milibrary.org",
    tip: "The chess room is legendary. Annual membership is a steal for daily use.",
  },
  {
    name: "StartupHQ",
    type: "coworking",
    neighborhood: "FiDi",
    description:
      "Founder-focused coworking space in the heart of SF's financial district.",
    price: "From $200/mo",
    wifi: true,
    outlets: true,
    hours: "24/7 member access",
    vibe: "Hustle mode, founder-friendly",
    url: "https://www.startuphq.com",
  },
  {
    name: "NEON",
    type: "coworking",
    neighborhood: "Marina",
    description:
      "Neighborhood coworking and event space. Great mix of remote workers, freelancers, and small teams.",
    price: "From $250/mo",
    wifi: true,
    outlets: true,
    hours: "Mon-Fri 8am-6pm",
    vibe: "Bright, neighborhood feel",
    url: "https://www.neon.co",
  },
  {
    name: "BerlinHouse",
    type: "coworking",
    neighborhood: "FiDi",
    description:
      "European-style coworking in Frontier Tower. Community-focused with events and networking.",
    price: "From $300/mo",
    wifi: true,
    outlets: true,
    hours: "24/7 member access",
    vibe: "International, community-driven",
  },
  {
    name: "Werqwise",
    type: "coworking",
    neighborhood: "FiDi",
    description:
      "Flexible coworking and private office spaces with a professional vibe.",
    price: "From $250/mo",
    wifi: true,
    outlets: true,
    hours: "24/7 member access",
    vibe: "Professional, flexible",
    url: "https://www.werqwise.com",
  },
  {
    name: "Homebrew Club",
    type: "coworking",
    neighborhood: "SoMa",
    description:
      "24/7 member-run DIY community space. Web3, AI, and frontier tech experimentation.",
    price: "Membership-based",
    wifi: true,
    outlets: true,
    hours: "24/7",
    vibe: "Hacker vibes, experimental",
    tip: "Great for late-night building sessions.",
  },

  // Public libraries
  {
    name: "SF Main Library",
    type: "library",
    neighborhood: "Civic Center",
    description:
      "The flagship SF public library. Multiple floors with quiet study rooms, free wifi, and city views from the top floor.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Mon & Sat 10am-6pm, Tue-Thu 9am-8pm, Fri 12pm-6pm, Sun 12pm-6pm",
    vibe: "Quiet, spacious, classic",
    address: "100 Larkin St",
    url: "https://sfpl.org",
    tip: "Top floor has the best views. Study rooms can be reserved for free.",
  },
  {
    name: "Mission Branch Library",
    type: "library",
    neighborhood: "Mission",
    description:
      "Neighborhood branch with a solid work setup. Less crowded than Main Library.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Mon & Fri 1pm-6pm, Tue & Thu 10am-8pm, Wed 12pm-8pm, Sat 10am-6pm",
    vibe: "Chill, neighborhood",
    address: "300 Bartlett St",
  },
  {
    name: "Noe Valley Branch Library",
    type: "library",
    neighborhood: "Noe Valley",
    description:
      "Bright, modern branch in a family-friendly neighborhood. Great for focused afternoon work.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Mon 12pm-6pm, Tue 10am-8pm, Wed 12pm-8pm, Thu 10am-6pm, Sat 10am-6pm",
    vibe: "Modern, quiet, sunny",
    address: "451 Jersey St",
  },
  {
    name: "Mill Valley Public Library",
    type: "library",
    neighborhood: "Mill Valley (Marin)",
    description:
      "One of the best reading nooks in the Bay Area. Surrounded by nature with beautiful architecture.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Mon-Thu 10am-9pm, Fri-Sat 10am-5pm, Sun 12pm-5pm",
    vibe: "Nature, serene, inspiring",
    address: "375 Throckmorton Ave, Mill Valley",
    tip: "Worth the trip across the bridge. Grab lunch on Throckmorton after.",
  },

  // Hotel lobbies
  {
    name: "Hotel Kabuki Lobby",
    type: "hotel-lobby",
    neighborhood: "Japantown",
    description:
      "Calm, Japanese-inspired hotel lobby with comfortable seating. Nobody will bother you if you order a drink.",
    price: "Free (buy a drink)",
    wifi: true,
    outlets: false,
    hours: "Lobby open 24/7",
    vibe: "Zen, quiet, elegant",
    address: "1625 Post St",
    tip: "The courtyard area is especially peaceful.",
  },
  {
    name: "1 Hotel San Francisco Lobby",
    type: "hotel-lobby",
    neighborhood: "Mission Bay",
    description:
      "Gorgeous nature-inspired lobby with ample seating, plants, and a calm atmosphere. Great for meetings.",
    price: "Free",
    wifi: true,
    outlets: false,
    hours: "Lobby open 24/7",
    vibe: "Modern, green, airy",
    address: "8 Mission St",
  },
  {
    name: "Proper Hotel Lobby",
    type: "hotel-lobby",
    neighborhood: "Mid-Market",
    description:
      "Beautifully designed lobby lounge with a cafe. Popular with tech workers for meetings.",
    price: "Free (buy a coffee)",
    wifi: true,
    outlets: false,
    hours: "Lobby open all day",
    vibe: "Chic, design-forward",
    address: "1100 Market St",
    tip: "The rooftop bar is great for after-work drinks too.",
  },
  {
    name: "The LINE SF Lobby",
    type: "hotel-lobby",
    neighborhood: "Tenderloin/Mid-Market",
    description:
      "Trendy hotel with a spacious ground-floor cafe/lobby. Good vibes for casual meetings.",
    price: "Free (buy a coffee)",
    wifi: true,
    outlets: false,
    hours: "Lobby open all day",
    vibe: "Trendy, artsy",
    address: "33 Turk St",
  },

  // Cafes great for working
  {
    name: "Blue Bottle - South Park",
    type: "cafe",
    neighborhood: "SoMa",
    description:
      "The original Blue Bottle spot in the tech-heavy South Park area. Iconic for startup meetings.",
    price: "$5-7/coffee",
    wifi: true,
    outlets: false,
    hours: "7am-5pm daily",
    vibe: "Classic tech scene",
    address: "315 Linden St",
    tip: "South Park is where tons of VCs and founders hang out.",
  },
  {
    name: "Sightglass Coffee - 20th St",
    type: "cafe",
    neighborhood: "Mission",
    description:
      "Spacious, industrial-chic cafe. The 20th St location is frequented by AI folks.",
    price: "$5-7/coffee",
    wifi: true,
    outlets: true,
    hours: "7am-5pm daily",
    vibe: "Industrial, spacious, AI crowd",
    address: "270 7th St",
    tip: "The 20th St location is where the AI people go.",
  },
  {
    name: "The Mill",
    type: "cafe",
    neighborhood: "NoPa",
    description:
      "Famous for $4 toast and great coffee. Lots of natural light and a long communal table.",
    price: "$5-7/coffee",
    wifi: true,
    outlets: true,
    hours: "7am-5pm daily",
    vibe: "Bright, communal, creative",
    address: "736 Divisadero St",
  },
  {
    name: "Ritual Coffee - Hayes Valley",
    type: "cafe",
    neighborhood: "Hayes Valley",
    description:
      "Open-air vibes. Outdoor seating with a great people-watching scene in the heart of Hayes.",
    price: "$5-6/coffee",
    wifi: true,
    outlets: false,
    hours: "7am-5pm daily",
    vibe: "Outdoor, social",
    address: "432B Octavia St",
    tip: "Mostly outdoor seating - great on sunny days.",
  },
  {
    name: "Cafe Reveille",
    type: "cafe",
    neighborhood: "Lower Haight",
    description:
      "Cozy neighborhood cafe with solid wifi and a good mix of locals and remote workers.",
    price: "$5-6/coffee",
    wifi: true,
    outlets: true,
    hours: "7am-5pm daily",
    vibe: "Cozy, neighborhood",
    address: "610 Long Oak St",
  },
  {
    name: "The Coffee Movement",
    type: "cafe",
    neighborhood: "Richmond",
    description:
      "Community-focused cafe in the Richmond. Less crowded than downtown spots.",
    price: "$4-6/coffee",
    wifi: true,
    outlets: true,
    hours: "7am-4pm daily",
    vibe: "Community, relaxed",
  },
  {
    name: "Flywheel Coffee",
    type: "cafe",
    neighborhood: "Upper Haight",
    description:
      "Great starting point for Golden Gate Park walking meetings. Cozy and laptop-friendly.",
    price: "$4-6/coffee",
    wifi: true,
    outlets: true,
    hours: "7am-5pm daily",
    vibe: "Chill, park-adjacent",
    address: "672 Stanyan St",
    tip: "Grab a coffee then walk through Golden Gate Park for a walking meeting.",
  },
  {
    name: "Equator Coffee - Fort Mason",
    type: "cafe",
    neighborhood: "Marina",
    description:
      "Waterfront location at Fort Mason with incredible views. Perfect pre-walk meeting coffee.",
    price: "$5-7/coffee",
    wifi: true,
    outlets: false,
    hours: "7am-5pm daily",
    vibe: "Scenic, waterfront",
    address: "2 Marina Blvd, Bldg C",
    tip: "Start here, then walk the Marina Green waterfront.",
  },
  {
    name: "Cafe Shoji",
    type: "cafe",
    neighborhood: "FiDi",
    description:
      "Japanese-inspired cafe in the Financial District. Calm atmosphere for focused work or meetings.",
    price: "$5-7/coffee",
    wifi: true,
    outlets: true,
    hours: "8am-4pm Mon-Fri",
    vibe: "Minimal, Japanese, calm",
  },
  {
    name: "La Boulangerie",
    type: "cafe",
    neighborhood: "Hayes Valley",
    description:
      "French bakery cafe where you'll run into founders and VCs on any given day.",
    price: "$5-8/coffee + pastry",
    wifi: true,
    outlets: false,
    hours: "7am-6pm daily",
    vibe: "French, social, tech scene",
    tip: "The unofficial meeting spot for Hayes Valley tech people.",
  },
  {
    name: "The Buoy",
    type: "cafe",
    neighborhood: "Hayes Valley",
    description:
      "Trendy spot in Hayes Valley. Good for casual meetings.",
    price: "$5-7/coffee",
    wifi: true,
    outlets: false,
    hours: "8am-5pm daily",
    vibe: "Trendy, social",
  },
];

const FILTERS: { value: WorkspaceType; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "" },
  { value: "free", label: "Free", icon: "🆓" },
  { value: "coworking", label: "Coworking", icon: "💻" },
  { value: "library", label: "Libraries", icon: "📚" },
  { value: "hotel-lobby", label: "Hotel Lobbies", icon: "🏨" },
  { value: "cafe", label: "Cafes", icon: "☕" },
];

export default function WorkspacesPage() {
  const [filter, setFilter] = useState<WorkspaceType>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return WORKSPACES.filter((w) => {
      const matchesType = filter === "all" || w.type === filter;
      const matchesSearch =
        search === "" ||
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
        w.description.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filter, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-white font-bold text-[10px]">
                SF
              </div>
              <span className="font-semibold text-sm text-foreground">
                BudgetSF
              </span>
            </Link>
            <span className="text-muted text-xs">/ Workspaces</span>
          </div>
          <Link href="/" className="text-xs text-accent hover:underline">
            Back to Map
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-warm/40" />
        <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-accent-dark text-xs font-medium mb-4 slide-up">
            <span>💻</span> Free &amp; budget work spots
          </div>
          <h1
            className="text-3xl sm:text-4xl text-foreground mb-3 slide-up"
            style={{
              fontFamily: "var(--font-dm-serif)",
              animationDelay: "0.05s",
              animationFillMode: "both",
            }}
          >
            Work Spots
          </h1>
          <p
            className="text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed slide-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            Coworking spaces, libraries, hotel lobbies, and cafes where you can
            get work done in SF without breaking the bank.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search spots, neighborhoods..."
            className="flex-1 px-4 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === f.value
                    ? "bg-foreground text-white"
                    : "bg-white text-muted border border-border hover:border-foreground/20"
                }`}
              >
                {f.icon && <span>{f.icon}</span>} {f.label}
                {f.value === "all" ? (
                  <span className="ml-0.5 opacity-60">
                    ({WORKSPACES.length})
                  </span>
                ) : (
                  <span className="ml-0.5 opacity-60">
                    ({WORKSPACES.filter((w) => w.type === f.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {filtered.map((workspace) => (
            <WorkspaceCard key={workspace.name} workspace={workspace} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm text-muted">No spots found</p>
          </div>
        )}

        <div className="text-center pt-10 text-xs text-muted">
          Know a great work spot?{" "}
          <Link href="/submit" className="text-accent hover:underline">
            Submit it
          </Link>
        </div>

        <div className="text-center pt-4 pb-2 text-[11px] text-muted">
          Spots sourced with help from{" "}
          <a
            href="https://x.com/michelleefang"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            @michelleefang
          </a>
          &apos;s{" "}
          <a
            href="https://www.startertosf.guide/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Starter Guide to SF
          </a>
        </div>
      </div>
    </div>
  );
}

function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const typeColors: Record<string, { bg: string; text: string }> = {
    free: { bg: "bg-green-50", text: "text-green-700" },
    coworking: { bg: "bg-blue-50", text: "text-blue-700" },
    library: { bg: "bg-amber-50", text: "text-amber-700" },
    "hotel-lobby": { bg: "bg-purple-50", text: "text-purple-700" },
    cafe: { bg: "bg-orange-50", text: "text-orange-700" },
  };

  const typeLabels: Record<string, string> = {
    free: "Free Coworking",
    coworking: "Coworking",
    library: "Library",
    "hotel-lobby": "Hotel Lobby",
    cafe: "Cafe",
  };

  const colors = typeColors[workspace.type] ?? {
    bg: "bg-gray-50",
    text: "text-gray-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-5 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground">
              {workspace.url ? (
                <a
                  href={workspace.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {workspace.name}
                  <span className="ml-1 text-[10px] opacity-40">&#8599;</span>
                </a>
              ) : (
                workspace.name
              )}
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.bg} ${colors.text}`}
            >
              {typeLabels[workspace.type]}
            </span>
          </div>

          <p className="text-xs text-muted mb-2.5">{workspace.description}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted">
            <span>
              <span className="font-medium text-foreground">
                {workspace.neighborhood}
              </span>
            </span>
            <span>
              <span className="font-medium text-foreground">
                {workspace.price}
              </span>
            </span>
            {workspace.wifi && <span>Wifi</span>}
            {workspace.outlets && <span>Outlets</span>}
            <span>{workspace.hours}</span>
          </div>

          {workspace.tip && (
            <div className="mt-2.5 rounded-lg bg-accent-light/40 border border-accent/10 px-3 py-2">
              <p className="text-[11px] text-accent-dark">
                <span className="font-semibold">Tip:</span> {workspace.tip}
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 text-right">
          <span className="text-xs font-medium text-muted italic">
            {workspace.vibe}
          </span>
        </div>
      </div>
    </div>
  );
}
