"use client";

import Link from "next/link";
import Image from "next/image";

type Airport = {
  code: string;
  name: string;
  distance: string;
  best: string;
  description: string;
  getToSF: {
    mode: string;
    cost: string;
    time: string;
    note: string;
    url?: string;
    cta?: string;
  }[];
  tips: string[];
  url: string;
};

const AIRPORTS: Airport[] = [
  {
    code: "SFO",
    name: "San Francisco International",
    distance: "~14 mi south of downtown",
    best: "Default — most flights, closest to SF, BART straight in",
    description:
      "The biggest and closest Bay Area airport. BART runs from inside the terminal straight to downtown SF in 30 min. Skip Uber unless you're landing at 2am — BART is cheaper and usually faster.",
    getToSF: [
      {
        mode: "BART (yellow line)",
        cost: "$10.85",
        time: "30 min to Embarcadero",
        note: "Station is inside International Terminal G — just follow signs.",
      },
      {
        mode: "Uber / Lyft",
        cost: "$35-70",
        time: "25-50 min (traffic-dependent)",
        note: "Pickup is at the Domestic Garage level 5. Surge hits hard during peak.",
      },
      {
        mode: "Waymo (within SF, not SFO pickup)",
        cost: "~$4-15 per ride in SF",
        time: "—",
        note: "Waymo doesn't serve SFO yet — take BART into SF, then Waymo for everything after. No surge pricing.",
        url: "https://waymo.smart.link/4pcoqniy5?code=HARNOO2645",
        cta: "Get $10 off with code HARNOO2645",
      },
    ],
    tips: [
      "Buy a Clipper card at the BART machines — covers Muni, BART, and Caltrain across the Bay Area.",
      "The AirTrain between terminals is free — use it to reach the BART station from Terminals 1, 2, or 3.",
      "Late-night flights (after 12am): BART is closed. Uber/Lyft is your only cheap option.",
      "International Terminal has the best food if you have a long layover — Koi Palace Express, Napa Farms Market.",
    ],
    url: "https://www.flysfo.com",
  },
  {
    code: "OAK",
    name: "Oakland International",
    distance: "~20 mi east of downtown SF",
    best: "Southwest hub — often cheaper flights than SFO",
    description:
      "Across the Bay in Oakland. Southwest's West Coast hub, so flights are frequently cheaper than SFO. The BART Connector (OAK AirTrain) takes you to Coliseum station in 8 min, then BART into SF — total ~50 min.",
    getToSF: [
      {
        mode: "BART + OAK AirTrain",
        cost: "~$13 total",
        time: "~50 min to Embarcadero",
        note: "AirTrain runs from terminals to Coliseum BART station. Then ride BART into SF.",
      },
      {
        mode: "Uber / Lyft",
        cost: "$45-90",
        time: "25-60 min (Bay Bridge traffic)",
        note: "Bay Bridge traffic can destroy your ride time. BART is almost always faster at rush hour.",
      },
    ],
    tips: [
      "Always check OAK first if you're price-sensitive — Southwest runs constant sales out of here.",
      "The BART Connector runs every 5 min and accepts Clipper.",
      "If you're doing a Bay Area loop, OAK is closer to Berkeley, Emeryville, and the East Bay.",
      "Food options are thinner than SFO — eat before you land.",
    ],
    url: "https://www.oaklandairport.com",
  },
  {
    code: "SJC",
    name: "San Jose (Mineta International)",
    distance: "~50 mi south of downtown SF",
    best: "Cheap flights, but painful transit to SF",
    description:
      "South Bay airport. Usually the cheapest base fares — but you're paying that back in transit time. No direct BART. Best option is VTA light rail + Caltrain, or Uber if you're flush. Worth it if the flight savings beat $60+ of ground transport.",
    getToSF: [
      {
        mode: "VTA Airport Flyer + Caltrain",
        cost: "~$10-15",
        time: "~1h 45m to SF 4th & King",
        note: "Free VTA Flyer bus (Route 10) to Santa Clara Caltrain station, then Caltrain north into SF.",
      },
      {
        mode: "Uber / Lyft",
        cost: "$90-150",
        time: "60-120 min",
        note: "South Bay → SF traffic is brutal on weekdays. Only do this if splitting with a group.",
      },
      {
        mode: "Caltrain (from Diridon)",
        cost: "~$10",
        time: "~75 min to SF",
        note: "Take Uber/Lyft (~$15) from SJC to San Jose Diridon station, then Caltrain baby bullet.",
      },
    ],
    tips: [
      "Only book SJC if the flight is $80+ cheaper than SFO/OAK — ground transport eats the savings otherwise.",
      "Caltrain baby bullet is 45 min faster than the local — check the schedule before you buy.",
      "If Google or Nvidia campus tours are on your agenda, SJC puts you in the South Bay already.",
      "No red-eye rush: SJC typically has less traffic at the ground transport pickups than SFO.",
    ],
    url: "https://www.flysanjose.com",
  },
];

