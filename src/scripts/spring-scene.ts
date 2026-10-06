/**
 * The springs section: a leaf spring pack built from primitives, no model
 * file. It plays on its own once the section is in view (no scroll-jacking),
 * looping through the story, and pauses whenever it is off screen:
 *
 *   0.00 to 0.30  the leaves fly in and stack
 *   0.30 to 0.52  U-bolts, plates and nuts drop on
 *   0.52 to 0.74  a helper leaf slides in under the pack (add-a-leaf)
 *   0.74 to 1.00  load comes on and the arch flattens
 *
 * Each leaf is a long box bent into a parabola every frame, so "load" is just
 * the curvature constant going down.
 */
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  BufferAttribute,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

const LEAVES = 6;
const MAIN = 4.2; // main leaf length
const T = 0.085; // leaf thickness
const W = 0.42; // leaf width (z)
const GAP = 0.012;
const K_FREE = 0.17; // curvature at rest: y = k x^2
const K_LOADED = 0.045;

type Leaf = { mesh: Mesh; base: Float32Array; len: number; index: number; helper?: boolean };

export function mountSpring(canvas: HTMLCanvasElement, track: HTMLElement, onStep: (i: number) => void) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.95;

  const camera = new PerspectiveCamera(28, 1, 0.1, 100);

  // Warm shop key, cool fill, and the logo green as a rim from behind.
  const key = new DirectionalLight(new Color('#fff2e0'), 3.4);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const rim = new DirectionalLight(new Color('#5aac3e'), 6);
  rim.position.set(4, 1.5, -4);
  scene.add(rim);
  const rim2 = new DirectionalLight(new Color('#7cc95c'), 2.2);
  rim2.position.set(-5, -1, -3);
  scene.add(rim2);
  const fill = new DirectionalLight(new Color('#c9d6e6'), 0.9);
  fill.position.set(2, 1, 6);
  scene.add(fill);
  scene.add(new HemisphereLight(0x9fb3c8, 0x0c0d0f, 0.5));

  const steel = new MeshPhysicalMaterial({
    color: '#2c3036',
    metalness: 0.78,
    roughness: 0.4,
    clearcoat: 0.25,
    clearcoatRoughness: 0.5,
  });
  const helperSteel = new MeshPhysicalMaterial({
    color: '#22301f',
    metalness: 0.8,
    roughness: 0.4,
    clearcoat: 0.4,
    clearcoatRoughness: 0.35,
    emissive: new Color('#2f6a24'),
    emissiveIntensity: 0.0,
  });
  const zinc = new MeshPhysicalMaterial({ color: '#b9bec5', metalness: 1, roughness: 0.3 });
  const rubber = new MeshStandardMaterial({ color: '#0b0b0c', roughness: 0.9, metalness: 0 });

  const pack = new Group();
  scene.add(pack);

  // ---- Leaves ----
  const leaves: Leaf[] = [];
  const makeLeaf = (len: number, index: number, helper = false) => {
    const geo = new BoxGeometry(len, T, W, 72, 1, 1);
    const pos = geo.getAttribute('position') as BufferAttribute;
    const base = new Float32Array(pos.array as Float32Array);
    const mesh = new Mesh(geo, helper ? helperSteel : steel);
    pack.add(mesh);
    const leaf: Leaf = { mesh, base, len, index, helper };
    leaves.push(leaf);
    return leaf;
  };
  for (let i = 0; i < LEAVES; i++) makeLeaf(MAIN * (1 - i * 0.13), i);
  const helper = makeLeaf(MAIN * (1 - LEAVES * 0.13) + 0.25, LEAVES, true);

  /** Bend one leaf in place. Thinner toward the tips on everything but the main leaf. */
  const bend = (leaf: Leaf, k: number) => {
    const pos = leaf.mesh.geometry.getAttribute('position') as BufferAttribute;
    const arr = pos.array as Float32Array;
    const half = leaf.len / 2;
    for (let v = 0; v < arr.length; v += 3) {
      const x = leaf.base[v];
      const y0 = leaf.base[v + 1];
      const taper = leaf.index === 0 ? 1 : 1 - 0.45 * smooth(0.78, 1, Math.abs(x) / half);
      arr[v] = x;
      arr[v + 1] = y0 * taper + k * x * x;
      arr[v + 2] = leaf.base[v + 2];
    }
    pos.needsUpdate = true;
    leaf.mesh.geometry.computeVertexNormals();
  };

  // ---- Eyes on the main leaf ----
  const eyes: Group[] = [];
  for (const side of [-1, 1]) {
    const g = new Group();
    const roll = new Mesh(new TorusGeometry(0.15, 0.05, 16, 40), steel);
    roll.scale.set(1, 1, W / 0.1);
    const bush = new Mesh(new CylinderGeometry(0.105, 0.105, W + 0.04, 32), rubber);
    bush.rotation.x = Math.PI / 2;
    const sleeve = new Mesh(new CylinderGeometry(0.05, 0.05, W + 0.12, 24), zinc);
    sleeve.rotation.x = Math.PI / 2;
    g.add(roll, bush, sleeve);
    g.userData.side = side;
    pack.add(g);
    eyes.push(g);
  }

  // ---- Clamp: plates, U-bolts, nuts, center bolt ----
  const clamp3 = new Group();
  pack.add(clamp3);
  const AXLE_R = (W + 0.2) / 2 - 0.04;
  const axleMat = new MeshPhysicalMaterial({ color: '#2a2e33', metalness: 0.7, roughness: 0.55 });
  const axle = new Mesh(new CylinderGeometry(AXLE_R, AXLE_R, 1.9, 40), axleMat);
  axle.rotation.x = Math.PI / 2; // runs side to side, across the spring
  pack.add(axle);
  const topPlate = new Mesh(new BoxGeometry(0.78, 0.09, W + 0.16), steel);
  const botPlate = new Mesh(new BoxGeometry(0.78, 0.09, W + 0.16), steel);
  const centerBolt = new Mesh(new CylinderGeometry(0.05, 0.05, 0.14, 6), zinc);
  clamp3.add(topPlate, centerBolt);
  pack.add(botPlate);

  const ubolts: Group[] = [];
  const R = (W + 0.2) / 2;
  for (const x of [-0.28, 0.28]) {
    const u = new Group();
    const arc = new Mesh(new TorusGeometry(R, 0.038, 14, 40, Math.PI), zinc);
    arc.rotation.y = Math.PI / 2; // arc lives in the yz plane
    const legLen = 1;
    const legA = new Mesh(new CylinderGeometry(0.038, 0.038, legLen, 16), zinc);
    const legB = legA.clone();
    legA.position.set(0, -legLen / 2, R);
    legB.position.set(0, -legLen / 2, -R);
    const nutA = new Mesh(new CylinderGeometry(0.075, 0.075, 0.08, 6), zinc);
    const nutB = nutA.clone();
    u.add(arc, legA, legB, nutA, nutB);
    u.userData = { x, legA, legB, nutA, nutB, legLen };
    pack.add(u);
    ubolts.push(u);
  }

  // ---- Layout ----
  let w = 0, h = 0, narrow = false;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    if (r.width === w && r.height === h) return;
    w = r.width; h = r.height;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    narrow = camera.aspect < 1.1;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  let px = 0, py = 0, tx = 0, ty = 0;
  if (!reduce) {
    addEventListener('pointermove', (e) => {
      tx = (e.clientX / innerWidth - 0.5) * 2;
      ty = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '200px 0px' }).observe(track);

  let shown = 0; // smoothed progress
  let step = -1;
  let t0 = performance.now();

  const pose = (p: number, time: number) => {
    const build = easeOut(span(p, 0.0, 0.3));
    const bolts = easeOut(span(p, 0.3, 0.52));
    const add = easeInOut(span(p, 0.52, 0.74));
    const load = easeInOut(span(p, 0.74, 1));
    const k = lerp(K_FREE, K_LOADED, load);

    // Leaves: each one flies up from below in turn, then sits in the stack.
    const pitch = T + GAP;
    leaves.forEach((leaf) => {
      if (leaf.helper) return;
      const i = leaf.index;
      const local = easeOut(clamp(build * (LEAVES + 1.5) - i * 0.9));
      bend(leaf, k);
      leaf.mesh.position.set(0, -i * pitch - (1 - local) * (2.6 + i * 0.25), 0);
      leaf.mesh.rotation.z = (1 - local) * (i % 2 ? 0.12 : -0.12);
      leaf.mesh.visible = local > 0.001;
    });

    // Helper leaf slides in from the side under the pack.
    bend(helper, k);
    helper.mesh.position.set((1 - add) * 5.5, -LEAVES * pitch, 0);
    helper.mesh.visible = add > 0.001;
    helperSteel.emissiveIntensity = add * (1 - load * 0.6) * 0.55;

    // Eyes ride the ends of the main leaf.
    const main = leaves[0];
    const mainLocal = easeOut(clamp(build * (LEAVES + 1.5)));
    eyes.forEach((g) => {
      const side = g.userData.side as number;
      const x = side * (MAIN / 2);
      g.position.set(x + side * 0.06, k * x * x + 0.15 - T / 2 + main.mesh.position.y, 0);
      g.visible = mainLocal > 0.001;
      g.rotation.z = main.mesh.rotation.z;
    });

    const stackBottom = -(LEAVES - 1 + add) * pitch - T / 2;
    const top = T / 2;
    // Plates and bolts drop in from above.
    const drop = (1 - bolts) * 2.2;
    topPlate.position.set(0, top + 0.045 + drop, 0);
    centerBolt.position.set(0, top + 0.12 + drop, 0);
    const axleY = top + 0.09 + AXLE_R;
    axle.position.set(0, axleY + drop * 1.3, 0);
    axle.visible = bolts > 0.001;
    botPlate.position.set(0, stackBottom - 0.045 - (1 - bolts) * 1.4, 0);
    botPlate.visible = bolts > 0.001;
    clamp3.visible = bolts > 0.001;
    ubolts.forEach((u, j) => {
      const d = u.userData as { x: number; legA: Mesh; legB: Mesh; nutA: Mesh; nutB: Mesh; legLen: number };
      const local = easeOut(clamp(bolts * 1.6 - j * 0.35));
      const yTop = axleY; // the bend wraps over the axle
      const yBot = stackBottom - 0.09 - 0.06;
      const len = yTop - yBot + 0.12;
      u.position.set(d.x, yTop + (1 - local) * 2.6, 0);
      u.visible = local > 0.001;
      for (const leg of [d.legA, d.legB]) {
        leg.scale.y = len / d.legLen;
        leg.position.y = -len / 2;
      }
      d.nutA.position.set(0, -len + 0.1 - (1 - local) * 0.4, R);
      d.nutB.position.set(0, -len + 0.1 - (1 - local) * 0.4, -R);
    });

    // Camera: three-quarter view that settles side-on as it loads.
    const idle = reduce ? 0 : Math.sin(time * 0.25) * 0.06;
    pack.rotation.y = lerp(-0.62, -0.18, load) + idle + px * 0.18;
    pack.rotation.x = lerp(0.32, 0.12, load) + py * 0.08;
    pack.position.y = lerp(-0.15, 0.1, build) - load * 0.1;
    const dist = narrow ? 12.5 / Math.max(0.55, camera.aspect) : 9.2;
    camera.position.set(0, 0.55, dist);
    camera.lookAt(0, 0, 0);

    return p < 0.27 ? 0 : p < 0.5 ? 1 : p < 0.72 ? 2 : 3;
  };

  // Timeline in seconds: [time, progress]. Holds give each step a beat.
  const keys: [number, number][] = [
    [0, 0], [3.4, 0.3], [4.4, 0.3],
    [6.6, 0.52], [7.6, 0.52],
    [9.8, 0.74], [10.8, 0.74],
    [13.4, 1], [16.6, 1],
    [17.8, 0],
  ];
  const LOOP = keys[keys.length - 1][0];
  const stepEnds = [3.4, 6.6, 9.8, 13.4];
  const at = (t: number) => {
    for (let i = 1; i < keys.length; i++) {
      const [t1, p1] = keys[i];
      const [t0k, p0] = keys[i - 1];
      if (t <= t1) return lerp(p0, p1, (t - t0k) / (t1 - t0k || 1));
    }
    return 0;
  };

  let clock = 0;
  let playing = false;
  new IntersectionObserver(([e]) => (playing = e.isIntersecting), { threshold: 0.35 }).observe(track);

  let last = performance.now();
  const frame = (now: number) => {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible || document.hidden) return;
    resize();
    if (playing && !reduce) clock = (clock + dt) % LOOP;
    const target = reduce ? 1 : at(clock);
    // Snap on the reset so the pack does not "un-build" in slow motion.
    shown = target < shown - 0.25 ? target : lerp(shown, target, 0.18);
    px = lerp(px, tx, 0.05);
    py = lerp(py, ty, 0.05);
    const s = pose(shown, (now - t0) / 1000);
    if (s !== step) { step = s; onStep(s); }
    renderer.render(scene, camera);
  };

  // First paint before the loop so the canvas is never blank on reveal.
  pose(reduce ? 1 : 0.02, 0);
  renderer.render(scene, camera);
  t0 = performance.now();
  requestAnimationFrame(frame);
  canvas.dataset.ready = 'true';

  return {
    /** Jump to the end of a step; the loop carries on from there. */
    goTo(i: number) { clock = stepEnds[Math.max(0, Math.min(stepEnds.length - 1, i))]; },
  };
}
