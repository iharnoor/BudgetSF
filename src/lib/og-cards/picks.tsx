import { CardShell, Footer, COLORS } from "./_shell";

export function PicksCard() {
  return (
    <CardShell routeLabel="/picks">
      <div style={{ display: "flex", flexDirection: "column", marginTop: 70 }}>
        <span
          style={{
            display: "flex",
            fontFamily: "DM Serif Display, Georgia, serif",
            fontSize: 72,
            lineHeight: 1.05,
            color: COLORS.ink,
            letterSpacing: "-0.01em",
          }}
        >
          The actual stack
        </span>
        <span
          style={{
            display: "flex",
            fontFamily: "DM Serif Display, Georgia, serif",
            fontSize: 72,
            lineHeight: 1.05,
            color: COLORS.greenDark,
            fontStyle: "italic",
            letterSpacing: "-0.01em",
          }}
        >
          a founder uses.
        </span>
        <span
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 28,
            color: COLORS.muted,
          }}
        >
          Phone, banks, credit card, neighborhoods, gear.
        </span>
      </div>
      <Footer proof="Visible · SoFi · the credit card that nets $0/yr" />
    </CardShell>
  );
}
