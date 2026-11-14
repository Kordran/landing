import * as THREE from "three";
import {
  BASE,
  CAP_EDGE_OPACITY,
  COLS,
  DATUM,
  DATUM_OPACITY,
  EDGE_OPACITY,
  FRAME,
  PITCH,
  ROWS,
  SETTLED,
  SIZE,
  TONES,
  WIDTH,
  cameraDirection,
  datumSegments,
  tileOrigin,
  varianceAt,
} from "./model";

export type PlateHover = {
  col: number;
  row: number;
  raised: boolean;
  resolved: boolean;
} | null;

export type PlateHandle = {
  destroy: () => void;
};

type MountOptions = {
  onReady: () => void;
  onLost: () => void;
  onHover: (hover: PlateHover) => void;
  onResolve: (count: number, col: number, row: number) => void;
  /**
   * Elements pinned to a tile. Each carries `data-col` and `data-row`; the
   * scene moves it to that tile's top face every frame so labels follow the
   * tilt exactly.
   */
  anchors: () => HTMLElement[];
};

/** Pointer tilt, in radians at the edge of the stage. */
const TILT_X = 0.028;
const TILT_Y = 0.045;
/** Seconds for the inspection light to cross the plate. */
const SCAN_PERIOD = 18;
/** Hero scroll distance, in pixels, over which the excess settles. */
const SETTLE_SPAN = 460;
/** Seconds a clicked cap takes to come down. */
const RESOLVE_TIME = 0.7;
/** Not yet resolved. Any time far in the future. */
const NEVER = 1e6;
/**
 * One invoice travels each price line that was billed above agreement, so you
 * can watch it light up exactly where the overbilling is. Lines billed as
 * agreed stay still.
 */
const TRAVEL = 2.4;
/** Height of a travelling line above the surface it is crossing. */
const RIDE = 0.16;

const tileVertex = /* glsl */ `
  attribute float aLift;
  attribute float aKind;
  attribute float aResolveAt;
  uniform float uAlign;
  uniform float uBase;
  uniform float uSettled;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vFace;
  varying float vKind;
  varying vec2 vOrigin;
  varying float vAcross;
  varying float vResolving;

  void main() {
    vUv = uv;
    vFace = normal;
    vKind = aKind;
    vec4 origin = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vOrigin = origin.xz;
    vAcross = origin.x + position.x;
    float height = uBase;
    float lift = 0.0;
    vResolving = 0.0;
    if (aKind > 0.5) {
      float done = smoothstep(aResolveAt, aResolveAt + ${RESOLVE_TIME.toFixed(2)}, uTime);
      vResolving = done * (1.0 - smoothstep(aResolveAt + 0.4, aResolveAt + 1.6, uTime));
      height = mix(aLift, uSettled, max(uAlign, done));
      lift = uBase;
    }
    vec3 p = position;
    p.y = (p.y + 0.5) * height + lift;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(p, 1.0);
  }
`;

