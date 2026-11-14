/**
 * The surface plate.
 *
 * A reconciliation matrix drawn as machined tiles on one axonometric
 * projection. Rows are price lines, columns are invoices over time. A tile
 * sits flush when the billed price matches the agreement and stands proud by
 * the size of the difference when it does not.
 *
 * This module is the single source for the geometry. The server renders it to
 * SVG, the client renders the same numbers through WebGL, and the two overlay
 * exactly.
 */

export const COLS = 28;
export const ROWS = 14;
export const SIZE = 1;
export const GAP = 0.16;
export const PITCH = SIZE + GAP;
/** Thickness of a flush tile. */
export const BASE = 0.18;
/** A resolved tile keeps a thin plate where the excess used to be. */
export const SETTLED = 0.03;

export const WIDTH = COLS * PITCH - GAP;
export const DEPTH = ROWS * PITCH - GAP;

/** Orthographic view. Azimuth is measured from +Z toward +X. */
export const AZIMUTH = -0.62;
export const ELEVATION = 0.6;

export const TONES = {
  top: "#fdfcfa",
  lit: "#dedbd3",
  shade: "#c3c0b7",
  capTop: "#27506b",
  capLit: "#1c3d57",
  capShade: "#142e42",
  edge: "#161a1d",
  capEdge: "#9bb8c6",
} as const;

export const EDGE_OPACITY = 0.3;
export const CAP_EDGE_OPACITY = 0.38;
export const DATUM_OPACITY = 0.42;

type Run = {
  row: number;
  from: number;
  to: number;
  h: number;
  every?: number;
};

/**
 * Illustrative variance, chosen to show the three patterns the service
 * examines: a price that steps up and stays up, a charge that recurs, and an
 * isolated mismatch.
 */
const RUNS: Run[] = [
  { row: 2, from: 16, to: 27, h: 0.42 },
  { row: 5, from: 7, to: 12, h: 0.26 },
  { row: 5, from: 13, to: 27, h: 0.6 },
  { row: 8, from: 3, to: 27, every: 4, h: 0.34 },
  { row: 10, from: 20, to: 27, h: 0.86 },
  { row: 12, from: 10, to: 11, h: 0.26 },
];

export function varianceAt(col: number, row: number): number {
  let h = 0;
  for (const run of RUNS) {
    if (run.row !== row || col < run.from || col > run.to) continue;
    if (run.every && (col - run.from) % run.every !== 0) continue;
    h = Math.max(h, run.h);
  }
  return h;
}

export type Vec3 = [number, number, number];

const dir: Vec3 = [
  Math.cos(ELEVATION) * Math.sin(AZIMUTH),
  Math.sin(ELEVATION),
  Math.cos(ELEVATION) * Math.cos(AZIMUTH),
];
const right: Vec3 = [Math.cos(AZIMUTH), 0, -Math.sin(AZIMUTH)];
const up: Vec3 = [
  -Math.sin(ELEVATION) * Math.sin(AZIMUTH),
  Math.cos(ELEVATION),
  -Math.sin(ELEVATION) * Math.cos(AZIMUTH),
];

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** World point to camera-plane coordinates. Y grows upward. */
export function project(p: Vec3): [number, number] {
  return [dot(p, right), dot(p, up)];
}

/** Distance toward the camera. Larger is nearer. */
export function nearness(p: Vec3): number {
  return dot(p, dir);
}

export const cameraDirection = dir;

export function tileOrigin(col: number, row: number): [number, number] {
  return [
    col * PITCH - WIDTH / 2 + SIZE / 2,
    row * PITCH - DEPTH / 2 + SIZE / 2,
  ];
}

const DATUM_PAD = 0.7;
export const DATUM = {
  x0: -WIDTH / 2 - DATUM_PAD,
  x1: WIDTH / 2 + DATUM_PAD,
  z0: -DEPTH / 2 - DATUM_PAD,
  z1: DEPTH / 2 + DATUM_PAD,
};

/** Datum edges and graduations as flat [x, z, x, z] segments at y = 0. */
export function datumSegments(): number[] {
  const out: number[] = [];
  const { x0, x1, z0, z1 } = DATUM;
  out.push(x0, z1, x1, z1);
  out.push(x0, z0, x0, z1);
  for (let c = 0; c <= COLS; c += 1) {
    const x = c * PITCH - WIDTH / 2 - GAP / 2;
    out.push(x, z1, x, z1 + (c % 4 === 0 ? 0.56 : 0.26));
  }
  for (let r = 0; r <= ROWS; r += 1) {
    const z = r * PITCH - DEPTH / 2 - GAP / 2;
    out.push(x0, z, x0 - (r % 2 === 0 ? 0.56 : 0.26), z);
  }
  return out;
}

