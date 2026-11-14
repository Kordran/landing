// Prototype of the "surface plate" signature visual.
// A reconciliation matrix drawn as machined tiles: rows are price lines,
// columns are invoices over time. A tile sits flush when the billed price
// matches the agreement and stands proud when it does not.
import * as THREE from "../../../node_modules/three/build/three.module.js";

export const COLS = 26;
export const ROWS = 14;
const SIZE = 1;
const GAP = 0.16;
const PITCH = SIZE + GAP;
const BASE = 0.18;

// Deterministic variance runs. Height is proportional to the price difference.
const RUNS = [
  { row: 2, from: 15, to: 25, h: 0.42 },
  { row: 5, from: 6, to: 11, h: 0.26 },
  { row: 5, from: 12, to: 25, h: 0.6 },
  { row: 8, from: 3, to: 23, every: 4, h: 0.34 },
  { row: 10, from: 18, to: 25, h: 0.86 },
  { row: 12, from: 9, to: 10, h: 0.3 },
];

export function varianceAt(col, row) {
  let h = 0;
  for (const run of RUNS) {
    if (run.row !== row || col < run.from || col > run.to) continue;
    if (run.every && (col - run.from) % run.every !== 0) continue;
    h = Math.max(h, run.h);
  }
  return h;
}

const PALETTES = {
  teal: {
    top: [0.992, 0.988, 0.976],
    cap: [0.11, 0.24, 0.34],
    capEdge: [0.55, 0.7, 0.78],
    edge: [0.086, 0.102, 0.114],
  },
  heat: {
    top: [0.992, 0.988, 0.976],
    cap: [0.78, 0.39, 0.16],
    capEdge: [0.98, 0.84, 0.72],
    edge: [0.086, 0.102, 0.114],
  },
};

