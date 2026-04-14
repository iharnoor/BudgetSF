# BudgetSF

**The guide to San Francisco I wish I had when I moved here.**

---

## The Problem

I moved to SF to build a startup. What nobody told me is how fast this city drains your bank account.

- **$18** for a lunch salad
- **$130/month** for a gym membership
- **$2,400+** for a studio apartment
- **$35** for an Uber that was $10 five minutes ago
- **$7** for a coffee

I'd sit in my overpriced apartment eating $15 delivery burritos, wondering why nobody had just... mapped out where the cheap stuff is. Every "budget SF" guide I found was written by someone who thinks $22 ramen is affordable.

So I built the guide myself.

## What This Is

[BudgetSF](https://budgetsf.com) is a map-first web app with **144+ community-curated spots** across San Francisco — cheap eats, affordable gyms, free coworking, budget groceries, and more. Everything on the site is either something I personally use or something the community voted in.

**It's not a review site.** It's a survival guide.

### What's Inside

- **Interactive Map** — Every spot pinned, color-coded by category, searchable. "Near Me" finds what's closest.
- **Budget Diet** — My actual meal plan. $7.25/day, ~$250/month. Costco runs, protein breakdowns, the whole thing.
- **Free Things** — 60+ free activities. Museum free days, parks, trails. SF gives away a lot if you know where to look.
- **Getting Around** — Robotaxis, Bay Wheels ($20/mo unlimited e-bikes), BART to SFO for $10 instead of a $45 Uber.
- **Work Spots** — Free and cheap places to work from. Libraries, cafe-offices, hotel lobbies nobody kicks you out of.
- **Events & Community** — Who to follow, where to find events, 15+ recurring communities for founders/engineers.
- **My Picks** — The actual products I use. $25/mo unlimited hotspot, the credit card that nets $0/year, neighborhoods ranked by rent.
- **Community Voting** — Anyone can submit a spot. 5 community approvals and it goes live on the map.

## Why Open Source

Because this should've existed years ago and it shouldn't be behind a paywall. If you know a cheap spot, add it. If you just moved to SF, use it.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Leaflet** for maps
- **HydraDB** for semantic search
- **Clerk** for auth
- **Tailwind CSS 4**
- Deployed on **Vercel**

## Run It Locally

```bash
git clone https://github.com/iharnoor/BudgetSF.git
cd BudgetSF
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Contribute

Know a cheap spot? Two ways:

1. **On the site** — Go to the Community page, sign in, submit it. Community votes it in.
2. **In the code** — PRs welcome. Add spots to `src/lib/sample-data.ts`, build features, fix bugs.

## License

MIT

---

*Built by [@iharnoor](https://github.com/iharnoor) in SF, on a budget.*
