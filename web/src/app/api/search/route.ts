import { NextRequest } from "next/server";
import { searchVenues } from "@/lib/hydradb";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60; // max searches per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

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

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many requests. Slow down." },
      { status: 429 }
    );
  }

  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return Response.json({ results: [] });
  }

  // Limit query length
  const sanitizedQuery = query.trim().slice(0, 200);

  if (sanitizedQuery.length < 2) {
    return Response.json({ results: [] });
  }

  try {
    const results = await searchVenues(sanitizedQuery, 20);
    return Response.json({ results });
  } catch {
    return Response.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
