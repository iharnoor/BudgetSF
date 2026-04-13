import { NextRequest } from "next/server";
import {
  getAffiliateDashboardStats,
  recordAffiliateClick,
} from "@/lib/affiliate-clicks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClickPayload = {
  section?: unknown;
  label?: unknown;
  href?: unknown;
  sourcePath?: unknown;
  clickedAt?: unknown;
};

export async function POST(request: NextRequest) {
  let body: ClickPayload;

  try {
    body = (await request.json()) as ClickPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const section = typeof body.section === "string" ? body.section.slice(0, 100) : "";
  const label = typeof body.label === "string" ? body.label.slice(0, 160) : "";
  const href = typeof body.href === "string" ? body.href.slice(0, 500) : "";
  const sourcePath =
    typeof body.sourcePath === "string" ? body.sourcePath.slice(0, 160) : "";
  const clickedAt =
    typeof body.clickedAt === "string" ? body.clickedAt : new Date().toISOString();

  if (!section || !label || !href) {
    return Response.json(
      { error: "Missing required fields: section, label, href" },
      { status: 400 }
    );
  }

  await recordAffiliateClick({
    section,
    label,
    href,
    sourcePath,
    clickedAt,
  });

  return Response.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const daysParam = request.nextUrl.searchParams.get("days");
  const windowDays = Number(daysParam);
  const safeWindowDays =
    Number.isFinite(windowDays) && windowDays > 0 && windowDays <= 365
      ? Math.floor(windowDays)
      : 30;

  const stats = await getAffiliateDashboardStats(safeWindowDays);
  return Response.json(stats);
}
