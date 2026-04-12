"use client";

import Link from "next/link";

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
    price: "From $1,299",
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
        {/* ── Phone Plans ── */}
        <section className="mb-12">
          <SectionHeader emoji="📱" title="Phone Plans" subtitle="Cut your phone bill without cutting corners" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PHONE_PLANS.map((plan, i) => (
              <a
                key={plan.name}
                href={plan.url}
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
            ))}
          </div>
        </section>

        {/* ── Tech ── */}
        <section className="mb-12">
          <SectionHeader emoji="💻" title="Tech" subtitle="The gear I actually use every day" />
          {TECH.map((item, i) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
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
            </a>
          ))}
        </section>

        {/* ── Credit Cards ── */}
        <section className="mb-12">
          <SectionHeader emoji="💳" title="Credit Cards" subtitle="Maximize rewards on everyday spending" />
          {CREDIT_CARDS.map((card, i) => (
            <a
              key={card.name}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
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
            </a>
          ))}
        </section>

        {/* ── Banking ── */}
        <section className="mb-12">
          <SectionHeader emoji="🏦" title="Banking" subtitle="Make your money work harder" />
          {BANKING.map((bank, i) => (
            <a
              key={bank.name}
              href={bank.url}
              target="_blank"
              rel="noopener noreferrer"
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
            </a>
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
