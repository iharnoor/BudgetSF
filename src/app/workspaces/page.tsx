"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type WorkspaceType =
  | "all"
  | "free"
  | "coworking"
  | "library"
  | "hotel-lobby"
  | "cafe";

type Workspace = {
  name: string;
  type: WorkspaceType | WorkspaceType[];
  neighborhood: string;
  description: string;
  price: string;
  wifi: boolean;
  outlets: boolean;
  hours: string;
  vibe: string;
  address?: string;
  url?: string;
  tip?: string;
};

const WORKSPACES: Workspace[] = [
  // Free coworking
  {
    name: "Founders Cafe",
    type: "free",
    neighborhood: "SoMa",
    description:
      "Free coworking for founders and builders. Community-driven space where you can work, network, and collaborate.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Check @founders_cafe on X",
    vibe: "Startup energy, collaborative",
    url: "https://x.com/founders_cafe",
    tip: "Follow @founders_cafe on X for hours and events. Great for meeting other founders.",
  },
  {
    name: "Mechanics' Institute",
    type: "coworking",
    neighborhood: "FiDi",
    description:
      "Historic library and chess room since 1854. Beautiful reading rooms with fast wifi, perfect for deep work.",
    price: "$120/year",
    wifi: true,
    outlets: true,
    hours: "Mon-Fri 9am-9pm, Sat 10am-5pm, Sun 1pm-5pm",
    vibe: "Quiet, scholarly, historic",
    address: "57 Post St",
    url: "https://www.milibrary.org",
    tip: "The chess room is legendary. Annual membership is a steal for daily use.",
  },
  {
    name: "StartupHQ",
    type: "coworking",
    neighborhood: "FiDi",
    description:
      "Founder-focused coworking space in the heart of SF's financial district.",
    price: "From $200/mo",
    wifi: true,
    outlets: true,
    hours: "24/7 member access",
    vibe: "Hustle mode, founder-friendly",
    url: "https://www.startuphq.com",
  },
  {
    name: "NEON",
    type: "coworking",
    neighborhood: "Marina",
    description:
      "Neighborhood coworking and event space. Great mix of remote workers, freelancers, and small teams.",
    price: "From $250/mo",
    wifi: true,
    outlets: true,
    hours: "Mon-Fri 8am-6pm",
    vibe: "Bright, neighborhood feel",
    url: "https://www.neon.co",
  },
  {
    name: "BerlinHouse",
    type: "coworking",
    neighborhood: "FiDi",
    description:
      "European-style coworking in Frontier Tower. Community-focused with events and networking.",
    price: "From $300/mo",
    wifi: true,
    outlets: true,
    hours: "24/7 member access",
    vibe: "International, community-driven",
  },
  {
    name: "Werqwise",
    type: "coworking",
    neighborhood: "FiDi",
    description:
      "Flexible coworking and private office spaces with a professional vibe.",
    price: "From $250/mo",
    wifi: true,
    outlets: true,
    hours: "24/7 member access",
    vibe: "Professional, flexible",
    url: "https://www.werqwise.com",
  },
  {
    name: "Homebrew Club",
    type: "coworking",
    neighborhood: "SoMa",
    description:
      "24/7 member-run DIY community space. Web3, AI, and frontier tech experimentation.",
    price: "Membership-based",
    wifi: true,
    outlets: true,
    hours: "24/7",
    vibe: "Hacker vibes, experimental",
    tip: "Great for late-night building sessions.",
  },

  // Public libraries
  {
    name: "SF Main Library",
    type: "library",
    neighborhood: "Civic Center",
    description:
      "The flagship SF public library. Multiple floors with quiet study rooms, free wifi, and city views from the top floor.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Mon & Sat 10am-6pm, Tue-Thu 9am-8pm, Fri 12pm-6pm, Sun 12pm-6pm",
    vibe: "Quiet, spacious, classic",
    address: "100 Larkin St",
    url: "https://sfpl.org",
    tip: "Top floor has the best views. Study rooms can be reserved for free.",
  },
  {
    name: "Mission Branch Library",
    type: "library",
    neighborhood: "Mission",
    description:
      "Neighborhood branch with a solid work setup. Less crowded than Main Library.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Mon & Fri 1pm-6pm, Tue & Thu 10am-8pm, Wed 12pm-8pm, Sat 10am-6pm",
    vibe: "Chill, neighborhood",
    address: "300 Bartlett St",
  },
  {
    name: "Noe Valley Branch Library",
    type: "library",
    neighborhood: "Noe Valley",
    description:
      "Bright, modern branch in a family-friendly neighborhood. Great for focused afternoon work.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Mon 12pm-6pm, Tue 10am-8pm, Wed 12pm-8pm, Thu 10am-6pm, Sat 10am-6pm",
    vibe: "Modern, quiet, sunny",
    address: "451 Jersey St",
  },
  {
    name: "Mill Valley Public Library",
    type: "library",
    neighborhood: "Mill Valley (Marin)",
    description:
      "One of the best reading nooks in the Bay Area. Surrounded by nature with beautiful architecture.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Mon-Thu 10am-9pm, Fri-Sat 10am-5pm, Sun 12pm-5pm",
    vibe: "Nature, serene, inspiring",
    address: "375 Throckmorton Ave, Mill Valley",
    tip: "Worth the trip across the bridge. Grab lunch on Throckmorton after.",
  },
  {
    name: "North Beach Branch Library",
    type: "library",
    neighborhood: "North Beach",
    description:
      "Bright, modern building with floor-to-ceiling windows. Less crowded than Main, walking distance to City Lights and Caffè Trieste.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Tue & Thu 10am-8pm, Wed 12pm-8pm, Fri-Sat 10am-6pm, Sun 12pm-6pm",
    vibe: "Modern, light-filled",
    address: "850 Columbus Ave",
    url: "https://sfpl.org",
    tip: "Grab a cappuccino at Caffè Trieste across the way.",
  },
  {
    name: "Mission Bay Branch Library",
    type: "library",
    neighborhood: "Mission Bay",
    description:
      "Modern branch near UCSF and Chase Center. Big windows, quiet, popular with grad students and remote workers.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Tue-Thu 10am-8pm, Fri-Sat 10am-6pm, Sun 12pm-6pm",
    vibe: "Sleek, quiet, student-heavy",
    address: "960 4th St",
    url: "https://sfpl.org",
  },
  {
    name: "Park Branch Library",
    type: "library",
    neighborhood: "Haight-Ashbury",
    description:
      "1909 Carnegie building near Golden Gate Park. Beautiful architecture, classic library feel, fast wifi.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Tue & Thu 10am-8pm, Wed 12pm-8pm, Fri-Sat 10am-6pm, Sun 12pm-6pm",
    vibe: "Historic, charming",
    address: "1833 Page St",
    url: "https://sfpl.org",
    tip: "Walk to GG Park after for a break.",
  },
  {
    name: "Eureka Valley / Harvey Milk Memorial Branch",
    type: "library",
    neighborhood: "Castro",
    description:
      "Castro neighborhood branch named after Harvey Milk. Quiet workspace, big skylight, locals' study spot.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Tue 1pm-8pm, Wed 10am-8pm, Thu-Sat 10am-6pm",
    vibe: "Bright, neighborhood",
    address: "1 Jose Sarria Ct",
    url: "https://sfpl.org",
  },
  {
    name: "Chinatown / Him Mark Lai Branch Library",
    type: "library",
    neighborhood: "Chinatown",
    description:
      "Top-floor reading room has sweeping city views. Sun-filled, quiet, and tourists never find it.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Tue-Thu 10am-8pm, Fri-Sat 10am-6pm, Sun 12pm-6pm",
    vibe: "Hidden gem, city views",
    address: "1135 Powell St",
    url: "https://sfpl.org",
    tip: "Take the elevator straight to the top floor.",
  },
  {
    name: "Glen Park Branch Library",
    type: "library",
    neighborhood: "Glen Park",
    description:
      "Newer build with floor-to-ceiling windows and a quiet residential vibe. Great for deep work.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Tue-Thu 10am-8pm, Fri-Sat 10am-6pm, Sun 12pm-6pm",
    vibe: "Modern, calm",
    address: "2825 Diamond St",
    url: "https://sfpl.org",
  },
  {
    name: "Sunset Branch Library",
    type: "library",
    neighborhood: "Inner Sunset",
    description:
      "Neighborhood branch with low foot traffic. Easy to find a quiet corner all day.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Tue-Thu 10am-8pm, Fri-Sat 10am-6pm, Sun 12pm-6pm",
    vibe: "Quiet, neighborhood",
    address: "1305 18th Ave",
    url: "https://sfpl.org",
  },
  {
    name: "Richmond / Senator Milton Marks Branch Library",
    type: "library",
    neighborhood: "Inner Richmond",
    description:
      "Classic 1914 Carnegie building. Multiple reading rooms, beautiful original woodwork.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Tue-Thu 10am-8pm, Fri-Sat 10am-6pm, Sun 12pm-6pm",
    vibe: "Historic, scholarly",
    address: "351 9th Ave",
    url: "https://sfpl.org",
  },
  {
    name: "Bernal Heights Branch Library",
    type: "library",
    neighborhood: "Bernal Heights",
    description:
      "Small but charming branch on Cortland. Fast wifi, friendly staff, locals stop in to work for hours.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Tue-Thu 10am-8pm, Fri-Sat 10am-6pm, Sun 12pm-6pm",
    vibe: "Cozy, neighborhood",
    address: "500 Cortland Ave",
    url: "https://sfpl.org",
    tip: "Grab a coffee at Pinhole on Cortland before you go in.",
  },

  // Hotel lobbies
  {
    name: "Hotel Kabuki Lobby",
    type: "hotel-lobby",
    neighborhood: "Japantown",
    description:
      "Calm, Japanese-inspired hotel lobby with comfortable seating. Nobody will bother you if you order a drink.",
    price: "Free (buy a drink)",
    wifi: true,
    outlets: false,
    hours: "Lobby open 24/7",
    vibe: "Zen, quiet, elegant",
    address: "1625 Post St",
    tip: "The courtyard area is especially peaceful.",
  },
  {
    name: "1 Hotel San Francisco Lobby",
    type: "hotel-lobby",
    neighborhood: "Mission Bay",
    description:
      "Gorgeous nature-inspired lobby with ample seating, plants, and a calm atmosphere. Great for meetings.",
    price: "Free",
    wifi: true,
    outlets: false,
    hours: "Lobby open 24/7",
    vibe: "Modern, green, airy",
    address: "8 Mission St",
  },
  {
    name: "Proper Hotel Lobby",
    type: "hotel-lobby",
    neighborhood: "Mid-Market",
    description:
      "Beautifully designed lobby lounge with a cafe. Popular with tech workers for meetings.",
    price: "Free (buy a coffee)",
    wifi: true,
    outlets: false,
    hours: "Lobby open all day",
    vibe: "Chic, design-forward",
    address: "1100 Market St",
    tip: "The rooftop bar is great for after-work drinks too.",
  },
  {
    name: "The LINE SF Lobby",
    type: "hotel-lobby",
    neighborhood: "Tenderloin/Mid-Market",
    description:
      "Trendy hotel with a spacious ground-floor cafe/lobby. Good vibes for casual meetings.",
    price: "Free (buy a coffee)",
    wifi: true,
    outlets: false,
    hours: "Lobby open all day",
    vibe: "Trendy, artsy",
    address: "33 Turk St",
  },
  {
    name: "Palace Hotel Garden Court",
    type: "hotel-lobby",
    neighborhood: "Financial District",
    description:
      "Iconic glass-domed atrium from 1909. Free to walk in and sit. Old-money grandeur — feels like working inside a museum.",
    price: "Free",
    wifi: true,
    outlets: false,
    hours: "Lobby 24/7, Garden Court breakfast/lunch hours",
    vibe: "Historic, grand, palatial",
    address: "2 New Montgomery St",
    tip: "The Garden Court itself has restaurant tables — for free seating, use the lobby couches just outside.",
  },
  {
    name: "Hyatt Regency Embarcadero Atrium",
    type: "hotel-lobby",
    neighborhood: "Embarcadero",
    description:
      "Massive 17-story atrium with hanging vines and bay-window light. Tons of open seating, free wifi, no one asks questions.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Lobby open 24/7",
    vibe: "Iconic, spacious, retro-futurist",
    address: "5 Embarcadero Center",
    tip: "Best free-seating-to-square-footage ratio in SF. Used in The Towering Inferno.",
  },
  {
    name: "St. Regis SF Lobby",
    type: "hotel-lobby",
    neighborhood: "SoMa",
    description:
      "Quiet, posh lobby lounge. Plush couches, calm music, business crowd. Order tea and stay forever.",
    price: "Free (buy a drink)",
    wifi: true,
    outlets: false,
    hours: "Lobby open 24/7",
    vibe: "Luxurious, quiet, executive",
    address: "125 3rd St",
  },
  {
    name: "Fairmont San Francisco Lobby",
    type: "hotel-lobby",
    neighborhood: "Nob Hill",
    description:
      "Grand 1907 lobby on top of Nob Hill. Marble columns, gold trim, comfortable seating throughout.",
    price: "Free",
    wifi: true,
    outlets: false,
    hours: "Lobby open 24/7",
    vibe: "Old-school SF, grand",
    address: "950 Mason St",
    tip: "The Laurel Court bar has free wifi and afternoon couches.",
  },
  {
    name: "JW Marriott Union Square",
    type: "hotel-lobby",
    neighborhood: "Union Square",
    description:
      "Spacious modern lobby/lounge in Union Square. Free seating, plenty of outlets along the wall, business-friendly.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Lobby open 24/7",
    vibe: "Modern, business",
    address: "515 Mason St",
  },
  {
    name: "InterContinental SF Lobby",
    type: "hotel-lobby",
    neighborhood: "SoMa",
    description:
      "Modern lobby with comfortable lounge areas and floor-to-ceiling windows. Quiet during the day.",
    price: "Free (buy a coffee)",
    wifi: true,
    outlets: true,
    hours: "Lobby open 24/7",
    vibe: "Modern, business",
    address: "888 Howard St",
  },
  {
    name: "The Marker SF Lobby",
    type: "hotel-lobby",
    neighborhood: "Union Square",
    description:
      "Colorful, boutique-feel lobby near Union Square. Designer chairs, low-key vibe, no one bothers you.",
    price: "Free (buy a drink)",
    wifi: true,
    outlets: false,
    hours: "Lobby open 24/7",
    vibe: "Boutique, colorful, chill",
    address: "501 Geary St",
  },

  // Cafes great for working
  {
    name: "Capital One Cafe",
    type: ["free", "cafe"],
    neighborhood: "Union Square",
    description:
      "Free workspace, free wifi, and 50% off handcrafted drinks for Capital One cardholders (anyone can come in and work). Plenty of outlets and a community feel.",
    price: "Free",
    wifi: true,
    outlets: true,
    hours: "Mon-Fri 8am-7pm, Sat-Sun 9am-6pm",
    vibe: "Bright, modern, laptop-friendly",
    address: "101 Post St",
    url: "https://www.capitalone.com/local/san-francisco/",
    tip: "One of the best free work spots downtown — feels more like a coworking space than a bank.",
  },
  {
    name: "Equinox Sports Club San Francisco",
    type: "free",
    neighborhood: "Union Square",
    description:
      "Downtown Equinox with lounge seating where members can open a laptop between workouts. Useful as a quiet reset spot if you already have club access.",
    price: "Free for members / guest-pass visitors",
    wifi: true,
    outlets: true,
    hours: "Check current club hours",
    vibe: "Premium gym lounge, focused, clean",
    address: "747 Market St",
    url: "https://www.equinox.com/clubs/northern-california/sportsclubsanfrancisco",
    tip: "Not a public coworking space — best used as a member perk downtown.",
  },
  {
    name: "Blue Bottle - South Park",
    type: "cafe",
    neighborhood: "SoMa",
    description:
      "The original Blue Bottle spot in the tech-heavy South Park area. Iconic for startup meetings.",
    price: "$5-7/coffee",
    wifi: true,
    outlets: false,
    hours: "7am-5pm daily",
    vibe: "Classic tech scene",
    address: "315 Linden St",
    tip: "South Park is where tons of VCs and founders hang out.",
  },
  {
    name: "Sightglass Coffee - 20th St",
    type: "cafe",
    neighborhood: "Mission",
    description:
      "Spacious, industrial-chic cafe. The 20th St location is frequented by AI folks.",
    price: "$5-7/coffee",
    wifi: true,
    outlets: true,
    hours: "7am-5pm daily",
    vibe: "Industrial, spacious, AI crowd",
    address: "270 7th St",
    tip: "The 20th St location is where the AI people go.",
  },
  {
    name: "The Mill",
    type: "cafe",
    neighborhood: "NoPa",
    description:
      "Famous for $4 toast and great coffee. Lots of natural light and a long communal table.",
    price: "$5-7/coffee",
    wifi: true,
    outlets: true,
    hours: "7am-5pm daily",
    vibe: "Bright, communal, creative",
    address: "736 Divisadero St",
  },
  {
    name: "Ritual Coffee - Hayes Valley",
    type: "cafe",
    neighborhood: "Hayes Valley",
    description:
      "Open-air vibes. Outdoor seating with a great people-watching scene in the heart of Hayes.",
    price: "$5-6/coffee",
    wifi: true,
    outlets: false,
    hours: "7am-5pm daily",
    vibe: "Outdoor, social",
    address: "432B Octavia St",
    tip: "Mostly outdoor seating - great on sunny days.",
  },
  {
    name: "Cafe Reveille",
    type: "cafe",
    neighborhood: "Lower Haight",
    description:
      "Cozy neighborhood cafe with solid wifi and a good mix of locals and remote workers.",
    price: "$5-6/coffee",
    wifi: true,
    outlets: true,
    hours: "7am-5pm daily",
    vibe: "Cozy, neighborhood",
    address: "610 Long Oak St",
  },
  {
    name: "The Coffee Movement",
    type: "cafe",
    neighborhood: "Richmond",
    description:
      "Community-focused cafe in the Richmond. Less crowded than downtown spots.",
    price: "$4-6/coffee",
    wifi: true,
    outlets: true,
    hours: "7am-4pm daily",
    vibe: "Community, relaxed",
  },
  {
    name: "Flywheel Coffee",
    type: "cafe",
    neighborhood: "Upper Haight",
    description:
      "Great starting point for Golden Gate Park walking meetings. Cozy and laptop-friendly.",
    price: "$4-6/coffee",
    wifi: true,
    outlets: true,
    hours: "7am-5pm daily",
    vibe: "Chill, park-adjacent",
    address: "672 Stanyan St",
    tip: "Grab a coffee then walk through Golden Gate Park for a walking meeting.",
  },
  {
    name: "Equator Coffee - Fort Mason",
    type: "cafe",
    neighborhood: "Marina",
    description:
      "Waterfront location at Fort Mason with incredible views. Perfect pre-walk meeting coffee.",
    price: "$5-7/coffee",
    wifi: true,
    outlets: false,
    hours: "7am-5pm daily",
    vibe: "Scenic, waterfront",
    address: "2 Marina Blvd, Bldg C",
    tip: "Start here, then walk the Marina Green waterfront.",
  },
  {
    name: "Cafe Shoji",
    type: "cafe",
    neighborhood: "FiDi",
    description:
      "Japanese-inspired cafe in the Financial District. Calm atmosphere for focused work or meetings.",
    price: "$5-7/coffee",
    wifi: true,
    outlets: true,
    hours: "8am-4pm Mon-Fri",
    vibe: "Minimal, Japanese, calm",
  },
  {
    name: "La Boulangerie",
    type: "cafe",
    neighborhood: "Hayes Valley",
    description:
      "French bakery cafe where you'll run into founders and VCs on any given day.",
    price: "$5-8/coffee + pastry",
    wifi: true,
    outlets: false,
    hours: "7am-6pm daily",
    vibe: "French, social, tech scene",
    tip: "The unofficial meeting spot for Hayes Valley tech people.",
  },
  {
    name: "The Buoy",
    type: "cafe",
    neighborhood: "Hayes Valley",
    description:
      "Trendy spot in Hayes Valley. Good for casual meetings.",
    price: "$5-7/coffee",
    wifi: true,
    outlets: false,
    hours: "8am-5pm daily",
    vibe: "Trendy, social",
  },

  // POPOS (Privately-Owned Public Open Spaces — always free by law)
  {
    name: "Crocker Galleria Rooftop",
    type: "free",
    neighborhood: "Financial District",
    description:
      "Hidden rooftop terrace above the Crocker Galleria. Tables, planters, open-air seating, FiDi views. One of SF's best-kept POPOS secrets.",
    price: "Free",
    wifi: false,
    outlets: false,
    hours: "Mon-Fri ~7am-6pm (galleria hours)",
    vibe: "Hidden, breezy, FiDi rooftop",
    address: "50 Post St (3rd floor)",
    tip: "Take the escalator to the top floor, then look for the door to the terrace.",
  },
  {
    name: "100 Pine Street Terrace",
    type: "free",
    neighborhood: "Financial District",
    description:
      "Open-air sky terrace on the 4th floor with downtown views, tables, and benches. Free wifi from the city.",
    price: "Free",
    wifi: true,
    outlets: false,
    hours: "Mon-Fri ~7am-6pm",
    vibe: "Sunny, open-air, downtown",
    address: "100 Pine St (4th floor)",
  },
  {
    name: "343 Sansome Sun Terrace",
    type: "free",
    neighborhood: "Financial District",
    description:
      "15th-floor sun terrace with potted trees, tables, and 360° FiDi views. Take the elevator up — anyone is allowed.",
    price: "Free",
    wifi: false,
    outlets: false,
    hours: "Mon-Fri 9am-5pm",
    vibe: "Sky-high, peaceful, photogenic",
    address: "343 Sansome St (15th floor)",
    tip: "Bring a hat — there's no shade until midday.",
  },
  {
    name: "555 Mission Plaza",
    type: "free",
    neighborhood: "SoMa",
    description:
      "Outdoor sculpture plaza between two office towers. Movable tables and chairs, often a food truck at lunch.",
    price: "Free",
    wifi: false,
    outlets: false,
    hours: "Daily 6am-10pm",
    vibe: "Sculptural, sunny, busy at lunch",
    address: "555 Mission St",
  },
  {
    name: "One Bush Street Plaza",
    type: "free",
    neighborhood: "Financial District",
    description:
      "Quiet tree-lined plaza next to the iconic blue-glass building. Benches, shade, low foot traffic.",
    price: "Free",
    wifi: false,
    outlets: false,
    hours: "Daily 6am-8pm",
    vibe: "Calm, shaded, classic FiDi",
    address: "1 Bush St",
  },
  {
    name: "Citigroup Center Galleria",
    type: "free",
    neighborhood: "Financial District",
    description:
      "Indoor atrium with a glass roof, tables, and a food court. Climate-controlled FiDi workspace.",
    price: "Free",
    wifi: false,
    outlets: false,
    hours: "Mon-Fri 7am-7pm",
    vibe: "Indoor atrium, lunch crowd",
    address: "1 Sansome St",
  },
  {
    name: "Salesforce Park",
    type: "free",
    neighborhood: "SoMa",
    description:
      "5.4-acre rooftop park on top of the Salesforce Transit Center. Free wifi, benches, gardens, amphitheater. Free gondola from street level.",
    price: "Free",
    wifi: true,
    outlets: false,
    hours: "Daily 6am-8pm",
    vibe: "Rooftop oasis, gardens",
    address: "425 Mission St",
    url: "https://salesforcetransitcenter.com/park",
    tip: "The east-end amphitheater has shaded seating and the strongest wifi.",
  },
  {
    name: "Embarcadero Plaza (Justin Herman Plaza)",
    type: "free",
    neighborhood: "Embarcadero",
    description:
      "Waterfront plaza by the Ferry Building. Free city wifi, benches with bay views, food trucks at lunch.",
    price: "Free",
    wifi: true,
    outlets: false,
    hours: "24/7",
    vibe: "Bay views, breezy, lively",
    address: "1 Market St",
  },

  // Hackerspaces & community
  {
    name: "Noisebridge",
    type: "free",
    neighborhood: "Mission",
    description:
      "24/7 anarchist hackerspace. Donation-based, no membership required. 3D printers, electronics lab, classes, big communal table for laptop work.",
    price: "Free (donation suggested)",
    wifi: true,
    outlets: true,
    hours: "24/7",
    vibe: "DIY, weird, friendly",
    address: "272 Capp St",
    url: "https://www.noisebridge.net",
    tip: "Show up to an open house first to meet people. Then come and go whenever.",
  },
  {
    name: "Frontier Tower Lobby",
    type: "free",
    neighborhood: "Mid-Market",
    description:
      "Open lobby of the founder-heavy Frontier Tower at 995 Market. Frequently has events, often you can sit and work without being a member.",
    price: "Free",
    wifi: true,
    outlets: false,
    hours: "Daytime weekdays",
    vibe: "Startup energy, ambient meetings",
    address: "995 Market St",
    tip: "Check Luma for public events to time your visit with a meetup.",
  },
  {
    name: "SHACK15 at the Ferry Building",
    type: "free",
    neighborhood: "Embarcadero",
    description:
      "Members-only coworking on the second floor, but the Ferry Building marketplace below has free seating, wifi, and bay views. Often hosts free public SHACK15 events upstairs.",
    price: "Free (Ferry Building marketplace seating)",
    wifi: true,
    outlets: false,
    hours: "Ferry Building daily 7am-9pm",
    vibe: "Founder-heavy, bay views, foodie",
    address: "1 Ferry Building",
    url: "https://shack15.com",
    tip: "Sit at the bay-side counter — outlets along the floor.",
  },
];

