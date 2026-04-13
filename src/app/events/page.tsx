"use client";

import Link from "next/link";

type Person = {
  name: string;
  handle: string;
  url: string;
  why: string;
};

type EventPlatform = {
  name: string;
  description: string;
  url: string;
  icon: string;
  highlight?: string;
};

type Community = {
  name: string;
  description: string;
  url?: string;
  vibe: string;
  free: boolean;
};

const PEOPLE_TO_FOLLOW: Person[] = [
  {
    name: "Michelle Fang",
    handle: "@michelleefang",
    url: "https://x.com/michelleefang",
    why: "Runs weekly SF event threads every Monday. The single best source for what's happening in SF tech each week.",
  },
  {
    name: "Jonathan Chang",
    handle: "@thechangj",
    url: "https://x.com/thechangj",
    why: "Monday 9am event roundups. Brex Startup Community lead — always plugged into what's happening.",
  },
  {
    name: "Jason Mok",
    handle: "@jasonmok",
    url: "https://x.com/jasonmok",
    why: "Deep in the SF founder ecosystem. Great for discovering under-the-radar events and meetups.",
  },
  {
    name: "Ivan Porollo",
    handle: "@iporollo",
    url: "https://x.com/iporollo",
    why: "Built PamPam maps for SF tech. Connected to the AI and founder scene.",
  },
  {
    name: "Jeremiah Owyang",
    handle: "@jowyang",
    url: "https://x.com/jowyang",
    why: "Hosts events and connects people across SF tech. Big on AI and community building.",
  },
  {
    name: "Cory Levy",
    handle: "@cory",
    url: "https://x.com/cory",
    why: "Z Fellows founder. Connected to the young founder community in SF.",
  },
  {
    name: "Kim-Mai Cutler",
    handle: "@kimmaicutler",
    url: "https://x.com/kimmaicutler",
    why: "Initialized Capital. Deep SF tech journalism background — great for understanding the ecosystem.",
  },
  {
    name: "Sheel Mohnot",
    handle: "@pitdesi",
    url: "https://x.com/pitdesi",
    why: "Better Tomorrow Ventures. Fintech-focused but broadly connected to SF startup events.",
  },
  {
    name: "Josh Constine",
    handle: "@JoshConstine",
    url: "https://x.com/JoshConstine",
    why: "Runs the best social events in SF you can't find anywhere else. Sign up by texting (415) 523-1361.",
  },
  {
    name: "Suffiyan Malik",
    handle: "@suffiyanmalikk",
    url: "https://x.com/suffiyanmalikk",
    why: "Active in the SF founder and community builder scene.",
  },
];

const EVENT_PLATFORMS: EventPlatform[] = [
  {
    name: "Cerebral Valley Events",
    description:
      "The hub for AI events in SF. Cerebral Valley is the epicenter of the AI scene — their events page is the go-to for hackathons, talks, and meetups.",
    url: "https://cerebralvalley.ai/events",
    icon: "🧠",
    highlight: "AI Events Hub",
  },
  {
    name: "Luma",
    description:
      "Where most SF tech events are hosted. Search by city, follow organizers, and RSVP. If it's happening in SF tech, it's probably on Luma.",
    url: "https://lu.ma/sf",
    icon: "✨",
    highlight: "Most Events Here",
  },
  {
    name: "Partiful",
    description:
      "The invite-only events app. More social and party-oriented — great for founder dinners, house parties, and informal gatherings.",
    url: "https://partiful.com",
    icon: "🎉",
    highlight: "Social Events",
  },
  {
    name: "Eventbrite",
    description:
      "Larger conferences and paid events. Filter by free events in SF to find hidden gems like panels, workshops, and networking nights.",
    url: "https://www.eventbrite.com/d/ca--san-francisco/free--events/",
    icon: "🎟️",
  },
  {
    name: "Meetup",
    description:
      "Classic platform for recurring meetups. Great for niche communities — hardware, game dev, product, design, specific programming languages.",
    url: "https://www.meetup.com/find/?location=us--ca--San%20Francisco",
    icon: "👥",
  },
];

