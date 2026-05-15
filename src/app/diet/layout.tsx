import type { Metadata, ResolvingMetadata } from "next";
import { OG_VERSION } from "@/lib/og-version";

const TITLE = "Live in SF on $7.25/day food — BudgetSF";
const DESCRIPTION =
  "The actual Costco-sourced meal plan I eat. ~$250/month, full protein/calorie breakdown.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://budgetsf.com/diet",
    images: [
      { url: `/api/og?for=/diet&v=${OG_VERSION}`, width: 1200, height: 630, alt: TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`/api/og?for=/diet&v=${OG_VERSION}`],
  },
};

export default function DietLayout({ children }: { children: React.ReactNode }) {
  return children;
}
