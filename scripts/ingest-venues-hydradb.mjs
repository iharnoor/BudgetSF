#!/usr/bin/env node

/**
 * Ingest SF venue data into HydraDB for semantic search.
 *
 * Usage:
 *   node scripts/ingest-venues-hydradb.mjs
 *
 * Uses /ingestion/upload_knowledge with app_sources for structured data.
 */

const API_KEY = process.env.HYDRADB_API_KEY;
if (!API_KEY) {
  console.error("Missing HYDRADB_API_KEY env var. Run with: HYDRADB_API_KEY=your_key node scripts/ingest-venues-hydradb.mjs");
  process.exit(1);
}
const TENANT_ID = process.env.HYDRADB_TENANT_ID || "WealthWise";
const SUB_TENANT_ID = "sf_venues";
const BASE_URL = "https://api.hydradb.com";

// Verified venues — fact-checked April 2026. Closed venues removed.
const venues = [
  // === FOOD: Mexican ===
  { name: "La Taqueria", slug: "la-taqueria", category: "food", subcategory: "mexican", neighborhood: "Mission", address: "2889 Mission St", price_tier: 1, avg_price: "$10-12", tags: ["cash_only", "local_icon", "burritos"], is_chain: false, description: "Legendary SF burrito, James Beard winner", lat: 37.7509, lng: -122.4181 },
  { name: "El Farolito", slug: "el-farolito", category: "food", subcategory: "mexican", neighborhood: "Mission", address: "2779 Mission St", price_tier: 1, avg_price: "$10-12", tags: ["late_night", "burritos", "local_icon"], is_chain: false, description: "Giant super burritos, open late", lat: 37.7525, lng: -122.4183 },
  { name: "Taqueria Cancun", slug: "taqueria-cancun", category: "food", subcategory: "mexican", neighborhood: "Mission", address: "2288 Mission St", price_tier: 1, avg_price: "$9-11", tags: ["burritos", "fast_service"], is_chain: false, description: "Huge burritos under $11", lat: 37.7583, lng: -122.4191 },
  { name: "Taqueria El Buen Sabor", slug: "taqueria-el-buen-sabor", category: "food", subcategory: "mexican", neighborhood: "Mission", address: "699 Valencia St", price_tier: 1, avg_price: "$8-10", tags: ["burritos", "authentic"], is_chain: false, description: "Under $10 burritos, authentic", lat: 37.7604, lng: -122.4216 },
  // === FOOD: Mediterranean ===
  { name: "Truly Mediterranean", slug: "truly-mediterranean", category: "food", subcategory: "mediterranean", neighborhood: "Mission", address: "3109 16th St", price_tier: 1, avg_price: "$8-10", tags: ["falafel", "byob"], is_chain: false, description: "Best falafel in the city under $10", lat: 37.7649, lng: -122.4194 },
  { name: "Old Jerusalem", slug: "old-jerusalem", category: "food", subcategory: "mediterranean", neighborhood: "Mission", address: "2976 Mission St", price_tier: 1, avg_price: "$10-14", tags: ["middle_eastern", "family_run"], is_chain: false, description: "Authentic Middle Eastern, huge portions", lat: 37.7530, lng: -122.4180 },
  { name: "Sunrise Deli", slug: "sunrise-deli", category: "food", subcategory: "mediterranean", neighborhood: "Sunset", address: "2115 Irving St", price_tier: 1, avg_price: "$10-12", tags: ["shawarma", "neighborhood_gem"], is_chain: false, description: "Massive shawarma plates", lat: 37.7637, lng: -122.4680 },
  // === FOOD: Vietnamese ===
  { name: "Saigon Sandwich", slug: "saigon-sandwich", category: "food", subcategory: "vietnamese", neighborhood: "Tenderloin", address: "560 Larkin St", price_tier: 1, avg_price: "$5-6", tags: ["cash_only", "local_icon", "banh_mi"], is_chain: false, description: "Best banh mi in SF, legendary $5", lat: 37.7833, lng: -122.4170 },
  { name: "Turtle Tower", slug: "turtle-tower", category: "food", subcategory: "vietnamese", neighborhood: "Tenderloin", address: "645 Larkin St", price_tier: 1, avg_price: "$12-14", tags: ["pho", "authentic"], is_chain: false, description: "Authentic Northern Vietnamese pho", lat: 37.7843, lng: -122.4166 },
  { name: "Pho 2000", slug: "pho-2000", category: "food", subcategory: "vietnamese", neighborhood: "Tenderloin", address: "637 Larkin St", price_tier: 1, avg_price: "$11-13", tags: ["pho", "quick_service"], is_chain: false, description: "Generous pho bowls", lat: 37.7840, lng: -122.4167 },
  { name: "Hai Ky Mi Gia", slug: "hai-ky-mi-gia", category: "food", subcategory: "vietnamese", neighborhood: "Tenderloin", address: "707 Ellis St", price_tier: 1, avg_price: "$9-11", tags: ["noodles", "authentic"], is_chain: false, description: "Dry egg noodles, authentic Vietnamese-Chinese", lat: 37.7830, lng: -122.4152 },
  { name: "Bun Mee", slug: "bun-mee", category: "food", subcategory: "vietnamese", neighborhood: "Tenderloin", address: "674 Geary St", price_tier: 1, avg_price: "$9-11", tags: ["banh_mi", "modern"], is_chain: false, description: "Modern banh mi, great combos", lat: 37.7862, lng: -122.4138 },
  // === FOOD: Chinese ===
  { name: "Good Mong Kok", slug: "good-mong-kok", category: "food", subcategory: "chinese", neighborhood: "Chinatown", address: "1039 Stockton St", price_tier: 1, avg_price: "$3-5", tags: ["dim_sum", "cash_only", "bakery"], is_chain: false, description: "Dim sum to-go, $3-5 boxes", lat: 37.7948, lng: -122.4093 },
  { name: "Yin Du Wonton", slug: "yin-du-wonton", category: "food", subcategory: "chinese", neighborhood: "Chinatown", address: "731 Vallejo St", price_tier: 1, avg_price: "$8-10", tags: ["noodles", "wonton"], is_chain: false, description: "Hand-pulled noodles and wontons", lat: 37.7979, lng: -122.4092 },
  { name: "San Tung", slug: "san-tung", category: "food", subcategory: "chinese", neighborhood: "Sunset", address: "1031 Irving St", price_tier: 1, avg_price: "$10-14", tags: ["dry_fried_chicken_wings", "noodles"], is_chain: false, description: "Famous dry fried chicken wings", lat: 37.7637, lng: -122.4680 },
  { name: "AA Bakery & Cafe", slug: "aa-bakery", category: "food", subcategory: "chinese", neighborhood: "Chinatown", address: "1068 Stockton St", price_tier: 1, avg_price: "$2-5", tags: ["bakery", "egg_tarts", "bbq_pork_buns"], is_chain: false, description: "Egg tarts $1.50, pork buns $2, no frills", lat: 37.7953, lng: -122.4094 },
  { name: "Delicious Dim Sum", slug: "delicious-dim-sum", category: "food", subcategory: "chinese", neighborhood: "Chinatown", address: "752 Jackson St", price_tier: 1, avg_price: "$3-6", tags: ["dim_sum", "to_go", "cash_only"], is_chain: false, description: "Pork buns & shrimp dumplings $3-6, always a line", lat: 37.7963, lng: -122.4074 },
  { name: "House of Pancakes", slug: "house-of-pancakes", category: "food", subcategory: "chinese", neighborhood: "Chinatown", address: "635 Jackson St", price_tier: 1, avg_price: "$4-8", tags: ["scallion_pancakes", "dumplings", "cash_only"], is_chain: false, description: "Scallion pancakes $4, pot stickers $6", lat: 37.7959, lng: -122.4065 },
  { name: "Kingdom of Dumpling", slug: "kingdom-of-dumpling", category: "food", subcategory: "chinese", neighborhood: "Sunset", address: "1713 Taraval St", price_tier: 1, avg_price: "$8-12", tags: ["dumplings", "xlb"], is_chain: false, description: "XLB and dumplings, Sunset favorite", lat: 37.7432, lng: -122.4831 },
  // === FOOD: Other cuisines ===
  { name: "Senor Sisig", slug: "senor-sisig", category: "food", subcategory: "filipino", neighborhood: "SoMa", address: "Food trucks citywide", price_tier: 1, avg_price: "$10-12", tags: ["food_truck", "bowls", "fusion"], is_chain: false, description: "Filipino fusion bowls, unique SF flavor", lat: 37.7620, lng: -122.4200 },
  { name: "Mandalay Restaurant", slug: "mandalay-restaurant", category: "food", subcategory: "burmese", neighborhood: "Richmond", address: "4348 California St", price_tier: 1, avg_price: "$10-13", tags: ["burmese", "tea_leaf_salad"], is_chain: false, description: "Tea leaf salad $10, unique Burmese food", lat: 37.7858, lng: -122.4629 },
  { name: "Pakwan", slug: "pakwan", category: "food", subcategory: "indian", neighborhood: "Mission", address: "3182 16th St", price_tier: 1, avg_price: "$8-12", tags: ["pakistani", "biryani", "naan"], is_chain: false, description: "Massive biryani plates under $12, BYOB", lat: 37.7651, lng: -122.4234 },
  { name: "Udupi Palace", slug: "udupi-palace", category: "food", subcategory: "indian", neighborhood: "Valencia", address: "1007 Valencia St", price_tier: 1, avg_price: "$10-14", tags: ["south_indian", "dosa", "vegetarian"], is_chain: false, description: "Giant dosas $10-12, all vegetarian", lat: 37.7561, lng: -122.4210 },
  { name: "Naan N Curry", slug: "naan-n-curry", category: "food", subcategory: "indian", neighborhood: "Tenderloin", address: "336 O'Farrell St", price_tier: 1, avg_price: "$8-12", tags: ["late_night", "naan", "curry"], is_chain: false, description: "Cheap curry and naan, open super late", lat: 37.7860, lng: -122.4107 },
  { name: "Lers Ros Thai", slug: "lers-ros", category: "food", subcategory: "thai", neighborhood: "Tenderloin", address: "730 Larkin St", price_tier: 1, avg_price: "$10-14", tags: ["thai", "spicy", "authentic"], is_chain: false, description: "Best authentic Thai in SF, big portions", lat: 37.7831, lng: -122.4175 },
  // === FOOD: Pizza ===
  { name: "Costco Pizza", slug: "costco-pizza", category: "food", subcategory: "pizza", neighborhood: "SoMa", address: "450 10th St", price_tier: 1, avg_price: "$2-10", tags: ["bulk", "value"], is_chain: true, description: "$1.99 slice, $9.95 whole pizza", lat: 37.7700, lng: -122.4050 },
  { name: "Arinell Pizza", slug: "arinell-pizza", category: "food", subcategory: "pizza", neighborhood: "Mission", address: "509 Valencia St", price_tier: 1, avg_price: "$4-6", tags: ["ny_style", "cash_friendly"], is_chain: false, description: "Legit NY-style slices, $4-5 a slice", lat: 37.7621, lng: -122.4220 },
  { name: "Golden Boy Pizza", slug: "golden-boy-pizza", category: "food", subcategory: "pizza", neighborhood: "North Beach", address: "542 Green St", price_tier: 1, avg_price: "$4-6", tags: ["focaccia_style", "local_icon"], is_chain: false, description: "Thick focaccia-style, legendary late night", lat: 37.7997, lng: -122.4074 },
  // === FOOD: Other ===
  { name: "Grubstake", slug: "grubstake", category: "food", subcategory: "late night", neighborhood: "Polk Gulch", address: "1525 Pine St", price_tier: 1, avg_price: "$10-14", tags: ["late_night", "portuguese", "burgers"], is_chain: false, description: "Late-night burgers in a converted train car", lat: 37.7887, lng: -122.4207 },
  { name: "Ike's Love & Sandwiches", slug: "ikes-sandwiches", category: "food", subcategory: "sandwiches", neighborhood: "SoMa", address: "Multiple SF locations", price_tier: 1, avg_price: "$10-13", tags: ["sandwiches", "dutch_crunch", "local"], is_chain: false, description: "Dutch crunch sandwiches, massive portions", lat: 37.7749, lng: -122.4194 },
  // === GROCERY ===
  { name: "Grocery Outlet", slug: "grocery-outlet", category: "groceries", subcategory: "supermarket", neighborhood: "Mission", address: "Multiple SF locations", price_tier: 1, avg_price: "$", tags: ["bargain", "treasure_hunt"], is_chain: true, description: "40-60% off retail, name brands", lat: 37.7700, lng: -122.4250 },
  { name: "Costco", slug: "costco-sf", category: "groceries", subcategory: "warehouse", neighborhood: "SoMa", address: "450 10th St", price_tier: 1, avg_price: "$", tags: ["bulk", "membership"], is_chain: true, description: "In-city Costco, bulk + $5 rotisserie", lat: 37.7700, lng: -122.4050 },
  { name: "Smart & Final", slug: "smart-and-final", category: "groceries", subcategory: "supermarket", neighborhood: "Mission", address: "1245 South Van Ness", price_tier: 1, avg_price: "$", tags: ["bulk", "no_membership"], is_chain: true, description: "Bulk pricing, no membership needed", lat: 37.7565, lng: -122.4165 },
  { name: "Duc Loi Supermarket", slug: "duc-loi", category: "groceries", subcategory: "supermarket", neighborhood: "Mission", address: "2200 Mission St", price_tier: 1, avg_price: "$", tags: ["asian_produce", "fresh"], is_chain: false, description: "Amazing produce prices", lat: 37.7583, lng: -122.4191 },
  { name: "Trader Joe's", slug: "trader-joes", category: "groceries", subcategory: "supermarket", neighborhood: "North Beach", address: "Multiple SF locations", price_tier: 1, avg_price: "$-$$", tags: ["value", "private_label"], is_chain: true, description: "Great private-label products, good prices", lat: 37.7750, lng: -122.4200 },
  { name: "Safeway", slug: "safeway", category: "groceries", subcategory: "supermarket", neighborhood: "Marina", address: "Multiple SF locations", price_tier: 2, avg_price: "$$", tags: ["chain", "rewards_program", "pharmacy"], is_chain: true, description: "Widespread in SF, Club Card deals + gas rewards", lat: 37.7645, lng: -122.4320 },
  // === BARS ===
  { name: "Li Po Lounge", slug: "li-po-lounge", category: "bars", subcategory: "dive bar", neighborhood: "Chinatown", address: "916 Grant Ave", price_tier: 1, avg_price: "$5-8", tags: ["dive_bar", "chinese_mai_tai"], is_chain: false, description: "Iconic dive, famous Chinese Mai Tai", lat: 37.7940, lng: -122.4076 },
  { name: "The 500 Club", slug: "the-500-club", category: "bars", subcategory: "dive bar", neighborhood: "Mission", address: "500 Guerrero St", price_tier: 1, avg_price: "$5-8", tags: ["dive_bar", "pool_table"], is_chain: false, description: "Classic Mission dive, cheap wells", lat: 37.7649, lng: -122.4236 },
  { name: "Toronado", slug: "toronado", category: "bars", subcategory: "beer bar", neighborhood: "Lower Haight", address: "547 Haight St", price_tier: 1, avg_price: "$6-9", tags: ["craft_beer", "local_icon"], is_chain: false, description: "50+ craft beers on tap, SF institution", lat: 37.7719, lng: -122.4296 },
  // === GYM & FITNESS (updated) ===
  { name: "24 Hour Fitness - North Beach", slug: "24-fitness-north-beach", category: "fitness", subcategory: "full gym", neighborhood: "North Beach", address: "350 Bay St", price_tier: 2, avg_price: "~$35/mo", tags: ["24_7", "classes", "cardio", "weights"], is_chain: true, description: "24/7 access, cardio, weights, group classes", lat: 37.8058, lng: -122.4148 },
  { name: "24 Hour Fitness - Fillmore", slug: "24-fitness-fillmore", category: "fitness", subcategory: "full gym", neighborhood: "Nob Hill", address: "1200 Van Ness Ave", price_tier: 2, avg_price: "~$40/mo", tags: ["pool", "basketball", "sauna", "24_7"], is_chain: true, description: "Super Sport with pool, basketball court, and sauna", lat: 37.7870, lng: -122.4213 },
  { name: "24 Hour Fitness - Market St", slug: "24-fitness-market", category: "fitness", subcategory: "full gym", neighborhood: "SoMa", address: "100 14th St", price_tier: 2, avg_price: "~$35/mo", tags: ["near_bart", "cardio", "weights"], is_chain: true, description: "Convenient Market St location near BART", lat: 37.7678, lng: -122.4167 },
  { name: "Crunch Fitness", slug: "crunch-fitness", category: "fitness", subcategory: "full gym", neighborhood: "SoMa", address: "61 New Montgomery St", price_tier: 1, avg_price: "~$30/mo", tags: ["budget", "classes", "downtown"], is_chain: true, description: "Budget-friendly full gym with group classes", lat: 37.7878, lng: -122.4013 },
  { name: "YMCA - Embarcadero", slug: "ymca-embarcadero", category: "fitness", subcategory: "full gym", neighborhood: "SoMa", address: "169 Steuart St", price_tier: 2, avg_price: "~$45/mo", tags: ["pool", "sliding_scale", "classes"], is_chain: false, description: "Full gym with pool, sliding-scale pricing available", lat: 37.7921, lng: -122.3923 },
  { name: "SF Rec & Park Centers", slug: "sf-rec-gyms", category: "fitness", subcategory: "public gym", neighborhood: "SF-wide", address: "Multiple city rec centers", price_tier: 1, avg_price: "Free-$5", tags: ["public", "free", "low_cost"], is_chain: false, description: "City-run rec centers with fitness rooms, free or very low-cost", lat: 37.7694, lng: -122.4262 },
  { name: "Marina Green Fitness Court", slug: "marina-fitness", category: "fitness", subcategory: "outdoor", neighborhood: "Marina", address: "Marina Blvd & Scott St", price_tier: 1, avg_price: "Free", tags: ["outdoor", "free", "bay_views", "bodyweight"], is_chain: false, description: "Free outdoor fitness court with pull-up bars, stations, and bay views", lat: 37.8065, lng: -122.4382 },
];