const COMMUNITIES: Community[] = [
  {
    name: "Pitch & Run Fridays",
    description:
      "Pitch your startup while running. Founders connect with angels and VCs without the pressure of a formal pitch meeting.",
    vibe: "Active, casual networking",
    free: true,
  },
  {
    name: "Founders Brew",
    description:
      "Bringing together ambitious people. No entry fees, no corporate agenda, just vibes. By Daivik Goel.",
    vibe: "Casual, high-quality people",
    free: true,
  },
  {
    name: "Sundays in SF",
    description:
      "Weekly co-working club to build fun side projects and explore creative interests.",
    vibe: "Creative, side projects",
    free: true,
  },
  {
    name: "AI Tinkerers",
    description:
      "Exclusive meetup for technical practitioners building with LLMs and generative AI. Hands-on and deeply technical.",
    vibe: "Technical, AI builders",
    free: true,
  },
  {
    name: "Bootstrappers Breakfast",
    description:
      "Recurring breakfast meetups for founders bootstrapping a startup. Conversations around growing a business on internal cashflow.",
    vibe: "Bootstrapped founders",
    free: true,
  },
  {
    name: "SF AI Agent Meetup",
    description:
      "Community for AI agent developers, engineers, and researchers exploring the evolution of AI agents.",
    vibe: "AI agents, technical",
    free: true,
  },
  {
    name: "The AI Collective",
    description:
      "Non-profit community uniting 70,000+ pioneers — founders, researchers, operators, and investors — in AI.",
    vibe: "Large AI community",
    free: true,
  },
  {
    name: "South Park Commons",
    description:
      "A community for technologists exploring what's next. Members get space to tinker, learn, and find co-founders. Alumni have started companies worth billions.",
    url: "https://www.southparkcommons.com",
    vibe: "Exploratory, high-caliber founders",
    free: false,
  },
  {
    name: "Homebrew Club",
    description:
      "24/7 member-run DIY community space. Web3, AI, and frontier tech experimentation.",
    vibe: "Hacker vibes, experimental",
    free: false,
  },
  {
    name: "Founders Common",
    description:
      "Social community for early-stage startup founders. Building third spaces for the startup world.",
    vibe: "Early-stage founders",
    free: true,
  },
  {
    name: "SF Freedom Club",
    description:
      "Epic parties for people who love freedom, technology, capitalism, and growth.",
    vibe: "Social, high energy",
    free: true,
  },
  {
    name: "Building Humane Tech",
    description:
      "Community movement to make humane technology accessible and actionable for builders at any stage.",
    vibe: "Ethics-focused, thoughtful",
    free: true,
  },
  {
    name: "We The Builders",
    description:
      "Events including podcasts, live events, and dinners. Past guests include David Sacks, Delian Asparouhov, and more.",
    vibe: "High-profile, networking",
    free: true,
  },
  {
    name: "Founders You Should Know",
    description:
      "Recurring showcase event by Jen Yip to meet the best founders from seed through growth.",
    vibe: "Curated, quality founders",
    free: true,
  },
  {
    name: "Product Folks",
    description:
      "Volunteer-driven community of Product Managers and enthusiasts passionate about making an impact.",
    vibe: "Product managers",
    free: true,
  },
  {
    name: "Design Buddies",
    description:
      "Events for designers and creatives. World's largest design community, founded by Grace Ling.",
    vibe: "Designers, creative",
    free: true,
  },
  {
    name: "Jared's Plunge Party",
    description:
      "Hottest wellness club in SF. Cold plunges, caffeine, and real connections.",
    vibe: "Wellness, social",
    free: true,
  },
  {
    name: "The Board Walks",
    description:
      "Every Saturday at 8 AM, a group of curious people walk 5 miles. Hosted by Adele Bloch.",
    vibe: "Walking, conversation",
    free: true,
  },
];

export default function EventsPage() {
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
            <span className="text-muted text-xs">/ Events</span>
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
            <span>🗓️</span> Get plugged in
          </div>
          <h1
            className="text-3xl sm:text-4xl text-foreground mb-3 slide-up"
            style={{
              fontFamily: "var(--font-dm-serif)",
              animationDelay: "0.05s",
              animationFillMode: "both",
            }}
          >
            Events & Community
          </h1>
          <p
            className="text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed slide-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            The best way to meet people in SF is to show up. Here&apos;s where
            to find events, who to follow, and which communities to join.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Event Platforms */}
        <section className="mb-12">
          <h2
            className="text-xl text-foreground mb-1"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Where to Find Events
          </h2>
          <p className="text-xs text-muted mb-5">
            Bookmark these. Most SF tech events live on one of these platforms.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EVENT_PLATFORMS.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-border p-5 hover:shadow-sm transition-shadow group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{platform.icon}</span>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                      {platform.name}
                      <span className="ml-1 text-[10px] opacity-40">
                        &#8599;
                      </span>
                    </h3>
                  </div>
                  {platform.highlight && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-accent-light text-accent-dark text-[10px] font-semibold">
                      {platform.highlight}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {platform.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* People to Follow */}
        <section className="mb-12">
          <h2
            className="text-xl text-foreground mb-1"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            10 People to Follow for SF Events
          </h2>
          <p className="text-xs text-muted mb-5">
            Follow these people on X and you&apos;ll never miss what&apos;s
            happening in SF tech.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PEOPLE_TO_FOLLOW.map((person, i) => (
              <a
                key={person.handle}
                href={person.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-border p-4 hover:shadow-sm transition-shadow group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] text-muted font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                    {person.name}
                  </h3>
                  <span className="text-xs text-accent">{person.handle}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed pl-6">
                  {person.why}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Communities */}
        <section className="mb-10">
          <h2
            className="text-xl text-foreground mb-1"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Communities & Recurring Events
          </h2>
          <p className="text-xs text-muted mb-5">
            Show up consistently to one or two of these and you&apos;ll build a
            real network fast.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMMUNITIES.map((community) => (
              <div
                key={community.name}
                className="bg-white rounded-2xl border border-border p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-sm font-semibold text-foreground">
                    {community.name}
                  </h3>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      community.free
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {community.free ? "Free" : "Paid"}
                  </span>
                </div>
                <p className="text-xs text-muted mb-2 leading-relaxed">
                  {community.description}
                </p>
                <span className="text-[10px] text-muted italic">
                  {community.vibe}
                </span>
              </div>
            ))}
          </div>
        </section>

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
