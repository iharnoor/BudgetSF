import type { Metadata } from "next";
import Link from "next/link";

import { BUDGET_BREAKDOWN, BUDGET_TOTAL } from "@/lib/budget";
import { OG_VERSION } from "@/lib/og-version";
import { ShareControls } from "./share-controls";

const PAGE_TITLE = `Moving to SF? Live here for $${BUDGET_TOTAL.toLocaleString()}/month.`;
const PAGE_DESCRIPTION =
  "A 4-min read for newcomers. Where to sleep first week, what to eat, how to get around, where to find people. By a founder doing it.";

export const metadata: Metadata = {
  title: `Moving to SF — BudgetSF`,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "article",
    url: "https://budgetsf.com/moving",
    images: [
      {
        url: `/api/og?for=/moving&v=${OG_VERSION}`,
        width: 1200,
        height: 630,
        alt: PAGE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [`/api/og?for=/moving&v=${OG_VERSION}`],
  },
};

const WEEK_ONE_PLACES = [
  {
    name: "HF0",
    blurb: "Residency for technical founders, 12 weeks, free housing in SoMa.",
    href: "/spots",
  },
  {
    name: "Hardware Residency",
    blurb: "1916 Octavia. Subsidiary of The Residency for hardware builders.",
    href: "/spots",
  },
  {
    name: "PowelHouse",
    blurb: "Mission hacker house, $1,100/mo private room.",
    href: "/spots",
  },
];

const FIRST_EATS = [
  { name: "Costco Hot Dog · SoMa", price: "$1.50" },
  { name: "Mensho Tonkotsu · TenderNob", price: "$16" },
  { name: "Jenny's Hair Salon · Chinatown (haircut, $13)", price: "$13" },
];

const COMMUNITIES = [
  {
    name: "South Park Commons",
    blurb: "Pre-idea founders + curious technologists. Apply early.",
    href: "/community",
  },
  {
    name: "Cerebral Valley",
    blurb: "AI summit + ongoing dinners. Where the AI scene lives.",
    href: "/community",
  },
  {
    name: "Founders Cafe",
    blurb: "Free coworking in Hayes Valley. Bump into people.",
    href: "/workspaces",
  },
];

function CostRow({ label, monthly, total }: { label: string; monthly: number; total?: boolean }) {
  return (
    <div
      className={`flex justify-between items-baseline py-3 px-4 ${
        total
          ? "bg-accent-light/40 font-semibold border-t border-border"
          : "border-b border-border last:border-b-0"
      }`}
    >
      <span className="text-sm text-foreground">{label}</span>
      <span
        className={`tabular-nums ${total ? "text-accent-dark text-base" : "text-foreground"}`}
      >
        ${monthly.toLocaleString()}
      </span>
    </div>
  );
}

export default function MovingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-white font-bold text-[10px]">
              SF
            </div>
            <span className="font-semibold text-sm text-foreground">BudgetSF</span>
            <span className="text-muted text-xs">/ Moving Here</span>
          </Link>
          <Link href="/" className="text-xs text-accent hover:underline">
            See the map →
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 pt-10 pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-accent-dark text-xs font-medium mb-6 slide-up">
          Moving to SF · 4-min read
        </div>
        <h1
          className="text-4xl sm:text-5xl text-foreground leading-[1.05] mb-4 slide-up"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          You can live in SF for{" "}
          <span className="text-accent-dark italic">${BUDGET_TOTAL.toLocaleString()}</span>{" "}
          if you do these 6 things.
        </h1>
        <p className="text-base text-muted leading-relaxed max-w-xl mb-8 slide-up">
          By a founder doing it. Hacker-house lifestyle, Costco diet, public transit. No paywalls,
          two affiliate links flagged inline.
        </p>

        <section className="mb-10">
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            {BUDGET_BREAKDOWN.map((line) => (
              <CostRow key={line.label} label={line.label} monthly={line.monthly} />
            ))}
            <CostRow label="Total / month" monthly={BUDGET_TOTAL} total />
          </div>
          <p className="text-xs text-muted mt-3 leading-relaxed">
            Anchored on the hacker-house lifestyle since most readers here are founders. A corporate
            studio lifestyle is roughly 2.5x this.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
            1 · Week 1: where to sleep
          </h2>
          <div className="space-y-3">
            {WEEK_ONE_PLACES.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="card-hover block bg-white rounded-xl border border-border p-4"
              >
                <div className="font-semibold text-sm text-foreground">{p.name}</div>
                <div className="text-xs text-muted mt-1 leading-relaxed">{p.blurb}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
            2 · Eat like this for the first month
          </h2>
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            {FIRST_EATS.map((e, i) => (
              <div
                key={e.name}
                className={`flex justify-between items-baseline py-3 px-4 ${
                  i < FIRST_EATS.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="text-sm text-foreground">{e.name}</span>
                <span className="text-sm text-foreground tabular-nums">{e.price}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-3">
            The full $250/month Costco diet is on <Link href="/diet" className="text-accent hover:underline">/diet</Link>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
            3 · Get around without a car
          </h2>
          <ul className="space-y-2 text-sm text-foreground leading-relaxed">
            <li>
              <b>BART from SFO</b> — $10.85, 30 min to Embarcadero. Skip Uber unless you land after midnight.
            </li>
            <li>
              <b>Bay Wheels e-bikes</b> — $20/mo unlimited. The fastest way around the city.
            </li>
            <li>
              <b>Waymo in SF</b> — flat pricing, no surge. Doesn't pickup at SFO yet.
            </li>
          </ul>
          <p className="text-xs text-muted mt-3">
            Full breakdown on <Link href="/transport" className="text-accent hover:underline">/transport</Link>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
            4 · Find your people in the first 30 days
          </h2>
          <div className="space-y-3">
            {COMMUNITIES.map((c) => (
              <Link
                key={c.name}
                href={c.href}
                className="card-hover block bg-white rounded-xl border border-border p-4"
              >
                <div className="font-semibold text-sm text-foreground">{c.name}</div>
                <div className="text-xs text-muted mt-1 leading-relaxed">{c.blurb}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
            5 · The stack
          </h2>
          <p className="text-sm text-foreground leading-relaxed mb-3">
            Phone, banking, credit card, gear — the boring decisions that compound. Pre-decided so you don't have to.
          </p>
          <Link
            href="/picks"
            className="inline-flex items-center text-sm font-medium text-accent hover:underline"
          >
            See /picks
            <span className="ml-1">→</span>
          </Link>
        </section>

        <section className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
            6 · Use the map
          </h2>
          <p className="text-sm text-foreground leading-relaxed mb-3">
            144+ spots — cheap eats, gyms, free workspaces, free things. Filter by category, search by intent.
          </p>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-accent hover:underline"
          >
            Open the map
            <span className="ml-1">→</span>
          </Link>
        </section>

        <section className="border-t border-border pt-8 mb-10">
          <p
            className="text-2xl text-foreground mb-4 leading-snug"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Send this to a friend moving to SF.
          </p>
          <p className="text-sm text-muted mb-5">
            Read it on the plane. Forward it before you land.
          </p>
          <ShareControls />
        </section>

        <footer className="text-xs text-muted leading-relaxed">
          Built by <a href="https://x.com/singhinusa" className="text-accent hover:underline">@singhinusa</a>{" "}
          in SF, on a budget. Open source on{" "}
          <a
            href="https://github.com/iharnoor/BudgetSF"
            className="text-accent hover:underline"
          >
            GitHub
          </a>
          . If a price is stale, open a PR.
        </footer>
      </article>
    </div>
  );
}