export type Frame = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

/** Fixed camera window. Padded so pointer tilt never clips the plate. */
export const FRAME: Frame = (() => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const { x0, x1, z0, z1 } = DATUM;
  for (const x of [x0 - 0.6, x1]) {
    for (const z of [z0, z1 + 0.6]) {
      for (const y of [0, BASE + 1]) {
        const [sx, sy] = project([x, y, z]);
        minX = Math.min(minX, sx);
        maxX = Math.max(maxX, sx);
        minY = Math.min(minY, sy);
        maxY = Math.max(maxY, sy);
      }
    }
  }
  const padX = (maxX - minX) * 0.03;
  const padY = (maxY - minY) * 0.05;
  return {
    minX: minX - padX,
    minY: minY - padY,
    width: maxX - minX + padX * 2,
    height: maxY - minY + padY * 2,
  };
})();

/** SVG units per world unit. One decimal at this scale keeps gaps even. */
const UNIT = 20;

const fix = (value: number) => {
  const rounded = Math.round(value * 10) / 10;
  return Object.is(rounded, -0) ? "0" : String(rounded);
};

/** Camera-plane point to SVG user units. Y grows downward. */
function toSvg(p: Vec3): [number, number] {
  const [x, y] = project(p);
  return [(x - FRAME.minX) * UNIT, (FRAME.minY + FRAME.height - y) * UNIT];
}

function boxFaces(height: number, lift: number) {
  const h = SIZE / 2;
  const y0 = lift;
  const y1 = lift + height;
  const poly = (points: Vec3[]) => {
    const origin = toSvg([0, 0, 0]);
    return points
      .map((p) => {
        const [x, y] = toSvg(p);
        return `${fix(x - origin[0])},${fix(y - origin[1])}`;
      })
      .join(" ");
  };
  return {
    top: poly([
      [-h, y1, -h],
      [h, y1, -h],
      [h, y1, h],
      [-h, y1, h],
    ]),
    // The camera sits toward -X and +Z, so those are the two visible sides.
    lit: poly([
      [-h, y0, -h],
      [-h, y0, h],
      [-h, y1, h],
      [-h, y1, -h],
    ]),
    shade: poly([
      [-h, y0, h],
      [h, y0, h],
      [h, y1, h],
      [-h, y1, h],
    ]),
  };
}

export type PlateDrawing = {
  viewBox: string;
  aspect: number;
  tile: ReturnType<typeof boxFaces>;
  caps: { id: string; faces: ReturnType<typeof boxFaces> }[];
  /** Back to front. `cap` names the cap symbol drawn on top of the tile. */
  placements: { x: string; y: string; cap?: string }[];
  datum: string;
};

let cache: PlateDrawing | null = null;

/** The plate at rest, as numbers ready to print into SVG. */
export function plateDrawing(): PlateDrawing {
  if (cache) return cache;

  const heights = Array.from(new Set(RUNS.map((run) => run.h))).sort(
    (a, b) => a - b
  );
  const capId = (h: number) => `plate-cap-${heights.indexOf(h)}`;

  const tiles: { near: number; x: string; y: string; cap?: string }[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const [x, z] = tileOrigin(col, row);
      const [sx, sy] = toSvg([x, 0, z]);
      const h = varianceAt(col, row);
      tiles.push({
        near: nearness([x, 0, z]),
        x: fix(sx),
        y: fix(sy),
        cap: h > 0 ? capId(h) : undefined,
      });
    }
  }
  tiles.sort((a, b) => a.near - b.near);

  const segs = datumSegments();
  let datum = "";
  for (let i = 0; i < segs.length; i += 4) {
    const a = toSvg([segs[i], 0, segs[i + 1]]);
    const b = toSvg([segs[i + 2], 0, segs[i + 3]]);
    datum += `M${fix(a[0])} ${fix(a[1])}L${fix(b[0])} ${fix(b[1])}`;
  }

  cache = {
    viewBox: `0 0 ${fix(FRAME.width * UNIT)} ${fix(FRAME.height * UNIT)}`,
    aspect: FRAME.width / FRAME.height,
    tile: boxFaces(BASE, 0),
    caps: heights.map((h) => ({ id: capId(h), faces: boxFaces(h, BASE) })),
    placements: tiles.map(({ x, y, cap }) => ({ x, y, cap })),
    datum,
  };
  return cache;
}

export const RAISED_COUNT = (() => {
  let count = 0;
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (varianceAt(col, row) > 0) count += 1;
    }
  }
  return count;
})();