type BudgetLine = {
  category: string;
  low: string;
  mid: string;
  note: string;
};

const DAILY_BUDGET: BudgetLine[] = [
  {
    category: "Bed",
    low: "$45 (hostel dorm)",
    mid: "$120 (budget hotel)",
    note: "HI Fisherman's Wharf, Green Tortoise — central and cheap.",
  },
  {
    category: "Food",
    low: "$25 (taqueria + groceries)",
    mid: "$55 (one sit-down, rest casual)",
    note: "Mission burritos, Chinatown lunch specials, Trader Joe's.",
  },
  {
    category: "Transit",
    low: "$5 (Muni + walking)",
    mid: "$15 (Muni + Waymo/Uber)",
    note: "$81/mo Clipper Muni pass if you're staying 3+ weeks.",
  },
  {
    category: "Activities",
    low: "$0 (free museums, parks)",
    mid: "$20 (one paid attraction)",
    note: "Time the free museum days — SFMOMA first Thursday, etc.",
  },
];

type TripTip = {
  title: string;
  body: string;
  icon: string;
  url?: string;
  cta?: string;
  badge?: string;
};

type RepeatDay = {
  title: string;
  route: string;
  stops: string[];
  note: string;
};

type RepeatPick = {
  name: string;
  area: string;
  cost: string;
  why: string;
  move: string;
  url?: string;
};

type VisualPick = {
  title: string;
  caption: string;
  src: string;
  alt: string;
};

const BEFORE_YOU_LAND: TripTip[] = [
  {
    icon: "📱",
    title: "Install Clipper (digital)",
    body: "Apple Wallet / Google Wallet — skip the physical card. Works on Muni, BART, Caltrain, AC Transit, Bay Wheels, ferries. One tap covers everything.",
  },
  {
    icon: "🚕",
    title: "Set up Waymo One",
    body: "Join the Waymo One waitlist before you arrive — it can take a few days. Cheaper than Uber in SF, no surge, and the ride itself is the attraction.",
    url: "https://waymo.smart.link/4pcoqniy5?code=HARNOO2645",
    cta: "Get $10 off Waymo",
    badge: "code HARNOO2645",
  },
  {
    icon: "📡",
    title: "Get a US number + hotspot",
    body: "I use Visible (Verizon) — $25/mo unlimited, including unlimited hotspot. No SSN needed to sign up. Huge for working from cafes, on Caltrain, or tethering a laptop anywhere.",
    url: "https://fxo.co/1535239/singhinusa",
    cta: "Try Visible",
  },
  {
    icon: "🌁",
    title: "Dress in layers",
    body: "SF weather is not California weather. Summer mornings are 55°F and foggy. Bring a hoodie even in July — Karl the Fog is real.",
  },
  {
    icon: "🗺️",
    title: "Pin your hotel + nearest BART/Muni",
    body: "Offline maps on Google Maps are your friend. Download the SF area before your flight.",
  },
  {
    icon: "💳",
    title: "Bring a no-FX card",
    body: "Coming internationally? A no-foreign-transaction card saves 3% on every charge. Capital One Venture X is my daily — $300 travel credit + lounge access makes the fee basically $0 net.",
    url: "https://i.capitalone.com/JxtpzL0LQ",
    cta: "Apply for Venture X",
  },
];

