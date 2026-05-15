import type { ReactNode } from "react";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const COLORS = {
  paper: "#faf9f6",
  paperDark: "#ece7d7",
  ink: "#1a1a2e",
  green: "#2d6a4f",
  greenDark: "#1b4332",
  muted: "#6c757d",
  line: "#e5e2da",
};

type CardShellProps = {
  routeLabel: string;
  children: ReactNode;
  background?: string;
};

export function CardShell({ routeLabel, children, background }: CardShellProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          background ??
          `linear-gradient(135deg, ${COLORS.paper} 0%, ${COLORS.paperDark} 100%)`,
        padding: "56px 64px",
        fontFamily: "Geist, system-ui, sans-serif",
        position: "relative",
        color: COLORS.ink,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 48,
          right: 64,
          display: "flex",
          background: "white",
          border: `1px solid ${COLORS.line}`,
          padding: "8px 18px",
          borderRadius: 999,
          fontSize: 22,
          fontWeight: 700,
          color: COLORS.greenDark,
          letterSpacing: "-0.01em",
        }}
      >
        BudgetSF · {routeLabel}
      </div>
      {children}
    </div>
  );
}

export function Footer({ proof }: { proof: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "auto",
        fontSize: 24,
        color: COLORS.muted,
      }}
    >
      <span style={{ display: "flex" }}>{proof}</span>
      <span style={{ display: "flex", color: COLORS.greenDark, fontWeight: 700 }}>budgetsf.com</span>
    </div>
  );
}
