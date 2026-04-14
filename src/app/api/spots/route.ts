import { getPendingSpots } from "@/lib/spots-store";

export async function GET() {
  try {
    const spots = await getPendingSpots();
    return Response.json({ spots });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
