# SF Alternatives: Normalized Venue-Based Data Structure
## Problem with Current Approach
The current `merchant_alternatives` table stores alternatives as a JSONB blob per merchant. This means:
* **Duplication**: La Taqueria is copy-pasted into every Mexican chain's alternatives. Costco appears in 4+ entries.
* **No queryability**: Can't ask "show me all places under $10 in the Mission" or "all boba shops sorted by price"
* **Update nightmare**: If a venue closes or changes address, you hunt through JSON blobs
* **No venue graph**: Can't build the Discover tab properly — it's just flat lists
## Proposed Schema: 3 Normalized Tables
### 1. `sf_venues` — Every place that matters
The single source of truth for any business in SF. Both the expensive places AND the cheap alternatives live here.
```warp-runnable-command
sf_venues (
  id              uuid PK,
  name            text NOT NULL,
  slug            text UNIQUE NOT NULL,     -- url-safe lowercase: "la-taqueria"
  category        text NOT NULL,            -- food, groceries, delivery, fitness, etc.
  subcategory     text,                     -- mexican, coffee, boba, etc.
  neighborhood    text,                     -- Mission, SoMa, Chinatown, etc.
  address         text,
  lat             double precision,
  lng             double precision,
  price_tier      int NOT NULL DEFAULT 2,   -- 1=$, 2=$$, 3=$$$, 4=$$$$
  avg_price       text,                     -- "$5-6" or "$12-16"
  tags            text[] DEFAULT '{}',      -- {cash_only, late_night, local_icon}
  is_chain        boolean DEFAULT false,
  google_place_id text,                     -- for future Maps integration
  description     text,                     -- one-liner: "Legendary SF burrito spot since 1969"
  city            text DEFAULT 'San Francisco',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
)
```
No RLS — this is shared public data.
### 2. `venue_alternatives` — The relationship map
Maps "if you spent money at X, try Y instead." This is the core of the product.
```warp-runnable-command
venue_alternatives (
  id                  uuid PK,
  expensive_venue_id  uuid FK -> sf_venues,  -- the place they went
  cheaper_venue_id    uuid FK -> sf_venues,  -- what we recommend
  estimated_savings   text,                  -- "30-40% cheaper"
  reason              text,                  -- "Bigger portions, cash-only icon"
  sort_order          int DEFAULT 0,         -- best alternative first
  UNIQUE(expensive_venue_id, cheaper_venue_id)
)
```
### 3. `merchant_aliases` — Bank statement → venue lookup
Same as before but now points to `sf_venues.slug` instead of a string.
```warp-runnable-command
merchant_aliases (
  id              uuid PK,
  alias_pattern   text NOT NULL,        -- "chipotle mexican grill", "sq *salt"
  venue_slug      text FK -> sf_venues(slug),
  city            text DEFAULT 'San Francisco'
)
```
## Why This is Better
* **One venue, one row**: Update La Taqueria's address once → propagates everywhere
* **Queryable**: `SELECT * FROM sf_venues WHERE subcategory = 'mexican' AND price_tier = 1 AND neighborhood = 'Mission'`
* **Venue can be both**: Trader Joe's is an alternative to Whole Foods AND a merchant people spend at (with its own alternatives like Grocery Outlet)
* **Discovery tab**: Query by neighborhood, price tier, category — no more flat JSON
* **Maps-ready**: lat/lng + google_place_id for future "show on map" feature
* **Multi-city ready**: Just change `city` filter
## Migration Plan
1. Drop the old `merchant_alternatives` table (it has no production data yet)
2. Create `sf_venues`, `venue_alternatives`, update `merchant_aliases`
3. Seed with all the same data from migration 006, but normalized
4. Update `find-alternatives` edge function to JOIN these tables