// Three fixed tones per solid and a constant-width edge. Colors are written as
// authored so the canvas matches the SVG and the page exactly.
const tileFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uTop;
  uniform vec3 uLit;
  uniform vec3 uShade;
  uniform vec3 uCapTop;
  uniform vec3 uCapLit;
  uniform vec3 uCapShade;
  uniform vec3 uEdge;
  uniform vec3 uCapEdge;
  uniform float uEdgeOpacity;
  uniform float uCapEdgeOpacity;
  uniform vec3 uBeam;
  uniform float uScan;
  uniform float uScanOn;
  uniform vec2 uHover;
  uniform float uHoverOn;
  uniform float uHoverRow;
  varying vec2 vUv;
  varying vec3 vFace;
  varying float vKind;
  varying vec2 vOrigin;
  varying float vAcross;
  varying float vResolving;

  void main() {
    bool cap = vKind > 0.5;
    bool top = vFace.y > 0.5;
    vec3 color;
    if (top) color = cap ? uCapTop : uTop;
    else if (abs(vFace.x) > 0.5) color = cap ? uCapLit : uLit;
    else color = cap ? uCapShade : uShade;

    // The inspection light: a narrow band on the flush surface, and a wider
    // lift on any solid it is passing.
    float beam = exp(-pow((vAcross - uScan) / 0.3, 2.0)) * uScanOn;
    float pass = exp(-pow((vOrigin.x - uScan) / 1.2, 2.0)) * uScanOn;
    if (cap) color = mix(color, uCapEdge, pass * 0.3);
    else if (top) color = mix(color, uBeam, beam * 0.85);

    // The line under the pointer is read across its whole length.
    float onRow = uHoverOn * (1.0 - step(0.5, abs(vOrigin.y - uHoverRow)));
    if (top && !cap) color = mix(color, uBeam, onRow * 0.28);

    vec2 away = abs(vOrigin - uHover);
    float hover = uHoverOn * (1.0 - step(0.5, max(away.x, away.y)));
    if (cap) color = mix(color, uCapEdge, hover * 0.35 + vResolving * 0.5);

    vec2 w = max(fwidth(vUv), vec2(1e-5));
    vec2 d = min(vUv, 1.0 - vUv) / w;
    float line = 1.0 - smoothstep(0.5, 1.4, min(d.x, d.y));
    vec3 edge = cap ? uCapEdge : mix(uEdge, uCapLit, hover);
    float strength = cap ? uCapEdgeOpacity : uEdgeOpacity;
    strength = mix(strength, 1.0, hover);
    gl_FragColor = vec4(mix(color, edge, line * strength), 1.0);
  }
`;

// Each point is one invoice line moving along its price line. It rides over
// whatever stands on the plate, and turns pale where it crosses an excess.
const flowVertex = /* glsl */ `
  attribute float aRow;
  attribute float aPhase;
  attribute float aSpeed;
  uniform sampler2D uHeights;
  uniform float uTime;
  uniform float uAlign;
  uniform float uBase;
  uniform float uSettled;
  uniform float uPixel;
  uniform float uHoverRow;
  uniform float uHoverOn;
  varying float vRide;
  varying float vAlpha;

  const float LEFT = ${(-WIDTH / 2).toFixed(4)};
  const float START = ${(DATUM.x0 - 1.2).toFixed(4)};
  const float SPAN = ${(DATUM.x1 - DATUM.x0 + 2.4).toFixed(4)};
  const float PITCH = ${PITCH.toFixed(4)};
  const float FILL = ${(SIZE / PITCH).toFixed(4)};

  float excessAt(float col, float row) {
    if (col < 0.0 || col > ${(COLS - 1).toFixed(1)}) return 0.0;
    vec2 cell = texelFetch(uHeights, ivec2(int(col), int(row)), 0).rg;
    float done = smoothstep(cell.g, cell.g + ${RESOLVE_TIME.toFixed(2)}, uTime);
    float h = cell.r;
    return h > 0.0 ? mix(h, uSettled, max(uAlign, done)) : 0.0;
  }

  void main() {
    float travelled = fract(aPhase + uTime * aSpeed / SPAN);
    float x = START + travelled * SPAN;
    float c = (x - LEFT) / PITCH;
    float col = floor(c);
    float f = c - col;
    float here = excessAt(col, aRow);
    float next = excessAt(col + 1.0, aRow);
    float h = mix(here, next, smoothstep(FILL - 0.02, 1.0, f));
    float z = aRow * PITCH - ${((ROWS * PITCH - PITCH) / 2).toFixed(4)};
    vec3 p = vec3(x, uBase + h + ${RIDE.toFixed(2)}, z);

    vRide = smoothstep(0.04, 0.2, h - uSettled * 0.5);
    float edges = smoothstep(0.0, 0.06, travelled) * (1.0 - smoothstep(0.94, 1.0, travelled));
    float onRow = uHoverOn * (1.0 - step(0.5, abs(aRow - uHoverRow)));
    vAlpha = edges * mix(0.62, 1.0, max(vRide, onRow));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uPixel * mix(7.0, 9.0, max(vRide, onRow * 0.6));
  }