const NEIGHBORHOODS_TO_SEE = [
  {
    name: "Mission District",
    why: "Best burritos in the country, murals in Balmy Alley, Dolores Park on a sunny day, 24th St taquerias.",
    tag: "Food + vibes",
  },
  {
    name: "North Beach + Chinatown",
    why: "Walk City Lights Bookstore, grab dim sum, then climb up Coit Tower for the view.",
    tag: "Historic SF",
  },
  {
    name: "Fisherman's Wharf + Embarcadero",
    why: "Touristy but worth it once. Pier 39 sea lions, Ghirardelli Square, walk the waterfront to the Ferry Building.",
    tag: "Classic tourist",
  },
  {
    name: "Golden Gate Park",
    why: "Free. Japanese Tea Garden (free before 10am Mon/Wed/Fri), de Young observation tower, Bison Paddock, Ocean Beach at the west end.",
    tag: "Outdoors",
  },
  {
    name: "Hayes Valley + Castro",
    why: "Indie coffee, Alamo Drafthouse, walk up to Twin Peaks for the 360° SF view at sunset.",
    tag: "Local SF",
  },
  {
    name: "SoMa + Yerba Buena",
    why: "SFMOMA (free first Thursdays), Yerba Buena Gardens, Ferry Building farmers market on Saturday AM.",
    tag: "Museums + food",
  },
];

const MUST_DO_FREE = [
  "Walk across the Golden Gate Bridge — free, 1.7 mi, best at sunrise",
  "Lands End Trail — cliffside hike, ruins of the Sutro Baths, free",
  "Dolores Park on a sunny Saturday — free entertainment, skyline view",
  "Ferry Building farmers market — Saturday mornings, free samples everywhere",
  "Twin Peaks at sunset — free 360° view of the whole city",
  "Chinatown + North Beach walking loop — Dragon's Gate to City Lights",
  "Ocean Beach at Golden Gate Park's west end — bonfires allowed in designated pits",
  "Palace of Fine Arts — free Roman-style rotunda, great for photos",
];

const STAY_CHEAP = [
  {
    name: "HI San Francisco Fisherman's Wharf",
    type: "Hostel",
    price: "$45-70/night (dorm)",
    why: "Converted military building in a park. Private rooms available. Central-ish with park views.",
    url: "https://www.hiusa.org/hostels/california/san-francisco/fishermans-wharf",
  },
  {
    name: "HI San Francisco Downtown",
    type: "Hostel",
    price: "$40-60/night (dorm)",
    why: "Right off Union Square. Best location for public transit and walking everywhere.",
    url: "https://www.hiusa.org/hostels/california/san-francisco/downtown",
  },
  {
    name: "Green Tortoise Hostel",
    type: "Hostel",
    price: "$40-65/night (dorm)",
    why: "North Beach, free breakfast, social vibe. Best for solo travelers. Walk to Chinatown and City Lights.",
    url: "https://www.greentortoise.com",
  },
  {
    name: "Orange Village Hostel",
    type: "Hostel",
    price: "$40-65/night (dorm)",
    why: "Budget SoMa hostel close to Powell BART, Moscone, and SFMOMA. Shared kitchen — groceries + fridge = big savings.",
    url: "https://www.orangevillagehostel.com",
  },
  {
    name: "Hotel Zephyr / budget chains (Wharf area)",
    type: "Budget hotel",
    price: "$120-200/night",
    why: "If hostels aren't your thing, look at the Fisherman's Wharf chains — they drop prices midweek.",
    url: "https://www.google.com/travel/hotels/San%20Francisco",
  },
  {
    name: "Airbnb in the Sunset / Richmond",
    type: "Short-term rental",
    price: "$80-150/night",
    why: "Quiet residential neighborhoods west of the city. Cheaper per night, requires more Muni time but feels local.",
    url: "https://www.airbnb.com",
  },
];

