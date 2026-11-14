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
  cameraDirection,
  datumSegments,
  tileOrigin,
  varianceAt,
} from "./model";

export type PlateHover = { col: number; row: number; raised: boolean } | null;

export type PlateHandle = {
  destroy: () => void;
};

type MountOptions = {
  onReady: () => void;
  onLost: () => void;
  onHover: (hover: PlateHover) => void;
};

/** Pointer tilt, in radians at the edge of the stage. */
const TILT_X = 0.028;
const TILT_Y = 0.045;
/** Seconds for the inspection line to cross the plate. */
const SCAN_PERIOD = 18;
/** Hero scroll distance, in pixels, over which the excess settles. */
const SETTLE_SPAN = 460;

const vertexShader = /* glsl */ `
  attribute float aLift;
  attribute float aKind;
  uniform float uAlign;
  uniform float uBase;
  uniform float uSettled;
  varying vec2 vUv;
  varying vec3 vFace;
  varying float vKind;
  varying vec2 vOrigin;
  varying float vAcross;

  void main() {
    vUv = uv;
    vFace = normal;
    vKind = aKind;
    vec4 origin = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vOrigin = origin.xz;
    vAcross = origin.x + position.x;
    float height = uBase;
    float lift = 0.0;
    if (aKind > 0.5) {
      height = mix(aLift, uSettled, uAlign);
      lift = uBase;
    }
    vec3 p = position;
    p.y = (p.y + 0.5) * height + lift;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(p, 1.0);
  }
`;

