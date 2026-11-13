import * as THREE from "three";
import {
  AGREED_INDEX,
  AMBIENT,
  AGREED_SHEET,
  HALF_H,
  HALF_W,
  INK,
  OBSERVED_SHEET,
  REST,
  SHEET,
  SUPPORT,
  TEAL,
  TILT_X,
  TILT_Y,
  agreedLocal,
  fieldPose,
  observedLocal,
  projectionFrame,
  type Seg,
  type Vec3,
} from "./model";

export type FieldHandle = {
  destroy: () => void;
};

type MountOptions = {
  onReady: () => void;
  onLost: () => void;
};

const PERIMETER = 16;
const BRIDGE = 8;

export function mountField(host: HTMLElement, options: MountOptions): FieldHandle {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const frame = projectionFrame();
  const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 20);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  const root = new THREE.Group();
  scene.add(root);
  const agreed = new THREE.Group();
  const observed = new THREE.Group();
  root.add(agreed, observed);

  const disposables: Array<{ dispose: () => void }> = [];

  const addLines = (parent: THREE.Object3D, segs: Seg[], order: number) => {
    const groups = new Map<string, Seg[]>();
    for (const seg of segs) {
      const key = `${seg.color}|${seg.opacity}`;
      const list = groups.get(key);
      if (list) list.push(seg);
      else groups.set(key, [seg]);
    }
    for (const list of groups.values()) {
      const positions = new Float32Array(list.length * 6);
      list.forEach((seg, index) => {
        positions.set(seg.a, index * 6);
        positions.set(seg.b, index * 6 + 3);
      });
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.LineBasicMaterial({
        color: list[0].color,
        transparent: list[0].opacity < 1,
        opacity: list[0].opacity,
        depthTest: false,
      });
      const lines = new THREE.LineSegments(geometry, material);
      lines.renderOrder = order;
      parent.add(lines);
      disposables.push(geometry, material);
    }
  };

  const addSheet = (parent: THREE.Object3D, color: string, opacity: number) => {
    const geometry = new THREE.PlaneGeometry(HALF_W * 2, HALF_H * 2);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthTest: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -0.01;
    mesh.renderOrder = 0;
    parent.add(mesh);
    disposables.push(geometry, material);
  };

  const addDots = (parent: THREE.Object3D, points: Vec3[], color: string) => {
    const positions = new Float32Array(points.length * 3);
    points.forEach((point, index) => positions.set(point, index * 3));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color,
      size: 5,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
    });
    const dots = new THREE.Points(geometry, material);
    dots.renderOrder = 3;
    parent.add(dots);
    disposables.push(geometry, material);
  };

  addSheet(agreed, SHEET, AGREED_SHEET);
  addLines(agreed, agreedLocal(), 1);
  addDots(
    agreed,
    [
      [-HALF_W, -HALF_H, 0],
      [HALF_W, -HALF_H, 0],
      [HALF_W, HALF_H, 0],
      [-HALF_W, HALF_H, 0],
    ],
    INK
  );

  addSheet(observed, SHEET, OBSERVED_SHEET);
  addLines(observed, observedLocal(), 1);
  addDots(
    observed,
    [
      [-HALF_W, -HALF_H, 0],
      [HALF_W, -HALF_H, 0],
      [HALF_W, HALF_H, 0],
      [-HALF_W, HALF_H, 0],
    ],
    TEAL
  );

  const indexPositions = new Float32Array(6);
  const indexGeometry = new THREE.BufferGeometry();
  indexGeometry.setAttribute("position", new THREE.BufferAttribute(indexPositions, 3));
  const indexMaterial = new THREE.LineBasicMaterial({
    color: TEAL,
    depthTest: false,
  });
  const indexLine = new THREE.LineSegments(indexGeometry, indexMaterial);
  indexLine.renderOrder = 2;
  observed.add(indexLine);
  disposables.push(indexGeometry, indexMaterial);

  const linkPositions = new Float32Array(12);
  const linkGeometry = new THREE.BufferGeometry();
  linkGeometry.setAttribute("position", new THREE.BufferAttribute(linkPositions, 3));
  const linkMaterial = new THREE.LineBasicMaterial({
    color: TEAL,
    transparent: true,
    opacity: 1,
    depthTest: false,
  });
  const links = new THREE.LineSegments(linkGeometry, linkMaterial);
  links.renderOrder = 2;
  root.add(links);
  disposables.push(linkGeometry, linkMaterial);

  const perimeterPositions = new Float32Array(PERIMETER * 3);
  const perimeterGeometry = new THREE.BufferGeometry();
  perimeterGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(perimeterPositions, 3)
  );
  const perimeterMaterial = new THREE.PointsMaterial({
    color: SUPPORT,
    size: 4,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.8,
    depthTest: false,
  });
  const perimeter = new THREE.Points(perimeterGeometry, perimeterMaterial);
  perimeter.renderOrder = 3;
  agreed.add(perimeter);
  disposables.push(perimeterGeometry, perimeterMaterial);

  const bridgePositions = new Float32Array(BRIDGE * 3);
  const bridgeGeometry = new THREE.BufferGeometry();
  bridgeGeometry.setAttribute("position", new THREE.BufferAttribute(bridgePositions, 3));
  const bridgeMaterial = new THREE.PointsMaterial({
    color: TEAL,
    size: 5,
    sizeAttenuation: false,
    transparent: true,
    opacity: 1,
    depthTest: false,
  });
  const bridge = new THREE.Points(bridgeGeometry, bridgeMaterial);
  bridge.renderOrder = 3;
  root.add(bridge);
  disposables.push(bridgeGeometry, bridgeMaterial);

  const pointer = { x: 0, y: 0 };
  const pointerTarget = { x: 0, y: 0 };
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
    const dprCap = width < 720 ? 1.25 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const boundsAspect = frame.width / frame.height;
    let halfW = frame.width / 2;
    let halfH = frame.height / 2;
    if (aspect > boundsAspect) halfW = halfH * aspect;
    else halfH = halfW / aspect;
    const cx = (frame.minX + frame.maxX) / 2;
    const cy = (frame.minY + frame.maxY) / 2;
    camera.left = cx - halfW;
    camera.right = cx + halfW;
    camera.top = cy + halfH;
    camera.bottom = cy - halfH;
    camera.updateProjectionMatrix();
  };

  const readAlign = () => {
    const section = host.closest("section");
    if (!section) return 0;
    const rect = section.getBoundingClientRect();
    const traveled = Math.max(0, -rect.top);
    const span = 180;
    const raw = Math.min(1, traveled / span);
    return raw * raw * (3 - 2 * raw);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const rect = host.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerTarget.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    idleFor = 0;
  };

  const onPointerLeave = () => {
    pointerTarget.x = 0;
    pointerTarget.y = 0;
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
    const moving =
      Math.abs(targetAlign - align) > 0.002 ||
      Math.abs(pointerTarget.x - pointer.x) > 0.002 ||
      Math.abs(pointerTarget.y - pointer.y) > 0.002;
    align = targetAlign;
    pointer.x += (pointerTarget.x - pointer.x) * Math.min(1, dt * 6);
    pointer.y += (pointerTarget.y - pointer.y) * Math.min(1, dt * 6);
    idleFor = moving ? 0 : idleFor + dt;

    const pose = fieldPose(align);
    observed.position.set(pose.offset[0], pose.offset[1], pose.offset[2]);
    root.rotation.set(
      REST.x - pointer.y * TILT_X,
      REST.y + pointer.x * TILT_Y,
      REST.z + Math.sin(time * 0.45) * AMBIENT * (1 - align * 0.65)
    );

    indexPositions[0] = pose.indexX;
    indexPositions[1] = -HALF_H;
    indexPositions[3] = pose.indexX;
    indexPositions[4] = HALF_H;
    indexGeometry.attributes.position.needsUpdate = true;

    const gap = 1 - align;
    linkMaterial.opacity = gap;
    links.visible = gap > 0.04;
    writeLink(linkPositions, 0, pose.offset, pose.indexX, -HALF_H);
    writeLink(linkPositions, 6, pose.offset, pose.indexX, HALF_H);
    linkGeometry.attributes.position.needsUpdate = true;

    for (let i = 0; i < PERIMETER; i += 1) {
      const point = pointOnRect((i / PERIMETER + time * 0.045) % 1);
      perimeterPositions.set(point, i * 3);
    }
    perimeterGeometry.attributes.position.needsUpdate = true;

    bridgeMaterial.opacity = gap;
    bridge.visible = gap > 0.04;
    for (let i = 0; i < BRIDGE; i += 1) {
      const u = (i / BRIDGE + time * 0.28) % 1;
      const y = i < BRIDGE / 2 ? -HALF_H : HALF_H;
      const fromX = pose.indexX + pose.offset[0];
      const toX = AGREED_INDEX;
      bridgePositions[i * 3] = fromX + (toX - fromX) * u;
      bridgePositions[i * 3 + 1] = y + pose.offset[1] * (1 - u);
      bridgePositions[i * 3 + 2] = pose.offset[2] * (1 - u);
    }
    bridgeGeometry.attributes.position.needsUpdate = true;
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
    const budget = idleFor > 1.4 ? 1 / 30 : 1 / 60;
    acc += dt;
    if (acc < budget) return;
    const stepDt = Math.min(0.05, acc);
    acc = 0;
    step(stepDt);
  };

  const start = () => {
    if (!running || raf) return;
    last = performance.now();
    acc = 0.016;
    raf = window.requestAnimationFrame(loop);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
    },
    { threshold: 0 }
  );

  const onVisibility = () => {
    if (document.visibilityState === "visible" && visible) start();
  };

  const box = new ResizeObserver(() => {
    resize();
    if (visible) start();
  });

  host.addEventListener("pointermove", onPointerMove);
  host.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("webglcontextlost", onLost);
  document.addEventListener("visibilitychange", onVisibility);
  observer.observe(host);
  box.observe(host);
  resize();
  visible = true;
  start();

  function destroy() {
    if (!running) return;
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    observer.disconnect();
    box.disconnect();
    host.removeEventListener("pointermove", onPointerMove);
    host.removeEventListener("pointerleave", onPointerLeave);
    canvas.removeEventListener("webglcontextlost", onLost);
    document.removeEventListener("visibilitychange", onVisibility);
    for (const item of disposables) item.dispose();
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

function writeLink(
  buffer: Float32Array,
  offset: number,
  shift: Vec3,
  indexX: number,
  y: number
) {
  buffer[offset] = AGREED_INDEX;
  buffer[offset + 1] = y;
  buffer[offset + 2] = 0;
  buffer[offset + 3] = indexX + shift[0];
  buffer[offset + 4] = y + shift[1];
  buffer[offset + 5] = shift[2];
}

function pointOnRect(t: number): Vec3 {
  const edge = t * 4;
  if (edge < 1) return [-HALF_W + edge * HALF_W * 2, -HALF_H, 0];
  if (edge < 2) return [HALF_W, -HALF_H + (edge - 1) * HALF_H * 2, 0];
  if (edge < 3) return [HALF_W - (edge - 2) * HALF_W * 2, HALF_H, 0];
  return [-HALF_W, HALF_H - (edge - 3) * HALF_H * 2, 0];
}