const REPEAT_DAYS: RepeatDay[] = [
  {
    title: "Day 1 - Local SF",
    route: "Mission -> Castro -> Twin Peaks",
    stops: [
      "24th St BART, Balmy Alley, and a Mission burrito",
      "Dolores Park if the weather is good",
      "Castro walk, then Twin Peaks near sunset or after dark",
    ],
    note: "Best if you have already done the waterfront, bridge, Presidio, and Painted Ladies.",
  },
  {
    title: "Day 2 - East Bay",
    route: "Berkeley -> Oakland Temescal",
    stops: [
      "UC Berkeley campus and Telegraph",
      "Cheese Board or Berkeley Bowl",
      "Temescal food crawl around Telegraph Ave",
    ],
    note: "Use BART all day. It feels like a different metro area without needing a car.",
  },
  {
    title: "Day 3 - Water or South Bay",
    route: "Pick based on weather",
    stops: [
      "Sunny: Ferry Building market, Sausalito ferry, or Angel Island",
      "Foggy: Computer History Museum, Mountain View Castro Street, San Jose Japantown",
      "Night: Exploratorium After Dark if it is Thursday",
    ],
    note: "Do not force a Marin view day through fog. Swap with the museum plan when the weather is bad.",
  },
];

const REPEAT_PICKS: RepeatPick[] = [
  {
    name: "Mission burrito + murals loop",
    area: "Mission",
    cost: "$12-18",
    why: "La Taqueria, El Farolito, Balmy Alley, Clarion Alley, and Dolores Park make this the highest-density SF afternoon.",
    move: "Start at 24th St BART, eat, walk north through murals, finish at Dolores Park.",
  },
  {
    name: "Crosstown Trail segment",
    area: "Glen Park to Golden Gate Park",
    cost: "Free",
    why: "A local-feeling hike through stairways, hills, neighborhoods, and parks. Do one 4-7 mile segment instead of the full 17 miles.",
    move: "Best easy segment: Glen Park BART to Inner Sunset, then N Judah back.",
    url: "https://crosstowntrail.org",
  },
  {
    name: "Berkeley + Oakland food day",
    area: "East Bay",
    cost: "$15-35",
    why: "Berkeley campus, Telegraph, Berkeley Bowl, and Temescal food give you a very different Bay Area day from SF.",
    move: "BART to Downtown Berkeley, walk south, then BART/rideshare to Temescal.",
  },
  {
    name: "Sausalito or Angel Island",
    area: "Marin / Bay",
    cost: "Ferry + food",
    why: "The ferry ride is the point: skyline, Alcatraz, Angel Island, bridge views, then a small waterfront town or a real hike.",
    move: "Check ferry schedules first; bring layers and water.",
    url: "https://www.parks.ca.gov/angelisland/",
  },
  {
    name: "Computer History Museum + Castro Street",
    area: "Mountain View",
    cost: "Paid museum + food",
    why: "Best South Bay tech-history stop after you have already done Stanford and Apple Park.",
    move: "Caltrain to Mountain View, museum first, dinner on Castro Street.",
    url: "https://computerhistory.org/",
  },
  {
    name: "San Jose Japantown + San Pedro Square",
    area: "San Jose",
    cost: "$10-35",
    why: "If you want a South Bay day that is not mall/campus-coded, this is more interesting than repeating Valley Fair or Santana Row.",
    move: "Caltrain to San Jose Diridon, light rail or rideshare to Japantown, finish downtown.",
  },
];

const TRIP_VISUALS: VisualPick[] = [
  {
    title: "Transit day",
    caption: "Use BART or Caltrain when the Bay plan stretches past SF.",
    src: "/TrainShot.jpg",
    alt: "Working from a train on a Silicon Valley day trip",
  },
  {
    title: "Founder scene",
    caption: "Leave one night open for a Luma event, hackathon, or meetup.",
    src: "/hackathon.jpg",
    alt: "Founder and developer meetup in San Francisco",
  },
  {
    title: "Weather call",
    caption: "Do the ferry and Marin ideas when the sky is actually clear.",
    src: "/goldengate.jpg",
    alt: "Clear day by the Golden Gate Bridge",
  },
];