const FILTERS: { value: WorkspaceType; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "" },
  { value: "free", label: "Free", icon: "🆓" },
  { value: "coworking", label: "Coworking", icon: "💻" },
  { value: "library", label: "Libraries", icon: "📚" },
  { value: "hotel-lobby", label: "Hotel Lobbies", icon: "🏨" },
  { value: "cafe", label: "Cafes", icon: "☕" },
];

function workspaceMatchesFilter(w: Workspace, filter: WorkspaceType): boolean {
  if (filter === "all") return true;
  if (filter === "free") {
    return w.price.toLowerCase().startsWith("free");
  }
  return Array.isArray(w.type) ? w.type.includes(filter) : w.type === filter;
}

export default function WorkspacesPage() {
  const [filter, setFilter] = useState<WorkspaceType>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return WORKSPACES.filter((w) => {
      const matchesType = workspaceMatchesFilter(w, filter);
      const matchesSearch =
        search === "" ||
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
        w.description.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filter, search]);

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
            <span className="text-muted text-xs">/ Workspaces</span>
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
            <span>💻</span> Free &amp; budget work spots
          </div>
          <h1
            className="text-3xl sm:text-4xl text-foreground mb-3 slide-up"
            style={{
              fontFamily: "var(--font-dm-serif)",
              animationDelay: "0.05s",
              animationFillMode: "both",
            }}
          >
            Work Spots
          </h1>
          <p
            className="text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed slide-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            Coworking spaces, libraries, hotel lobbies, and cafes where you can
            get work done in SF without breaking the bank.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search spots, neighborhoods..."
            className="flex-1 px-4 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === f.value
                    ? "bg-foreground text-white"
                    : "bg-white text-muted border border-border hover:border-foreground/20"
                }`}
              >
                {f.icon && <span>{f.icon}</span>} {f.label}
                {f.value === "all" ? (
                  <span className="ml-0.5 opacity-60">
                    ({WORKSPACES.length})
                  </span>
                ) : (
                  <span className="ml-0.5 opacity-60">
                    (
                    {
                      WORKSPACES.filter((w) =>
                        workspaceMatchesFilter(w, f.value),
                      ).length
                    }
                    )
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {filtered.map((workspace) => (
            <WorkspaceCard key={workspace.name} workspace={workspace} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm text-muted">No spots found</p>
          </div>
        )}

        <div className="text-center pt-10 text-xs text-muted">
          Know a great work spot?{" "}
          <Link href="/submit" className="text-accent hover:underline">
            Submit it
          </Link>
        </div>

        <div className="text-center pt-4 pb-2 text-[11px] text-muted">
          Spots sourced with help from{" "}
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

function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const typeColors: Record<string, { bg: string; text: string }> = {
    free: { bg: "bg-green-50", text: "text-green-700" },
    coworking: { bg: "bg-blue-50", text: "text-blue-700" },
    library: { bg: "bg-amber-50", text: "text-amber-700" },
    "hotel-lobby": { bg: "bg-purple-50", text: "text-purple-700" },
    cafe: { bg: "bg-orange-50", text: "text-orange-700" },
  };

  const typeLabels: Record<string, string> = {
    free: "Free Coworking",
    coworking: "Coworking",
    library: "Library",
    "hotel-lobby": "Hotel Lobby",
    cafe: "Cafe",
  };

  const primaryType = Array.isArray(workspace.type)
    ? workspace.type[0]
    : workspace.type;
  const colors = typeColors[primaryType] ?? {
    bg: "bg-gray-50",
    text: "text-gray-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-5 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground">
              {workspace.url ? (
                <a
                  href={workspace.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {workspace.name}
                  <span className="ml-1 text-[10px] opacity-40">&#8599;</span>
                </a>
              ) : (
                workspace.name
              )}
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.bg} ${colors.text}`}
            >
              {typeLabels[primaryType]}
            </span>
          </div>

          <p className="text-xs text-muted mb-2.5">{workspace.description}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted">
            <span>
              <span className="font-medium text-foreground">
                {workspace.neighborhood}
              </span>
            </span>
            <span>
              <span className="font-medium text-foreground">
                {workspace.price}
              </span>
            </span>
            {workspace.wifi && <span>Wifi</span>}
            {workspace.outlets && <span>Outlets</span>}
            <span>{workspace.hours}</span>
          </div>

          {workspace.tip && (
            <div className="mt-2.5 rounded-lg bg-accent-light/40 border border-accent/10 px-3 py-2">
              <p className="text-[11px] text-accent-dark">
                <span className="font-semibold">Tip:</span> {workspace.tip}
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 text-right">
          <span className="text-xs font-medium text-muted italic">
            {workspace.vibe}
          </span>
        </div>
      </div>
    </div>
  );
}
