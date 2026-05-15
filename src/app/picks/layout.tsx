import type { Metadata } from "next";
import { OG_VERSION } from "@/lib/og-version";

const TITLE = "The stack a founder in SF actually uses — BudgetSF";
const DESCRIPTION =
  "Phone, banks, credit card, neighborhoods, gear. The boring decisions, pre-decided.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://budgetsf.com/picks",
    images: [
      { url: `/api/og?for=/picks&v=${OG_VERSION}`, width: 1200, height: 630, alt: TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`/api/og?for=/picks&v=${OG_VERSION}`],
  },
};

export default function PicksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
