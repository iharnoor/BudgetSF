import { CardShell, Footer, COLORS } from "./_shell";

export function DietCard() {
  return (
    <CardShell routeLabel="/diet">
      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
        <span
          style={{
            display: "flex",
            fontFamily: "DM Serif Display, Georgia, serif",
            fontSize: 64,
            lineHeight: 1.05,
            color: COLORS.ink,
            letterSpacing: "-0.01em",
          }}
        >
          Live in SF on
        </span>
        <div
          style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 14 }}
        >
          <span
            style={{
              display: "flex",
              fontSize: 200,
              fontWeight: 700,
              color: COLORS.greenDark,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
            }}
          >
            $7.25
          </span>
          <span style={{ display: "flex", fontSize: 32, color: COLORS.muted, fontWeight: 600 }}>
            /day food
          </span>
        </div>
      </div>
      <Footer proof="Costco · Trader Joe's · Mensho on Fridays" />
    </CardShell>
  );
}
