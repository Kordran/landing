import { Fragment } from "react";
import {
  CAP_EDGE_OPACITY,
  DATUM_OPACITY,
  EDGE_OPACITY,
  TONES,
  plateDrawing,
} from "./model";

/**
 * The plate at rest, drawn on the server. It is the first paint, the
 * reduced-motion version, and the fallback when WebGL is unavailable.
 */
export default function PlateArt() {
  const drawing = plateDrawing();

  return (
    <svg
      className="plate-art"
      viewBox={drawing.viewBox}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <g
          id="plate-tile"
          stroke={TONES.edge}
          strokeOpacity={EDGE_OPACITY}
          strokeLinejoin="round"
        >
          <polygon points={drawing.tile.lit} fill={TONES.lit} />
          <polygon points={drawing.tile.shade} fill={TONES.shade} />
          <polygon points={drawing.tile.top} fill={TONES.top} />
        </g>
        {drawing.caps.map((cap) => {
          const tone = cap.tone === "back" ? "back" : "over";
          const fill =
            tone === "back"
              ? {
                  lit: TONES.backLit,
                  shade: TONES.backShade,
                  top: TONES.backTop,
                  edge: TONES.backEdge,
                }
              : {
                  lit: TONES.capLit,
                  shade: TONES.capShade,
                  top: TONES.capTop,
                  edge: TONES.capEdge,
                };
          return (
            <g
              key={cap.id}
              id={cap.id}
              stroke={fill.edge}
              strokeOpacity={CAP_EDGE_OPACITY}
              strokeLinejoin="round"
            >
              <polygon points={cap.faces.lit} fill={fill.lit} />
              <polygon points={cap.faces.shade} fill={fill.shade} />
              <polygon points={cap.faces.top} fill={fill.top} />
            </g>
          );
        })}
      </defs>
      <path
        d={drawing.datum}
        fill="none"
        stroke={TONES.edge}
        strokeOpacity={DATUM_OPACITY}
      />
      {drawing.placements.map((tile) => (
        <Fragment key={`${tile.x}:${tile.y}`}>
          <use href="#plate-tile" x={tile.x} y={tile.y} />
          {tile.cap ? (
            <use href={`#${tile.cap}`} x={tile.x} y={tile.y} />
          ) : null}
        </Fragment>
      ))}
    </svg>
  );
}
