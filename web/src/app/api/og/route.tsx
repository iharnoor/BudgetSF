import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                backgroundColor: "#2d6a4f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              SF
            </div>
            <span
              style={{
                fontSize: "48px",
                fontWeight: 700,
                color: "#1a1a2e",
              }}
            >
              BudgetSF
            </span>
          </div>
          <p
            style={{
              fontSize: "24px",
              color: "#6c757d",
              textAlign: "center",
              maxWidth: "600px",
            }}
          >
            Cheap food, groceries, gyms & more in SF.
            Community-curated by locals.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "8px",
            }}
          >
            {["🍕 Food", "🛒 Grocery", "💪 Gym", "☕ Coffee", "🍺 Bars"].map(
              (cat) => (
                <div
                  key={cat}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    backgroundColor: "#e9ecef",
                    fontSize: "16px",
                    color: "#1a1a2e",
                  }}
                >
                  {cat}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
