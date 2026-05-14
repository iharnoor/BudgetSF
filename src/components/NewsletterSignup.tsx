import Link from "next/link";

const SUBSTACK_URL = "https://singhinusa.substack.com";

interface NewsletterSignupProps {
  variant?: "card" | "inline";
  className?: string;
}

export default function NewsletterSignup({
  variant = "card",
  className = "",
}: NewsletterSignupProps) {
  if (variant === "inline") {
    return (
      <Link
        href={`${SUBSTACK_URL}/subscribe`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-[12px] font-medium text-muted hover:text-foreground transition-colors ${className}`}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
        </svg>
        Subscribe on Substack
      </Link>
    );
  }

  return (
    <div
      className={`glass border border-border/60 rounded-2xl p-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#ff6719] flex items-center justify-center text-white shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-[15px] text-foreground mb-1"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            The Friday drop
          </h3>
          <p className="text-[12px] text-muted leading-relaxed mb-3">
            New spots, price corrections, and one founder-life detail each week.
            Free. Unsubscribe anytime.
          </p>
          <Link
            href={`${SUBSTACK_URL}/subscribe`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-foreground text-background text-[12px] font-semibold hover:opacity-90 transition-opacity"
          >
            Subscribe on Substack
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
