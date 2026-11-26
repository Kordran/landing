import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { contactEmail, shareImagePlaces, siteName } from "@/lib/site";

export const shareImageSize = { width: 1200, height: 630 };

const hairlines = [72, 220, 280, 920, 1088];

export async function createShareImage(title: string) {
  const font = await readFile(
    join(process.cwd(), "assets/Alexandria-400.ttf"),
  );
  const footer = `${shareImagePlaces} · ${contactEmail}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FFFFFF",
          position: "relative",
          color: "#111111",
        }}
      >
        {hairlines.map((left) => (
          <div
            key={left}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left,
              width: 1,
              background: "#E6E5E3",
            }}
          />
        ))}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "72px 88px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                position: "relative",
                width: 72,
                height: 72,
              }}
            >
              <div
                style={{ width: 40, height: 40, background: "#1C3D57" }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 28,
                  top: 28,
                  width: 40,
                  height: 40,
                  background: "#161A1D",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: 24,
                fontSize: 40,
                fontFamily: "Alexandria",
                letterSpacing: "-0.03em",
              }}
            >
              {siteName}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 52,
              lineHeight: 1.15,
              fontFamily: "Alexandria",
              letterSpacing: "-0.03em",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#5d6771",
              fontFamily: "Alexandria",
            }}
          >
            {footer}
          </div>
        </div>
      </div>
    ),
    {
      ...shareImageSize,
      fonts: [
        {
          name: "Alexandria",
          data: font,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
