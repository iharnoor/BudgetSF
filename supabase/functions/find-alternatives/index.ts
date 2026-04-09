import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin, getUserId } from "../_shared/supabase.ts";
import { errorResponse } from "../_shared/errors.ts";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;

/**
 * Resolve a bank-statement merchant name to a venue slug
 * via the merchant_aliases table. Returns the slug or null.
 */
async function resolveAlias(
  rawName: string,
  city: string,
): Promise<string | null> {
  const normalized = rawName.toLowerCase().trim();

  // Exact match first
  const { data: exact } = await supabaseAdmin
    .from("merchant_aliases")
    .select("venue_slug")
    .eq("city", city)
    .ilike("alias_pattern", normalized)
    .limit(1)
    .single();

  if (exact) return exact.venue_slug;

  // Partial match — check if the merchant name contains any alias pattern
  const { data: partials } = await supabaseAdmin
    .from("merchant_aliases")
    .select("alias_pattern, venue_slug")
    .eq("city", city);

  if (partials) {
    for (const row of partials) {
      if (normalized.includes(row.alias_pattern.toLowerCase())) {
        return row.venue_slug;
      }
    }
  }

  return null;
}

/**
 * Look up curated alternatives via normalized JOIN:
 * sf_venues -> venue_alternatives -> sf_venues (cheaper)
 */
async function getCuratedAlternatives(venueSlug: string) {
  // Get the expensive venue
  const { data: venue } = await supabaseAdmin
    .from("sf_venues")
    .select(
      "id, name, slug, category, subcategory, neighborhood, price_tier, avg_price, tags, description, lat, lng, h3_index_res8",
    )
    .eq("slug", venueSlug)
    .single();

  if (!venue) return null;

  // Get cheaper alternatives via JOIN
  const { data: alternatives } = await supabaseAdmin
    .from("venue_alternatives")
    .select(
      `
      estimated_savings,
      reason,
      sort_order,
      cheaper:cheaper_venue_id (
        name, slug, category, subcategory, neighborhood, address,
        price_tier, avg_price, tags, is_chain, description, lat, lng, h3_index_res8
      )
    `,
    )
    .eq("expensive_venue_id", venue.id)
    .order("sort_order", { ascending: true });

  if (!alternatives || alternatives.length === 0) return null;

  return {
    venue,
    alternatives: alternatives.map((alt: Record<string, unknown>) => {
      const cheaper = alt.cheaper as Record<string, unknown>;
      return {
        name: cheaper.name,
        slug: cheaper.slug,
        category: cheaper.category,
        subcategory: cheaper.subcategory,
        neighborhood: cheaper.neighborhood,
        address: cheaper.address,
        price_tier: cheaper.price_tier,
        avg_price: cheaper.avg_price,
        tags: cheaper.tags,
        is_chain: cheaper.is_chain,
        description: cheaper.description,
        estimated_savings: alt.estimated_savings,
        reason: alt.reason,
        lat: cheaper.lat,
        lng: cheaper.lng,
      };
    }),
  };
}

/**
 * Haversine distance in meters between two lat/lng points.
 */
function haversineMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Find cheap venues near a lat/lng. Queries all venues in the city
 * matching filters, then sorts by straight-line distance.
 */
async function findNearbyAlternatives(
  lat: number,
  lng: number,
  city: string,
  category?: string,
  subcategory?: string,
  maxPriceTier?: number,
) {
  let query = supabaseAdmin
    .from("sf_venues")
    .select(
      "name, slug, category, subcategory, neighborhood, address, price_tier, avg_price, tags, is_chain, description, lat, lng",
    )
    .eq("city", city)
    .not("lat", "is", null)
    .not("lng", "is", null)
    .lte("price_tier", maxPriceTier ?? 1);

  if (category) {
    query = query.eq("category", category);
  }
  if (subcategory) {
    query = query.eq("subcategory", subcategory);
  }

  const { data: venues, error } = await query;

  if (error || !venues || venues.length === 0) return null;

  // Compute distance and sort by it
  const withDistance = venues.map((v: Record<string, unknown>) => {
    const dist = haversineMeters(lat, lng, v.lat as number, v.lng as number);
    let distanceEstimate = "far";
    if (dist < 500) distanceEstimate = "< 500m";
    else if (dist < 1000) distanceEstimate = "< 1 km";
    else if (dist < 2000) distanceEstimate = "< 2 km";
    else if (dist < 5000) distanceEstimate = `~${Math.round(dist / 1000)} km`;

    return {
      ...v,
      distance_meters: Math.round(dist),
      distance_estimate: distanceEstimate,
    };
  });

  withDistance.sort(
    (a: Record<string, unknown>, b: Record<string, unknown>) =>
      (a.distance_meters as number) - (b.distance_meters as number),
  );

  return withDistance;
}

/**
 * Sort curated alternatives by proximity to user location.
 */
function sortByProximity(
  alternatives: Record<string, unknown>[],
  userLat: number,
  userLng: number,
): Record<string, unknown>[] {
  return alternatives
    .map((alt) => {
      let distanceEstimate = "far";
      let distMeters = Infinity;
      if (alt.lat && alt.lng) {
        distMeters = haversineMeters(userLat, userLng, alt.lat as number, alt.lng as number);
        if (distMeters < 500) distanceEstimate = "< 500m";
        else if (distMeters < 1000) distanceEstimate = "< 1 km";
        else if (distMeters < 2000) distanceEstimate = "< 2 km";
        else if (distMeters < 5000) distanceEstimate = `~${Math.round(distMeters / 1000)} km`;
      }
      return { ...alt, distance_meters: Math.round(distMeters), distance_estimate: distanceEstimate };
    })
    .sort((a, b) => (a.distance_meters as number) - (b.distance_meters as number));
}

