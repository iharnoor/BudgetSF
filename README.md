# BudgetSF

**Community-curated cheap spots in San Francisco.**

Find the best budget-friendly food, groceries, gyms, coffee, and bars in SF — all recommended and approved by locals.

**Live at [budgetsf.vercel.app](https://budgetsf.vercel.app)**

## What it does

BudgetSF is an open-source, map-first web app where locals share their favorite affordable spots in San Francisco. Think of it as a community-driven Yelp, but only for cheap gems.

- Browse 55+ verified budget spots on an interactive map
- Semantic search powered by [HydraDB](https://hydradb.com) — search "cheap burritos near Mission" and get real results
- Filter by category: food, grocery, gym, bars, coffee
- Anyone can submit a new spot
- Community voting: 5 approvals and a spot goes live on the map

## How it works

```
User submits a spot → Community votes → 5 approvals → Live on the map
```

Every spot is fact-checked and community-approved. No ads, no sponsored listings.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + Tailwind CSS |
| Map | Leaflet with Stamen/OSM tiles |
| Search | [HydraDB](https://hydradb.com) Full Recall API (semantic search) |
| Auth | Auth.js v5 (Google OAuth) |
| Hosting | Vercel |
| Typography | DM Serif Display + Geist |

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Map view (home)
│   │   ├── spots/page.tsx        # Grid list view
│   │   ├── submit/page.tsx       # Add a new spot
│   │   ├── pending/page.tsx      # Vote on pending spots
│   │   ├── place/[id]/page.tsx   # Spot detail page
│   │   ├── login/page.tsx        # Google sign-in
│   │   └── api/
│   │       ├── search/route.ts   # HydraDB semantic search
│   │       ├── submit/route.ts   # Venue ingestion
│   │       └── auth/[...nextauth]/route.ts
│   ├── components/               # Header, Map, PlaceCard, etc.
│   └── lib/
│       ├── hydradb.ts            # HydraDB API client
│       ├── sample-data.ts        # 55 verified SF venues
│       ├── types.ts              # TypeScript interfaces
│       ├── format.ts             # Price formatting
│       └── sanitize.ts           # XSS protection
├── scripts/
│   └── ingest-venues-hydradb.mjs # Bulk venue ingestion script
```

## Categories

| Category | Examples |
|----------|---------|
| Food | La Taqueria, Saigon Sandwich, Golden Boy Pizza, San Tung |
| Grocery | Trader Joe's, Grocery Outlet, Costco, Duc Loi |
| Gym | 24 Hour Fitness, Crunch, YMCA, SF Rec & Park (free) |
| Bars | Li Po Lounge, Toronado, The 500 Club |
| Coffee | Philz, Blue Bottle, Ritual, Sightglass, Andytown |

## Setup

```bash
cd web
npm install
```

Create `.env.local`:
```
HYDRADB_API_KEY=your_key
HYDRADB_TENANT_ID=your_tenant
AUTH_SECRET=your_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
```

```bash
npm run dev
```

## Ingesting venues to HydraDB

```bash
HYDRADB_API_KEY=your_key node scripts/ingest-venues-hydradb.mjs
```

## Security

- All API keys stored in environment variables (never in code)
- Rate limiting on all API routes (60 searches/min, 10 submissions/hour)
- Input validation with length/type/range checks
- XSS protection via HTML escaping in map popups
- CSP, HSTS, X-Frame-Options security headers
- Git history scrubbed of any previously committed secrets

## Contributing

Know a cheap spot in SF? Two ways to help:

1. **Add it on the site** — go to [budgetsf.vercel.app/submit](https://budgetsf.vercel.app/submit)
2. **Open a PR** — add venues to `web/src/lib/sample-data.ts`

## License

MIT
