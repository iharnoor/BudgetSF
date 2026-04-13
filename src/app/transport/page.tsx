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
  // === Robotaxis ===
  {
    name: "Tesla Robotaxi",
    icon: "🚘",
    tagline: "Tesla's autonomous ride-hailing — now in SF",
    cost: "Varies (check the app for pricing)",
    bestFor: "Autonomous rides in a Tesla",
    description:
      "Tesla's Robotaxi service is rolling out in SF. Hail a self-driving Tesla from the app. The future of ride-hailing from the company that's been building towards this for years.",
    tips: [
      "Download the Tesla app to request rides",
      "Availability is expanding — check for coverage in your area",
      "No driver, no tipping, no awkward small talk",
      "Compare pricing with Waymo — competition is good for your wallet",
    ],
    link: "https://www.tesla.com/robotaxi",
    linkLabel: "Tesla Robotaxi",
    highlight: "New in SF",
  },
  {
    name: "Zoox Robotaxi",
    icon: "🤖",
    tagline: "Amazon's purpose-built robotaxi — coming soon",
    cost: "TBD",
    bestFor: "Another autonomous option hitting SF streets",
    description:
      "Zoox is Amazon's autonomous vehicle company with a purpose-built robotaxi (no steering wheel, no pedals). It's a completely different form factor — the vehicle is designed from scratch for passengers, not adapted from a regular car. Currently testing in SF with a public launch on the horizon.",
    tips: [
      "Purpose-built vehicle — not a retrofitted car like Waymo or Tesla",
      "Bi-directional design means it doesn't need to do U-turns",
      "Keep an eye out for their cube-shaped vehicles around SoMa and downtown",
      "Sign up for early access on their website",
    ],
    link: "https://zoox.com",
    linkLabel: "Zoox",
    highlight: "Coming Soon",
  },
  {
    name: "Waymo Robotaxi",
    icon: "🤖",
    tagline: "The OG robotaxi — reliable and no surge pricing",
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

  // === Rideshare & Bikes ===
  {
    name: "Lyft (Rides + Bay Wheels E-Bikes)",
    icon: "🚗",
    tagline: "Rides, bikes, and scooters all in one app",
    cost: "Rides: $8-25+ | Bay Wheels: $3/ride or $20/mo unlimited",
    bestFor: "Rides when robotaxis aren't available + e-bikes for short trips",
    description:
      "Lyft does rides AND operates Bay Wheels, SF's e-bike share network. The $20/month bike membership gives you unlimited 30-min rides — honestly the best deal in SF transit. E-bikes make the hills totally manageable. For car rides, Lyft is often cheaper than Uber in SF.",
    tips: [
      "Bay Wheels e-bikes are game-changers for SF hills — $20/mo unlimited",
      "BART + Bay Wheels combo gets you anywhere in SF for under $5",
      "Check Lyft vs Uber pricing — one is often 30% cheaper",
      "Lyft Shared can save 30-50% if you're not in a rush",
      "Bay Wheels stations are on almost every corner — check availability in app",
      "Sign up with this link and get 50% off your first ride",
    ],
    link: "https://www.lyft.com/i/HARNOOR348519?utm_medium=2pi_iacc",
    linkLabel: "Get 50% off first Lyft ride",
    highlight: "50% Off First Ride",
  },
  {
    name: "Uber",
    icon: "🚙",
    tagline: "The default — use strategically",
    cost: "$8-25+ per ride (varies wildly with surge)",
    bestFor: "Late nights, groups splitting, airport trips",
    description:
      "The default ride-hail but not always the cheapest. Surge pricing during events, rain, and Friday nights can make a $10 ride cost $35. Always check Waymo and Lyft first. Best for scheduled airport rides and splitting with friends.",
    tips: [
      "Always compare with Lyft and Waymo before booking",
      "Check Waymo first for no-surge pricing",
      "Split rides with friends — SF is small enough that most rides are short",
      "Schedule rides in advance to lock in pricing for airport trips",
      "UberX Share can save 30-50% if you're not in a rush",
      "Sign up with this link and get $25 off your first 2 rides",
    ],
    link: "https://referrals.uber.com/refer?id=q3bjmq31be1h",
    linkLabel: "Get $25 off first 2 Uber rides",
    highlight: "$25 Off First 2 Rides",
  },

  // === Public Transit ===
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
