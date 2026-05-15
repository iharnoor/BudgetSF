import { CardShell, Footer, COLORS } from "./_shell";

export function DefaultCard() {
  return (
    <CardShell routeLabel="open source">
      <div style={{ display: "flex", flexDirection: "column", marginTop: 90 }}>
        <span
          style={{
            display: "flex",
            fontFamily: "DM Serif Display, Georgia, serif",
            fontSize: 84,
            lineHeight: 1.05,
            color: COLORS.ink,
            letterSpacing: "-0.01em",
          }}
        >
          The guide to SF
        </span>
        <span
          style={{
            display: "flex",
            fontFamily: "DM Serif Display, Georgia, serif",
            fontStyle: "italic",
            fontSize: 84,
            color: COLORS.greenDark,
            lineHeight: 1.05,
          }}
        >
          I wish I had.
        </span>
        <span
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            color: COLORS.muted,
          }}
        >
          Cheap food, gyms, hacker houses, free things. Community curated.
        </span>
      </div>
      <Footer proof="144+ spots · open source · by locals" />
    </CardShell>
  );
}
