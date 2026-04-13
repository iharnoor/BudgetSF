"use client";

import { type AnchorHTMLAttributes, useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

const PHONE_PLANS = [
  {
    name: "Mint Mobile",
    tagline: "Wireless that's worth it",
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
  {
    name: "Visible by Verizon",
    tagline: "Premium wireless, simplified",
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
    highlight: "Unlimited Hotspot",
    url: "https://fxo.co/1535239/singhinusa",
    cta: "Try Visible",
  },
];

const CREDIT_CARDS = [
  {
    name: "Capital One Venture X",
    tagline: "Premium travel rewards, simplified",
    color: "#1a1a2e",
    colorLight: "#f0eff5",
    emoji: "💳",
    annualFee: "$395",
    features: [
      { label: "$300 travel credit", desc: "Applied automatically each year" },
      { label: "10,000 anniversary points", desc: "Worth $100+ annually" },
      { label: "2X miles on everything", desc: "No categories to track" },
      { label: "Priority Pass lounge access", desc: "1,300+ lounges worldwide" },
      { label: "Global Entry / TSA Pre credit", desc: "Up to $100 statement credit" },
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
    tagline: "The best budget laptop for everything",
    price: "From $1,099",
    color: "#3b3b3b",
    colorLight: "#f5f5f7",
    emoji: "💻",
    features: [
      { label: '15-inch Liquid Retina display', desc: "Gorgeous screen, perfect for work & media" },
      { label: "All-day battery life", desc: "Up to 18 hours — charge less, do more" },
      { label: "Apple Silicon chip", desc: "Fast, silent, fanless design" },
      { label: "Lightweight & portable", desc: "Thin enough for any backpack" },
    ],
    highlight: "Best Value Mac",
    url: "https://geni.us/6BCrWL",
    cta: "Check Price on Amazon",
  },
];

const BANKING = [
  {
    name: "SoFi Bank",
    tagline: "A smarter way to bank",
    bonus: "Up to $250",
    bonusNote: "with direct deposit",
    color: "#6b35b5",
    colorLight: "#f3edfc",
    emoji: "🏦",
    features: [
      { label: "High-yield savings", desc: "Earn more on every dollar saved" },
      { label: "Checking with interest", desc: "Your checking earns too" },
      { label: "No account fees", desc: "No minimums, no overdraft fees" },
      { label: "Early paycheck", desc: "Get paid up to 2 days early" },
    ],
    highlight: "Up to $250 Bonus",
    url: "https://www.sofi.com/invite/money?gcp=ba1670b7-b9c7-41e8-b1fa-c549dfc6c9cc&isAliasGcp=false",
    cta: "Open SoFi Account",
  },
  {
    name: "Robinhood",
    tagline: "Start investing with free stock",
    bonus: "Free Stock",
    bonusNote: "you pick your gift stock",
    color: "#00c805",
    colorLight: "#e6fbe7",
    emoji: "📈",
    features: [
      { label: "Commission-free trading", desc: "Stocks, ETFs, options, crypto" },
      { label: "Free stock on sign-up", desc: "We both pick a gift stock" },
      { label: "Fractional shares", desc: "Invest with as little as $1" },
      { label: "No account minimums", desc: "Start investing immediately" },
    ],
    highlight: "Free Stock Gift",
    url: "https://join.robinhood.com/harnoos28",
    cta: "Get Free Stock",
  },
];

const SAVINGS = [
  {
    name: "Rakuten",
    tagline: "Get cash back on everything you buy",
    bonus: "Up to $30",
    bonusNote: "welcome bonus",
    color: "#e6002a",
    colorLight: "#fce8ec",
    emoji: "💸",
    features: [
      { label: "Cash back at 3,500+ stores", desc: "Up to 19% back on Temu, plus Amazon, Walmart & more" },
      { label: "Browser extension", desc: "Auto-applies coupons + earns cash back" },
      { label: "Quarterly payouts", desc: "Big Fat Check or PayPal deposit" },
      { label: "Stack with credit card rewards", desc: "Double dip on every purchase" },
    ],
    highlight: "Free Money",
    url: "https://www.rakuten.com/r/IHARNO2?eeid=44749",
    cta: "Start Earning Cash Back",
  },
];

type BundleItem = {
  name: string;
  price: number;
  url: string;
  merchant: string;
};

type ApartmentBundle = {
  id: string;
  name: string;
  maxBudget: number;
  roomTypes: string[];
  styles: string[];
  vibe: string;
  setupTip: string;
  items: BundleItem[];
};

const APARTMENT_BUNDLES: ApartmentBundle[] = [
  {
    id: "micro-studio",
    name: "Micro Studio Starter",
    maxBudget: 1200,
    roomTypes: ["Studio", "1BR"],
    styles: ["Minimal", "Japandi"],
    vibe: "Clean lines, foldable pieces, and no-wasted-space zones.",
    setupTip: "Use one anchor furniture color so the room feels bigger.",
    items: [
      { name: 'Zinus 14" Platform Bed Frame', price: 169, url: "https://geni.us/3R2dh", merchant: "Amazon" },
      { name: "Nnewvante Folding Desk", price: 119, url: "https://geni.us/MQ9kB", merchant: "Amazon" },
      { name: "SONGMICS 43-inch Storage Ottoman", price: 82, url: "https://geni.us/QCzEgt", merchant: "Amazon" },
      { name: "Mellanni Queen Sheet Set", price: 38, url: "https://geni.us/6G7z9", merchant: "Amazon" },
      { name: "LEPOWER Floor Lamp", price: 45, url: "https://geni.us/yShv2", merchant: "Amazon" },
    ],
  },
  {
    id: "cozy-corner",
    name: "Cozy WFH Corner Kit",
    maxBudget: 1800,
    roomTypes: ["Studio", "1BR", "2BR"],
    styles: ["Cozy", "Minimal"],
    vibe: "Soft lighting + practical ergonomics for long work days.",
    setupTip: "Keep your desk near natural light and layer warm lamp tones at night.",
    items: [
      { name: 'Marsail Ergonomic Office Chair', price: 249, url: "https://geni.us/8JQf3", merchant: "Amazon" },
      { name: 'SHW 55" Standing Desk', price: 239, url: "https://geni.us/eS1b6N", merchant: "Amazon" },
      { name: "Logitech MX Keys S Keyboard", price: 119, url: "https://geni.us/q8Yv", merchant: "Amazon" },
      { name: "Logitech MX Master 3S Mouse", price: 99, url: "https://geni.us/KyA3", merchant: "Amazon" },
      { name: 'Mount-It! Monitor Arm', price: 49, url: "https://geni.us/f1q2m", merchant: "Amazon" },
      { name: "Govee Smart Lamp", price: 49, url: "https://geni.us/nm8Kc", merchant: "Amazon" },
    ],
  },
  {
    id: "roommate-flex",
    name: "Roommate Flex Bundle",
    maxBudget: 2600,
    roomTypes: ["2BR", "3BR+"],
    styles: ["Modern", "Cozy"],
    vibe: "Shared-space friendly picks, durable and easy to replace.",
    setupTip: "Prioritize modular furniture so everyone can tweak layout quickly.",
    items: [
      { name: "HONBAY Convertible Sectional", price: 599, url: "https://geni.us/nfVA3H", merchant: "Amazon" },
      { name: "Vasagle Coffee Table with Storage", price: 109, url: "https://geni.us/1fN2J", merchant: "Amazon" },
      { name: 'OLIXIS 63" Dining Table', price: 169, url: "https://geni.us/xW7vJ", merchant: "Amazon" },
      { name: "4-Pack Dining Chairs", price: 149, url: "https://geni.us/r4z9L", merchant: "Amazon" },
      { name: "2x Kitchen Utility Racks", price: 160, url: "https://geni.us/U53Qa", merchant: "Amazon" },
      { name: "Area Rug 8x10", price: 119, url: "https://geni.us/Lz99v", merchant: "Amazon" },
    ],
  },
];

const APARTMENT_PARTNERS = [
  {
    name: "Apartments.com Budget Finder",
    summary: "Filter by rent ceiling + commute + pet policy",
    url: "https://www.apartments.com/san-francisco-ca/under-2500/",
  },
  {
    name: "Zillow Rentals",
    summary: "Great for no-fee and owner-listed options",
    url: "https://www.zillow.com/san-francisco-ca/rentals/",
  },
  {
    name: "HotPads",
    summary: "Fast neighborhood scanning for budget apartments",
    url: "https://hotpads.com/san-francisco-ca/apartments-for-rent",
  },
];

export default function PicksPage() {
  const [city, setCity] = useState("San Francisco");
  const [budget, setBudget] = useState(1800);
  const [roomType, setRoomType] = useState("Studio");
  const [style, setStyle] = useState("Minimal");

  const matchingBundles = useMemo(() => {
    return APARTMENT_BUNDLES.filter(
      (bundle) =>
        budget <= bundle.maxBudget &&
        bundle.roomTypes.includes(roomType) &&
        bundle.styles.includes(style)
    );
  }, [budget, roomType, style]);

  const fallbackBundles = useMemo(
    () => APARTMENT_BUNDLES.filter((bundle) => budget <= bundle.maxBudget),
    [budget]
  );

  const featuredBundles =
    matchingBundles.length > 0 ? matchingBundles : fallbackBundles;

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
            Services I personally use to save money in SF. These links support
            BudgetSF &mdash; and often get you a deal too.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <section className="mb-12">
          <SectionHeader
            emoji="🏡"
            title="Budget Apartment Mode"
            subtitle="Get a magic setup plan in 30 seconds"
          />
          <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <label className="text-xs text-muted">
                City
                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground bg-background"
                />
              </label>
              <label className="text-xs text-muted">
                Monthly Rent Budget
                <input
                  type="number"
                  min={900}
                  step={50}
                  value={budget}
                  onChange={(event) => setBudget(Number(event.target.value) || 900)}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground bg-background"
                />
              </label>
              <label className="text-xs text-muted">
                Room Type
                <select
                  value={roomType}
                  onChange={(event) => setRoomType(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground bg-background"
                >
                  <option>Studio</option>
                  <option>1BR</option>
                  <option>2BR</option>
                  <option>3BR+</option>
                </select>
              </label>
              <label className="text-xs text-muted">
                Style
                <select
                  value={style}
                  onChange={(event) => setStyle(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground bg-background"
                >
                  <option>Minimal</option>
                  <option>Cozy</option>
                  <option>Modern</option>
                  <option>Japandi</option>
                </select>
              </label>
            </div>

            <div className="rounded-xl bg-accent-light/60 border border-accent/20 p-4 mb-5">
              <p className="text-xs text-accent-dark">
                Magic concept for {city}: prioritize{" "}
                <span className="font-semibold">{style}</span> pieces with fast
                assembly for a <span className="font-semibold">{roomType}</span>.{" "}
                Keep total setup spend under 60% of one month&apos;s rent.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuredBundles.slice(0, 2).map((bundle) => {
                const setupCost = bundle.items.reduce(
                  (sum, item) => sum + item.price,
                  0
                );
                return (
                  <div
                    key={bundle.id}
                    className="rounded-xl border border-border p-4 bg-background"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {bundle.name}
                      </h3>
                      <span className="badge badge-blue">
                        ${setupCost.toLocaleString()} setup
                      </span>
                    </div>
                    <p className="text-xs text-muted mb-3">{bundle.vibe}</p>
                    <p className="text-xs text-muted mb-3">
                      <span className="font-medium text-foreground">Tip:</span>{" "}
                      {bundle.setupTip}
                    </p>
                    <AffiliateLink
                      section="budget-apartment-mode"
                      label={`${bundle.name}-full-bundle`}
                      href={bundle.items[0]?.url ?? "https://amazon.com"}
                      className="inline-flex items-center text-xs text-accent hover:underline"
                    >
                      Shop starter item
                      <span className="ml-1">&rarr;</span>
                    </AffiliateLink>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <SectionHeader
            emoji="🛒"
            title="Shoppable Bundles"
            subtitle="Curated packs you can buy item-by-item"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {APARTMENT_BUNDLES.map((bundle, index) => {
              const total = bundle.items.reduce((sum, item) => sum + item.price, 0);
              return (
                <div
                  key={bundle.id}
                  className="bg-white rounded-2xl border border-border p-5 card-hover slide-up"
                  style={{
                    animationDelay: `${0.1 + index * 0.06}s`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-[15px] font-semibold text-foreground">
                      {bundle.name}
                    </h3>
                    <span className="badge badge-green">${total}</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {bundle.items.slice(0, 4).map((item) => (
                      <li
                        key={item.name}
                        className="flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="text-muted">{item.name}</span>
                        <AffiliateLink
                          section="shoppable-bundles"
                          label={`${bundle.id}-${item.name}`}
                          href={item.url}
                          className="text-accent hover:underline whitespace-nowrap"
                        >
                          ${item.price} at {item.merchant}
                        </AffiliateLink>
                      </li>
                    ))}
                  </ul>
                  <AffiliateLink
                    section="shoppable-bundles"
                    label={`${bundle.id}-shop-all`}
                    href={bundle.items[0]?.url ?? "https://amazon.com"}
                    className="w-full py-2.5 rounded-xl text-center text-sm font-semibold text-white bg-accent block hover:bg-accent-dark transition-colors"
                  >
                    Shop This Bundle
                  </AffiliateLink>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <SectionHeader
            emoji="🏙️"
            title="Budget Apartment Search"
            subtitle="Find apartments first, then map your setup budget"
          />
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {APARTMENT_PARTNERS.map((partner) => (
                <div
                  key={partner.name}
                  className="rounded-xl border border-border p-3 bg-background"
                >
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-muted mb-2">{partner.summary}</p>
                  <AffiliateLink
                    section="budget-apartment-search"
                    label={partner.name}
                    href={partner.url}
                    className="text-xs text-accent hover:underline"
                  >
                    Open search
                  </AffiliateLink>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Phone Plans ── */}
        <section className="mb-12">
          <SectionHeader emoji="📱" title="Phone Plans" subtitle="Cut your phone bill without cutting corners" />
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

        {/* ── Tech ── */}
        <section className="mb-12">
          <SectionHeader emoji="💻" title="Tech" subtitle="The gear I actually use every day" />
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
                    Best balance of screen size, performance, and portability.
                    The 15&quot; is the sweet spot for productivity.
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
          <SectionHeader emoji="💸" title="Cash Back & Savings" subtitle="Free money on stuff you already buy" />
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

        {/* ── Credit Cards ── */}
        <section className="mb-12">
          <SectionHeader emoji="💳" title="Credit Cards" subtitle="Maximize rewards on everyday spending" />
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
                    Easily offset by the <strong>$300 travel credit</strong> +{" "}
                    <strong>10K anniversary points</strong> &mdash; making it{" "}
                    <span className="text-accent font-semibold">effectively free</span>.
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
          <SectionHeader emoji="🏦" title="Banking" subtitle="Make your money work harder" />
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