const vertex = /* glsl */ `
  attribute float aLift;
  attribute float aKind;
  uniform float uReveal;
  uniform float uAlign;
  uniform float uBase;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vKind;
  varying vec2 vScale;
  void main() {
    vUv = uv;
    vNormal = normal;
    vKind = aKind;
    vec3 p = position;
    vec4 origin = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    // The sweep runs along X. A tile rises as the inspection line passes it.
    float pass = smoothstep(0.0, 1.0, (uReveal - origin.x) * 0.45);
    float lift = aLift * pass * (1.0 - uAlign);
    float height = aKind > 0.5 ? max(lift, 0.012) : uBase;
    p.y = (p.y + 0.5) * height + (aKind > 0.5 ? uBase : 0.0);
    vScale = vec2(1.0, height);
    vec4 world = instanceMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * world;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec3 uTop;
  uniform vec3 uCap;
  uniform vec3 uEdge;
  uniform vec3 uCapEdge;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vKind;
  void main() {
    vec3 base = vKind > 0.5 ? uCap : uTop;
    // Three fixed tones: top, lit side, shaded side. No lights to compute.
    float tone = vNormal.y > 0.5 ? 1.0 : (abs(vNormal.x) > 0.5 ? 0.86 : 0.72);
    if (vKind > 0.5) tone = vNormal.y > 0.5 ? 1.18 : (abs(vNormal.x) > 0.5 ? 0.92 : 0.7);
    vec3 color = base * tone;
    vec2 w = fwidth(vUv);
    vec2 d = min(vUv, 1.0 - vUv) / max(w, vec2(1e-5));
    float line = 1.0 - smoothstep(0.55, 1.35, min(d.x, d.y));
    vec3 edge = vKind > 0.5 ? uCapEdge : uEdge;
    float strength = vKind > 0.5 ? 0.42 : 0.3;
    color = mix(color, edge, line * strength);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function mountPlate(host, options = {}) {
  const palette = PALETTES[options.accent || "teal"];
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  const azimuth = options.azimuth ?? -0.62;
  const elevation = options.elevation ?? 0.6;
  const dist = 60;
  camera.position.set(
    dist * Math.cos(elevation) * Math.sin(azimuth),
    dist * Math.sin(elevation),
    dist * Math.cos(elevation) * Math.cos(azimuth)
  );
  camera.lookAt(0, 0, 0);

  const rig = new THREE.Group();
  scene.add(rig);

  const width = COLS * PITCH - GAP;
  const depth = ROWS * PITCH - GAP;
  const raised = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const h = varianceAt(c, r);
      if (h > 0) raised.push({ c, r, h });
    }
  }

  const box = new THREE.BoxGeometry(SIZE, 1, SIZE);
  const total = COLS * ROWS + raised.length;
  const lift = new Float32Array(total);
  const kind = new Float32Array(total);
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uReveal: { value: -width },
      uAlign: { value: 0 },
      uBase: { value: BASE },
      uTop: { value: new THREE.Vector3(...palette.top) },
      uCap: { value: new THREE.Vector3(...palette.cap) },
      uEdge: { value: new THREE.Vector3(...palette.edge) },
      uCapEdge: { value: new THREE.Vector3(...palette.capEdge) },
    },
    extensions: { derivatives: true },
  });
  const mesh = new THREE.InstancedMesh(box, material, total);
  const m = new THREE.Matrix4();
  let i = 0;
  const place = (c, r) => {
    m.makeTranslation(c * PITCH - width / 2 + SIZE / 2, 0, r * PITCH - depth / 2 + SIZE / 2);
    mesh.setMatrixAt(i, m);
  };
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      place(c, r);
      i += 1;
    }
  }
  for (const tile of raised) {
    place(tile.c, tile.r);
    lift[i] = tile.h;
    kind[i] = 1;
    i += 1;
  }
  box.setAttribute("aLift", new THREE.InstancedBufferAttribute(lift, 1));
  box.setAttribute("aKind", new THREE.InstancedBufferAttribute(kind, 1));
  mesh.frustumCulled = false;
  rig.add(mesh);

  // Datum frame with graduations along the two near edges.
  const pts = [];
  const pad = 0.7;
  const x0 = -width / 2 - pad;
  const x1 = width / 2 + pad;
  const z0 = -depth / 2 - pad;
  const z1 = depth / 2 + pad;
  const seg = (a, b, c, d) => pts.push(a, 0, b, c, 0, d);
  seg(x0, z1, x1, z1);
  seg(x0, z0, x0, z1);
  for (let c = 0; c <= COLS; c += 1) {
    const x = c * PITCH - width / 2 - GAP / 2;
    seg(x, z1, x, z1 + (c % 5 === 0 ? 0.55 : 0.28));
  }
  for (let r = 0; r <= ROWS; r += 1) {
    const z = r * PITCH - depth / 2 - GAP / 2;
    seg(x0, z, x0 - (r % 5 === 0 ? 0.55 : 0.28), z);
  }
  const frameGeometry = new THREE.BufferGeometry();
  frameGeometry.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  const frameMaterial = new THREE.LineBasicMaterial({ color: 0x161a1d, transparent: true, opacity: 0.4 });
  rig.add(new THREE.LineSegments(frameGeometry, frameMaterial));

  // Inspection line.
  const scanGeometry = new THREE.BufferGeometry();
  scanGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([0, BASE + 0.02, z0, 0, BASE + 0.02, z1 + 0.6], 3)
  );
  const scanMaterial = new THREE.LineBasicMaterial({ color: 0x1c3d57, transparent: true, opacity: 0.9 });
  const scan = new THREE.LineSegments(scanGeometry, scanMaterial);
  rig.add(scan);

  const view = options.view ?? 15;
  const center = options.center ?? [0, 0];
  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (w < 2 || h < 2) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 720 ? 1.5 : 2));
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.left = center[0] - view * aspect;
    camera.right = center[0] + view * aspect;
    camera.top = center[1] + view;
    camera.bottom = center[1] - view;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(host);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const rect = host.getBoundingClientRect();
    pointer.tx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
    pointer.ty = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
  });

  const start = performance.now();
  const sweep = options.still ? 0 : 2600;
  const frame = (now) => {
    const t = now - start;
    const k = sweep ? Math.min(1, t / sweep) : 1;
    const eased = 1 - Math.pow(1 - k, 3);
    const reveal = x0 + (x1 - x0 + 3) * eased;
    material.uniforms.uReveal.value = reveal;
    const scroll = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.55)));
    material.uniforms.uAlign.value = scroll * scroll * (3 - 2 * scroll);
    // After the first pass the line parks, then drifts slowly across the plate.
    const drift = k < 1 ? reveal : x0 + ((t - sweep) / 16000 % 1) * (x1 - x0);
    scan.position.x = Math.min(x1, drift);
    scanMaterial.opacity = k < 1 ? 0.9 : 0.5;
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    rig.rotation.y = pointer.x * 0.05;
    rig.rotation.x = pointer.y * 0.03;
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  return { renderer };
}
