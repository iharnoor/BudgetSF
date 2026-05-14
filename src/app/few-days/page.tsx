"use client";

import Link from "next/link";
import Image from "next/image";

type Pick = {
  name: string;
  area: string;
  cost: string;
  why: string;
  move: string;
  url?: string;
};

type DayPlan = {
  title: string;
  route: string;
  stops: string[];
  note: string;
};

type VisualPick = {
  title: string;
  caption: string;
  src: string;
  alt: string;
};

const ALREADY_DONE = [
  "Pier 39",
  "Alcatraz",
  "Boudin Bakery",
  "Presidio",
  "Sutro Baths",
  "Golden Gate Bridge",
  "Golden Gate Beach",
  "Painted Ladies",
  "Fillmore Street",
  "Chestnut Street",
  "Chinatown",
  "Japantown",
  "Arsicault Bakery",
  "Salesforce Tower",
  "Stanford",
  "Apple Park Visitor Center",
  "Valley Fair",
  "Santana Row",
];

const SF_PICKS: Pick[] = [
  {
    name: "Mission burrito + murals loop",
    area: "Mission",
    cost: "$12-18",
    why: "La Taqueria, El Farolito, Balmy Alley, Clarion Alley, and Dolores Park make this the highest-density SF afternoon you have not listed yet.",
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
    name: "Twin Peaks after dark",
    area: "Twin Peaks",
    cost: "Free",
    why: "The city grid, Bay Bridge, and fog line make more sense from here. It is the cleanest night view in SF.",
    move: "Take a Waymo/Uber up, walk the summit loop, leave before it gets too cold.",
  },
  {
    name: "Ferry Building Saturday market",
    area: "Embarcadero",
    cost: "$0-20",
    why: "Better than a normal tourist stop if you go Saturday morning: local farms, snacks, coffee, and Bay views in one place.",
    move: "Pair it with a waterfront walk to Mission Bay or a ferry ride.",
    url: "https://www.ferrybuildingmarketplace.com/farmers-market/",
  },
  {
    name: "Exploratorium After Dark",
    area: "Pier 15",
    cost: "Paid",
    why: "Adult-only Thursday night version of the science museum. More fun than a standard museum if you are here on the right night.",
    move: "Go Thursday 6-10pm, then walk the Embarcadero at night.",
    url: "https://www.exploratorium.edu/visit/calendar/after-dark",
  },
  {
    name: "SF City Guides walking tour",
    area: "Citywide",
    cost: "Free / donation",
    why: "Volunteer-led walks that make familiar neighborhoods feel new. Choose architecture, history, stairs, North Beach, or downtown.",
    move: "Pick one that starts near where you already planned to be.",
    url: "https://sfcityguides.org/",
  },
];

