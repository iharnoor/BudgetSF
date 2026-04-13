"use client";

import Link from "next/link";

type TransportMode = {
  name: string;
  icon: string;
  tagline: string;
  cost: string;
  bestFor: string;
  description: string;
  tips: string[];
  link?: string;
  linkLabel?: string;
  highlight?: string;
};

const TRANSPORT_MODES: TransportMode[] = [
  {
    name: "Waymo Robotaxi",
    icon: "🤖",
    tagline: "The future is here and it's budget-friendly",
    cost: "~$4-15 per ride (comparable to Uber, often cheaper)",
    bestFor: "Getting around SF without surge pricing",
    description:
      "Waymo operates autonomous robotaxis across SF. No driver, no awkward small talk, no surge pricing. Available 24/7 in most of SF. The rides are smooth, safe, and surprisingly affordable compared to Uber/Lyft during peak hours.",
    tips: [
      "No surge pricing — great for late nights and events when Uber spikes 3x",
      "Download the Waymo One app and join the waitlist if you haven't already",
      "Rides are often cheaper than Uber for short-to-medium trips",
      "Can't go to the airport yet — use BART for SFO instead",
      "The car will pull up exactly where you pin it, so be precise with your pickup",
    ],
    link: "https://waymo.com/waymo-one",
    linkLabel: "Get Waymo One",
    highlight: "No Surge Pricing",
  },
  {
    name: "Muni (Bus & Metro)",
    icon: "🚌",
    tagline: "SF's public transit backbone",
    cost: "$2.50/ride or $81/month unlimited (Clipper card)",
    bestFor: "Daily commuting around SF",
    description:
      "Muni runs buses, light rail (Metro), and historic streetcars across the city. The monthly pass is unbeatable if you ride daily. Reliable in most areas, especially downtown corridors. The N-Judah, L-Taraval, and 38-Geary are the lines you'll use most.",
    tips: [
      "Get a Clipper card immediately — works on Muni, BART, and Caltrain",
      "$81/month Muni pass is a no-brainer if you commute",
      "The N-Judah goes from Ocean Beach through downtown to AT&T Park",
      "38-Geary is the most frequent bus in the city (Richmond to downtown)",
      "Use the Muni app or Google Maps for real-time arrivals — don't just guess",
      "Free transfers within 2 hours of your first tap",
    ],
    link: "https://www.sfmta.com",
    linkLabel: "SFMTA",
    highlight: "$81/mo Unlimited",
  },
  {
    name: "BART",
    icon: "🚇",
    tagline: "The heavy rail connecting SF to East Bay and SFO",
    cost: "$2-13 depending on distance",
    bestFor: "Getting to Oakland, Berkeley, SFO airport",
    description:
      "BART is the regional rapid transit system. It connects SF to Oakland, Berkeley, and the East Bay, plus goes directly to SFO airport. Faster than driving during rush hour. Key SF stations: Embarcadero, Montgomery, Powell, Civic Center, 16th St Mission, 24th St Mission.",
    tips: [
      "BART to SFO costs ~$10 and takes 30 min from downtown — way cheaper than Uber",
      "Embarcadero and Montgomery are the main downtown stations",
      "Runs 5am-midnight weekdays, 6am-midnight weekends",
      "Don't leave anything visible in your car at BART parking lots",
      "The Oakland/Berkeley trip is 15-25 min — don't let people tell you it's far",
    ],
    link: "https://www.bart.gov",
    linkLabel: "BART",
    highlight: "SFO for ~$10",
  },
  {
    name: "Caltrain",
    icon: "🚆",
    tagline: "SF to Silicon Valley commuter rail",
    cost: "$3.75-15 depending on zones",
    bestFor: "Getting to South Bay (Palo Alto, Mountain View, San Jose)",
    description:
      "Caltrain runs from SF (4th & King station) down the Peninsula to San Jose. Essential if you're taking meetings in Palo Alto, Mountain View, or other South Bay tech hubs. Recently electrified — faster and more frequent now.",
    tips: [
      "The 4th & King station in SoMa is the SF terminus",
      "Express trains skip stops and cut the Palo Alto trip to ~45 min",
      "Bring your Visible hotspot — wifi on Caltrain is unreliable",
      "Bike cars available if you're doing the Bay Wheels + Caltrain combo",
      "South Bay is further than you think — allot 1.5-2 hours door-to-door",
      "Monthly pass saves money if you go to South Bay more than 2x/week",
    ],
    link: "https://www.caltrain.com",
    linkLabel: "Caltrain",
    highlight: "SF to Palo Alto 45min",
  },
  {
    name: "Bay Wheels (E-Bikes)",
    icon: "🚲",
    tagline: "The fastest way to get around SF on a budget",
    cost: "$3/ride or $20/month membership",
    bestFor: "Short trips, running to meetings, exploring neighborhoods",
    description:
      "Lyft-operated bike share with stations on almost every corner. E-bikes make SF's hills totally manageable. The $20/month membership gives you unlimited 30-min rides. Honestly the best-kept secret for getting around SF fast and cheap.",
    tips: [
      "E-bikes are game-changers for SF hills — don't suffer on a regular bike",
      "$20/month membership pays for itself in 3 days of riding",
      "Check the app for bike availability before walking to a station",
      "Great for the last-mile problem — BART + Bay Wheels is chef's kiss",
      "Lock it properly at a station or you'll get charged for a lost bike",
      "Helmet not required by law but highly recommended — SF drivers are wild",
    ],
    link: "https://www.lyft.com/bikes/bay-wheels",
    linkLabel: "Bay Wheels",
    highlight: "$20/mo Unlimited",
  },
  {
    name: "Uber / Lyft",
    icon: "🚗",
    tagline: "You know what it is — but use strategically",
    cost: "$8-25+ per ride (varies wildly)",
    bestFor: "Late nights, groups splitting, when transit doesn't work",
    description:
      "The default but not always the cheapest. Surge pricing during events, rain, and Friday nights can make a $10 ride cost $35. Use strategically — check Waymo first, and consider Muni or BART for predictable trips.",
    tips: [
      "Always compare Uber vs Lyft pricing — one is often 30% cheaper",
      "Check Waymo first for no-surge pricing",
      "Split rides with friends — SF is small enough that most rides are short",
      "Schedule rides in advance to lock in pricing for airport trips",
      "UberX Share / Lyft Shared can save 30-50% if you're not in a rush",
    ],
    highlight: "Compare First",
  },
  {
    name: "Walking",
    icon: "🚶",
    tagline: "SF is more walkable than you think",
    cost: "Free",
    bestFor: "Neighborhoods, meetings, exploring",
    description:
      "SF is only 7x7 miles. Most of the key neighborhoods (Hayes Valley, Mission, SoMa, FiDi, Marina) are walkable between each other. Walking meetings are a founder staple — grab a coffee and walk the Embarcadero, Presidio, or Marina Green.",
    tips: [
      "Presidio Tunnel Tops has amazing GGB views — great for walking meetings",
      "Embarcadero along the pier is flat and scenic — start at Philz Coffee",
      "Hayes Valley to Mission is a 20-min walk through the heart of startup SF",
      "Avoid Tenderloin for walking, especially at night",
      "Wear layers — microclimates mean sunny FiDi can be foggy Sunset",
    ],
    highlight: "Free & Healthy",
  },
];

