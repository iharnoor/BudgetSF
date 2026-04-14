"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/", label: "Map" },
  { href: "/spots", label: "Spots" },
  { href: "/workspaces", label: "Work Spots" },
  { href: "/transport", label: "Getting Around" },
  { href: "/events", label: "Events" },
  { href: "/free", label: "Free" },
  { href: "/community", label: "Vote / Add" },
  { href: "/diet", label: "Diet" },
  { href: "/picks", label: "My Picks", special: true },
  { href: "/about", label: "About Me" },
];

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-40 glass border-b border-border/60">
      <div className="max-w-screen-2xl mx-auto px-5 h-[52px] flex items-center justify-between">
        {/* Logo */}
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

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                  item.special
                    ? "text-amber-500 hover:text-amber-400"
                    : isActive
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                }`}
              >
                {item.special && "⭐ "}{item.label}
                {isActive && (
                  <span className={`absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full ${item.special ? "bg-amber-500" : "bg-accent"}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {AUTH_ENABLED && (
            isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton>
                <button className="text-[13px] font-medium text-white bg-accent px-3.5 py-1.5 rounded-lg hover:bg-accent-dark transition-colors press shadow-sm">
                  Sign in
                </button>
              </SignInButton>
            )
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 text-muted hover:text-foreground transition-colors"
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
          <nav className="sm:hidden relative z-40 glass border-t border-border/60 py-2 animate-in">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-2.5 text-[14px] font-medium transition-colors ${
                    item.special
                      ? "text-amber-500 hover:text-amber-400 hover:bg-warm"
                      : isActive
                        ? "text-foreground bg-accent-light/30"
                        : "text-muted hover:text-foreground hover:bg-warm"
                  }`}
                >
                  {item.special && "⭐ "}{item.label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </header>
  );
}
