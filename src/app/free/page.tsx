"use client";

import Link from "next/link";

type FreeActivity = {
  name: string;
  description: string;
  location: string;
  when: string;
  tip?: string;
  url?: string;
};

const MUSEUM_FREE_DAYS: FreeActivity[] = [
  {
    name: "SFMOMA",
    description: "Free first Thursdays. One of the best modern art museums in the world.",
    location: "SoMa",
    when: "First Thursday of every month",
    tip: "Get there early — it gets packed by noon.",
    url: "https://www.sfmoma.org",
  },
  {
    name: "de Young Museum",
    description: "Fine arts museum in Golden Gate Park. Free admission for SF residents with proof of address.",
    location: "Golden Gate Park",
    when: "First Tuesday of every month (all visitors)",
    tip: "The observation tower is always free and has 360-degree views of SF.",
    url: "https://www.famsf.org/visit/de-young",
  },
  {
    name: "California Academy of Sciences",
    description: "Aquarium, planetarium, and natural history museum all in one. Free for SF residents quarterly.",
    location: "Golden Gate Park",
    when: "Select Sundays (check website)",
    tip: "Reserve tickets online — they sell out fast on free days.",
    url: "https://www.calacademy.org",
  },
  {
    name: "Asian Art Museum",
    description: "One of the largest collections of Asian art in the world. Free first Sundays.",
    location: "Civic Center",
    when: "First Sunday of every month",
    url: "https://asianart.org",
  },
  {
    name: "Contemporary Jewish Museum",
    description: "Thought-provoking exhibitions in a stunning Daniel Libeskind building.",
    location: "SoMa",
    when: "First Tuesday of every month",
    url: "https://www.thecjm.org",
  },
  {
    name: "Museum of the African Diaspora (MoAD)",
    description: "Art and culture of the African diaspora. Small but powerful exhibitions.",
    location: "SoMa",
    when: "First Wednesday of every month",
    url: "https://www.moadsf.org",
  },
];

const PARKS_AND_NATURE: FreeActivity[] = [
  {
    name: "Presidio Tunnel Tops",
    description: "Brand new park with stunning Golden Gate Bridge views, playgrounds, picnic areas, and community gathering spaces.",
    location: "Presidio",
    when: "Open daily, sunrise to sunset",
    tip: "Best views at sunset. Bring a jacket — it's windy.",
  },
  {
    name: "Golden Gate Park",
    description: "1,017 acres of gardens, trails, lakes, and museums. Bigger than Central Park. You could spend weeks here.",
    location: "Richmond / Sunset",
    when: "Open 24/7",
    tip: "Rent a bike and ride from the Panhandle to Ocean Beach. The Japanese Tea Garden is $10 but free before 10am Mon/Wed/Fri.",
  },
  {
    name: "Lands End Trail",
    description: "Coastal trail with dramatic views of the Golden Gate Bridge, Marin Headlands, and the Pacific. The hidden Sutro Baths ruins are at the end.",
    location: "Outer Richmond",
    when: "Open daily",
    tip: "Start at the Lands End Lookout visitor center. The labyrinth viewpoint is the best photo spot.",
  },
  {
    name: "Twin Peaks",
    description: "360-degree panoramic views of SF from 922 feet. The best free viewpoint in the city.",
    location: "Twin Peaks",
    when: "Open 24/7",
    tip: "Go at sunset or after dark for city lights. Very windy — bring layers.",
  },
  {
    name: "Baker Beach",
    description: "Beach with Golden Gate Bridge views. Less touristy than Ocean Beach. Great for walks.",
    location: "Presidio",
    when: "Open daily",
    tip: "The north end has the best bridge views. Not great for swimming — strong currents.",
  },
  {
    name: "Dolores Park",
    description: "SF's living room. Hilltop park with city skyline views, perfect for people-watching and picnics.",
    location: "Mission District",
    when: "Open daily",
    tip: "Grab a burrito from La Taqueria and eat it here. Weekends are a scene.",
  },
  {
    name: "Crissy Field",
    description: "Waterfront park along the bay with Golden Gate Bridge views. Flat and perfect for walking or running.",
    location: "Marina / Presidio",
    when: "Open daily",
    tip: "Great for walking meetings. Start at Equator Coffee in Fort Mason.",
  },
  {
    name: "Bernal Heights Hill",
    description: "Off-leash dog park with 360-degree views. Less crowded than Twin Peaks, more local vibe.",
    location: "Bernal Heights",
    when: "Open daily",
    tip: "Short steep hike from Bernal Heights Blvd. The sunrise views are incredible.",
  },
];

