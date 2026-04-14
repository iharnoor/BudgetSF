import { NextRequest } from "next/server";
import { voteOnSpot } from "@/lib/spots-store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let fingerprint = "anonymous";
  try {
    const body = await request.json();
    if (typeof body.fingerprint === "string") {
      fingerprint = body.fingerprint;
    }
  } catch {
    // no body is fine, use default fingerprint
  }

  try {
    const result = await voteOnSpot(id, fingerprint);
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 404 });
  }
}