/**
 * Convert a venue object to an HydraDB app_source.
 * The `content.text` field contains the full venue JSON for parsing on recall,
 * plus a human-readable description for better semantic matching.
 */
function venueToAppSource(venue) {
  const readable = [
    `${venue.name} — ${venue.subcategory || venue.category} in ${venue.neighborhood || "San Francisco"}`,
    venue.description,
    `Price: ${venue.avg_price}`,
    `Address: ${venue.address}`,
    venue.tags ? `Tags: ${venue.tags.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join(". ");

  return {
    id: venue.slug,
    tenant_id: TENANT_ID,
    sub_tenant_id: SUB_TENANT_ID,
    title: venue.name,
    source: "wealthlens",
    description: `${venue.category}/${venue.subcategory || "general"} venue in ${venue.neighborhood || "SF"}`,
    content: {
      text: `${readable}\n\n---JSON---\n${JSON.stringify(venue)}`,
    },
    metadata: {
      category: venue.category,
      subcategory: venue.subcategory || "",
      neighborhood: venue.neighborhood || "",
      price_tier: String(venue.price_tier),
    },
  };
}

async function ingest(batch) {
  const formData = new FormData();
  formData.append("tenant_id", TENANT_ID);
  formData.append("sub_tenant_id", SUB_TENANT_ID);
  formData.append("app_sources", JSON.stringify(batch));

  const res = await fetch(`${BASE_URL}/ingestion/upload_knowledge`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    body: formData,
  });
  const body = await res.text();
  return { status: res.status, body };
}

async function main() {
  console.log(`Ingesting ${venues.length} venues into HydraDB...`);
  console.log(`Tenant: ${TENANT_ID}, Sub-tenant: ${SUB_TENANT_ID}\n`);

  const appSources = venues.map(venueToAppSource);

  // Upload in batches of 10
  const BATCH_SIZE = 10;
  let total = 0;
  for (let i = 0; i < appSources.length; i += BATCH_SIZE) {
    const batch = appSources.slice(i, i + BATCH_SIZE);
    const names = batch.map((s) => s.title).join(", ");
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${names}`);

    const { status, body } = await ingest(batch);
    if (status >= 200 && status < 300) {
      const parsed = JSON.parse(body);
      console.log(
        `  OK (${status}) — success: ${parsed.success_count ?? "?"}, failed: ${parsed.failed_count ?? 0}`,
      );
      total += batch.length;
    } else {
      console.log(`  FAIL (${status}): ${body.substring(0, 200)}`);
    }

    // Small delay between batches
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\nIngested ${total}/${venues.length} venues.`);

  // Wait for processing
  console.log("\nWaiting 5s for indexing...");
  await new Promise((r) => setTimeout(r, 5000));

  // Test search
  console.log("Testing full_recall for 'cheap burritos near Mission'...");
  const searchRes = await fetch(`${BASE_URL}/recall/full_recall`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tenant_id: TENANT_ID,
      sub_tenant_id: SUB_TENANT_ID,
      query: "cheap burritos near Mission",
      max_results: 5,
      mode: "fast",
      alpha: 0.8,
      recency_bias: 0,
    }),
  });
  const searchData = await searchRes.json();
  console.log(`  Status: ${searchRes.status}`);
  console.log(`  Chunks: ${searchData.chunks?.length ?? 0}`);
  if (searchData.chunks?.length) {
    for (const chunk of searchData.chunks.slice(0, 5)) {
      const title = chunk.source_title || "?";
      const score = chunk.relevancy_score?.toFixed(3) || "?";
      const preview = chunk.chunk_content?.substring(0, 100) || "";
      console.log(`    [${score}] ${title}: ${preview}...`);
    }
  }
}

main().catch(console.error);