export default function TripPage() {
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
            <span className="text-muted text-xs">/ Plan a Trip</span>
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
            <span>🧳</span> Budget SF in under $100/day
          </div>
          <h1
            className="text-3xl sm:text-4xl text-foreground mb-3 slide-up"
            style={{
              fontFamily: "var(--font-dm-serif)",
              animationDelay: "0.05s",
              animationFillMode: "both",
            }}
          >
            Planning a Budget Trip to SF
          </h1>
          <p
            className="text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed slide-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            Three airports, public transit that actually works, and a city where
            the best parts are free. Here&apos;s everything you need to land, sleep,
            eat, and explore without going broke.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Try before you commit */}
        <section className="mb-12">
          <SectionHeader
            emoji="🎥"
            title="Try Before You Commit"
            subtitle="SF isn't for everyone — test it first"
          />
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-[280px,1fr]">
              <a
                href="https://www.youtube.com/watch?v=-SLgCQKE1zg"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block group aspect-video sm:aspect-auto sm:h-full bg-black"
              >
                <img
                  src="https://img.youtube.com/vi/-SLgCQKE1zg/hqdefault.jpg"
                  alt="Singh in USA — Day in the Life of an Engineer in SF"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-white/95 shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg
                      className="w-6 h-6 text-red-600 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </a>
              <div className="p-5 sm:p-6 flex flex-col justify-center">
                <p className="text-sm text-foreground mb-3 leading-relaxed">
                  SF is not for everyone. Before you sign a 12-month lease, do
                  a week or two in hostels and Airbnbs across different
                  neighborhoods — Mission, SoMa, Sunset, North Beach all feel
                  like different cities.
                </p>
                <p className="text-xs text-muted leading-relaxed mb-3">
                  I did multiple hostel and Airbnb trips before committing. The
                  vibe, the fog, the hills, the pace — you need to feel it.
                </p>
                <a
                  href="https://www.youtube.com/watch?v=-SLgCQKE1zg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-medium text-accent hover:underline"
                >
                  Watch: Day in the Life of an Engineer in SF
                  <span className="ml-1">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Daily budget card */}
        <section className="mb-12">
          <SectionHeader
            emoji="💰"
            title="Daily Budget"
            subtitle="Two realistic numbers — backpacker and comfortable"
          />
          <div className="bg-white rounded-2xl border border-border p-5 sm:p-6">
            <div className="grid grid-cols-[1.2fr,1fr,1fr] gap-x-4 pb-2 mb-2 border-b border-border text-[11px] font-semibold text-foreground">
              <div>Category</div>
              <div>Backpacker</div>
              <div>Comfortable</div>
            </div>
            {DAILY_BUDGET.map((line) => (
              <div
                key={line.category}
                className="grid grid-cols-[1.2fr,1fr,1fr] gap-x-4 py-2 border-b border-border/40 last:border-0"
              >
                <div className="text-xs font-medium text-foreground">
                  {line.category}
                  <div className="text-[10px] text-muted/80 mt-0.5 leading-snug">
                    {line.note}
                  </div>
                </div>
                <div className="text-xs text-muted">{line.low}</div>
                <div className="text-xs text-muted">{line.mid}</div>
              </div>
            ))}
            <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-x-6 gap-y-1 text-[11px]">
              <span className="text-foreground font-semibold">
                Backpacker total: ~$75/day
              </span>
              <span className="text-foreground font-semibold">
                Comfortable total: ~$210/day
              </span>
            </div>
          </div>
        </section>

        {/* Airports */}
        <section className="mb-12">
          <SectionHeader
            emoji="✈️"
            title="The 3 Bay Area Airports"
            subtitle="Which one to fly into and how to get into SF cheap"
          />
          <div className="space-y-4">
            {AIRPORTS.map((airport) => (
              <div
                key={airport.code}
                className="bg-white rounded-2xl border border-border p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-lg font-bold text-foreground tracking-tight"
                        style={{ fontFamily: "var(--font-dm-serif)" }}
                      >
                        {airport.code}
                      </span>
                      <span className="text-xs text-muted">
                        {airport.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">{airport.distance}</p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-accent-light text-accent-dark text-[10px] font-semibold max-w-[50%] text-right">
                    {airport.best}
                  </span>
                </div>

                <p className="text-sm text-foreground mb-4 leading-relaxed">
                  {airport.description}
                </p>

                <div className="rounded-xl bg-background border border-border/60 p-4 mb-3">
                  <p className="text-[11px] font-semibold text-foreground mb-3">
                    How to get to SF
                  </p>
                  <div className="space-y-3">
                    {airport.getToSF.map((opt) => (
                      <div key={opt.mode} className="text-xs">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 mb-0.5">
                          <span className="font-semibold text-foreground">
                            {opt.mode}
                          </span>
                          <span className="text-accent-dark font-medium">
                            {opt.cost}
                          </span>
                          <span className="text-muted">• {opt.time}</span>
                        </div>
                        <p className="text-[11px] text-muted leading-snug">
                          {opt.note}
                        </p>
                        {opt.url && opt.cta && (
                          <a
                            href={opt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[11px] font-medium text-accent hover:underline mt-1"
                          >
                            {opt.cta}
                            <span className="ml-1">&rarr;</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-background border border-border/60 p-4 mb-3">
                  <p className="text-[11px] font-semibold text-foreground mb-2">
                    Tips
                  </p>
                  <ul className="space-y-1.5">
                    {airport.tips.map((tip) => (
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

                <a
                  href={airport.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-accent hover:underline"
                >
                  {airport.code} website
                  <span className="ml-1">&rarr;</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Before you land */}
        <section className="mb-12">
          <SectionHeader
            emoji="📋"
            title="Before You Land"
            subtitle="A few things to do while you're still on the plane"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BEFORE_YOU_LAND.map((tip) => (
              <div
                key={tip.title}
                className="bg-white rounded-2xl border border-border p-4 sm:p-5 flex flex-col"
              >
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xl shrink-0">{tip.icon}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        {tip.title}
                      </h3>
                      {tip.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-accent-light text-accent-dark text-[10px] font-semibold">
                          {tip.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {tip.body}
                    </p>
                  </div>
                </div>
                {tip.url && tip.cta && (
                  <div className="mt-3 pl-9">
                    <a
                      href={tip.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-medium text-accent hover:underline"
                    >
                      {tip.cta}
                      <span className="ml-1">&rarr;</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Where to sleep cheap */}
        <section className="mb-12">
          <SectionHeader
            emoji="🛏️"
            title="Where to Sleep Cheap"
            subtitle="Hostels and budget hotels that won't wreck your budget"
          />
          <div className="space-y-3">
            {STAY_CHEAP.map((place) => (
              <div
                key={place.name}
                className="bg-white rounded-2xl border border-border p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="text-sm font-semibold text-foreground">
                    <a
                      href={place.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {place.name}
                    </a>
                  </h3>
                  <span className="shrink-0 text-[11px] font-medium text-accent-dark">
                    {place.price}
                  </span>
                </div>
                <p className="text-[11px] text-muted mb-1.5">{place.type}</p>
                <p className="text-xs text-muted leading-relaxed">
                  {place.why}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-warm rounded-2xl border border-border p-4 text-xs text-foreground">
            <span className="font-semibold">🍳 Hostels have full kitchens + fridges.</span>{" "}
            This is the budget cheat code. Hit Trader Joe&apos;s or Safeway
            once, cook your own breakfasts and a couple dinners, and you can
            cut food spend in half. Store leftovers in the shared fridge
            (label your bag). Cuts a $55/day food budget down to $20-25.{" "}
            <a
              href="https://walmrt.us/41truU3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium"
            >
              Walmart+ same-day delivery
            </a>{" "}
            straight to the hostel works too — actual in-store prices, free on
            $35+.
          </div>
          <div className="mt-3 bg-accent-light/40 rounded-2xl border border-accent/20 p-4 text-xs text-foreground">
            <span className="font-semibold">Staying 2+ weeks?</span> Look at
            hacker houses and co-livings on the{" "}
            <Link href="/" className="text-accent hover:underline">
              map
            </Link>{" "}
            — PowelHouse, HSR, Gomry, Atmosphere all run $1,500-2,500/mo
            furnished.
          </div>
        </section>

        {/* Must-do free */}
        <section className="mb-12">
          <SectionHeader
            emoji="🆓"
            title="Must-Do Free Things"
            subtitle="The list every first-timer should hit"
          />
          <div className="bg-white rounded-2xl border border-border p-5">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MUST_DO_FREE.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-muted"
                >
                  <span className="text-accent mt-0.5 shrink-0">*</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-border/60">
              <Link
                href="/free"
                className="text-xs text-accent hover:underline"
              >
                See the full free things guide &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="mb-12">
          <SectionHeader
            emoji="🏘️"
            title="Neighborhoods to See"
            subtitle="One or two per day — don't try to cram it all in"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NEIGHBORHOODS_TO_SEE.map((n) => (
              <div
                key={n.name}
                className="bg-white rounded-2xl border border-border p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="text-sm font-semibold text-foreground">
                    {n.name}
                  </h3>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-warm text-[10px] font-medium text-muted">
                    {n.tag}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{n.why}</p>
              </div>
            ))}
          </div>
        </section>

        <RepeatVisitorSection />

        {/* Deeper dives */}
        <section className="mb-12">
          <SectionHeader
            emoji="🗺️"
            title="Go Deeper"
            subtitle="The rest of the BudgetSF playbook"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              {
                href: "/transport",
                label: "Getting Around",
                desc: "Muni, BART, Waymo, bikes",
              },
              {
                href: "/spots",
                label: "Cheap Eats Map",
                desc: "Vetted budget venues",
              },
              {
                href: "/diet",
                label: "Eat for $250/mo",
                desc: "Grocery + cheap food guide",
              },
              {
                href: "/free",
                label: "Free Things",
                desc: "Museums, parks, events",
              },
              {
                href: "/events",
                label: "Free Events",
                desc: "Meetups and talks",
              },
              {
                href: "/workspaces",
                label: "Free Work Spots",
                desc: "Cafes, libraries",
              },
              {
                href: "/picks",
                label: "My Picks",
                desc: "Cards, apps, services",
              },
              {
                href: "/community",
                label: "Vote / Add a Spot",
                desc: "Help grow the map",
              },
              {
                href: "/student",
                label: "Student Guide",
                desc: "If you're moving here",
              },
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

        {/* Sourcing */}
        <div className="text-center text-[11px] text-muted pt-6 border-t border-border">
          Trip tips sourced from personal experience and{" "}
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
          . Something missing?{" "}
          <Link href="/community" className="text-accent hover:underline">
            Add it
          </Link>
          .
        </div>

        {/* Affiliate disclosure */}
        <div className="text-center pt-4">
          <p className="text-[11px] text-muted leading-relaxed max-w-md mx-auto">
            Some links above are referral/affiliate links. Using them supports
            BudgetSF at no extra cost to you — and often gets you a bonus too.
          </p>
        </div>
      </div>
    </div>
  );
}

function RepeatVisitorSection() {
  return (
    <section className="mb-12">
      <SectionHeader
        emoji="🗓️"
        title="Already Done the Obvious Stuff?"
        subtitle="For a second SF visit after Alcatraz, the bridge, Pier 39, Chinatown, Japantown, Stanford, Apple Park, and the mall/campus loop"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {TRIP_VISUALS.map((item) => (
          <div
            key={item.title}
            className="overflow-hidden rounded-2xl border border-border bg-white"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 640px) 270px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-foreground mb-1">
                {item.title}
              </p>
              <p className="text-[11px] text-muted leading-relaxed">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      <RouteSketch />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {REPEAT_DAYS.map((day) => (
          <div
            key={day.title}
            className="bg-white rounded-2xl border border-border p-5"
          >
            <p
              className="text-lg text-foreground mb-1"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              {day.title}
            </p>
            <p className="text-[11px] font-semibold text-accent-dark mb-4">
              {day.route}
            </p>
            <ul className="space-y-2 mb-4">
              {day.stops.map((stop) => (
                <li
                  key={stop}
                  className="text-xs text-muted leading-relaxed pl-4 relative"
                >
                  <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
                  {stop}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-muted/80 leading-relaxed border-t border-border pt-3">
              {day.note}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REPEAT_PICKS.map((pick) => (
          <article
            key={pick.name}
            className="bg-white rounded-2xl border border-border p-5 card-hover"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3
                  className="text-lg text-foreground leading-tight"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  {pick.name}
                </h3>
                <p className="text-[11px] text-muted mt-1">{pick.area}</p>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-full bg-accent-light text-accent-dark text-[10px] font-semibold">
                {pick.cost}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-3">
              {pick.why}
            </p>
            <p className="text-xs text-muted leading-relaxed">{pick.move}</p>
            {pick.url && (
              <a
                href={pick.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-medium text-accent hover:underline mt-3"
              >
                Check details
                <span className="ml-1">&rarr;</span>
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function RouteSketch() {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-white">
      <div className="grid grid-cols-1 md:grid-cols-[0.95fr,1.05fr]">
        <div className="p-5 sm:p-6 flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-accent-dark text-xs font-medium mb-4">
            <span>🗺️</span> Route shape
          </div>
          <p
            className="text-2xl text-foreground mb-2"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Don&apos;t stack every day in SF
          </p>
          <p className="text-sm text-muted leading-relaxed">
            Treat the trip like three zones: one dense SF neighborhood day, one
            East Bay food/campus day, and one weather-dependent water or South
            Bay tech-history day.
          </p>
        </div>
        <div className="relative min-h-[260px] bg-background border-t md:border-t-0 md:border-l border-border">
          <svg
            viewBox="0 0 520 320"
            role="img"
            aria-label="Three-day Bay Area route map"
            className="w-full h-full min-h-[260px]"
          >
            <rect width="520" height="320" fill="#fdfbf7" />
            <path
              d="M70 92 C145 32 228 48 292 98 C350 143 404 142 462 94"
              fill="none"
              stroke="#d5c4a1"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M74 226 C148 174 216 178 278 220 C346 266 405 254 456 214"
              fill="none"
              stroke="#d5c4a1"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M122 162 C190 126 260 132 326 164 C380 190 424 184 462 160"
              fill="none"
              stroke="#2d6a4f"
              strokeWidth="4"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
            <RouteNode x={92} y={158} label="SF" detail="Mission + Twin Peaks" />
            <RouteNode x={258} y={132} label="East Bay" detail="Berkeley + Oakland" />
            <RouteNode x={432} y={104} label="Marin" detail="Ferry day" />
            <RouteNode x={414} y={224} label="South Bay" detail="Museum + food" />
            <path
              d="M376 182 L398 202"
              stroke="#2d6a4f"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M380 190 L410 160"
              stroke="#2d6a4f"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text
              x="260"
              y="292"
              textAnchor="middle"
              className="fill-muted"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              Pick Marin on a clear day. Pick South Bay when the fog wins.
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

function RouteNode({
  x,
  y,
  label,
  detail,
}: {
  x: number;
  y: number;
  label: string;
  detail: string;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r="28" fill="#2d6a4f" />
      <circle cx={x} cy={y} r="22" fill="#d8f3dc" />
      <text
        x={x}
        y={y - 2}
        textAnchor="middle"
        className="fill-accent-dark"
        style={{ fontSize: 12, fontWeight: 800 }}
      >
        {label}
      </text>
      <text
        x={x}
        y={y + 47}
        textAnchor="middle"
        className="fill-muted"
        style={{ fontSize: 10, fontWeight: 700 }}
      >
        {detail}
      </text>
    </g>
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
