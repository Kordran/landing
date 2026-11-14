import type { AxoScene } from "./axo";

/** Prints an axonometric scene. Tones and strokes are set in CSS. */
export default function Axo({
  scene,
  className = "",
  label,
  active,
}: {
  scene: AxoScene;
  className?: string;
  label?: string;
  /** Id of the solid to mark as active. */
  active?: string;
}) {
  return (
    <svg
      className={`axo ${className}`.trim()}
      viewBox={scene.viewBox}
      width={scene.width}
      height={scene.height}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {scene.lines
        .filter((line) => line.kind === "rule")
        .map((line) => (
          <path key={line.d} className="axo-rule" d={line.d} />
        ))}
      {scene.solids.map((solid) => (
        <g
          key={`${solid.top}-${solid.tone}`}
          className={`axo-solid axo-${solid.tone}`}
          data-solid={solid.id}
          data-active={solid.id && solid.id === active ? "true" : undefined}
        >
          <polygon className="axo-lit" points={solid.lit} />
          <polygon className="axo-shade" points={solid.shade} />
          <polygon className="axo-top" points={solid.top} />
        </g>
      ))}
      {scene.lines
        .filter((line) => line.kind !== "rule")
        .map((line) => (
          <path key={line.d} className={`axo-${line.kind}`} d={line.d} />
        ))}
      {scene.labels.map((label) => (
        <text
          key={`${label.x}-${label.y}-${label.text}`}
          className={`axo-label${label.accent ? " is-accent" : ""}`}
          x={label.x}
          y={label.y}
          textAnchor={label.anchor}
        >
          {label.text}
        </text>
      ))}
    </svg>
  );
}