const PUBLIC_SPACES: FreeActivity[] = [
  {
    name: "SF Privately Owned Public Open Spaces (POPOS)",
    description: "Over 60 beautiful lobbies, terraces, rooftop gardens, and plazas maintained privately but open to the public by law. Hidden gems throughout FiDi and SoMa.",
    location: "Citywide (mostly FiDi/SoMa)",
    when: "Business hours, most Mon-Fri",
    tip: "Search 'SF POPOS map' for the full list. The Salesforce Transit Center rooftop park is the best one.",
    url: "https://sfplanning.org/privately-owned-public-open-spaces",
  },
  {
    name: "Salesforce Transit Center Rooftop Park",
    description: "5.4-acre park on top of the Salesforce Transit Center. Gardens, walking paths, an amphitheater, and a bus fountain. Completely free.",
    location: "SoMa / FiDi",
    when: "Daily 6am-8pm",
    tip: "Take the free gondola up from street level. The park has free wifi.",
  },
  {
    name: "Ferry Building",
    description: "Iconic marketplace on the Embarcadero. Free to walk around and browse. Saturday farmers market is legendary.",
    location: "Embarcadero",
    when: "Daily, farmers market Sat 8am-2pm",
    tip: "Saturday morning is the best time. Grab free samples from the food vendors.",
  },
  {
    name: "SF Public Libraries (31 locations)",
    description: "Free wifi, free events, free workspace. The Main Library on Larkin has study rooms and city views from the top floor.",
    location: "Citywide",
    when: "Check sfpl.org for hours",
    tip: "Main Library top floor is one of the best free work spots in the city.",
    url: "https://sfpl.org",
  },
];

const FREE_ACTIVITIES: FreeActivity[] = [
  {
    name: "Free Walking Tours",
    description: "SF City Guides runs free walking tours of neighborhoods, parks, and historic districts. Volunteer-led, tip-based.",
    location: "Various",
    when: "Multiple daily, check schedule",
    url: "https://sfcityguides.org",
  },
  {
    name: "Sunday Streets SF",
    description: "Car-free streets with live music, food, and activities. Different neighborhoods each month.",
    location: "Rotating neighborhoods",
    when: "Select Sundays",
    url: "https://www.sundaystreetssf.com",
  },
  {
    name: "Stern Grove Festival",
    description: "Free outdoor concerts every Sunday in summer. Acts range from indie to symphony to jazz.",
    location: "Stern Grove (Sunset)",
    when: "Sundays, June-August",
    tip: "Arrive early with a blanket. It fills up fast.",
  },
  {
    name: "Ocean Beach Bonfires",
    description: "Free fire pits on Ocean Beach. Bring wood, marshmallows, and friends. One of the most SF things you can do.",
    location: "Ocean Beach",
    when: "Daily, best at sunset",
    tip: "Fire pits are first-come-first-served. Go early on weekends to claim one.",
  },
  {
    name: "The Board Walks",
    description: "Every Saturday at 8 AM, a group of curious people walk 5 miles together. Hosted by Adele Bloch.",
    location: "Varies",
    when: "Saturdays 8am",
    tip: "Great way to meet people. Follow @adele_bloch on X for locations.",
  },
  {
    name: "Jared's Plunge Party",
    description: "Free cold plunges at Crissy Field. Caffeine and real connections. The hottest wellness club in SF.",
    location: "Marina / Crissy Field",
    when: "Weekly, check X for schedule",
  },
];

export default function FreePage() {
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
            <span className="text-muted text-xs">/ Free Things</span>
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
          <div className="mb-5 slide-up">
            <img
              src="/goldengate.jpg"
              alt="At the Golden Gate Bridge"
              className="mx-auto w-full max-w-md rounded-2xl shadow-lg border border-border/60 object-cover"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-accent-dark text-xs font-medium mb-4 slide-up">
            <span>🆓</span> $0 required
          </div>
          <h1
            className="text-3xl sm:text-4xl text-foreground mb-3 slide-up"
            style={{
              fontFamily: "var(--font-dm-serif)",
              animationDelay: "0.05s",
              animationFillMode: "both",
            }}
          >
            Free Things to Do in SF
          </h1>
          <p
            className="text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed slide-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            Museums, parks, public spaces, and activities that cost nothing.
            SF is expensive — but the best parts are free.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <Section
          title="Free Museum Days"
          subtitle="Mark your calendar — most museums have one free day per month"
          items={MUSEUM_FREE_DAYS}
        />
        <Section
          title="Parks & Nature"
          subtitle="SF has some of the best urban nature in the country"
          items={PARKS_AND_NATURE}
        />
        <Section
          title="Public Spaces"
          subtitle="Beautiful spaces that are free and open to everyone"
          items={PUBLIC_SPACES}
        />
        <Section
          title="Free Activities"
          subtitle="Things to do that cost $0"
          items={FREE_ACTIVITIES}
        />

        <div className="text-center text-[11px] text-muted">
          Sourced with help from{" "}
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

function Section({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: FreeActivity[];
}) {
  return (
    <section className="mb-12">
      <h2
        className="text-xl text-foreground mb-1"
        style={{ fontFamily: "var(--font-dm-serif)" }}
      >
        {title}
      </h2>
      <p className="text-xs text-muted mb-5">{subtitle}</p>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.name}
            className="bg-white rounded-2xl border border-border p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h3 className="text-sm font-semibold text-foreground">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    {item.name}
                    <span className="ml-1 text-[10px] opacity-40">
                      &#8599;
                    </span>
                  </a>
                ) : (
                  item.name
                )}
              </h3>
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-medium">
                Free
              </span>
            </div>
            <p className="text-xs text-muted mb-2 leading-relaxed">
              {item.description}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
              <span>
                <span className="font-medium text-foreground">Where:</span>{" "}
                {item.location}
              </span>
              <span>
                <span className="font-medium text-foreground">When:</span>{" "}
                {item.when}
              </span>
            </div>
            {item.tip && (
              <div className="mt-2.5 rounded-lg bg-accent-light/40 border border-accent/10 px-3 py-2">
                <p className="text-[11px] text-accent-dark">
                  <span className="font-semibold">Tip:</span> {item.tip}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
