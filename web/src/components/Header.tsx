"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="absolute top-0 left-0 right-0 z-40 glass border-b border-border/60">
      <div className="max-w-screen-2xl mx-auto px-5 h-[52px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white text-[10px] font-bold tracking-tight shadow-sm group-hover:shadow-md transition-shadow">
            SF
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className="text-[17px] text-foreground tracking-tight"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              BudgetSF
            </span>
          </div>
        </Link>

        {/* Center nav */}
        <nav className="hidden sm:flex items-center gap-0.5">
          {[
            { href: "/", label: "Map" },
            { href: "/spots", label: "Spots" },
            { href: "/submit", label: "Add My Fav" },
          ].map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Link
            href="/pending"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium transition-colors ${
              pathname === "/pending"
                ? "text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            Vote
          </Link>
          <Link
            href="/submit"
            className="text-[13px] text-muted hover:text-foreground font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
