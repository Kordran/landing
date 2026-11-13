/** Shared drawing for the hero registration field. */

export const INK = "#161a1d";
export const TEAL = "#1c3d57";
export const SUPPORT = "#3e4e5c";
export const SHEET = "#d5dee6";

export const HALF_W = 1.7;
export const HALF_H = 1.02;

/** Resting view. Shallow enough to read as a drawing, deep enough to show two layers. */
export const REST = { x: -0.62, y: 0.48, z: 0.1 };
export const TILT_X = 0.09;
export const TILT_Y = 0.12;
export const AGREED_SHEET = 0.42;
export const OBSERVED_SHEET = 0.28;
export const AMBIENT = 0.012;

export const AGREED_INDEX = -0.42;
export const OBSERVED_INDEX_OPEN = 0.48;
export const OFFSET_OPEN = { x: 0.26, y: 0.4, z: 0.82 };
export const OFFSET_SHUT_Z = 0.03;

export type Vec3 = [number, number, number];

export type Seg = {
  a: Vec3;
  b: Vec3;
  color: string;
  opacity: number;
};

export type Dot = {
  p: Vec3;
  color: string;
};

type Rot = { x: number; y: number; z: number };

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Same column-major XYZ matrix as Three.js Euler order XYZ. */
export function rotateXYZ(p: Vec3, r: Rot): Vec3 {
  const a = Math.cos(r.x);
  const b = Math.sin(r.x);
  const c = Math.cos(r.y);
  const d = Math.sin(r.y);
  const e = Math.cos(r.z);
  const f = Math.sin(r.z);
  const ae = a * e;
  const af = a * f;
  const be = b * e;
  const bf = b * f;
  const m0 = c * e;
  const m4 = -c * f;
  const m8 = d;
  const m1 = af + be * d;
  const m5 = ae - bf * d;
  const m9 = -b * c;
  return [
    m0 * p[0] + m4 * p[1] + m8 * p[2],
    m1 * p[0] + m5 * p[1] + m9 * p[2],
    (bf - ae * d) * p[0] + (be + af * d) * p[1] + a * c * p[2],
  ];
}

export function fieldPose(align: number): {
  offset: Vec3;
  indexX: number;
} {
  const t = clamp01(align);
  return {
    offset: [
      OFFSET_OPEN.x * (1 - t),
      OFFSET_OPEN.y * (1 - t),
      OFFSET_OPEN.z * (1 - t) + OFFSET_SHUT_Z * t,
    ],
    indexX: OBSERVED_INDEX_OPEN * (1 - t) + AGREED_INDEX * t,
  };
}

function add(p: Vec3, q: Vec3): Vec3 {
  return [p[0] + q[0], p[1] + q[1], p[2] + q[2]];
}

function edge(a: Vec3, b: Vec3, color: string, opacity = 1): Seg {
  return { a, b, color, opacity };
}

function plateFrame(color: string): Seg[] {
  const w = HALF_W;
  const h = HALF_H;
  return [
    edge([-w, -h, 0], [w, -h, 0], color),
    edge([w, -h, 0], [w, h, 0], color),
    edge([w, h, 0], [-w, h, 0], color),
    edge([-w, h, 0], [-w, -h, 0], color),
  ];
}

function agreedDatum(): Seg[] {
  const w = HALF_W;
  const h = HALF_H;
  const ticks: Seg[] = [];
  for (let i = 1; i <= 6; i += 1) {
    const x = -w + (i / 7) * w * 2;
    if (Math.abs(x - AGREED_INDEX) < 0.12) continue;
    ticks.push(edge([x, -h, 0], [x, -h + 0.12, 0], INK));
  }
  return [
    edge([-w, -h, 0], [w, -h, 0], INK),
    edge([AGREED_INDEX, -h, 0], [AGREED_INDEX, h, 0], INK),
    ...ticks,
  ];
}

function corners(shift: Vec3 = [0, 0, 0]): Vec3[] {
  const points: Vec3[] = [
    [-HALF_W, -HALF_H, 0],
    [HALF_W, -HALF_H, 0],
    [HALF_W, HALF_H, 0],
    [-HALF_W, HALF_H, 0],
  ];
  return points.map((point) => add(point, shift));
}

