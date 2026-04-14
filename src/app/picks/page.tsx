"use client";

import { type AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

const PHONE_PLANS = [
  {
    name: "Visible by Verizon",
    tagline: "What I use daily — unlimited hotspot is a game changer",
    price: "$25",
    pricePer: "/mo",
    priceNote: "Visible+",
    color: "#1a1a40",
    colorLight: "#e8e8f4",
    emoji: "📡",
    features: [
      "Unlimited data on Verizon's network",
      "Unlimited mobile hotspot",
      "No annual contracts",
      "Taxes & fees included",
    ],
    highlight: "My Favorite",
    note: "I hotspot off Visible everywhere — Ubers, Caltrain, cafes. Unlimited hotspot on Verizon's network for $25/mo is hard to beat.",
    url: "https://fxo.co/1535239/singhinusa",
    cta: "Try Visible",
  },
  {
    name: "Mint Mobile",
    tagline: "Solid budget option if you don't need hotspot",
    price: "$15",
    pricePer: "/mo",
    priceNote: "starting price",
    color: "#00b140",
    colorLight: "#e6f9ed",
    emoji: "📱",
    features: [
      "5G coverage nationwide",
      "Unlimited talk & text",
      "Plans from 5GB to Unlimited",
      "No contract, cancel anytime",
    ],
    highlight: "Best Value",
    url: "https://mintmobile.com/singh",
    cta: "Get Mint Mobile",
  },
];

const NEIGHBORHOODS_RANKED = [
  {
    name: "Tenderloin",
    tier: "$",
    studio: "$1,200-1,800",
    oneBr: "$1,500-2,200",
    description: "Cheapest central neighborhood. Gritty but walkable to FiDi/SoMa. Safety concerns are real but improving in spots.",
    vibe: "Budget central",
  },
  {
    name: "Bayview-Hunters Point",
    tier: "$",
    studio: "$1,300-1,800",
    oneBr: "$1,600-2,200",
    description: "Rapidly developing. T-line access. Some of the lowest rents in SF proper.",
    vibe: "Up-and-coming",
  },
  {
    name: "Visitacion Valley",
    tier: "$",
    studio: "$1,300-1,800",
    oneBr: "$1,600-2,200",
    description: "One of the most affordable neighborhoods. Quieter, more suburban feel.",
    vibe: "Quiet, affordable",
  },
  {
    name: "Excelsior",
    tier: "$",
    studio: "$1,400-1,900",
    oneBr: "$1,700-2,300",
    description: "Working-class neighborhood, affordable, diverse food options. BART accessible via Balboa Park.",
    vibe: "Diverse, family",
  },
  {
    name: "Outer Sunset",
    tier: "$",
    studio: "$1,400-1,900",
    oneBr: "$1,700-2,300",
    description: "Quiet, foggy, residential. Near Ocean Beach. Long commute downtown but N-Judah helps. Best ethnic food in SF.",
    vibe: "Chill, foggy",
  },
  {
    name: "Outer Richmond",
    tier: "$",
    studio: "$1,400-1,900",
    oneBr: "$1,700-2,400",
    description: "Similar to Outer Sunset. Near Golden Gate Park and Land's End. Amazing Asian food scene.",
    vibe: "Park-adjacent",
  },
  {
    name: "Inner Sunset",
    tier: "$$",
    studio: "$1,600-2,100",
    oneBr: "$1,900-2,600",
    description: "Near UCSF. Good restaurants and cafes. Better transit than Outer Sunset.",
    vibe: "Student-friendly",
  },
  {
    name: "Mission District",
    tier: "$$",
    studio: "$1,700-2,300",
    oneBr: "$2,000-2,800",
    description: "Creative, gritty, diverse. Where tech culture mixes with SF's artistic roots. Tons of founders live here. Startup meetups at taquerias.",
    vibe: "Founder + artsy",
  },
  {
    name: "SoMa",
    tier: "$$",
    studio: "$1,500-2,200",
    oneBr: "$1,900-2,700",
    description: "Varies wildly block by block. High density of startup offices and VC activity. Close to everything but can feel sketchy.",
    vibe: "Tech corridor",
  },
  {
    name: "Dogpatch / Potrero Hill",
    tier: "$$",
    studio: "$1,700-2,200",
    oneBr: "$2,000-2,700",
    description: "Maker/startup energy. Biotech spillover from Mission Bay. Community-driven, hidden gem for founders who want space.",
    vibe: "Maker vibes",
  },
  {
    name: "NoPa",
    tier: "$$",
    studio: "$1,800-2,300",
    oneBr: "$2,100-2,800",
    description: "Chill, creative, local vibe. Walkable to Hayes Valley and Lower Haight. The Mill coffee shop is here.",
    vibe: "Creative, chill",
  },
  {
    name: "Hayes Valley",
    tier: "$$$",
    studio: "$2,000-2,600",
    oneBr: "$2,400-3,200",
    description: "Dubbed 'Cerebral Valley' — high concentration of AI folks. La Boulangerie, Patricia's Green. The startup neighborhood.",
    vibe: "Cerebral Valley",
  },
  {
    name: "Marina",
    tier: "$$$",
    studio: "$2,000-2,700",
    oneBr: "$2,500-3,400",
    description: "Popular with the just-graduated, tech-adjacent crowd. Lively, safe, social. Bro-y reputation but great location.",
    vibe: "Social, lively",
  },
  {
    name: "East Cut / Rincon Hill",
    tier: "$$$",
    studio: "$2,200-2,800",
    oneBr: "$2,600-3,500",
    description: "Luxury high-rises, walkable to FiDi and SoMa. Feels sterile but convenient. The 'freshman dorms of SF' — tons of transplants.",
    vibe: "Modern, corporate",
  },
  {
    name: "Pacific Heights",
    tier: "$$$",
    studio: "$2,400-3,000",
    oneBr: "$2,800-3,800",
    description: "The neighborhood everyone wants to end up in. Upscale, safe, chic. Lower Pac Heights / Fillmore has a great social scene.",
    vibe: "Aspirational",
  },
];

const BUSINESS = [
  {
    name: "doola",
    tagline: "How I formed my LLC — Business in a Box handles taxes, everything",
    price: "$297",
    priceNote: "+ state fees",
    color: "#1a1a1a",
    colorLight: "#f5f5e8",
    emoji: "📌",
    features: [
      { label: "Company Formation", desc: "$0 + state fees — they handle the paperwork" },
      { label: "EIN & Operating Agreement", desc: "Included — no extra legal fees" },
      { label: "Registered Agent Service", desc: "Required for your LLC, included in the $297" },
      { label: "US Bank Account Setup", desc: "They walk you through opening a business bank account" },
      { label: "Mailing Address / Virtual Mailbox", desc: "Included with Registered Agent — no PO box needed" },
      { label: "Trustpilot: 4.5 stars", desc: "Higher rated than LegalZoom, Atlas, and Firstbase" },
    ],
    highlight: "10% Off",
    highlightNote: "code DOOLAHARNOOR10",
    note: "I used doola to set up my LLC — way cheaper than LegalZoom ($806) or Firstbase ($848). The Starter Plan covers formation, EIN, registered agent, and a virtual mailbox for $297 total. Use code DOOLAHARNOOR10 for 10% off.",
    url: "https://partnersps.doola.com/64gf2eto223k",
    cta: "Start Your LLC with doola",
  },
];

const CREDIT_CARDS = [
  {
    name: "Capital One Venture X",
    tagline: "My daily card — the credits make it basically free",
    color: "#1a1a2e",
    colorLight: "#f0eff5",
    emoji: "💳",
    annualFee: "$395",
    features: [
      { label: "$300 travel credit", desc: "Hits automatically — I don't even think about it" },
      { label: "10,000 anniversary points", desc: "Another ~$100 back every year just for having it" },
      { label: "2X miles on everything", desc: "I just swipe it everywhere, no categories to track" },
      { label: "Priority Pass lounge access", desc: "Free airport lounges — huge when traveling" },
      { label: "Global Entry / TSA Pre credit", desc: "Paid for my TSA Pre — skip the line every time" },
    ],
    highlight: "Net $0 Annual Fee",
    highlightNote: "after credits",
    url: "https://i.capitalone.com/JxtpzL0LQ",
    cta: "Apply Now",
  },
];

const TECH = [
  {
    name: 'MacBook Air 15"',
    tagline: "What I carry everywhere — lightweight, all-day battery, big screen",
    price: "From $1,099",
    color: "#3b3b3b",
    colorLight: "#f5f5f7",
    emoji: "💻",
    features: [
      { label: '15-inch Liquid Retina display', desc: "Big enough to split-screen code and browser" },
      { label: "All-day battery life", desc: "I go all day without a charger — 18 hours" },
      { label: "Apple Silicon chip", desc: "Silent, no fan, runs everything I need" },
      { label: "Lightweight & portable", desc: "Fits in any backpack, barely notice it" },
    ],
    highlight: "Best Value Mac",
    url: "https://geni.us/6BCrWL",
    cta: "Check Price on Amazon",
  },
];

const BANKING = [
  {
    name: "SoFi Bank",
    tagline: "Where I keep my money — high yield, no fees, and I got a $425 bonus",
    bonus: "Up to $425",
    bonusNote: "with direct deposit",
    color: "#6b35b5",
    colorLight: "#f3edfc",
    emoji: "🏦",
    features: [
      { label: "High-yield savings", desc: "My savings actually earn something here" },
      { label: "Checking with interest", desc: "Even the checking account pays you" },
      { label: "No account fees", desc: "No minimums, no overdraft fees, nothing" },
      { label: "Early paycheck", desc: "I get paid up to 2 days early" },
    ],
    highlight: "Up to $425 Bonus",
    url: "https://www.sofi.com/invite/money?gcp=145a5a84-2c09-4647-b446-cac4a9a2a1c9&isAliasGcp=false",
    cta: "Open SoFi Account",
  },
  {
    name: "Robinhood",
    tagline: "Where I invest — we both get a free stock when you sign up",
    bonus: "Free Stock",
    bonusNote: "you pick your gift stock",
    color: "#00c805",
    colorLight: "#e6fbe7",
    emoji: "📈",
    features: [
      { label: "Commission-free trading", desc: "Stocks, ETFs, options, crypto — no fees" },
      { label: "Free stock on sign-up", desc: "We both get to pick a gift stock" },
      { label: "Fractional shares", desc: "I started with just a few bucks" },
      { label: "No account minimums", desc: "Just sign up and start" },
    ],
    highlight: "Free Stock Gift",
    url: "https://join.robinhood.com/harnoos28",
    cta: "Get Free Stock",
  },
];

const GROCERIES = [
  {
    name: "Walmart+",
    tagline: "What I use for same-day grocery delivery",
    price: "$12.95",
    pricePer: "/mo",
    priceNote: "or $98/year",
    color: "#0071dc",
    colorLight: "#e6f0fa",
    emoji: "🛒",
    features: [
      { label: "Free delivery from store", desc: "No per-order delivery fee on $35+ orders" },
      { label: "Walmart prices, not markups", desc: "Same in-store prices online — unlike Amazon Fresh" },
      { label: "Free shipping, no minimum", desc: "Free next-day & two-day shipping on items" },
      { label: "Fuel savings", desc: "Up to 10¢ off per gallon at Exxon, Mobil, Walmart & Murphy stations" },
    ],
    highlight: "My Pick",
    note: "I switched from Amazon Fresh to Walmart+ — same-day delivery, actual store prices, and way cheaper.",
    url: "https://walmrt.us/41truU3",
    cta: "Shop My Walmart Grocery List",
  },
];

const MUSHROOM_COFFEE = [
  {
    name: "RYZE Mushroom Coffee",
    tagline: "What I switched to from regular coffee — steady energy, no crash",
    price: "~$1",
    pricePer: "/cup",
    color: "#5c3d2e",
    colorLight: "#f5efe8",
    emoji: "🍄",
    features: [
      { label: "Smooth, sustained energy", desc: "No jitters, no afternoon crash — just steady focus all day" },
      { label: "6 functional mushrooms", desc: "Lion's Mane, Reishi, Cordyceps, Shiitake, Turkey Tail, King Trumpet" },
      { label: "Way easier to make", desc: "Just add hot water and stir — no machine, no filters, no cleanup" },
      { label: "Better for your gut", desc: "Less acidic than regular coffee, easier on digestion" },
      { label: "Supports immunity & focus", desc: "Adaptogens help with stress, brain fog, and immune health" },
      { label: "Half the caffeine", desc: "48mg vs ~95mg in regular coffee — enough to work, not enough to crash" },
    ],
    highlight: "15% Off",
    highlightNote: "code IHARNOOR15",
    note: "I was spending $5-7/day on SF coffee shops. Switched to RYZE and it's ~$1/cup, takes 30 seconds to make, and I actually feel better — no midday crash. Use code IHARNOOR15 for 15% off.",
    url: "https://get.aspr.app/SH1gdN",
    cta: "Try RYZE — 15% Off",
  },
];

const SAVINGS = [
  {
    name: "Rakuten",
    tagline: "I get cash back on stuff I'm already buying — it just runs in the background",
    bonus: "Up to $30",
    bonusNote: "welcome bonus",
    color: "#e6002a",
    colorLight: "#fce8ec",
    emoji: "💸",
    features: [
      { label: "Cash back at 3,500+ stores", desc: "I get up to 19% back on Temu, Amazon, Walmart, etc." },
      { label: "Browser extension", desc: "It just pops up and applies coupons automatically" },
      { label: "Quarterly payouts", desc: "They send you a check or PayPal deposit" },
      { label: "Stack with credit card rewards", desc: "I double dip — Rakuten + Venture X on every purchase" },
    ],
    highlight: "Free Money",
    url: "https://www.rakuten.com/r/IHARNO2?eeid=44749",
    cta: "Start Earning Cash Back",
  },
];

export default function PicksPage() {
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
            <span className="text-muted text-xs">/ My Picks</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-accent hover:underline">
              Back to Map
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-warm/40" />
        <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="mb-5 slide-up">
            <img
              src="/TrainShot.jpg"
              alt="Working on Caltrain with a laptop"
              className="mx-auto w-full max-w-md rounded-2xl shadow-lg border border-border/60 object-cover"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-accent-dark text-xs font-medium mb-4 slide-up">
            <span>✨</span> Personally tested & recommended
          </div>
          <h1
            className="text-3xl sm:text-4xl text-foreground mb-3 slide-up"
            style={{
              fontFamily: "var(--font-dm-serif)",
              animationDelay: "0.05s",
              animationFillMode: "both",
            }}
          >
            Budget Picks
          </h1>
          <p
            className="text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed slide-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            Everything I actually use to save money in SF. These links support
            BudgetSF &mdash; and often get you a deal too.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* ── Phone Plans ── */}
        <section className="mb-12">
          <SectionHeader emoji="📱" title="Phone Plans" subtitle="How I get fast hotspot everywhere for $25/mo" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PHONE_PLANS.map((plan, i) => (
              <AffiliateLink
                key={plan.name}
                section="phone-plans"
                label={plan.name}
                href={plan.url}
                className="group relative bg-white rounded-2xl border border-border overflow-hidden card-hover press slide-up"
                style={{
                  animationDelay: `${0.1 + i * 0.08}s`,
                  animationFillMode: "both",
                }}
              >
                {/* Top color bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: plan.color }}
                />

                <div className="p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{plan.emoji}</span>
                        <h3 className="font-semibold text-foreground text-[15px]">
                          {plan.name}
                        </h3>
                      </div>
                      <p className="text-xs text-muted">{plan.tagline}</p>
                    </div>
                    <span
                      className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ background: plan.color }}
                    >
                      {plan.highlight}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-0.5 mb-4">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: plan.color }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted font-medium">
                      {plan.pricePer}
                    </span>
                    <span className="text-[10px] text-muted ml-1.5">
                      {plan.priceNote}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-muted">
                        <svg
                          className="w-3.5 h-3.5 mt-0.5 shrink-0"
                          style={{ color: plan.color }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Personal note */}
                  {"note" in plan && plan.note && (
                    <div className="rounded-lg bg-accent-light/40 border border-accent/10 px-3 py-2 mb-4">
                      <p className="text-[11px] text-accent-dark">{plan.note}</p>
                    </div>
                  )}

                  {/* CTA */}
                  <div
                    className="w-full py-2.5 rounded-xl text-center text-sm font-semibold text-white transition-all group-hover:shadow-lg group-hover:scale-[1.01]"
                    style={{ background: plan.color }}
                  >
                    {plan.cta}
                    <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
                      &rarr;
                    </span>
                  </div>
                </div>
              </AffiliateLink>
            ))}
          </div>
        </section>

        {/* ── Groceries ── */}
        <section className="mb-12">
          <SectionHeader emoji="🛒" title="Groceries" subtitle="How I get same-day grocery delivery on a budget" />
          {GROCERIES.map((item, i) => (
            <AffiliateLink
              key={item.name}
              section="groceries"
              label={item.name}
              href={item.url}
              className="group relative block bg-white rounded-2xl border border-border overflow-hidden card-hover press slide-up"
              style={{
                animationDelay: `${0.15 + i * 0.08}s`,
                animationFillMode: "both",
              }}
            >
              {/* Top color bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(to right, ${item.color}, ${item.color}cc)`,
                }}
              />

              <div className="p-5 sm:p-6">
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                      style={{ background: item.colorLight }}
                    >
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted">{item.tagline}</p>
                    </div>
                  </div>
                  <span
                    className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ background: item.color }}
                  >
                    {item.highlight}
                  </span>
                </div>

                {/* Price callout */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-warm border border-border/60 mb-5">
                  <div>
                    <span className="text-lg font-bold" style={{ color: item.color }}>
                      {item.price}
                    </span>
                    <span className="text-sm text-muted font-medium">{item.pricePer}</span>
                    <span className="text-[10px] text-muted ml-1.5">{item.priceNote}</span>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <p className="text-xs text-muted leading-relaxed flex-1">
                    I stopped using Amazon Fresh — Walmart+ has same-day delivery at actual store prices.
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {item.features.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-background"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: item.color }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {f.label}
                        </div>
                        <div className="text-[11px] text-muted">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Personal note */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 mb-5">
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <span className="font-semibold">Pro tip:</span> {item.note}
                  </p>
                </div>

                {/* CTA */}
                <div
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white transition-all group-hover:shadow-lg group-hover:scale-[1.005]"
                  style={{ background: item.color }}
                >
                  {item.cta}
                  <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </div>
              </div>
            </AffiliateLink>
          ))}
        </section>

        {/* ── Neighborhoods ── */}
        <section className="mb-12">
          <SectionHeader
            emoji="🏘️"
            title="SF Neighborhoods Ranked by Cost"
            subtitle="Where I'd look depending on budget — ranked cheapest to priciest"
          />
          <div className="space-y-2.5">
            {NEIGHBORHOODS_RANKED.map((hood, i) => (
              <div
                key={hood.name}
                className="bg-white rounded-2xl border border-border p-4 sm:p-5 slide-up"
                style={{
                  animationDelay: `${0.05 + i * 0.03}s`,
                  animationFillMode: "both",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] text-muted font-mono">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-sm font-semibold text-foreground">
                        {hood.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          hood.tier === "$"
                            ? "bg-green-50 text-green-700"
                            : hood.tier === "$$"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {hood.tier}
                      </span>
                    </div>
                    <p className="text-xs text-muted mb-1.5">{hood.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
                      <span>
                        <span className="font-medium text-foreground">Studio:</span>{" "}
                        {hood.studio}
                      </span>
                      <span>
                        <span className="font-medium text-foreground">1BR:</span>{" "}
                        {hood.oneBr}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted italic shrink-0">
                    {hood.vibe}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tech ── */}
        <section className="mb-12">
          <SectionHeader emoji="💻" title="Tech" subtitle="What's in my backpack — I work from cafes and Caltrain daily" />
          {TECH.map((item, i) => (
            <AffiliateLink
              key={item.name}
              section="tech"
              label={item.name}
              href={item.url}
              className="group relative block bg-white rounded-2xl border border-border overflow-hidden card-hover press slide-up"
              style={{
                animationDelay: `${0.15 + i * 0.08}s`,
                animationFillMode: "both",
              }}
            >
              {/* Top gradient */}
              <div className="h-2 w-full bg-gradient-to-r from-[#3b3b3b] via-[#8e8e93] to-[#3b3b3b]" />

              <div className="p-5 sm:p-6">
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                      style={{ background: item.colorLight }}
                    >
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted">{item.tagline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ background: item.color }}
                    >
                      {item.highlight}
                    </span>
                  </div>
                </div>

                {/* Price callout */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-warm border border-border/60 mb-5">
                  <div
                    className="text-lg font-bold"
                    style={{ color: item.color }}
                  >
                    {item.price}
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <p className="text-xs text-muted leading-relaxed flex-1">
                    I went with the 15&quot; — big enough to get real work done,
                    light enough to carry everywhere.
                  </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {item.features.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-background"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: item.color }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {f.label}
                        </div>
                        <div className="text-[11px] text-muted">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white transition-all group-hover:shadow-lg group-hover:scale-[1.005]"
                  style={{ background: item.color }}
                >
                  {item.cta}
                  <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </div>
              </div>
            </AffiliateLink>
          ))}
        </section>

        {/* ── Savings ── */}
        <section className="mb-12">
          <SectionHeader emoji="💸" title="Cash Back & Savings" subtitle="How I get money back without thinking about it" />
          {SAVINGS.map((item, i) => (
            <AffiliateLink
              key={item.name}
              section="cash-back-savings"
              label={item.name}
              href={item.url}
              className="group relative block bg-white rounded-2xl border border-border overflow-hidden card-hover press slide-up"
              style={{
                animationDelay: `${0.15 + i * 0.08}s`,
                animationFillMode: "both",
              }}
            >
              {/* Top color bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(to right, ${item.color}, ${item.color}cc)`,
                }}
              />

              <div className="p-5 sm:p-6">
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                      style={{ background: item.colorLight }}
                    >
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted">{item.tagline}</p>
                    </div>
                  </div>
                  <div
                    className="shrink-0 px-4 py-2 rounded-xl text-white text-center"
                    style={{ background: item.color }}
                  >
                    <div className="text-lg font-bold leading-tight">
                      {item.bonus}
                    </div>
                    <div className="text-[10px] opacity-80 font-medium">
                      {item.bonusNote}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {item.features.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-background"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: item.color }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {f.label}
                        </div>
                        <div className="text-[11px] text-muted">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white transition-all group-hover:shadow-lg group-hover:scale-[1.005]"
                  style={{ background: item.color }}
                >
                  {item.cta}
                  <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </div>
              </div>
            </AffiliateLink>
          ))}
        </section>

        {/* ── Business ── */}
        <section className="mb-12">
          <SectionHeader emoji="📌" title="Start Your Business" subtitle="How I formed my LLC — taxes, banking, everything handled" />
          {BUSINESS.map((item, i) => (
            <AffiliateLink
              key={item.name}
              section="business"
              label={item.name}
              href={item.url}
              className="group relative block bg-white rounded-2xl border border-border overflow-hidden card-hover press slide-up"
              style={{
                animationDelay: `${0.15 + i * 0.08}s`,
                animationFillMode: "both",
              }}
            >
              {/* Top color bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(to right, ${item.color}, ${item.color}cc)`,
                }}
              />

              <div className="p-5 sm:p-6">
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                      style={{ background: item.colorLight }}
                    >
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted">{item.tagline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span
                        className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{ background: item.color }}
                      >
                        {item.highlight}
                      </span>
                      {item.highlightNote && (
                        <p className="text-[10px] text-muted mt-0.5 text-right">
                          {item.highlightNote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price callout */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-warm border border-border/60 mb-5">
                  <div>
                    <span className="text-lg font-bold" style={{ color: item.color }}>
                      {item.price}
                    </span>
                    <span className="text-[10px] text-muted ml-1.5">{item.priceNote}</span>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <p className="text-xs text-muted leading-relaxed flex-1">
                    Cheaper than LegalZoom ($806), Atlas ($410), and Firstbase ($848).
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {item.features.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-background"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: item.color }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {f.label}
                        </div>
                        <div className="text-[11px] text-muted">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Personal note */}
                <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-5">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <span className="font-semibold">My experience:</span> {item.note}
                  </p>
                </div>

                {/* CTA */}
                <div
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white transition-all group-hover:shadow-lg group-hover:scale-[1.005]"
                  style={{ background: item.color }}
                >
                  {item.cta}
                  <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </div>
              </div>
            </AffiliateLink>
          ))}
        </section>

        {/* ── Credit Cards ── */}
        <section className="mb-12">
          <SectionHeader emoji="💳" title="Credit Cards" subtitle="The one card I use for everything — pays for itself" />
          {CREDIT_CARDS.map((card, i) => (
            <AffiliateLink
              key={card.name}
              section="credit-cards"
              label={card.name}
              href={card.url}
              className="group relative block bg-white rounded-2xl border border-border overflow-hidden card-hover press slide-up"
              style={{
                animationDelay: `${0.15 + i * 0.08}s`,
                animationFillMode: "both",
              }}
            >
              {/* Gradient top strip */}
              <div className="h-2 w-full bg-gradient-to-r from-[#1a1a2e] via-[#4a4a6a] to-[#1a1a2e]" />

              <div className="p-5 sm:p-6">
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                      style={{ background: card.colorLight }}
                    >
                      {card.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base">
                        {card.name}
                      </h3>
                      <p className="text-xs text-muted">{card.tagline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="badge badge-green font-bold">
                        {card.highlight}
                      </span>
                      {card.highlightNote && (
                        <p className="text-[10px] text-muted mt-0.5 text-right">
                          {card.highlightNote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Annual fee callout */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-warm border border-border/60 mb-5">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {card.annualFee}
                    </div>
                    <div className="text-[10px] text-muted font-medium uppercase tracking-wide">
                      Annual Fee
                    </div>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <p className="text-xs text-muted leading-relaxed flex-1">
                    The <strong>$300 travel credit</strong> +{" "}
                    <strong>10K anniversary points</strong> cover it &mdash; I basically pay{" "}
                    <span className="text-accent font-semibold">$0/year</span>.
                  </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {card.features.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-background"
                    >
                      <svg
                        className="w-4 h-4 text-accent mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {f.label}
                        </div>
                        <div className="text-[11px] text-muted">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white bg-gradient-to-r from-[#1a1a2e] to-[#2d2d5e] transition-all group-hover:shadow-lg group-hover:scale-[1.005]">
                  {card.cta}
                  <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </div>
              </div>
            </AffiliateLink>
          ))}
        </section>

        {/* ── Banking ── */}
        <section className="mb-12">
          <SectionHeader emoji="🏦" title="Banking" subtitle="Where I bank and invest — both gave me sign-up bonuses" />
          {BANKING.map((bank, i) => (
            <AffiliateLink
              key={bank.name}
              section="banking"
              label={bank.name}
              href={bank.url}
              className="group relative block bg-white rounded-2xl border border-border overflow-hidden card-hover press slide-up"
              style={{
                animationDelay: `${0.15 + i * 0.08}s`,
                animationFillMode: "both",
              }}
            >
              {/* Top color bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(to right, ${bank.color}, ${bank.color}cc)`,
                }}
              />

              <div className="p-5 sm:p-6">
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                      style={{ background: bank.colorLight }}
                    >
                      {bank.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base">
                        {bank.name}
                      </h3>
                      <p className="text-xs text-muted">{bank.tagline}</p>
                    </div>
                  </div>
                  <div
                    className="shrink-0 px-4 py-2 rounded-xl text-white text-center"
                    style={{ background: bank.color }}
                  >
                    <div className="text-lg font-bold leading-tight">
                      {bank.bonus}
                    </div>
                    <div className="text-[10px] opacity-80 font-medium">
                      {bank.bonusNote}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {bank.features.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-background"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: bank.color }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {f.label}
                        </div>
                        <div className="text-[11px] text-muted">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white transition-all group-hover:shadow-lg group-hover:scale-[1.005]"
                  style={{ background: bank.color }}
                >
                  {bank.cta}
                  <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </div>
              </div>
            </AffiliateLink>
          ))}
        </section>

        {/* ── Mushroom Coffee ── */}
        <section className="mb-12">
          <SectionHeader emoji="🍄" title="Mushroom Coffee" subtitle="How I replaced $6 cafe lattes with something that actually works better" />
          {MUSHROOM_COFFEE.map((item, i) => (
            <AffiliateLink
              key={item.name}
              section="mushroom-coffee"
              label={item.name}
              href={item.url}
              className="group relative block bg-white rounded-2xl border border-border overflow-hidden card-hover press slide-up"
              style={{
                animationDelay: `${0.15 + i * 0.08}s`,
                animationFillMode: "both",
              }}
            >
              {/* Top color bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(to right, ${item.color}, ${item.color}cc)`,
                }}
              />

              <div className="p-5 sm:p-6">
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                      style={{ background: item.colorLight }}
                    >
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted">{item.tagline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span
                        className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{ background: item.color }}
                      >
                        {item.highlight}
                      </span>
                      {item.highlightNote && (
                        <p className="text-[10px] text-muted mt-0.5 text-right">
                          {item.highlightNote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price callout */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-warm border border-border/60 mb-5">
                  <div>
                    <span className="text-lg font-bold" style={{ color: item.color }}>
                      {item.price}
                    </span>
                    <span className="text-sm text-muted font-medium">{item.pricePer}</span>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <p className="text-xs text-muted leading-relaxed flex-1">
                    vs $5-7 for a coffee shop latte in SF. That&apos;s $150+/month back in your pocket.
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {item.features.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-background"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: item.color }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {f.label}
                        </div>
                        <div className="text-[11px] text-muted">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Personal note */}
                <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-5">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <span className="font-semibold">My experience:</span> {item.note}
                  </p>
                </div>

                {/* CTA */}
                <div
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white transition-all group-hover:shadow-lg group-hover:scale-[1.005]"
                  style={{ background: item.color }}
                >
                  {item.cta}
                  <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </div>
              </div>
            </AffiliateLink>
          ))}
        </section>

        {/* Disclosure */}
        <div className="text-center py-6 border-t border-border">
          <p className="text-[11px] text-muted leading-relaxed max-w-md mx-auto">
            Some links above are referral/affiliate links. Using them supports
            BudgetSF at no extra cost to you &mdash; and often gets you a
            bonus too. I only recommend services I personally use and trust.
          </p>
        </div>

      </div>
    </div>
  );
}

function SectionHeader({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{emoji}</span>
        <h2
          className="text-xl text-foreground"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          {title}
        </h2>
      </div>
      <p className="text-xs text-muted">{subtitle}</p>
    </div>
  );
}

type AffiliateLinkProps = {
  section: string;
  label: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

function AffiliateLink({
  section,
  label,
  href,
  onClick,
  children,
  ...props
}: AffiliateLinkProps) {
  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        onClick?.(event);
        if (!href) {
          return;
        }
        track("affiliate_click", { section, label, href });
        void fetch("/api/affiliate-click", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            section,
            label,
            href,
            sourcePath: window.location.pathname,
            clickedAt: new Date().toISOString(),
          }),
        }).catch(() => {});
      }}
    >
      {children}
    </a>
  );
}
