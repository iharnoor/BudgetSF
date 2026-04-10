"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="flex items-center gap-3">
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

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 press"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || ""}
                    className="w-7 h-7 rounded-full border-2 border-border/60 hover:border-accent/40 transition-colors"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center text-accent-dark text-[11px] font-bold">
                    {user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <span className="hidden sm:block text-[12px] font-medium text-foreground truncate max-w-[100px]">
                  {user.name?.split(" ")[0]}
                </span>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-10 z-50 w-48 bg-surface-warm border border-border/60 rounded-xl shadow-lg shadow-black/[0.08] py-1.5 animate-in">
                    <div className="px-3.5 py-2 border-b border-border/60">
                      <p className="text-[12px] font-medium text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-muted truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-3.5 py-2 text-[12px] text-muted hover:text-foreground hover:bg-warm transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-[13px] font-medium text-white bg-accent px-3.5 py-1.5 rounded-lg hover:bg-accent-dark transition-colors press shadow-sm"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
