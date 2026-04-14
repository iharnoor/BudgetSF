import { NextRequest } from "next/server";
import { ingestVenue, VenueData } from "@/lib/hydradb";

const VALID_CATEGORIES = [
  "food", "housing", "workspace", "coffee", "startup", "vc",
  "gym", "bars", "grocery", "entertainment", "services", "other",
];

// Simple in-memory rate limiter (per-IP, resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max submissions per window
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many submissions. Try again later." },
      { status: 429 }
    );
  }

  // Parse body safely
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate required fields
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const neighborhood = typeof body.neighborhood === "string" ? body.neighborhood.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const submittedBy = typeof body.submitted_by === "string" ? body.submitted_by.trim() : "";

  if (!name || !category || !neighborhood || !address) {
    return Response.json(
      { error: "Missing required fields: name, category, neighborhood, address" },
      { status: 400 }
    );
  }

  // Allow anonymous submissions for now

  // Validate field lengths
  if (name.length > 100) {
    return Response.json({ error: "Name too long (max 100 chars)" }, { status: 400 });
  }
  if (description.length > 500) {
    return Response.json({ error: "Description too long (max 500 chars)" }, { status: 400 });
  }
  if (address.length > 200) {
    return Response.json({ error: "Address too long (max 200 chars)" }, { status: 400 });
  }

  // Validate category
  if (!VALID_CATEGORIES.includes(category)) {
    return Response.json({ error: "Invalid category" }, { status: 400 });
  }

  // Validate price tier
  const priceTier = Number(body.price_tier) || 1;
  if (priceTier < 1 || priceTier > 4) {
    return Response.json({ error: "Price tier must be 1-4" }, { status: 400 });
  }

  // Validate tags (max 10 tags, max 30 chars each)
  let tags: string[] = [];
  if (Array.isArray(body.tags)) {
    tags = body.tags
      .filter((t): t is string => typeof t === "string")
      .slice(0, 10)
      .map((t) => t.trim().slice(0, 30))
      .filter(Boolean);
  }

  // Validate coordinates (must be within SF area)
  const lat = Number(body.lat) || 37.7749;
  const lng = Number(body.lng) || -122.4194;
  if (lat < 37.6 || lat > 37.85 || lng < -122.55 || lng > -122.35) {
    // Default to SF center if coordinates are outside SF bounds
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  const venue: VenueData = {
    name: name.slice(0, 100),
    slug,
    category,
    subcategory: typeof body.subcategory === "string" ? body.subcategory.trim().slice(0, 50) : undefined,
    neighborhood: neighborhood.slice(0, 50),
    address: address.slice(0, 200),
    price_tier: priceTier,
    avg_price: typeof body.avg_price === "string" ? body.avg_price.trim().slice(0, 20) : undefined,
    tags,
    is_chain: false,
    description: description.slice(0, 500),
    lat,
    lng,
  };

  const success = await ingestVenue(venue);

  if (!success) {
    return Response.json(
      { error: "Failed to submit venue. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({ success: true, venue }, { status: 201 });
}