export function agreedLocal(): Seg[] {
  return [...plateFrame(SUPPORT), ...agreedDatum()];
}

export function observedLocal(): Seg[] {
  return plateFrame(TEAL);
}

export function segmentsAt(align: number): Seg[] {
  const { offset, indexX } = fieldPose(align);
  const observed = observedLocal().map((seg) => ({
    ...seg,
    a: add(seg.a, offset),
    b: add(seg.b, offset),
  }));
  const index: Seg = edge(
    add([indexX, -HALF_H, 0], offset),
    add([indexX, HALF_H, 0], offset),
    TEAL
  );
  const connectors: Seg[] = [
    edge(
      [AGREED_INDEX, -HALF_H, 0],
      add([indexX, -HALF_H, 0], offset),
      TEAL,
      0.95
    ),
    edge(
      [AGREED_INDEX, HALF_H, 0],
      add([indexX, HALF_H, 0], offset),
      TEAL,
      0.95
    ),
  ];
  return [...agreedLocal(), ...observed, index, ...connectors];
}

export function dotsAt(align: number): Dot[] {
  const { offset } = fieldPose(align);
  return [
    ...corners().map((p) => ({ p, color: INK })),
    ...corners(offset).map((p) => ({ p, color: TEAL })),
  ];
}

export type Frame = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
};

let frameCache: Frame | null = null;

/** World-space window that still contains pointer tilt and the resolved pose. */
export function projectionFrame(): Frame {
  if (frameCache) return frameCache;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const consider = (p: Vec3, rot: Rot) => {
    const q = rotateXYZ(p, rot);
    minX = Math.min(minX, q[0]);
    maxX = Math.max(maxX, q[0]);
    minY = Math.min(minY, q[1]);
    maxY = Math.max(maxY, q[1]);
  };
  for (const align of [0, 1]) {
    for (const py of [-1, 0, 1]) {
      for (const px of [-1, 0, 1]) {
        const rot = {
          x: REST.x + py * TILT_X,
          y: REST.y + px * TILT_Y,
          z: REST.z + AMBIENT,
        };
        for (const seg of segmentsAt(align)) {
          consider(seg.a, rot);
          consider(seg.b, rot);
        }
        for (const dot of dotsAt(align)) consider(dot.p, rot);
      }
    }
  }
  const padX = (maxX - minX) * 0.08;
  const padY = (maxY - minY) * 0.1;
  minX -= padX;
  maxX += padX;
  minY -= padY;
  maxY += padY;
  frameCache = {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
  return frameCache;
}

export type Drawing = {
  viewBox: string;
  width: number;
  height: number;
  sheets: { points: string; fill: string; opacity: number }[];
  lines: { x1: number; y1: number; x2: number; y2: number; stroke: string; opacity: number }[];
  dots: { cx: number; cy: number; fill: string }[];
};

let drawingCache: Drawing | null = null;

/** Static pose used before WebGL and when motion is reduced. */
export function fieldDrawing(): Drawing {
  if (drawingCache) return drawingCache;
  const frame = projectionFrame();
  const screen = (p: Vec3) => {
    const q = rotateXYZ(p, REST);
    return { x: q[0], y: -q[1] };
  };
  const polygon = (shift: Vec3) =>
    corners(shift)
      .map((point) => {
        const p = screen(point);
        return `${p.x},${p.y}`;
      })
      .join(" ");
  const { offset } = fieldPose(0);
  drawingCache = {
    viewBox: `${frame.minX} ${-frame.maxY} ${frame.width} ${frame.height}`,
    width: frame.width,
    height: frame.height,
    sheets: [
      { points: polygon([0, 0, 0]), fill: SHEET, opacity: AGREED_SHEET },
      { points: polygon(offset), fill: SHEET, opacity: OBSERVED_SHEET },
    ],
    lines: segmentsAt(0).map((seg) => {
      const a = screen(seg.a);
      const b = screen(seg.b);
      return {
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
        stroke: seg.color,
        opacity: seg.opacity,
      };
    }),
    dots: dotsAt(0).map((dot) => {
      const p = screen(dot.p);
      return { cx: p.x, cy: p.y, fill: dot.color };
    }),
  };
  return drawingCache;
}
