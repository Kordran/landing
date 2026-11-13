import { ImageResponse } from "next/og";

export const alt =
  "Kordran. Supplier costs, verified and resolved. Example comparison of a $42 agreed unit price and a $44 billed unit price.";
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
          background: "#FFFFFF",
          color: "#161A1D",
          padding: "64px 72px 56px",
          fontFamily: "Helvetica Neue, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 42, height: 42, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 18,
                height: 18,
                background: "#1C3D57",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 18,
                height: 18,
                background: "#161A1D",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.22em",
            }}
          >
            KORDRAN
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: "0.14em",
              color: "#1C3D57",
              textTransform: "uppercase",
            }}
          >
            Supplier cost intelligence + execution
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 500,
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
            }}
          >
            <div>Supplier costs.</div>
            <div>Verified and resolved.</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            background: "#FFFFFF",
            border: "1px solid #D8DDE1",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "18px 28px",
              flex: 1,
            }}
          >
            <div style={{ display: "flex", fontSize: 14, color: "#5C6770" }}>
              Agreed unit price
            </div>
            <div style={{ display: "flex", fontSize: 32, fontWeight: 500 }}>
              $42.00
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "18px 28px",
              flex: 1,
              borderLeft: "1px solid #D8DDE1",
            }}
          >
            <div style={{ display: "flex", fontSize: 14, color: "#5C6770" }}>
              Billed unit price
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 32,
                fontWeight: 500,
                color: "#1C3D57",
              }}
            >
              $44.00
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "18px 28px",
              flex: 1.15,
              borderLeft: "1px solid #D8DDE1",
            }}
          >
            <div style={{ display: "flex", fontSize: 14, color: "#5C6770" }}>
              Difference
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 32,
                fontWeight: 500,
                color: "#1C3D57",
              }}
            >
              $2.00 / unit
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