const BUDGET_HACKS = [
  "Ditch the car — parking is expensive and break-ins are frequent",
  "Clipper card is your best friend — works on Muni, BART, and Caltrain",
  "Waymo for no-surge rides, BART for airport, Bay Wheels for short hops",
  "The combo of BART + Bay Wheels gets you anywhere in SF for under $5",
  "Never pay for parking — there's always a transit option",
  "South Bay meetings? Caltrain + hotspot and you can work the whole way",
];

export default function TransportPage() {
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
            <span className="text-muted text-xs">/ Getting Around</span>
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
            <span>🚀</span> Skip the car, save thousands
          </div>
          <h1
            className="text-3xl sm:text-4xl text-foreground mb-3 slide-up"
            style={{
              fontFamily: "var(--font-dm-serif)",
              animationDelay: "0.05s",
              animationFillMode: "both",
            }}
          >
            Getting Around SF
          </h1>
          <p
            className="text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed slide-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            Robotaxis, buses, bikes, and trains. Everything you need to get
            around SF without a car.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Budget hacks */}
        <div className="bg-white rounded-2xl border border-border p-5 mb-10">
          <h2
            className="text-lg text-foreground mb-3"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Budget Transport Hacks
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BUDGET_HACKS.map((hack) => (
              <li
                key={hack}
                className="flex items-start gap-2 text-xs text-muted"
              >
                <span className="text-accent mt-0.5 shrink-0">*</span>
                {hack}
              </li>
            ))}
          </ul>
        </div>

        {/* Transport modes */}
        <div className="space-y-4">
          {TRANSPORT_MODES.map((mode) => (
            <div
              key={mode.name}
              className="bg-white rounded-2xl border border-border p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mode.icon}</span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {mode.name}
                    </h3>
                    <p className="text-xs text-muted">{mode.tagline}</p>
                  </div>
                </div>
                {mode.highlight && (
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-accent-light text-accent-dark text-[10px] font-semibold">
                    {mode.highlight}
                  </span>
                )}
              </div>

              <p className="text-sm text-foreground mb-3 leading-relaxed">
                {mode.description}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted mb-4">
                <span>
                  <span className="font-medium text-foreground">Cost:</span>{" "}
                  {mode.cost}
                </span>
                <span>
                  <span className="font-medium text-foreground">Best for:</span>{" "}
                  {mode.bestFor}
                </span>
              </div>

              <div className="rounded-xl bg-background border border-border/60 p-4 mb-3">
                <p className="text-[11px] font-semibold text-foreground mb-2">
                  Tips
                </p>
                <ul className="space-y-1.5">
                  {mode.tips.map((tip) => (
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

              {mode.link && (
                <a
                  href={mode.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-accent hover:underline"
                >
                  {mode.linkLabel}
                  <span className="ml-1">&rarr;</span>
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="text-center pt-10 text-[11px] text-muted">
          Tips sourced with help from{" "}
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