/**
 * Search venues in a city by query string, category, neighborhood, etc.
 * Powers the "explore a city" search feature.
 */
async function searchVenues(
  city: string,
  query?: string,
  category?: string,
  subcategory?: string,
  neighborhood?: string,
  maxPriceTier?: number,
) {
  let dbQuery = supabaseAdmin
    .from("sf_venues")
    .select(
      "name, slug, category, subcategory, neighborhood, address, price_tier, avg_price, tags, is_chain, description, lat, lng, city",
    )
    .eq("city", city);

  if (category) {
    dbQuery = dbQuery.eq("category", category);
  }
  if (subcategory) {
    dbQuery = dbQuery.eq("subcategory", subcategory);
  }
  if (neighborhood) {
    dbQuery = dbQuery.ilike("neighborhood", `%${neighborhood}%`);
  }
  if (maxPriceTier) {
    dbQuery = dbQuery.lte("price_tier", maxPriceTier);
  }
  if (query) {
    // Search across name, description, and tags
    dbQuery = dbQuery.or(
      `name.ilike.%${query}%,description.ilike.%${query}%,subcategory.ilike.%${query}%`,
    );
  }

  dbQuery = dbQuery.order("price_tier", { ascending: true }).limit(30);

  const { data, error } = await dbQuery;

  if (error) {
    console.error("Search error:", error);
    return [];
  }
  return data ?? [];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405, "Method not allowed");
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");

    await getUserId(authHeader); // verify auth

    const {
      merchant_name,
      category,
      subcategory,
      city,
      lat,
      lng,
      mode,
      query,
      neighborhood,
      max_price_tier,
    } = await req.json();

    const targetCity = city ?? "San Francisco";

    // ── Mode: "search" — city-wide venue search ──
    // Search venues by text query, category, neighborhood, price
    if (mode === "search") {
      const results = await searchVenues(
        targetCity,
        query,
        category,
        subcategory,
        neighborhood,
        max_price_tier,
      );

      return new Response(
        JSON.stringify({
          city: targetCity,
          query: query ?? null,
          category: category ?? "all",
          results,
          source: "search",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ── Mode: "nearby" — pure proximity discovery ──
    // Find cheap venues near a lat/lng, no merchant needed
    if (mode === "nearby") {
      if (typeof lat !== "number" || typeof lng !== "number") {
        return errorResponse(
          "Missing coordinates",
          400,
          "lat and lng are required for nearby mode",
        );
      }

      const nearby = await findNearbyAlternatives(
        lat,
        lng,
        targetCity,
        category,
        subcategory,
        max_price_tier ?? 2,
      );

      return new Response(
        JSON.stringify({
          lat,
          lng,
          category: category ?? "all",
          city: targetCity,
          alternatives: nearby ?? [],
          source: "h3_nearby",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ── Mode: default — merchant-based alternatives ──
    if (!merchant_name || typeof merchant_name !== "string") {
      return errorResponse(
        "Missing merchant_name",
        400,
        "merchant_name is required",
      );
    }

    // Step 1: Resolve bank-statement name to venue slug via aliases
    const venueSlug = await resolveAlias(merchant_name, targetCity);

    // Step 2: If we resolved a slug, look up curated alternatives
    if (venueSlug) {
      const result = await getCuratedAlternatives(venueSlug);
      if (result) {
        // If user provided lat/lng, sort alternatives by proximity
        let alternatives = result.alternatives;
        if (typeof lat === "number" && typeof lng === "number") {
          alternatives = sortByProximity(alternatives, lat, lng);
        }

        return new Response(
          JSON.stringify({
            merchant_name,
            venue: result.venue,
            city: targetCity,
            alternatives,
            source: "curated",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // Step 3: No curated data — generate via Gemini
    const prompt = `You are a San Francisco local expert. Find 5 cheaper alternatives to "${merchant_name}"${category ? ` (category: ${category})` : ""} in ${targetCity}.

Focus on real, currently-operating businesses. Prioritize:
1. Significantly cheaper options first
2. Local/independent businesses over chains
3. Places actual SF residents recommend

Return a JSON array where each element has:
- name (string): business name
- category (string): business category
- estimated_savings (string): e.g. "20-30% cheaper"
- address (string): specific location in ${targetCity}
- reason (string): brief reason why it's a good alternative (include approximate prices)

Only return the JSON array, no other text.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1500 },
        }),
      },
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.json();
      console.error("Gemini error:", err);
      throw new Error("Failed to generate alternatives");
    }

    const geminiData = await geminiRes.json();
    const rawContent =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    let alternatives: unknown[];
    try {
      const cleaned = rawContent
        .replace(/```json?\n?/g, "")
        .replace(/```/g, "")
        .trim();
      alternatives = JSON.parse(cleaned);
    } catch {
      throw new Error("Failed to parse alternatives from AI response");
    }

    return new Response(
      JSON.stringify({
        merchant_name,
        city: targetCity,
        alternatives,
        source: "ai_generated",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return errorResponse(error, 500, "Failed to find alternatives");
  }
});
