"use client";

import { type AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

const FIRST_MONTH_CHECKLIST = [
  {
    title: "Get a US phone number",
    desc: "Activate Visible on day one — no SSN needed to sign up, eSIM works the second you land.",
    emoji: "📱",
  },
  {
    title: "Open a US bank account",
    desc: "SoFi lets international students open accounts with a passport in many cases. Get the $425 bonus with direct deposit once you're set up.",
    emoji: "🏦",
  },
  {
    title: "Apply for your SSN",
    desc: "Wait ~10 days after entering the US, then visit the Social Security office. You need your I-20, I-94, and passport.",
    emoji: "📝",
  },
  {
    title: "Get on Muni Clipper",
    desc: "Adult Clipper card is $3, then load $81/mo for unlimited Muni. No car needed in SF.",
    emoji: "🚋",
  },
  {
    title: "Sign up for Rakuten",
    desc: "Runs in the background, gets you cash back on stuff you already buy. $30 welcome bonus.",
    emoji: "💸",
  },
  {
    title: "Start building credit",
    desc: "Get a secured card (Discover it or Capital One Platinum Secured) — you need 6-12 months of history before premium cards like Venture X.",
    emoji: "💳",
  },
];

const VISA_TIPS = [
  {
    title: "F-1 can start an LLC (but not work for it)",
    desc: "International students on F-1 can legally form an LLC — you just can't work for it until you have OPT/CPT. doola handles the whole setup for $297 including EIN and registered agent.",
  },
  {
    title: "OPT = 12 months of US work authorization",
    desc: "Apply 90 days before graduation. STEM majors get 24 extra months. This is your window to build US work experience.",
  },
  {
    title: "Keep your I-20 and I-94 on you",
    desc: "Digital copies in your phone. Your DSO can re-issue, but it's a pain. Screenshot them now.",
  },
  {
    title: "Don't work off-campus without authorization",
    desc: "On-campus jobs up to 20hrs/week are fine on F-1. Off-campus requires CPT/OPT — unauthorized work can end your visa.",
  },
  {
    title: "File taxes every year, even with $0 income",
    desc: "Form 8843 is required for all F-1 students. Sprintax is the go-to for nonresident tax filing.",
  },
];

const PHONE_PLANS = [
  {
    name: "Visible by Verizon",
    tagline: "What I use — unlimited hotspot, no SSN needed to sign up",
    price: "$25/mo",
    highlight: "Best for students",
    note: "Runs on Verizon, unlimited hotspot is huge for study sessions at cafes and Caltrain commutes.",
    url: "https://fxo.co/1535239/singhinusa",
    cta: "Try Visible",
    color: "#1a1a40",
    colorLight: "#e8e8f4",
    emoji: "📡",
  },
  {
    name: "Mint Mobile",
    tagline: "Cheapest plans, 3-month prepaid packages",
    price: "$15/mo",
    highlight: "Budget option",
    note: "Good if you don't need hotspot. Prepaid so no credit check at all.",
    url: "https://mintmobile.com/singh",
    cta: "Get Mint",
    color: "#00b140",
    colorLight: "#e6f9ed",
    emoji: "📱",
  },
];

const BANKING = {
  name: "SoFi Bank",
  tagline: "Where I bank — high yield savings, no fees, up to $425 bonus",
  bonus: "Up to $425",
  bonusNote: "with direct deposit",
  highlight: "Up to $425 Bonus",
  note: "No minimum, no fees, early paycheck, and the savings account actually earns interest. I got $300+ back in bonuses.",
  url: "https://www.sofi.com/invite/money?gcp=145a5a84-2c09-4647-b446-cac4a9a2a1c9&isAliasGcp=false",
  cta: "Open SoFi Account",
  color: "#6b35b5",
  colorLight: "#f3edfc",
  emoji: "🏦",
};

const STUDENT_LOAN = {
  name: "SoFi Student Loan Refinance",
  tagline: "Refinance your Leap/Prodigy loan and drop under 7% — even on F-1",
  bonus: "$300",
  bonusNote: "welcome bonus",
  highlight: "$300 Bonus",
  note: "Most international students I know got their USD loans from LeapFinance or Prodigy at 11-13% APR — those rates eat you alive. Once you land a US job on OPT (and sometimes even earlier on F-1 with a co-signer), SoFi refi can drop you under 7%. The $300 welcome bonus stacks on top. Check your rate first — soft pull, doesn't hit your credit. Saved a friend ~$18K over the life of his loan.",
  url: "https://www.sofi.com/invite/student-loans?gcp=174b310b-f306-454b-86e5-062ce06a9ec7&isAliasGcp=false",
  cta: "Check My Rate",
  color: "#6b35b5",
  colorLight: "#f3edfc",
  emoji: "🎓",
};

const BUSINESS = {
  name: "doola",
  tagline: "Form your LLC as an international student — I used them for mine",
  price: "$297",
  priceNote: "+ state fees",
  highlight: "10% Off with DOOLAHARNOOR10",
  note: "Huge for international founders. F-1 students can legally form an LLC (you just can't work for it until OPT). doola handles formation, EIN, registered agent, and virtual mailbox — no SSN required, no US address required. Way cheaper than LegalZoom ($806) or Firstbase ($848).",
  url: "https://partnersps.doola.com/64gf2eto223k",
  cta: "Start Your LLC",
  color: "#1a1a1a",
  colorLight: "#f5f5e8",
  emoji: "📌",
};

const CREDIT_CARD = {
  name: "Capital One Venture X",
  tagline: "My daily card — apply once you have 6-12 months of US credit history",
  annualFee: "$395",
  highlight: "Net $0 after credits",
  note: "You'll need credit history first. Start with a secured card, then graduate to this. $300 travel credit + 10K anniversary points basically cover the $395 fee. Priority Pass lounges save you when flying home.",
  url: "https://i.capitalone.com/JxtpzL0LQ",
  cta: "Apply Now",
  color: "#1a1a2e",
  colorLight: "#f0eff5",
  emoji: "💳",
};

const GROCERIES = {
  name: "Walmart+",
  tagline: "Same-day grocery delivery at store prices — not marked up like Amazon Fresh",
  price: "$12.95/mo",
  priceNote: "or $98/year",
  highlight: "My Pick",
  note: "Students in dorms or shared housing without a car: this is how you grocery shop. Free delivery on $35+ orders, same prices as in-store, no tipping drivers.",
  url: "https://walmrt.us/41truU3",
  cta: "Shop Walmart+",
  color: "#0071dc",
  colorLight: "#e6f0fa",
  emoji: "🛒",
};

const TECH = {
  name: 'MacBook Air 15"',
  tagline: "What I carry — lightweight, all-day battery, big screen for coding",
  price: "From $1,099",
  highlight: "Student discount available",
  note: "Use Apple's Education Store for a student discount + free AirPods at the start of semester. 18-hour battery means you never need a charger between classes.",
  url: "https://geni.us/6BCrWL",
  cta: "Check Price",
  color: "#3b3b3b",
  colorLight: "#f5f5f7",
  emoji: "💻",
};

const SAVINGS = {
  name: "Rakuten",
  tagline: "Cash back on things you'd buy anyway — books, clothes, flights home",
  bonus: "Up to $30",
  bonusNote: "welcome bonus",
  highlight: "Free Money",
  note: "Stacks with credit card rewards. Up to 19% back on Temu, Amazon, Walmart, and 3,500+ stores. I use it for flights home — sometimes 5-10% back on Expedia.",
  url: "https://www.rakuten.com/r/IHARNO2?eeid=44749",
  cta: "Start Earning",
  color: "#e6002a",
  colorLight: "#fce8ec",
  emoji: "💸",
};

const COFFEE = {
  name: "RYZE Mushroom Coffee",
  tagline: "How I replaced $6 Blue Bottle with something I actually like better",
  price: "~$1/cup",
  highlight: "15% Off with IHARNOOR15",
  note: "SF coffee is $5-7 a cup. RYZE is ~$1, takes 30 seconds — just hot water. Steady energy for study sessions without the afternoon crash. 48mg caffeine vs 95mg in regular coffee.",
  url: "https://get.aspr.app/SH1gdN",
  cta: "Try RYZE",
  color: "#5c3d2e",
  colorLight: "#f5efe8",
  emoji: "🍄",
};

const TRANSPORT = {
  name: "Waymo Robotaxi",
  tagline: "No-surge rides across SF — my go-to when Uber is $40 for a 10-min ride",
  highlight: "$10 off with HARNOO2645",
  note: "Fully autonomous, no driver, no surge pricing. Available 24/7 across most of SF. Way more predictable pricing than Uber or Lyft, especially on event nights.",
  url: "https://waymo.smart.link/4pcoqniy5?code=HARNOO2645",
  cta: "Get $10 Off Waymo",
  color: "#0d6efd",
  colorLight: "#e7f0ff",
  emoji: "🚗",
};

const HOUSING_TIPS = [
  "Co-living (Tripalink, Common, HubHaus) cuts rent 40-50% and includes furniture — great first-year setup",
  "Check for rent-controlled units (built before 1979) — rent increases capped at ~2%/year",
  "Bring a checkbook to open houses — good units go same day in SF",
  "Avoid broker fees — unlike NYC, most SF rentals don't require them",
  "Tenderloin and Bayview are cheapest but research the specific block before signing",
  "Outer Sunset is cheap, safe, and foggy — great if you don't mind the commute",
];

const MONEY_TIPS = [
  "Don't use foreign cards in the US — 3% foreign transaction fees add up fast",
  "Wise (TransferWise) is the cheapest way to move money from home to your US account",
  "File taxes even with $0 income — Form 8843 is required for all F-1 students",
  "Sprintax handles nonresident tax filing — some schools offer free Sprintax codes",
  "Venmo, Zelle, and Apple Pay are how Americans split bills — set them up early",
  "Keep a US address on file with your home bank so they don't flag US transactions",
];

export default function StudentPage() {
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
            <span className="text-muted text-xs">/ For International Students</span>
          </div>
          <Link href="/picks" className="text-xs text-accent hover:underline">
            See All Picks
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-warm/40" />
        <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-accent-dark text-xs font-medium mb-4 slide-up">
            <span>🎓</span> Built from my own F-1 → OPT journey
          </div>
          <h1
            className="text-3xl sm:text-4xl text-foreground mb-3 slide-up"
            style={{
              fontFamily: "var(--font-dm-serif)",
              animationDelay: "0.05s",
              animationFillMode: "both",
            }}
          >
            International Student Guide to SF
          </h1>
          <p
            className="text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed slide-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            Everything I wish I knew when I landed in SF as an international student — banking without an SSN, building credit, starting an LLC on F-1, and living cheap in the most expensive city in America.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* First Month Checklist */}
        <section className="mb-12">
          <SectionHeader
            emoji="✅"
            title="Your First Month Checklist"
            subtitle="Do these in order — don't skip the SSN step"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FIRST_MONTH_CHECKLIST.map((item, i) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-border p-4 flex items-start gap-3 slide-up"
                style={{
                  animationDelay: `${0.05 + i * 0.04}s`,
                  animationFillMode: "both",
                }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl bg-accent-light shrink-0">
                  {item.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Visa Tips */}
        <section className="mb-12">
          <SectionHeader
            emoji="🛂"
            title="Visa & Legal Basics"
            subtitle="Not legal advice — just what I learned navigating F-1 and OPT"
          />
          <div className="bg-white rounded-2xl border border-border divide-y divide-border/60">
            {VISA_TIPS.map((tip) => (
              <div key={tip.title} className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {tip.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Phone Plans */}
        <section className="mb-12">
          <SectionHeader
            emoji="📱"
            title="Phone Plan"
            subtitle="What I use for unlimited hotspot — works everywhere in SF"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PHONE_PLANS.map((plan) => (
              <PickCard key={plan.name} section="student-phone" item={plan} />
            ))}
          </div>
        </section>

        {/* Student Loan Refi */}
        <section className="mb-12">
          <SectionHeader
            emoji="🎓"
            title="Student Loan Refinance"
            subtitle="Escape those 11-13% Leap/Prodigy rates once you're working in the US"
          />
          <PickCard section="student-loan-refi" item={STUDENT_LOAN} fullBonus />
        </section>

        {/* Banking */}
        <section className="mb-12">
          <SectionHeader
            emoji="🏦"
            title="Banking"
            subtitle="First real US bank account — no fees, early paycheck, bonus cash"
          />
          <PickCard section="student-banking" item={BANKING} fullBonus />
        </section>

        {/* Credit Card */}
        <section className="mb-12">
          <SectionHeader
            emoji="💳"
            title="Credit Card (Once You Have Credit)"
            subtitle="Start with a secured card, then graduate to this one"
          />
          <PickCard section="student-credit-card" item={CREDIT_CARD} />
        </section>

        {/* Business / LLC */}
        <section className="mb-12">
          <SectionHeader
            emoji="📌"
            title="Start a Company on F-1"
            subtitle="Yes, you can legally form an LLC as an international student"
          />
          <PickCard section="student-business" item={BUSINESS} />
        </section>

        {/* Groceries */}
        <section className="mb-12">
          <SectionHeader
            emoji="🛒"
            title="Groceries Without a Car"
            subtitle="How I feed myself in SF without a Costco run"
          />
          <PickCard section="student-groceries" item={GROCERIES} />
        </section>

        {/* Tech */}
        <section className="mb-12">
          <SectionHeader
            emoji="💻"
            title="Laptop"
            subtitle="What I carry everywhere — works on Caltrain, lasts all day"
          />
          <PickCard section="student-tech" item={TECH} />
        </section>

        {/* Mushroom Coffee */}
        <section className="mb-12">
          <SectionHeader
            emoji="🍄"
            title="Morning Coffee"
            subtitle="How I stopped spending $6/day at Blue Bottle"
          />
          <PickCard section="student-coffee" item={COFFEE} />
        </section>

        {/* Savings */}
        <section className="mb-12">
          <SectionHeader
            emoji="💸"
            title="Cash Back"
            subtitle="Runs in the background — especially useful for flights home"
          />
          <PickCard section="student-savings" item={SAVINGS} fullBonus />
        </section>

        {/* Transport */}
        <section className="mb-12">
          <SectionHeader
            emoji="🚗"
            title="Getting Around"
            subtitle="Muni for daily, Waymo for nights — no Uber surge"
          />
          <PickCard section="student-transport" item={TRANSPORT} />
          <div className="mt-3 text-center">
            <Link
              href="/transport"
              className="text-xs text-accent hover:underline"
            >
              See full transport guide →
            </Link>
          </div>
        </section>

        {/* Housing Tips */}
        <section className="mb-12">
          <SectionHeader
            emoji="🏘️"
            title="Housing Tips"
            subtitle="First-year survival — don't lock into a year-long lease sight unseen"
          />
          <div className="bg-white rounded-2xl border border-border p-5">
            <ul className="space-y-2">
              {HOUSING_TIPS.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 text-xs text-muted"
                >
                  <span className="text-accent mt-0.5 shrink-0">-</span>
                  {tip}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border/60">
              <Link
                href="/picks"
                className="text-xs text-accent hover:underline"
              >
                See neighborhood rankings &amp; housing resources →
              </Link>
            </div>
          </div>
        </section>

        {/* Money Tips */}
        <section className="mb-12">
          <SectionHeader
            emoji="💰"
            title="Money Tips"
            subtitle="Little things that save hundreds over the year"
          />
          <div className="bg-white rounded-2xl border border-border p-5">
            <ul className="space-y-2">
              {MONEY_TIPS.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 text-xs text-muted"
                >
                  <span className="text-accent mt-0.5 shrink-0">-</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Related pages */}
        <section className="mb-12">
          <SectionHeader
            emoji="🗺️"
            title="Explore More"
            subtitle="The rest of the budget playbook"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { href: "/diet", label: "Budget Diet", desc: "Eat well for $250/mo" },
              { href: "/free", label: "Free Things", desc: "Museums, parks, events" },
              { href: "/spots", label: "Cheap Eats Map", desc: "51 vetted venues" },
              { href: "/workspaces", label: "Free Work Spots", desc: "Cafes, libraries" },
              { href: "/events", label: "Free Events", desc: "Meetups and talks" },
              { href: "/transport", label: "Getting Around", desc: "Muni, BART, Waymo" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white rounded-2xl border border-border p-4 hover:border-accent/40 hover:bg-accent-light/20 transition-colors"
              >
                <div className="text-sm font-semibold text-foreground mb-0.5">
                  {link.label}
                </div>
                <div className="text-[11px] text-muted">{link.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Disclosure */}
        <div className="text-center py-6 border-t border-border">
          <p className="text-[11px] text-muted leading-relaxed max-w-md mx-auto">
            Some links above are referral/affiliate links. Using them supports
            BudgetSF at no extra cost to you — and often gets you a bonus too.
            Not legal or immigration advice — talk to your DSO for anything
            visa-related.
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

type PickItem = {
  name: string;
  tagline: string;
  price?: string;
  priceNote?: string;
  bonus?: string;
  bonusNote?: string;
  annualFee?: string;
  highlight: string;
  note: string;
  url: string;
  cta: string;
  color: string;
  colorLight: string;
  emoji: string;
};

function PickCard({
  section,
  item,
  fullBonus,
}: {
  section: string;
  item: PickItem;
  fullBonus?: boolean;
}) {
  return (
    <AffiliateLink
      section={section}
      label={item.name}
      href={item.url}
      className="group relative block bg-white rounded-2xl border border-border overflow-hidden card-hover press slide-up"
    >
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(to right, ${item.color}, ${item.color}cc)`,
        }}
      />
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0"
              style={{ background: item.colorLight }}
            >
              {item.emoji}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-[15px]">
                {item.name}
              </h3>
              <p className="text-xs text-muted">{item.tagline}</p>
            </div>
          </div>
          {fullBonus && item.bonus ? (
            <div
              className="shrink-0 px-4 py-2 rounded-xl text-white text-center"
              style={{ background: item.color }}
            >
              <div className="text-base font-bold leading-tight">
                {item.bonus}
              </div>
              {item.bonusNote && (
                <div className="text-[10px] opacity-80 font-medium">
                  {item.bonusNote}
                </div>
              )}
            </div>
          ) : (
            <span
              className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ background: item.color }}
            >
              {item.highlight}
            </span>
          )}
        </div>

        {(item.price || item.annualFee) && (
          <div className="flex items-baseline gap-1.5 mb-4">
            <span
              className="text-2xl font-bold"
              style={{ color: item.color }}
            >
              {item.price ?? item.annualFee}
            </span>
            {item.priceNote && (
              <span className="text-[11px] text-muted">{item.priceNote}</span>
            )}
            {item.annualFee && !item.price && (
              <span className="text-[11px] text-muted">annual fee</span>
            )}
          </div>
        )}

        <div className="rounded-lg bg-surface-warm border border-border/60 px-3 py-2.5 mb-4">
          <p className="text-[11px] text-foreground/80 leading-relaxed">
            {item.note}
          </p>
        </div>

        <div
          className="w-full py-2.5 rounded-xl text-center text-sm font-semibold text-white transition-all group-hover:shadow-lg group-hover:scale-[1.005]"
          style={{ background: item.color }}
        >
          {item.cta}
          <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
            &rarr;
          </span>
        </div>
      </div>
    </AffiliateLink>
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