// Three fixed tones per solid and a constant-width edge. Colors are written as
// authored so the canvas matches the SVG and the page exactly.
const fragmentShader = /* glsl */ `
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
  varying vec2 vUv;
  varying vec3 vFace;
  varying float vKind;
  varying vec2 vOrigin;
  varying float vAcross;

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

    vec2 away = abs(vOrigin - uHover);
    float hover = uHoverOn * (1.0 - step(0.5, max(away.x, away.y)));
    if (cap) color = mix(color, uCapEdge, hover * 0.35);

    vec2 w = max(fwidth(vUv), vec2(1e-5));
    vec2 d = min(vUv, 1.0 - vUv) / w;
    float line = 1.0 - smoothstep(0.5, 1.4, min(d.x, d.y));
    vec3 edge = cap ? uCapEdge : mix(uEdge, uCapLit, hover);
    float strength = cap ? uCapEdgeOpacity : uEdgeOpacity;
    strength = mix(strength, 1.0, hover);
    gl_FragColor = vec4(mix(color, edge, line * strength), 1.0);
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
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uAlign: { value: 0 },
      uBase: { value: BASE },
      uSettled: { value: SETTLED },
      uScan: { value: DATUM.x0 },
      uScanOn: { value: 0 },
      uBeam: { value: rgb(TONES.beam) },
      uHover: { value: new THREE.Vector2(999, 999) },
      uHoverOn: { value: 0 },
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
    index += 1;
  }
  box.setAttribute("aLift", new THREE.InstancedBufferAttribute(lift, 1));
  box.setAttribute("aKind", new THREE.InstancedBufferAttribute(kind, 1));
  tiles.frustumCulled = false;
  rig.add(tiles);
  disposables.push(box, material);

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
  const hoverTarget = new THREE.Vector2(999, 999);
  let hoverWanted = 0;
  let hoverKey = "";
  let align = 0;
  let time = 0;
  let raf = 0;
  let running = true;
  let ready = false;
  let visible = false;
  let idleFor = 0;
  let last = performance.now();
  let acc = 0;

  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width < 2 || height < 2) return;
    const cap = width < 900 ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    renderer.setSize(width, height, false);
  };

  const readAlign = () => {
    const section = host.closest("section");
    if (!section) return 0;
    const traveled = Math.max(0, -section.getBoundingClientRect().top);
    const raw = Math.min(1, traveled / SETTLE_SPAN);
    return raw * raw * (3 - 2 * raw);
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

    const settle = 1 - align;
    let best: PlateHover = null;
    let bestDistance = Infinity;
    for (const tile of raised) {
      const [x, z] = tileOrigin(tile.col, tile.row);
      const top = BASE + SETTLED + (tile.h - SETTLED) * settle;
      boxMin.set(x - SIZE / 2, 0, z - SIZE / 2);
      boxMax.set(x + SIZE / 2, top, z + SIZE / 2);
      bounds.set(boxMin, boxMax);
      if (!ray.intersectBox(bounds, hit)) continue;
      const distance = hit.distanceToSquared(ray.origin);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = { col: tile.col, row: tile.row, raised: true };
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
    return { col, row, raised: false };
  };

  const setHover = (hover: PlateHover) => {
    const key = hover ? `${hover.col}:${hover.row}` : "";
    if (key === hoverKey) return;
    hoverKey = key;
    if (hover) {
      const [x, z] = tileOrigin(hover.col, hover.row);
      hoverTarget.set(x, z);
      material.uniforms.uHover.value.copy(hoverTarget);
      hoverWanted = 1;
    } else {
      hoverWanted = 0;
    }
    options.onHover(hover);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const rect = host.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    const inside = Math.abs(nx) <= 1 && Math.abs(ny) <= 1;
    pointer.tx = Math.max(-1, Math.min(1, nx));
    pointer.ty = Math.max(-1, Math.min(1, -ny));
    setHover(inside ? pick(nx, ny) : null);
    idleFor = 0;
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

  const step = (dt: number) => {
    if (host.clientWidth < 2 || host.clientHeight < 2) return;
    time += dt;

    const targetAlign = readAlign();
    const hoverOn = material.uniforms.uHoverOn.value as number;
    const moving =
      Math.abs(targetAlign - align) > 0.002 ||
      Math.abs(pointer.tx - pointer.x) > 0.002 ||
      Math.abs(pointer.ty - pointer.y) > 0.002 ||
      Math.abs(hoverWanted - hoverOn) > 0.01;
    idleFor = moving ? 0 : idleFor + dt;

    align = targetAlign;
    const ease = Math.min(1, dt * 5);
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;
    material.uniforms.uAlign.value = align;
    material.uniforms.uHoverOn.value =
      hoverOn + (hoverWanted - hoverOn) * Math.min(1, dt * 12);
    rig.rotation.set(pointer.y * TILT_X, pointer.x * TILT_Y, 0);
    rig.updateMatrixWorld();

    // One slow pass, a pause off the plate, then again.
    const phase = (time / SCAN_PERIOD) % 1;
    const travel = Math.min(1, phase / 0.82);
    const x = DATUM.x0 + (DATUM.x1 - DATUM.x0) * travel;
    const fade = Math.min(1, travel / 0.06) * Math.min(1, (1 - travel) / 0.06);
    material.uniforms.uScan.value = x;
    material.uniforms.uScanOn.value = fade * (1 - align);

    renderer.render(scene, camera);
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
    // The line moves slowly, so half rate is enough when nothing else does.
    const budget = idleFor > 1.2 ? 1 / 30 : 1 / 60;
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

  const box2 = new ResizeObserver(() => {
    resize();
    start();
  });

  const onScroll = () => start();

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("scroll", onScroll, { passive: true });
  canvas.addEventListener("webglcontextlost", onLost);
  document.addEventListener("visibilitychange", onVisibility);
  observer.observe(host);
  box2.observe(host);
  resize();
  visible = true;
  start();

  function destroy() {
    if (!running) return;
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    observer.disconnect();
    box2.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    document.documentElement.removeEventListener(
      "pointerleave",
      onPointerLeave
    );
    window.removeEventListener("scroll", onScroll);
    canvas.removeEventListener("webglcontextlost", onLost);
    document.removeEventListener("visibilitychange", onVisibility);
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
