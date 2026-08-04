import { ImageResponse } from "next/og";

export const alt =
  "Kordran. Find the cost. Recover the value. Fix the system.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#111111",
          padding: "72px 80px",
          fontFamily: "Helvetica Neue, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.22em",
          }}
        >
          KORDRAN
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 64,
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          <div>Find the cost.</div>
          <div>Recover the value.</div>
          <div>Fix the system.</div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#303030",
            maxWidth: 720,
            lineHeight: 1.4,
          }}
        >
          Landed-cost recovery for complex hardware supply chains.
        </div>
      </div>
    ),
    size
  );
}
