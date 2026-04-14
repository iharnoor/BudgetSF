import { NextRequest } from "next/server";
import { approveSpot } from "@/lib/spots-store";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "budgetsf-admin-2024";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check admin secret from header
  const authHeader = request.headers.get("x-admin-secret");
  if (authHeader !== ADMIN_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const spot = await approveSpot(id);
    return Response.json({ spot });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 404 });
  }
}
