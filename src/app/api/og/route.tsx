import { ImageResponse } from "next/og";
import { renderCard, isAllowedOgRoute } from "@/lib/og-cards";
import { OG_WIDTH, OG_HEIGHT } from "@/lib/og-cards/_shell";

export const runtime = "edge";

const dmSerifFont = fetch(
  new URL("../../../../public/fonts/DMSerifDisplay-Regular.woff2", import.meta.url)
).then((res) => res.arrayBuffer());

const geistFont = fetch(
  new URL("../../../../public/fonts/Geist-Regular.woff2", import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(request: Request) {
  const url = new URL(request.url);
  const forParam = url.searchParams.get("for");
  const route = isAllowedOgRoute(forParam) ? forParam : null;

  const [dmSerifData, geistData] = await Promise.all([dmSerifFont, geistFont]);

  return new ImageResponse(renderCard(route), {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: [
      { name: "DM Serif Display", data: dmSerifData, style: "normal", weight: 400 },
      { name: "Geist", data: geistData, style: "normal", weight: 400 },
    ],
    headers: {
      "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