`;

const flowFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uInk;
  uniform vec3 uPale;
  varying float vRide;
  varying float vAlpha;

  void main() {
    vec2 c = abs(gl_PointCoord - 0.5);
    float square = 1.0 - smoothstep(0.36, 0.5, max(c.x, c.y));
    gl_FragColor = vec4(mix(uInk, uPale, vRide), square * vAlpha);
  }
`;

/** Authored sRGB hex to a plain vector. The shader writes it back unchanged. */
const rgb = (hex: string) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return new THREE.Vector3(
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255
  );
};

export function mountPlate(
  host: HTMLElement,
  options: MountOptions
): PlateHandle {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    stencil: false,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    FRAME.minX,
    FRAME.minX + FRAME.width,
    FRAME.minY + FRAME.height,
    FRAME.minY,
    0.1,
    200
  );
  camera.position.set(
    cameraDirection[0] * 60,
    cameraDirection[1] * 60,
    cameraDirection[2] * 60
  );
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();

  const rig = new THREE.Group();
  scene.add(rig);

  const disposables: Array<{ dispose: () => void }> = [];

  const raised: { col: number; row: number; h: number }[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const h = varianceAt(col, row);
      if (h > 0) raised.push({ col, row, h });
    }
  }

  const total = COLS * ROWS + raised.length;
  const box = new THREE.BoxGeometry(SIZE, 1, SIZE);
  const lift = new Float32Array(total);
  const kind = new Float32Array(total);
  const resolveAt = new Float32Array(total).fill(NEVER);
  const uTime = { value: 0 };
  const uAlign = { value: 0 };
  const uHoverRow = { value: -99 };
  const uHoverOn = { value: 0 };
  const material = new THREE.ShaderMaterial({
    vertexShader: tileVertex,
    fragmentShader: tileFragment,
    uniforms: {
      uAlign,
      uTime,
      uBase: { value: BASE },
      uSettled: { value: SETTLED },
      uScan: { value: DATUM.x0 },
      uScanOn: { value: 0 },
      uBeam: { value: rgb(TONES.beam) },
      uHover: { value: new THREE.Vector2(999, 999) },
      uHoverOn,
      uHoverRow: { value: 999 },
      uTop: { value: rgb(TONES.top) },
      uLit: { value: rgb(TONES.lit) },
      uShade: { value: rgb(TONES.shade) },
      uCapTop: { value: rgb(TONES.capTop) },
      uCapLit: { value: rgb(TONES.capLit) },
      uCapShade: { value: rgb(TONES.capShade) },
      uEdge: { value: rgb(TONES.edge) },
      uCapEdge: { value: rgb(TONES.capEdge) },
      uEdgeOpacity: { value: EDGE_OPACITY },
      uCapEdgeOpacity: { value: CAP_EDGE_OPACITY },
    },
  });
  const tiles = new THREE.InstancedMesh(box, material, total);
  const matrix = new THREE.Matrix4();
  const capIndex = new Map<string, number>();
  let index = 0;
  const place = (col: number, row: number) => {
    const [x, z] = tileOrigin(col, row);
    matrix.makeTranslation(x, 0, z);
    tiles.setMatrixAt(index, matrix);
  };
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      place(col, row);
      index += 1;
    }
  }
  for (const tile of raised) {
    place(tile.col, tile.row);
    lift[index] = tile.h;
    kind[index] = 1;
    capIndex.set(`${tile.col}:${tile.row}`, index);
    index += 1;
  }
  box.setAttribute("aLift", new THREE.InstancedBufferAttribute(lift, 1));
  box.setAttribute("aKind", new THREE.InstancedBufferAttribute(kind, 1));
  const resolveAttr = new THREE.InstancedBufferAttribute(resolveAt, 1);
  box.setAttribute("aResolveAt", resolveAttr);
  tiles.frustumCulled = false;
  rig.add(tiles);
  disposables.push(box, material);

  // Heights and resolve times per tile, read by the travelling lines.
  const cells = new Float32Array(COLS * ROWS * 2);
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const i = (row * COLS + col) * 2;
      cells[i] = varianceAt(col, row);
      cells[i + 1] = NEVER;
    }
  }
  const heights = new THREE.DataTexture(
    cells,
    COLS,
    ROWS,
    THREE.RGFormat,
    THREE.FloatType
  );
  heights.needsUpdate = true;
  disposables.push(heights);

  const flowRows: number[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (varianceAt(col, row) > 0) {
        flowRows.push(row);
        break;
      }
    }
  }
  const count = flowRows.length;
  const flowGeometry = new THREE.BufferGeometry();
  const rowAttr = new Float32Array(count);
  const phaseAttr = new Float32Array(count);
  const speedAttr = new Float32Array(count);
  // Evenly staggered, so the invoices cross the plate one after another.
  flowRows.forEach((row, i) => {
    rowAttr[i] = row;
    phaseAttr[i] = i / count;
    speedAttr[i] = TRAVEL;
  });
  flowGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(count * 3), 3)
  );
  flowGeometry.setAttribute("aRow", new THREE.BufferAttribute(rowAttr, 1));
  flowGeometry.setAttribute("aPhase", new THREE.BufferAttribute(phaseAttr, 1));
  flowGeometry.setAttribute("aSpeed", new THREE.BufferAttribute(speedAttr, 1));
  const uPixel = { value: 1 };
  const flowMaterial = new THREE.ShaderMaterial({
    vertexShader: flowVertex,
    fragmentShader: flowFragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uHeights: { value: heights },
      uTime,
      uAlign,
      uBase: { value: BASE },
      uSettled: { value: SETTLED },
      uPixel,
      uHoverRow,
      uHoverOn,
      uInk: { value: rgb(TONES.capLit) },
      uPale: { value: rgb(TONES.capEdge) },
    },
  });
  const flow = new THREE.Points(flowGeometry, flowMaterial);
  flow.frustumCulled = false;
  flow.renderOrder = 1;
  rig.add(flow);
  disposables.push(flowGeometry, flowMaterial);

  const segs = datumSegments();
  const datumPositions = new Float32Array((segs.length / 4) * 6);
  for (let i = 0, o = 0; i < segs.length; i += 4, o += 6) {
    datumPositions[o] = segs[i];
    datumPositions[o + 2] = segs[i + 1];
    datumPositions[o + 3] = segs[i + 2];
    datumPositions[o + 5] = segs[i + 3];
  }
  const datumGeometry = new THREE.BufferGeometry();
  datumGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(datumPositions, 3)
  );
  const datumMaterial = new THREE.LineBasicMaterial({
    color: TONES.edge,
    transparent: true,
    opacity: DATUM_OPACITY,
  });
  rig.add(new THREE.LineSegments(datumGeometry, datumMaterial));
  disposables.push(datumGeometry, datumMaterial);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let hoverWanted = 0;
  let hoverKey = "";
  let resolvedCount = 0;
  let align = 0;
  let raf = 0;
  let running = true;
  let ready = false;
  let visible = false;
  let last = performance.now();
  let acc = 0;

  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width < 2 || height < 2) return;
    const cap = width < 900 ? 1.5 : 2;
    const ratio = Math.min(window.devicePixelRatio || 1, cap);
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    // Points keep the same size on screen at every stage width.
    uPixel.value = ratio * Math.max(0.75, Math.min(1.25, width / 1100));
  };

  const readAlign = () => {
    const section = host.closest("section");
    if (!section) return 0;
    const traveled = Math.max(0, -section.getBoundingClientRect().top);
    const raw = Math.min(1, traveled / SETTLE_SPAN);
    return raw * raw * (3 - 2 * raw);
  };

  const isResolved = (col: number, row: number) => {
    const i = capIndex.get(`${col}:${row}`);
    return i !== undefined && resolveAt[i] < NEVER;
  };

  const capTop = (col: number, row: number) => {
    const h = varianceAt(col, row);
    if (h <= 0) return BASE;
    const flat = isResolved(col, row) ? 1 : align;
    return BASE + h + (SETTLED - h) * flat;
  };

  const ray = new THREE.Ray();
  const inverse = new THREE.Matrix4();
  const hit = new THREE.Vector3();
  const boxMin = new THREE.Vector3();
  const boxMax = new THREE.Vector3();
  const bounds = new THREE.Box3();

  /** Tile under the pointer: raised solids first, then the flush surface. */
  const pick = (nx: number, ny: number): PlateHover => {
    ray.origin.set(nx, ny, -1).unproject(camera);
    ray.direction.set(
      -cameraDirection[0],
      -cameraDirection[1],
      -cameraDirection[2]
    );
    ray.applyMatrix4(inverse.copy(rig.matrixWorld).invert());

    let best: PlateHover = null;
    let bestDistance = Infinity;
    for (const tile of raised) {
      const [x, z] = tileOrigin(tile.col, tile.row);
      boxMin.set(x - SIZE / 2, 0, z - SIZE / 2);
      boxMax.set(x + SIZE / 2, capTop(tile.col, tile.row), z + SIZE / 2);
      bounds.set(boxMin, boxMax);
      if (!ray.intersectBox(bounds, hit)) continue;
      const distance = hit.distanceToSquared(ray.origin);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = {
          col: tile.col,
          row: tile.row,
          raised: true,
          resolved: isResolved(tile.col, tile.row),
        };
      }
    }
    if (best) return best;

    const t = (ray.origin.y - BASE) / -ray.direction.y;
    if (!Number.isFinite(t) || t < 0) return null;
    ray.at(t, hit);
    const col = Math.round((hit.x + (COLS * PITCH - PITCH) / 2) / PITCH);
    const row = Math.round((hit.z + (ROWS * PITCH - PITCH) / 2) / PITCH);
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
    const [x, z] = tileOrigin(col, row);
    if (Math.abs(hit.x - x) > SIZE / 2 || Math.abs(hit.z - z) > SIZE / 2)
      return null;
    return { col, row, raised: false, resolved: false };
  };

  const setHover = (next: PlateHover) => {
    const key = next ? `${next.col}:${next.row}:${next.resolved}` : "";
    if (key === hoverKey) return;
    hoverKey = key;
    if (next) {
      const [x, z] = tileOrigin(next.col, next.row);
      material.uniforms.uHover.value.set(x, z);
      material.uniforms.uHoverRow.value = z;
      uHoverRow.value = next.row;
      hoverWanted = 1;
    } else {
      hoverWanted = 0;
    }
    host.style.cursor = next?.raised && !next.resolved ? "pointer" : "";
    options.onHover(next);
  };

  const resolve = (col: number, row: number) => {
    const i = capIndex.get(`${col}:${row}`);
    if (i === undefined || resolveAt[i] < NEVER) return;
    resolveAt[i] = uTime.value;
    resolveAttr.needsUpdate = true;
    cells[(row * COLS + col) * 2 + 1] = uTime.value;
    heights.needsUpdate = true;
    resolvedCount += 1;
    options.onResolve(resolvedCount, col, row);
    hoverKey = "";
    setHover({ col, row, raised: true, resolved: true });
  };

  const locate = (event: PointerEvent | MouseEvent) => {
    const rect = host.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return null;
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    return { nx, ny, inside: Math.abs(nx) <= 1 && Math.abs(ny) <= 1 };
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const at = locate(event);
    if (!at) return;
    pointer.tx = Math.max(-1, Math.min(1, at.nx));
    pointer.ty = Math.max(-1, Math.min(1, -at.ny));
    const overText =
      event.target instanceof Element &&
      event.target.closest(".hero-body a, .hero-body button, .hero-rail");
    setHover(at.inside && !overText ? pick(at.nx, at.ny) : null);
    start();
  };

  const onClick = (event: MouseEvent) => {
    if (
      event.target instanceof Element &&
      event.target.closest("a, button, input, textarea, summary")
    )
      return;
    const at = locate(event);
    if (!at?.inside) return;
    const found = pick(at.nx, at.ny);
    if (found?.raised && !found.resolved) resolve(found.col, found.row);
    else setHover(found);
    start();
  };

  const onPointerLeave = () => {
    pointer.tx = 0;
    pointer.ty = 0;
    setHover(null);
  };

  const onLost = (event: Event) => {
    event.preventDefault();
    options.onLost();
    destroy();
  };

  const point = new THREE.Vector3();
  const placeAnchors = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    for (const node of options.anchors()) {
      const col = Number(node.dataset.col);
      const row = Number(node.dataset.row);
      if (!Number.isFinite(col) || !Number.isFinite(row)) continue;
      const [x, z] = tileOrigin(col, row);
      point.set(x, capTop(col, row), z).applyMatrix4(rig.matrixWorld);
      point.project(camera);
      node.style.left = `${((point.x + 1) / 2) * width}px`;
      node.style.top = `${((1 - point.y) / 2) * height}px`;
    }
  };

  const step = (dt: number) => {
    if (host.clientWidth < 2 || host.clientHeight < 2) return;
    uTime.value += dt;

    align = readAlign();
    const ease = Math.min(1, dt * 5);
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;
    uAlign.value = align;
    uHoverOn.value += (hoverWanted - uHoverOn.value) * Math.min(1, dt * 12);
    rig.rotation.set(pointer.y * TILT_X, pointer.x * TILT_Y, 0);
    rig.updateMatrixWorld();

    // One slow pass, a pause off the plate, then again.
    const phase = (uTime.value / SCAN_PERIOD) % 1;
    const travel = Math.min(1, phase / 0.82);
    const x = DATUM.x0 + (DATUM.x1 - DATUM.x0) * travel;
    const fade = Math.min(1, travel / 0.06) * Math.min(1, (1 - travel) / 0.06);
    material.uniforms.uScan.value = x;
    material.uniforms.uScanOn.value = fade * (1 - align);

    renderer.render(scene, camera);
    placeAnchors();
    if (!ready) {
      ready = true;
      options.onReady();
    }
  };

  const loop = (now: number) => {
    if (!running || !visible || document.visibilityState === "hidden") {
      raf = 0;
      return;
    }
    raf = window.requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    // Thirty frames a second is smooth for slow travel and halves the cost.
    const budget = hoverWanted || Math.abs(pointer.tx - pointer.x) > 0.01 ? 1 / 60 : 1 / 30;
    acc += dt;
    if (acc < budget) return;
    const stepDt = Math.min(0.05, acc);
    acc = 0;
    step(stepDt);
  };

  function start() {
    if (!running || raf || !visible) return;
    last = performance.now();
    acc = 0.016;
    raf = window.requestAnimationFrame(loop);
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
    },
    { threshold: 0 }
  );

  const onVisibility = () => {
    if (document.visibilityState === "visible") start();
  };

  const sizer = new ResizeObserver(() => {
    resize();
    start();
  });

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("click", onClick);
  document.documentElement.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("webglcontextlost", onLost);
  document.addEventListener("visibilitychange", onVisibility);
  observer.observe(host);
  sizer.observe(host);
  resize();
  visible = true;
  start();

  function destroy() {
    if (!running) return;
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    observer.disconnect();
    sizer.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("click", onClick);
    document.documentElement.removeEventListener(
      "pointerleave",
      onPointerLeave
    );
    canvas.removeEventListener("webglcontextlost", onLost);
    document.removeEventListener("visibilitychange", onVisibility);
    host.style.cursor = "";
    options.onHover(null);
    for (const item of disposables) item.dispose();
    tiles.dispose();
    renderer.dispose();
    try {
      renderer.forceContextLoss();
    } catch {
      // The context may already be gone.
    }
    canvas.remove();
  }

  return { destroy };
}
