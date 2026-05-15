import type { Metadata } from "next";
import { OG_VERSION } from "@/lib/og-version";

const TITLE = "Planning a trip to SF? Skip Union Square. — BudgetSF";
const DESCRIPTION =
  "Airports, hotels, neighborhoods, networking — what a founder visiting SF should actually do.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://budgetsf.com/trip",
    images: [
      { url: `/api/og?for=/trip&v=${OG_VERSION}`, width: 1200, height: 630, alt: TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`/api/og?for=/trip&v=${OG_VERSION}`],
  },
};

export default function TripLayout({ children }: { children: React.ReactNode }) {
  return children;
}