const BAY_PICKS: Pick[] = [
  {
    name: "Berkeley campus + Telegraph + Berkeley Bowl",
    area: "East Bay",
    cost: "$0-25",
    why: "Very different energy from Stanford: denser, older, weirder, better for wandering. Berkeley Bowl is a grocery store worth treating like an attraction.",
    move: "BART to Downtown Berkeley, walk campus, eat on Telegraph or at Cheese Board, detour to Berkeley Bowl.",
  },
  {
    name: "Oakland Temescal food crawl",
    area: "Oakland",
    cost: "$15-35",
    why: "A strong non-SF food neighborhood: tacos, Korean, Ethiopian, cafes, and small shops without the tourist loop.",
    move: "BART to MacArthur, walk Telegraph Ave, finish with dessert or coffee.",
  },
  {
    name: "Sausalito by ferry",
    area: "Marin",
    cost: "$14-30 transit + food",
    why: "The ferry ride is the point: skyline, Alcatraz, Angel Island, bridge views, then a small waterfront town.",
    move: "Ferry out, snack by the water, bus or ferry back depending on schedule.",
  },
  {
    name: "Angel Island day trip",
    area: "Bay",
    cost: "Ferry + park fees",
    why: "Bay views plus real history. It is quieter and more physical than Alcatraz, with hiking and the immigration station.",
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

const FOOD_PICKS: Pick[] = [
  {
    name: "House of Nanking alternatives",
    area: "Chinatown / North Beach",
    cost: "$12-25",
    why: "Since you have already walked Chinatown, go food-specific: Good Mong Kok Bakery, Yuet Lee late night, Golden Gate Bakery if it is open.",
    move: "Snack crawl, not a sit-down meal.",
  },
  {
    name: "Outer Richmond crawl",
    area: "Richmond",
    cost: "$15-35",
    why: "Dim sum, Burmese, Russian bakeries, boba, and Clement Street produce markets. This is one of SF's best budget food zones.",
    move: "Start around Clement and 6th, walk west until you are full.",
  },
  {
    name: "Inner Sunset before the park",
    area: "Inner Sunset",
    cost: "$10-25",
    why: "Good casual food before Golden Gate Park: Arizmendi, San Tung, Tartine Inner Sunset, Ebisu, or a cheap banh mi nearby.",
    move: "Eat first, then Japanese Tea Garden free hour or the de Young tower.",
  },
  {
    name: "Mission late-night tacos",
    area: "Mission",
    cost: "$10-18",
    why: "The obvious answer is still right. If someone visits SF and skips a Mission burrito, they missed a core food group.",
    move: "El Farolito after 9pm is the canonical move.",
  },
];

const DAY_PLANS: DayPlan[] = [
  {
    title: "Day 1 - Local SF, not repeat-tourist SF",
    route: "Mission -> Castro -> Twin Peaks",
    stops: [
      "24th St BART, Balmy Alley, and a Mission burrito",
      "Dolores Park if the weather is good",
      "Castro walk, then Twin Peaks near sunset or after dark",
    ],
    note: "This is the highest ROI first day because it is all close together and does not repeat your waterfront/bridge list.",
  },
  {
    title: "Day 2 - East Bay day",
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
    route: "Pick Marin if sunny, South Bay if tech mood",
    stops: [
      "Sunny: Ferry Building market, Sausalito ferry, or Angel Island",
      "Foggy: Computer History Museum, Mountain View Castro Street, San Jose Japantown",
      "Night: Exploratorium After Dark if it is Thursday",
    ],
    note: "Do not force a Marin view day through fog. Swap with the museum/South Bay plan when the weather is bad.",
  },
];

const VISUAL_PICKS: VisualPick[] = [
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

export default function FewDaysPage() {
  return (
    <div className="min-h-screen bg-background">
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
            <span className="text-muted text-xs">/ Few Days</span>
          </div>
          <Link href="/" className="text-xs text-accent hover:underline">
            Back to Map
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-warm/40" />
        <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.05fr,0.95fr] gap-6 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-accent-dark text-xs font-medium mb-4 slide-up">
                <span>🗓️</span> For a second SF visit
              </div>
              <h1
                className="text-3xl sm:text-4xl text-foreground mb-3 slide-up"
                style={{
                  fontFamily: "var(--font-dm-serif)",
                  animationDelay: "0.05s",
                  animationFillMode: "both",
                }}
              >
                What to Do in SF for a Few Days
              </h1>
              <p
                className="text-sm sm:text-base text-muted max-w-2xl mx-auto md:mx-0 leading-relaxed slide-up"
                style={{ animationDelay: "0.1s", animationFillMode: "both" }}
              >
                A repeat-visitor guide for when you have already done the bridge,
                Alcatraz, Pier 39, Chinatown, Japantown, the Presidio, Stanford,
                Apple Park, and the obvious mall/campus loop.
              </p>
            </div>
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-white shadow-lg shadow-black/[0.04] slide-up"
              style={{ animationDelay: "0.12s", animationFillMode: "both" }}
            >
              <Image
                src="/TrainShot.jpg"
                alt="Working from a train on a Silicon Valley day trip"
                fill
                priority
                sizes="(min-width: 768px) 380px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {VISUAL_PICKS.map((item) => (
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
        </section>

        <section className="mb-12">
          <SectionHeader
            emoji="✅"
            title="Already Done"
            subtitle="This guide intentionally routes around the obvious repeats"
          />
          <div className="flex flex-wrap gap-2">
            {ALREADY_DONE.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-full bg-white border border-border text-[11px] font-medium text-muted"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <SectionHeader
            emoji="🧭"
            title="Best 3-Day Shape"
            subtitle="A practical route that avoids doubling back"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DAY_PLANS.map((day) => (
              <div
                key={day.title}
                className="bg-white rounded-2xl border border-border p-5 card-hover"
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
        </section>

        <PickSection
          emoji="🌁"
          title="SF Picks"
          subtitle="Things that still feel worth doing after the standard tourist list"
          picks={SF_PICKS}
        />

        <PickSection
          emoji="🚆"
          title="Bay Area Picks"
          subtitle="Good day trips without repeating Stanford, Apple Park, Valley Fair, or Santana Row"
          picks={BAY_PICKS}
        />

        <PickSection
          emoji="🍜"
          title="Food Moves"
          subtitle="Cheap-ish food plans that are better than one reservation"
          picks={FOOD_PICKS}
        />

        <section className="mt-12 bg-accent-dark rounded-2xl p-5 sm:p-6 text-white">
          <p
            className="text-2xl mb-2"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            My default answer
          </p>
          <p className="text-sm leading-relaxed text-white/85">
            If you only have one free day: do a Mission burrito and murals, walk
            through Dolores/Castro, go up Twin Peaks, then end with a night
            activity like Exploratorium After Dark, a comedy show, or a founder
            event from Luma. That gives you food, neighborhoods, views, and the
            current SF scene without repeating the checklist.
          </p>
        </section>
      </main>
    </div>
  );
}

function PickSection({
  emoji,
  title,
  subtitle,
  picks,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  picks: Pick[];
}) {
  return (
    <section className="mb-12">
      <SectionHeader emoji={emoji} title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {picks.map((pick) => (
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
        <span className="text-xl">{emoji}</span>
        <h2
          className="text-2xl text-foreground"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          {title}
        </h2>
      </div>
      <p className="text-sm text-muted">{subtitle}</p>
    </div>
  );
}
