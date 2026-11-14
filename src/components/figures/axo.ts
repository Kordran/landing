import { nearness, project, type Vec3 } from "@/components/plate/model";

/**
 * Small axonometric drawings in the same projection as the hero plate, so
 * every figure on the site belongs to one drawn world.
 */

export type AxoTone = "paper" | "teal" | "tint" | "ghost";

export type AxoBox = {
  /** Minimum corner. Y is up. */
  at: Vec3;
  /** Width along X, height along Y, depth along Z. */
  size: Vec3;
  tone?: AxoTone;
  id?: string;
};

export type AxoLine = {
  from: Vec3;
  to: Vec3;
  /** `space` reserves room in the frame without drawing anything. */
  kind?: "rule" | "dash" | "accent" | "space";
};

export type AxoLabel = {
  at: Vec3;
  text: string;
  anchor?: "start" | "middle" | "end";
  dx?: number;
  dy?: number;
  accent?: boolean;
};

export type AxoScene = {
  viewBox: string;
  width: number;
  height: number;
  solids: {
    id?: string;
    tone: AxoTone;
    top: string;
    lit: string;
    shade: string;
  }[];
  lines: { d: string; kind: "rule" | "dash" | "accent" }[];
  labels: {
    x: number;
    y: number;
    text: string;
    anchor: NonNullable<AxoLabel["anchor"]>;
    accent: boolean;
  }[];
};

const UNIT = 24;
const round = (value: number) => {
  const rounded = Math.round(value * 10) / 10;
  return Object.is(rounded, -0) ? 0 : rounded;
};

export function axoScene({
  boxes,
  frame,
  lines = [],
  labels = [],
  pad = [12, 12, 12, 12],
}: {
  boxes: AxoBox[];
  /** Boxes that set the frame instead, so an animated scene never resizes. */
  frame?: AxoBox[];
  lines?: AxoLine[];
  labels?: AxoLabel[];
  /** Top, right, bottom, left padding in SVG units. */
  pad?: [number, number, number, number];
}): AxoScene {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const see = (p: Vec3) => {
    const [x, y] = project(p);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  };

  for (const box of frame ?? boxes) {
    const [x, y, z] = box.at;
    const [w, h, d] = box.size;
    for (const px of [x, x + w]) {
      for (const py of [y, y + h]) {
        for (const pz of [z, z + d]) see([px, py, pz]);
      }
    }
  }
  for (const line of lines) {
    see(line.from);
    see(line.to);
  }
  for (const label of labels) see(label.at);

  const [padTop, padRight, padBottom, padLeft] = pad;
  const place = (p: Vec3): [number, number] => {
    const [x, y] = project(p);
    return [
      round((x - minX) * UNIT + padLeft),
      round((maxY - y) * UNIT + padTop),
    ];
  };
  const polygon = (points: Vec3[]) =>
    points.map((p) => place(p).join(",")).join(" ");

  const sorted = [...boxes].sort((a, b) => {
    const center = (box: AxoBox): Vec3 => [
      box.at[0] + box.size[0] / 2,
      box.at[1] + box.size[1] / 2,
      box.at[2] + box.size[2] / 2,
    ];
    return nearness(center(a)) - nearness(center(b));
  });

  const width = round((maxX - minX) * UNIT + padLeft + padRight);
  const height = round((maxY - minY) * UNIT + padTop + padBottom);

  return {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    solids: sorted.map((box) => {
      const [x, y, z] = box.at;
      const [w, h, d] = box.size;
      return {
        id: box.id,
        tone: box.tone ?? "paper",
        top: polygon([
          [x, y + h, z],
          [x + w, y + h, z],
          [x + w, y + h, z + d],
          [x, y + h, z + d],
        ]),
        // The camera sits toward -X and +Z.
        lit: polygon([
          [x, y, z],
          [x, y, z + d],
          [x, y + h, z + d],
          [x, y + h, z],
        ]),
        shade: polygon([
          [x, y, z + d],
          [x + w, y, z + d],
          [x + w, y + h, z + d],
          [x, y + h, z + d],
        ]),
      };
    }),
    lines: lines
      .filter((line) => line.kind !== "space")
      .map((line) => {
        const a = place(line.from);
        const b = place(line.to);
        return {
          d: `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`,
          kind: (line.kind ?? "rule") as "rule" | "dash" | "accent",
        };
      }),
    labels: labels.map((label) => {
      const [x, y] = place(label.at);
      return {
        x: round(x + (label.dx ?? 0)),
        y: round(y + (label.dy ?? 0)),
        text: label.text,
        anchor: label.anchor ?? "start",
        accent: Boolean(label.accent),
      };
    }),
  };
}

/** A grid of flush tiles on the ground plane, with optional raised caps. */
export function tileField({
  cols,
  rows,
  raised = [],
  size = 1,
  gap = 0.16,
  base = 0.18,
}: {
  cols: number;
  rows: number;
  raised?: { col: number; row: number; h: number }[];
  size?: number;
  gap?: number;
  base?: number;
}): AxoBox[] {
  const pitch = size + gap;
  const boxes: AxoBox[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      boxes.push({
        at: [col * pitch, 0, row * pitch],
        size: [size, base, size],
      });
    }
  }
  for (const cap of raised) {
    boxes.push({
      at: [cap.col * pitch, base, cap.row * pitch],
      size: [size, cap.h, size],
      tone: "teal",
    });
  }
  return boxes;
}
