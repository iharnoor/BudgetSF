import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export type AffiliateClickEvent = {
  section: string;
  label: string;
  href: string;
  sourcePath: string;
  clickedAt: string;
};

type StoredClickEvent = AffiliateClickEvent & {
  id: string;
};

export type AffiliateLinkSummary = {
  section: string;
  label: string;
  href: string;
  clicks: number;
  lastClickedAt: string;
};

export type AffiliateSectionSummary = {
  section: string;
  clicks: number;
};

export type DailyClicks = {
  day: string;
  clicks: number;
};

export type AffiliateDashboardStats = {
  totalClicks: number;
  uniqueLinks: number;
  uniqueSections: number;
  windowDays: number;
  topLinks: AffiliateLinkSummary[];
  topSections: AffiliateSectionSummary[];
  clicksByDay: DailyClicks[];
  recommendationNotes: string[];
};

const MAX_STORED_CLICKS = 5000;
const CLICK_STORE_PATH = join(process.cwd(), ".data", "affiliate-clicks.json");

let writeQueue = Promise.resolve();

function toISODate(isoDate: string): string {
  return new Date(isoDate).toISOString().slice(0, 10);
}

async function readStoredClicks(): Promise<StoredClickEvent[]> {
  try {
    const raw = await readFile(CLICK_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is StoredClickEvent => {
      if (!item || typeof item !== "object") return false;
      const record = item as Partial<StoredClickEvent>;
      return (
        typeof record.id === "string" &&
        typeof record.section === "string" &&
        typeof record.label === "string" &&
        typeof record.href === "string" &&
        typeof record.sourcePath === "string" &&
        typeof record.clickedAt === "string"
      );
    });
  } catch {
    return [];
  }
}

async function persistClicks(clicks: StoredClickEvent[]): Promise<void> {
  await mkdir(dirname(CLICK_STORE_PATH), { recursive: true });
  await writeFile(CLICK_STORE_PATH, JSON.stringify(clicks, null, 2), "utf8");
}

export async function recordAffiliateClick(click: AffiliateClickEvent): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    const stored = await readStoredClicks();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const next: StoredClickEvent[] = [{ ...click, id }, ...stored].slice(
      0,
      MAX_STORED_CLICKS
    );
    await persistClicks(next);
  });
  await writeQueue;
}

export async function getAffiliateDashboardStats(
  windowDays = 30
): Promise<AffiliateDashboardStats> {
  const stored = await readStoredClicks();
  const cutoff = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
  const recent = stored.filter((event) => new Date(event.clickedAt) >= cutoff);

  const linkMap = new Map<string, AffiliateLinkSummary>();
  const sectionMap = new Map<string, number>();
  const dayMap = new Map<string, number>();

  for (const event of recent) {
    const linkKey = `${event.section}::${event.label}::${event.href}`;
    const existingLink = linkMap.get(linkKey);
    if (existingLink) {
      existingLink.clicks += 1;
      if (event.clickedAt > existingLink.lastClickedAt) {
        existingLink.lastClickedAt = event.clickedAt;
      }
    } else {
      linkMap.set(linkKey, {
        section: event.section,
        label: event.label,
        href: event.href,
        clicks: 1,
        lastClickedAt: event.clickedAt,
      });
    }

    sectionMap.set(event.section, (sectionMap.get(event.section) ?? 0) + 1);
    const day = toISODate(event.clickedAt);
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }

  const topLinks = [...linkMap.values()].sort((a, b) => b.clicks - a.clicks).slice(0, 10);
  const topSections = [...sectionMap.entries()]
    .map(([section, clicks]) => ({ section, clicks }))
    .sort((a, b) => b.clicks - a.clicks);

  const clicksByDay = [...dayMap.entries()]
    .map(([day, clicks]) => ({ day, clicks }))
    .sort((a, b) => a.day.localeCompare(b.day));

  const recommendationNotes: string[] = [];
  if (topSections.length > 0) {
    recommendationNotes.push(
      `Double down on ${topSections[0].section.replaceAll("-", " ")} since it is driving the most clicks right now.`
    );
  }
  if (!sectionMap.has("budget-apartment-mode")) {
    recommendationNotes.push(
      "Add at least one affiliate link inside Budget Apartment Mode where users are already making purchase decisions."
    );
  }
  if (!sectionMap.has("budget-apartment-search")) {
    recommendationNotes.push(
      "Test affiliate links in apartment search tools since high-intent renters are likely to convert."
    );
  }
  recommendationNotes.push(
    "Add links to your About or community pages for always-visible discovery outside the picks page."
  );

  return {
    totalClicks: recent.length,
    uniqueLinks: linkMap.size,
    uniqueSections: sectionMap.size,
    windowDays,
    topLinks,
    topSections,
    clicksByDay,
    recommendationNotes: recommendationNotes.slice(0, 4),
  };
}
