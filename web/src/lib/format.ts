/** Format avg_price for display — handles numbers (12) and strings ("$8-12") */
export function formatPrice(avg_price: number | string | undefined): string | null {
  if (avg_price === undefined || avg_price === null) return null;
  if (typeof avg_price === "number") {
    if (avg_price === 0) return "Free";
    return `~$${avg_price}`;
  }
  // String — already formatted like "$8-12" or "Free"
  const s = String(avg_price).trim();
  if (!s || s === "0") return "Free";
  if (s.startsWith("$")) return `~${s}`;
  if (s.match(/^\d/)) return `~$${s}`;
  return s;
}
