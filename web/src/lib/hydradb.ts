const HYDRA_API = "https://api.hydradb.com";
const TENANT_ID = process.env.HYDRADB_TENANT_ID || "WealthWise";
const API_KEY = process.env.HYDRADB_API_KEY || "";
const SUB_TENANT = "sf_venues";

export interface VenueData {
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  neighborhood: string;
  address: string;
  price_tier: number;
  avg_price?: string;
  tags: string[];
  is_chain: boolean;
  description: string;
  lat: number;
  lng: number;
}

export interface SearchResult {
  venue: VenueData;
  score: number;
}

export async function searchVenues(
  query: string,
  maxResults = 20
): Promise<SearchResult[]> {
  const res = await fetch(`${HYDRA_API}/recall/full_recall`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tenant_id: TENANT_ID,
      sub_tenant_id: SUB_TENANT,
      query,
      max_results: maxResults,
      mode: "fast",
      alpha: 0.8,
      recency_bias: 0,
    }),
  });

  if (!res.ok) {
    console.error("HydraDB search failed:", res.status);
    return [];
  }

  const data = await res.json();
  const results: SearchResult[] = [];
  const seenSlugs = new Set<string>();

  for (const chunk of data.chunks || []) {
    try {
      const score = chunk.relevancy_score || 0;
      // Filter out low-relevance results
      if (score < 0.85) continue;

      const content =
        typeof chunk.chunk_content === "string"
          ? JSON.parse(chunk.chunk_content)
          : chunk.chunk_content;

      const text = content?.content?.text || "";
      const jsonPart = text.split("---JSON---\n")[1];
      if (jsonPart) {
        const venue = JSON.parse(jsonPart) as VenueData;

        // Deduplicate by slug (HydraDB may have old + new entries)
        if (seenSlugs.has(venue.slug)) continue;
        seenSlugs.add(venue.slug);

        // Boost score if query terms appear in category/subcategory/name
        const queryLower = query.toLowerCase();
        const queryTerms = queryLower.split(/\s+/).filter(Boolean);
        let boostedScore = score;
        for (const term of queryTerms) {
          if (
            venue.subcategory?.toLowerCase().includes(term) ||
            venue.category.toLowerCase().includes(term)
          ) {
            boostedScore += 0.3;
          }
          if (venue.name.toLowerCase().includes(term)) {
            boostedScore += 0.2;
          }
          if (venue.tags?.some((t) => t.toLowerCase().includes(term))) {
            boostedScore += 0.1;
          }
        }

        results.push({ venue, score: boostedScore });
      }
    } catch {
      // skip malformed entries
    }
  }

  // Sort by boosted score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}

export async function ingestVenue(venue: VenueData): Promise<boolean> {
  const readable = [
    venue.name,
    venue.subcategory
      ? `${venue.category} / ${venue.subcategory}`
      : venue.category,
    venue.neighborhood,
    venue.address,
    `Price: ${"$".repeat(venue.price_tier)}`,
    venue.avg_price ? `Avg: ${venue.avg_price}` : "",
    venue.description,
    venue.tags.length > 0 ? `Tags: ${venue.tags.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const appSource = {
    id: venue.slug,
    tenant_id: TENANT_ID,
    sub_tenant_id: SUB_TENANT,
    title: venue.name,
    source: "budgetsf",
    description: `${venue.category}${venue.subcategory ? "/" + venue.subcategory : ""} in ${venue.neighborhood}`,
    content: {
      text: `${readable}\n\n---JSON---\n${JSON.stringify(venue)}`,
    },
    metadata: {
      category: venue.category,
      subcategory: venue.subcategory || "",
      neighborhood: venue.neighborhood,
      price_tier: String(venue.price_tier),
    },
  };

  const boundary = `----FormBoundary${Date.now()}`;
  const parts = [
    `--${boundary}\r\nContent-Disposition: form-data; name="tenant_id"\r\n\r\n${TENANT_ID}`,
    `--${boundary}\r\nContent-Disposition: form-data; name="sub_tenant_id"\r\n\r\n${SUB_TENANT}`,
    `--${boundary}\r\nContent-Disposition: form-data; name="app_sources"\r\n\r\n${JSON.stringify([appSource])}`,
    `--${boundary}--`,
  ].join("\r\n");

  const res = await fetch(`${HYDRA_API}/ingestion/upload_knowledge`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body: parts,
  });

  if (!res.ok) {
    console.error("HydraDB ingest failed:", res.status);
    return false;
  }

  const result = await res.json();
  return (result.success_count || 0) > 0;
}
