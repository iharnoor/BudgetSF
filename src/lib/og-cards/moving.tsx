import { CardShell, Footer, COLORS } from "./_shell";
import { BUDGET_TOTAL } from "../budget";

export function MovingCard() {
  return (
    <CardShell routeLabel="/moving">
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
          You can live in SF for
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            marginTop: 14,
          }}
        >
          <span
            style={{
              display: "flex",
              fontSize: 168,
              fontWeight: 700,
              color: COLORS.greenDark,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
            }}
          >
            ${BUDGET_TOTAL.toLocaleString()}
          </span>
          <span style={{ display: "flex", fontSize: 28, color: COLORS.muted, fontWeight: 600 }}>
            /month
          </span>
        </div>
        <span
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 30,
            color: COLORS.ink,
            fontFamily: "DM Serif Display, Georgia, serif",
            fontStyle: "italic",
          }}
        >
          if you do these 6 things.
        </span>
      </div>
      <Footer proof="Hacker house · Costco diet · BART · Visible · YMCA" />
    </CardShell>
  );
}
