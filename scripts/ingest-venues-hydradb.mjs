#!/usr/bin/env node

/**
 * Ingest SF venue data into HydraDB for semantic search.
 *
 * Usage:
 *   node scripts/ingest-venues-hydradb.mjs
 *
 * Uses /ingestion/upload_knowledge with app_sources for structured data.
 */

const API_KEY =
  process.env.HYDRADB_API_KEY ||
  "REDACTED";
const TENANT_ID = process.env.HYDRADB_TENANT_ID || "WealthWise";
const SUB_TENANT_ID = "sf_venues";
const BASE_URL = "https://api.hydradb.com";

const venues = [
  { name: "La Taqueria", slug: "la-taqueria", category: "food", subcategory: "mexican", neighborhood: "Mission", address: "2889 Mission St", price_tier: 1, avg_price: "$10-12", tags: ["cash_only", "local_icon", "burritos"], is_chain: false, description: "Legendary SF burrito, James Beard winner", lat: 37.7509, lng: -122.4181 },
  { name: "El Farolito", slug: "el-farolito", category: "food", subcategory: "mexican", neighborhood: "Mission", address: "2779 Mission St", price_tier: 1, avg_price: "$10-12", tags: ["late_night", "burritos", "local_icon"], is_chain: false, description: "Giant super burritos, open late", lat: 37.7525, lng: -122.4183 },
  { name: "Taqueria Cancun", slug: "taqueria-cancun", category: "food", subcategory: "mexican", neighborhood: "Mission", address: "2288 Mission St", price_tier: 1, avg_price: "$9-11", tags: ["burritos", "fast_service"], is_chain: false, description: "Huge burritos under $11", lat: 37.7583, lng: -122.4191 },
  { name: "Taqueria El Buen Sabor", slug: "taqueria-el-buen-sabor", category: "food", subcategory: "mexican", neighborhood: "Mission", address: "699 Valencia St", price_tier: 1, avg_price: "$8-10", tags: ["burritos", "authentic"], is_chain: false, description: "Under $10 burritos, authentic", lat: 37.7604, lng: -122.4216 },
  { name: "Truly Mediterranean", slug: "truly-mediterranean", category: "food", subcategory: "mediterranean", neighborhood: "Mission", address: "3109 16th St", price_tier: 1, avg_price: "$8-10", tags: ["falafel", "byob"], is_chain: false, description: "Best falafel in the city under $10", lat: 37.7649, lng: -122.4194 },
  { name: "Old Jerusalem", slug: "old-jerusalem", category: "food", subcategory: "mediterranean", neighborhood: "Mission", address: "2976 Mission St", price_tier: 1, avg_price: "$10-14", tags: ["middle_eastern", "family_run"], is_chain: false, description: "Authentic Middle Eastern, huge portions", lat: 37.7530, lng: -122.4180 },
  { name: "Sunrise Deli", slug: "sunrise-deli", category: "food", subcategory: "mediterranean", neighborhood: "Sunset", address: "2115 Irving St", price_tier: 1, avg_price: "$10-12", tags: ["shawarma", "neighborhood_gem"], is_chain: false, description: "Massive shawarma plates", lat: 37.7637, lng: -122.4680 },
  { name: "Saigon Sandwich", slug: "saigon-sandwich", category: "food", subcategory: "vietnamese", neighborhood: "Tenderloin", address: "560 Larkin St", price_tier: 1, avg_price: "$5-6", tags: ["cash_only", "local_icon", "banh_mi"], is_chain: false, description: "Best banh mi in SF, legendary $5", lat: 37.7833, lng: -122.4170 },
  { name: "Turtle Tower", slug: "turtle-tower", category: "food", subcategory: "vietnamese", neighborhood: "Tenderloin", address: "645 Larkin St", price_tier: 1, avg_price: "$12-14", tags: ["pho", "authentic"], is_chain: false, description: "Authentic Northern Vietnamese pho", lat: 37.7843, lng: -122.4166 },
  { name: "Pho 2000", slug: "pho-2000", category: "food", subcategory: "vietnamese", neighborhood: "Tenderloin", address: "637 Larkin St", price_tier: 1, avg_price: "$11-13", tags: ["pho", "quick_service"], is_chain: false, description: "Generous pho bowls", lat: 37.7840, lng: -122.4167 },
  { name: "Hai Ky Mi Gia", slug: "hai-ky-mi-gia", category: "food", subcategory: "vietnamese", neighborhood: "Tenderloin", address: "707 Ellis St", price_tier: 1, avg_price: "$9-11", tags: ["noodles", "authentic"], is_chain: false, description: "Dry egg noodles, authentic Vietnamese-Chinese", lat: 37.7830, lng: -122.4152 },
  { name: "Bun Mee", slug: "bun-mee", category: "food", subcategory: "vietnamese", neighborhood: "Tenderloin", address: "674 Geary St", price_tier: 1, avg_price: "$9-11", tags: ["banh_mi", "modern"], is_chain: false, description: "Modern banh mi, great combos", lat: 37.7862, lng: -122.4138 },
  { name: "Senor Sisig", slug: "senor-sisig", category: "food", subcategory: "filipino", neighborhood: null, address: "Food trucks citywide", price_tier: 1, avg_price: "$10-12", tags: ["food_truck", "bowls", "fusion"], is_chain: false, description: "Filipino fusion bowls, unique SF flavor", lat: 37.7620, lng: -122.4200 },
  { name: "Costco Pizza", slug: "costco-pizza", category: "food", subcategory: "pizza", neighborhood: "SoMa", address: "450 10th St", price_tier: 1, avg_price: "$2-10", tags: ["bulk", "value"], is_chain: true, description: "$1.99 slice, $9.95 whole pizza", lat: 37.7700, lng: -122.4050 },
  { name: "Arinell Pizza", slug: "arinell-pizza", category: "food", subcategory: "pizza", neighborhood: "Mission", address: "509 Valencia St", price_tier: 1, avg_price: "$4-5", tags: ["ny_style", "cash_friendly"], is_chain: false, description: "Legit NY-style slices, $4-5 a slice", lat: 37.7621, lng: -122.4220 },
  { name: "Golden Boy Pizza", slug: "golden-boy-pizza", category: "food", subcategory: "pizza", neighborhood: "North Beach", address: "542 Green St", price_tier: 1, avg_price: "$4-6", tags: ["focaccia_style", "local_icon"], is_chain: false, description: "Thick focaccia-style, legendary late night", lat: 37.7997, lng: -122.4074 },
  { name: "Good Mong Kok", slug: "good-mong-kok", category: "food", subcategory: "chinese", neighborhood: "Chinatown", address: "1039 Stockton St", price_tier: 1, avg_price: "$3-5", tags: ["dim_sum", "cash_only", "bakery"], is_chain: false, description: "Dim sum to-go, $3-5 boxes", lat: 37.7948, lng: -122.4093 },
  { name: "Yin Du Wonton", slug: "yin-du-wonton", category: "food", subcategory: "chinese", neighborhood: "Chinatown", address: "731 Vallejo St", price_tier: 1, avg_price: "$8-10", tags: ["noodles", "wonton"], is_chain: false, description: "Hand-pulled noodles and wontons", lat: 37.7979, lng: -122.4092 },
  { name: "San Tung", slug: "san-tung", category: "food", subcategory: "chinese", neighborhood: "Sunset", address: "1031 Irving St", price_tier: 1, avg_price: "$10-14", tags: ["dry_fried_chicken_wings", "noodles"], is_chain: false, description: "Famous dry fried chicken wings", lat: 37.7637, lng: -122.4680 },
  { name: "Grocery Outlet", slug: "grocery-outlet", category: "groceries", subcategory: "supermarket", neighborhood: null, address: "Multiple SF locations", price_tier: 1, avg_price: "$", tags: ["bargain", "treasure_hunt"], is_chain: true, description: "40-60% off retail, name brands", lat: 37.7700, lng: -122.4250 },
  { name: "Costco", slug: "costco-sf", category: "groceries", subcategory: "warehouse", neighborhood: "SoMa", address: "450 10th St", price_tier: 1, avg_price: "$", tags: ["bulk", "membership"], is_chain: true, description: "In-city Costco, bulk + $5 rotisserie", lat: 37.7700, lng: -122.4050 },
  { name: "Smart & Final", slug: "smart-and-final", category: "groceries", subcategory: "supermarket", neighborhood: "Mission", address: "1245 South Van Ness", price_tier: 1, avg_price: "$", tags: ["bulk", "no_membership"], is_chain: true, description: "Bulk pricing, no membership needed", lat: 37.7565, lng: -122.4165 },
  { name: "Duc Loi Supermarket", slug: "duc-loi", category: "groceries", subcategory: "supermarket", neighborhood: "Mission", address: "2200 Mission St", price_tier: 1, avg_price: "$", tags: ["asian_produce", "fresh"], is_chain: false, description: "Amazing produce prices", lat: 37.7583, lng: -122.4191 },
  { name: "Trader Joe's", slug: "trader-joes", category: "groceries", subcategory: "supermarket", neighborhood: null, address: "Multiple SF locations", price_tier: 1, avg_price: "$-$$", tags: ["value", "private_label"], is_chain: true, description: "Great private-label products, good prices", lat: 37.7750, lng: -122.4200 },
  { name: "Walmart", slug: "walmart-sf", category: "groceries", subcategory: "supermarket", neighborhood: null, address: "Multiple Bay Area locations", price_tier: 1, avg_price: "$", tags: ["everyday_low_price", "one_stop"], is_chain: true, description: "Everyday low prices, groceries + everything else", lat: 37.7290, lng: -122.4010 },
  { name: "Safeway", slug: "safeway", category: "groceries", subcategory: "supermarket", neighborhood: null, address: "Multiple SF locations", price_tier: 1, avg_price: "$$", tags: ["chain", "rewards_program", "pharmacy"], is_chain: true, description: "Widespread in SF, Club Card deals + gas rewards", lat: 37.7645, lng: -122.4320 },
  { name: "Walmart+", slug: "walmart-plus", category: "online", subcategory: "grocery delivery", neighborhood: null, address: "Delivery", price_tier: 1, avg_price: "In-store prices", tags: ["delivery", "no_markup", "membership"], is_chain: true, description: "$12.95/mo, free delivery, in-store prices", lat: 37.7749, lng: -122.4194 },
  { name: "Amazon Fresh", slug: "amazon-fresh", category: "online", subcategory: "grocery delivery", neighborhood: null, address: "Delivery", price_tier: 1, avg_price: "Online prices", tags: ["delivery", "prime", "free_over_35"], is_chain: true, description: "Free delivery over $35 with Prime", lat: 37.7749, lng: -122.4194 },
  { name: "Costco Same-Day", slug: "costco-delivery", category: "online", subcategory: "grocery delivery", neighborhood: null, address: "Delivery", price_tier: 1, avg_price: "Costco prices", tags: ["bulk", "same_day", "membership"], is_chain: true, description: "Costco prices delivered same-day via Instacart", lat: 37.7749, lng: -122.4194 },
  { name: "Thrive Market", slug: "thrive-market", category: "online", subcategory: "organic grocery", neighborhood: null, address: "Delivery", price_tier: 1, avg_price: "25-50% off retail", tags: ["organic", "wholesale", "membership"], is_chain: false, description: "Organic groceries at wholesale prices, ships free", lat: 37.7749, lng: -122.4194 },
  { name: "Misfits Market", slug: "misfits-market", category: "online", subcategory: "organic grocery", neighborhood: null, address: "Delivery", price_tier: 1, avg_price: "Up to 40% off", tags: ["organic", "ugly_produce", "value"], is_chain: false, description: "Ugly produce + organic staples, up to 40% off", lat: 37.7749, lng: -122.4194 },
  { name: "Li Po Lounge", slug: "li-po-lounge", category: "bars", subcategory: "dive bar", neighborhood: "Chinatown", address: "916 Grant Ave", price_tier: 1, avg_price: "$5-8", tags: ["dive_bar", "chinese_mai_tai"], is_chain: false, description: "Iconic dive, famous Chinese Mai Tai", lat: 37.7940, lng: -122.4076 },
  { name: "The 500 Club", slug: "the-500-club", category: "bars", subcategory: "dive bar", neighborhood: "Mission", address: "500 Guerrero St", price_tier: 1, avg_price: "$5-8", tags: ["dive_bar", "pool_table"], is_chain: false, description: "Classic Mission dive, cheap wells", lat: 37.7649, lng: -122.4236 },
  { name: "Toronado", slug: "toronado", category: "bars", subcategory: "beer bar", neighborhood: "Lower Haight", address: "547 Haight St", price_tier: 1, avg_price: "$6-9", tags: ["craft_beer", "local_icon"], is_chain: false, description: "50+ craft beers on tap, SF institution", lat: 37.7719, lng: -122.4296 },
  { name: "SF Rec & Park Gyms", slug: "sf-rec-gyms", category: "fitness", subcategory: "gym", neighborhood: null, address: "Multiple city rec centers", price_tier: 1, avg_price: "Free-$5", tags: ["public", "free"], is_chain: false, description: "Free city rec center gyms", lat: 37.7694, lng: -122.4862 },
  { name: "Outdoor Fitness SF", slug: "outdoor-fitness", category: "fitness", subcategory: "outdoor", neighborhood: null, address: "Golden Gate Park & more", price_tier: 1, avg_price: "Free", tags: ["outdoor", "free"], is_chain: false, description: "Free outdoor fitness: stairs, parks, trails", lat: 37.7694, lng: -122.4862 },
  { name: "AA Bakery & Cafe", slug: "aa-bakery", category: "food", subcategory: "chinese", neighborhood: "Chinatown", address: "1068 Stockton St", price_tier: 1, avg_price: "$2-5", tags: ["bakery", "egg_tarts", "bbq_pork_buns"], is_chain: false, description: "Egg tarts $1.50, pork buns $2, no frills", lat: 37.7953, lng: -122.4094 },
  { name: "Eastern Bakery", slug: "eastern-bakery", category: "food", subcategory: "chinese", neighborhood: "Chinatown", address: "720 Grant Ave", price_tier: 1, avg_price: "$2-4", tags: ["bakery", "mooncakes", "since_1924"], is_chain: false, description: "SF oldest bakery (1924), mooncakes & cocktail buns", lat: 37.7938, lng: -122.4064 },
  { name: "Delicious Dim Sum", slug: "delicious-dim-sum", category: "food", subcategory: "chinese", neighborhood: "Chinatown", address: "752 Jackson St", price_tier: 1, avg_price: "$3-6", tags: ["dim_sum", "to_go", "cash_only"], is_chain: false, description: "Pork buns & shrimp dumplings $3-6, always a line", lat: 37.7963, lng: -122.4074 },
  { name: "House of Pancakes", slug: "house-of-pancakes", category: "food", subcategory: "chinese", neighborhood: "Chinatown", address: "635 Jackson St", price_tier: 1, avg_price: "$4-8", tags: ["scallion_pancakes", "dumplings", "cash_only"], is_chain: false, description: "Scallion pancakes $4, pot stickers $6", lat: 37.7959, lng: -122.4065 },
  { name: "Kingdom of Dumpling", slug: "kingdom-of-dumpling", category: "food", subcategory: "chinese", neighborhood: "Sunset", address: "1713 Taraval St", price_tier: 1, avg_price: "$8-12", tags: ["dumplings", "xlb"], is_chain: false, description: "XLB and dumplings, Sunset favorite", lat: 37.7432, lng: -122.4831 },
  { name: "Mandalay Restaurant", slug: "mandalay-restaurant", category: "food", subcategory: "burmese", neighborhood: "Richmond", address: "4348 California St", price_tier: 1, avg_price: "$10-13", tags: ["burmese", "tea_leaf_salad"], is_chain: false, description: "Tea leaf salad $10, unique Burmese food", lat: 37.7858, lng: -122.4629 },
  { name: "Pakwan", slug: "pakwan", category: "food", subcategory: "indian", neighborhood: "Mission", address: "3182 16th St", price_tier: 1, avg_price: "$8-12", tags: ["pakistani", "biryani", "naan"], is_chain: false, description: "Massive biryani plates under $12, BYOB", lat: 37.7651, lng: -122.4234 },
  { name: "Udupi Palace", slug: "udupi-palace", category: "food", subcategory: "indian", neighborhood: "Valencia", address: "1007 Valencia St", price_tier: 1, avg_price: "$10-14", tags: ["south_indian", "dosa", "vegetarian"], is_chain: false, description: "Giant dosas $10-12, all vegetarian", lat: 37.7561, lng: -122.4210 },
  { name: "Naan N Curry", slug: "naan-n-curry", category: "food", subcategory: "indian", neighborhood: "Tenderloin", address: "336 O'Farrell St", price_tier: 1, avg_price: "$8-12", tags: ["late_night", "naan", "curry"], is_chain: false, description: "Cheap curry and naan, open super late", lat: 37.7860, lng: -122.4107 },
  { name: "Lers Ros Thai", slug: "lers-ros", category: "food", subcategory: "thai", neighborhood: "Tenderloin", address: "730 Larkin St", price_tier: 1, avg_price: "$10-14", tags: ["thai", "spicy", "authentic"], is_chain: false, description: "Best authentic Thai in SF, big portions", lat: 37.7831, lng: -122.4175 },
  { name: "Sushi Zone", slug: "sushi-zone", category: "food", subcategory: "japanese", neighborhood: "Castro", address: "1815 Market St", price_tier: 1, avg_price: "$10-15", tags: ["sushi", "omakase_value", "tiny"], is_chain: false, description: "Tiny 6-seat sushi bar, incredible value", lat: 37.7698, lng: -122.4270 },
  { name: "Toyose", slug: "toyose", category: "food", subcategory: "korean", neighborhood: "Sunset", address: "3814 Noriega St", price_tier: 1, avg_price: "$10-15", tags: ["late_night", "hidden", "cash_only"], is_chain: false, description: "Hidden behind garage door, amazing Korean late-night", lat: 37.7536, lng: -122.5005 },
  { name: "Grubstake", slug: "grubstake", category: "food", subcategory: "late night", neighborhood: "Polk Gulch", address: "1525 Pine St", price_tier: 1, avg_price: "$10-14", tags: ["late_night", "portuguese", "burgers"], is_chain: false, description: "Late-night burgers in a converted train car", lat: 37.7887, lng: -122.4207 },
  { name: "Ike's Love & Sandwiches", slug: "ikes-sandwiches", category: "food", subcategory: "sandwiches", neighborhood: null, address: "Multiple SF locations", price_tier: 1, avg_price: "$10-13", tags: ["sandwiches", "dutch_crunch", "local"], is_chain: false, description: "Dutch crunch sandwiches, massive portions", lat: 37.7749, lng: -122.4194 },
  { name: "Lucca Ravioli Co", slug: "lucca-deli", category: "food", subcategory: "italian", neighborhood: "Mission", address: "1100 Valencia St", price_tier: 1, avg_price: "$8-12", tags: ["deli", "ravioli", "since_1925"], is_chain: false, description: "Fresh ravioli and Italian deli since 1925", lat: 37.7535, lng: -122.4209 },
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
