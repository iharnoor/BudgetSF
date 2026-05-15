"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  special?: boolean;
};

const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Map" },
  { href: "/spots", label: "Spots" },
  { href: "/trip", label: "Plan a Trip" },
];

const GUIDES: NavItem[] = [
  { href: "/few-days", label: "Few Days" },
  { href: "/workspaces", label: "Work Spots" },
  { href: "/transport", label: "Getting Around" },
  { href: "/events", label: "Events" },
  { href: "/free", label: "Free Things" },
  { href: "/diet", label: "Budget Diet" },
  { href: "/student", label: "Student" },
];

const PICKS: NavItem = { href: "/picks", label: "My Picks", special: true };

const RIGHT_NAV: NavItem[] = [{ href: "/about", label: "About" }];

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const guidesRef = useRef<HTMLDivElement>(null);

  // Close Guides on outside click / Escape
  useEffect(() => {
    if (!guidesOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (guidesRef.current && !guidesRef.current.contains(e.target as Node)) {
        setGuidesOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGuidesOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [guidesOpen]);

  const guidesActive = GUIDES.some((g) => isItemActive(pathname, g.href));

  return (
    <header className="absolute top-0 left-0 right-0 z-40 glass border-b border-border/60">
      <div className="max-w-screen-2xl mx-auto px-5 h-[52px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-baseline gap-2.5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white text-[10px] font-bold tracking-tight shadow-sm group-hover:shadow-md transition-shadow">
              SF
            </div>
            <span
              className="text-[17px] text-foreground tracking-tight"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              BudgetSF
            </span>
          </Link>
          <a
            href="https://hydradb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-[12px] font-medium text-muted/60 hover:text-muted tracking-wide transition-colors"
          >
            by HydraDB
          </a>
          <a
            href="https://singhinusa.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[12px] font-semibold text-[#ff6719] hover:opacity-80 tracking-wide transition-opacity"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
            </svg>
            Newsletter
          </a>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-0.5">
          {PRIMARY_NAV.map((item) => {
            const active = isItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full bg-accent" />
                )}
              </Link>
            );
          })}

          {/* Guides dropdown */}
          <div className="relative" ref={guidesRef}>
            <button
              onClick={() => setGuidesOpen((s) => !s)}
              aria-haspopup="true"
              aria-expanded={guidesOpen}
              className={`relative flex items-center gap-1 px-3.5 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                guidesActive
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Guides
              <svg
                className={`w-3 h-3 transition-transform ${guidesOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              {guidesActive && (
                <span className="absolute bottom-0 left-3.5 right-6 h-[2px] rounded-full bg-accent" />
              )}
            </button>
            {guidesOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 glass rounded-xl border border-border/60 shadow-xl shadow-black/[0.08] py-1.5 animate-in">
                {GUIDES.map((g) => {
                  const active = isItemActive(pathname, g.href);
                  return (
                    <Link
                      key={g.href}
                      href={g.href}
                      onClick={() => setGuidesOpen(false)}
                      className={`block px-4 py-2 text-[13px] transition-colors ${
                        g.special
                          ? "text-amber-500 hover:text-amber-400 hover:bg-warm"
                          : active
                            ? "text-foreground bg-accent-light/40"
                            : "text-muted hover:text-foreground hover:bg-warm"
                      }`}
                    >
                      {g.special && "⭐ "}
                      {g.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {(() => {
            const active = isItemActive(pathname, PICKS.href);
            return (
              <Link
                href={PICKS.href}
                className={`relative px-3.5 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                  active
                    ? "text-amber-500"
                    : "text-amber-500/90 hover:text-amber-400"
                }`}
              >
                <span aria-hidden="true">⭐</span> {PICKS.label}
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full bg-amber-500" />
                )}
              </Link>
            );
          })()}

          {RIGHT_NAV.map((item) => {
            const active = isItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Desktop: Add a spot button */}
          <Link
            href="/community"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-foreground bg-accent-light/60 hover:bg-accent-light border border-accent/20 transition-colors press"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add a spot
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 text-muted hover:text-foreground transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="sm:hidden relative z-40 glass border-t border-border/60 py-2 animate-in max-h-[calc(100vh-52px)] overflow-y-auto">
            {PRIMARY_NAV.map((item) => {
              const active = isItemActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-2.5 text-[14px] font-medium transition-colors ${
                    active
                      ? "text-foreground bg-accent-light/30"
                      : "text-muted hover:text-foreground hover:bg-warm"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={PICKS.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-5 py-2.5 text-[14px] font-medium text-amber-500 hover:text-amber-400 hover:bg-warm transition-colors"
            >
              ⭐ {PICKS.label}
            </Link>
            <div className="px-5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted/60">
              Guides
            </div>
            {GUIDES.map((g) => {
              const active = isItemActive(pathname, g.href);
              return (
                <Link
                  key={g.href}
                  href={g.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-2.5 text-[14px] font-medium transition-colors ${
                    g.special
                      ? "text-amber-500 hover:text-amber-400 hover:bg-warm"
                      : active
                        ? "text-foreground bg-accent-light/30"
                        : "text-muted hover:text-foreground hover:bg-warm"
                  }`}
                >
                  {g.special && "⭐ "}
                  {g.label}
                </Link>
              );
            })}
            <div className="border-t border-border/60 mt-1 pt-1">
              {RIGHT_NAV.map((item) => {
                const active = isItemActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-5 py-2.5 text-[14px] font-medium transition-colors ${
                      active
                        ? "text-foreground bg-accent-light/30"
                        : "text-muted hover:text-foreground hover:bg-warm"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-5 py-2.5 text-[14px] font-semibold text-accent hover:bg-warm transition-colors"
              >
                + Add a spot
              </Link>
              <a
                href="https://singhinusa.substack.com/subscribe"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold text-[#ff6719] hover:bg-warm transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                </svg>
                Newsletter
              </a>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
