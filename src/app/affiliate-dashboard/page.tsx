import Link from "next/link";
import { getAffiliateDashboardStats } from "@/lib/affiliate-clicks";

export const dynamic = "force-dynamic";

function prettyLabel(label: string): string {
  return label
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function AffiliateDashboardPage() {
  const stats = await getAffiliateDashboardStats(30);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-white font-bold text-[10px]">
                SF
              </div>
              <span className="font-semibold text-sm text-foreground">BudgetSF</span>
            </Link>
            <span className="text-muted text-xs">/ Affiliate Dashboard</span>
          </div>
          <Link href="/picks" className="text-xs text-accent hover:underline">
            Back to Picks
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl text-foreground mb-2"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Affiliate Dashboard
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            Track outbound affiliate clicks from your picks page and use the
            recommendations below to place links where intent is highest.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Clicks (30d)" value={String(stats.totalClicks)} />
          <StatCard label="Unique Links" value={String(stats.uniqueLinks)} />
          <StatCard label="Active Sections" value={String(stats.uniqueSections)} />
          <StatCard
            label="Top Section"
            value={stats.topSections[0]?.section.replaceAll("-", " ") ?? "n/a"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2
              className="text-xl text-foreground mb-1"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Top Links
            </h2>
            <p className="text-xs text-muted mb-4">Most clicked affiliate links in the last 30 days.</p>
            {stats.topLinks.length === 0 ? (
              <p className="text-sm text-muted">No tracked clicks yet. Click any affiliate link on picks to seed data.</p>
            ) : (
              <ul className="space-y-3">
                {stats.topLinks.slice(0, 7).map((link) => (
                  <li
                    key={`${link.section}:${link.label}:${link.href}`}
                    className="rounded-xl border border-border p-3 bg-background"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground capitalize">
                          {prettyLabel(link.label)}
                        </p>
                        <p className="text-[11px] text-muted capitalize">
                          {prettyLabel(link.section)}
                        </p>
                      </div>
                      <span className="badge badge-green">{link.clicks} clicks</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-border p-5">
            <h2
              className="text-xl text-foreground mb-1"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Placement Recommendations
            </h2>
            <p className="text-xs text-muted mb-4">Where to add or feature affiliate links next.</p>
            <ul className="space-y-2">
              {stats.recommendationNotes.map((note) => (
                <li
                  key={note}
                  className="text-sm text-foreground rounded-xl bg-surface-warm border border-border px-3 py-2"
                >
                  {note}
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-xl border border-accent/20 bg-accent-light/40 px-3 py-2.5">
              <p className="text-xs text-accent-dark">
                Quick win: place your best-performing link near the top of your
                picks hero and once in your About profile bio for always-on discovery.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <h2
            className="text-xl text-foreground mb-1"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Daily Click Trend
          </h2>
          <p className="text-xs text-muted mb-4">Simple daily totals for the current 30-day window.</p>
          {stats.clicksByDay.length === 0 ? (
            <p className="text-sm text-muted">No click events recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.clicksByDay.slice(-14).map((day) => (
                <div key={day.day} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-muted">{day.day}</div>
                  <div className="flex-1 h-2 rounded bg-border overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{
                        width: `${Math.max(
                          8,
                          Math.round((day.clicks / Math.max(...stats.clicksByDay.map((entry) => entry.clicks), 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="w-14 text-right text-xs font-medium text-foreground">
                    {day.clicks}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-border p-3">
      <p className="text-[11px] text-muted mb-1">{label}</p>
      <p className="text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
