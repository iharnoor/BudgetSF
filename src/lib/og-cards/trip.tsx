import { CardShell, Footer, COLORS } from "./_shell";

export function TripCard() {
  return (
    <CardShell routeLabel="/trip">
      <div style={{ display: "flex", flexDirection: "column", marginTop: 80 }}>
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
          Planning a trip to SF?
        </span>
        <span
          style={{
            display: "flex",
            marginTop: 18,
            fontFamily: "DM Serif Display, Georgia, serif",
            fontStyle: "italic",
            fontSize: 56,
            color: COLORS.greenDark,
          }}
        >
          Skip Union Square.
        </span>
        <span
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 28,
            color: COLORS.muted,
          }}
        >
          Airports, hotels, neighborhoods, networking.
        </span>
      </div>
      <Footer proof="SFO · Kabuki · Hayes Valley · Founders Cafe" />
    </CardShell>
  );
}
