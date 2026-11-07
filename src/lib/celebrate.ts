/**
 * Full-screen burst of confetti and flowers.
 *
 * Built to stay smooth while the page scrolls: everything is drawn on one
 * fixed, click-through <canvas> (no DOM node per piece, no layout), flowers
 * are painted once into small sprites and then only stamped, and a single
 * requestAnimationFrame loop runs only while pieces are on screen; the
 * canvas is removed as soon as the last one has fallen.
 */

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  /** Phase of the 3-D flip (confetti) or gentle wobble (flowers). */
  tilt: number;
  vtilt: number;
  sway: number;
  swayAmp: number;
  size: number;
  drag: number;
  gravity: number;
  /** performance.now() at which the piece appears. */
  born: number;
  /** Lifetime in ms; it fades out over the last FADE_MS. */
  life: number;
  shape: "rect" | "dot" | "flower";
  color: string;
  sprite: HTMLCanvasElement | null;
};

const CONFETTI = [
  "#e6007e", "#ff4d8d", "#ff9f1c", "#ffbe0b", "#f4c430", "#d62828",
  "#8338ec", "#3a86ff", "#00a6a6", "#06d6a0", "#f15bb5", "#ff6b35",
];
const FADE_MS = 600;
const SPRITE_PX = 48; // flower sprite size in CSS px, before per-piece scaling

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let dpr = 1;
let width = 0;
let height = 0;
let pieces: Piece[] = [];
let raf = 0;
let lastFrame = 0;
let sprites: HTMLCanvasElement[] | null = null;

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/* ---------------------------------------------------------------- sprites */

function makeSprite(draw: (c: CanvasRenderingContext2D, r: number) => void) {
  const c = document.createElement("canvas");
  c.width = c.height = Math.ceil(SPRITE_PX * dpr);
  const g = c.getContext("2d");
  if (g) {
    g.scale(dpr, dpr);
    g.translate(SPRITE_PX / 2, SPRITE_PX / 2);
    draw(g, SPRITE_PX / 2 - 1);
  }
  return c;
}

/** Genda (marigold): three rings of ruffled petals. */
function marigold(colors: [string, string, string, string]) {
  return makeSprite((g, r) => {
    const rings = [
      { n: 16, dist: 0.6, rx: 0.24, ry: 0.36, c: colors[0], off: 0 },
      { n: 13, dist: 0.4, rx: 0.22, ry: 0.32, c: colors[1], off: 0.2 },
      { n: 9, dist: 0.2, rx: 0.19, ry: 0.27, c: colors[2], off: 0.4 },
    ];
    g.lineWidth = 0.7;
    g.strokeStyle = "rgba(140,50,0,.35)";
    for (const ring of rings) {
      for (let i = 0; i < ring.n; i++) {
        g.save();
        g.rotate((i / ring.n) * Math.PI * 2 + ring.off);
        g.translate(0, -ring.dist * r);
        g.beginPath();
        g.ellipse(0, 0, ring.rx * r, ring.ry * r, 0, 0, Math.PI * 2);
        g.fillStyle = ring.c;
        g.fill();
        g.stroke();
        g.restore();
      }
    }
    g.beginPath();
    g.arc(0, 0, r * 0.13, 0, Math.PI * 2);
    g.fillStyle = colors[3];
    g.fill();
  });
}

/** Five-petal blossom with a golden centre. */
function blossom(petal: string, tip: string, centre: string) {
  return makeSprite((g, r) => {
    for (let i = 0; i < 5; i++) {
      g.save();
      g.rotate((i / 5) * Math.PI * 2);
      const grad = g.createLinearGradient(0, 0, 0, -r);
      grad.addColorStop(0, petal);
      grad.addColorStop(1, tip);
      g.beginPath();
      g.moveTo(0, 0);
      g.bezierCurveTo(-r * 0.62, -r * 0.35, -r * 0.42, -r * 0.98, 0, -r * 0.86);
      g.bezierCurveTo(r * 0.42, -r * 0.98, r * 0.62, -r * 0.35, 0, 0);
      g.fillStyle = grad;
      g.fill();
      g.restore();
    }
    g.beginPath();
    g.arc(0, 0, r * 0.2, 0, Math.PI * 2);
    g.fillStyle = centre;
    g.fill();
    g.fillStyle = "rgba(160,80,0,.6)";
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      g.beginPath();
      g.arc(Math.cos(a) * r * 0.1, Math.sin(a) * r * 0.1, r * 0.035, 0, Math.PI * 2);
      g.fill();
    }
  });
}

/** A single rose petal. */
function rosePetal(edge: string, heart: string) {
  return makeSprite((g, r) => {
    const grad = g.createRadialGradient(0, -r * 0.1, r * 0.05, 0, 0, r);
    grad.addColorStop(0, heart);
    grad.addColorStop(1, edge);
    g.beginPath();
    g.moveTo(0, r * 0.85);
    g.bezierCurveTo(-r * 0.95, r * 0.3, -r * 0.75, -r * 0.8, -r * 0.05, -r * 0.62);
    g.quadraticCurveTo(0, -r * 0.5, r * 0.05, -r * 0.62);
    g.bezierCurveTo(r * 0.75, -r * 0.8, r * 0.95, r * 0.3, 0, r * 0.85);
    g.fillStyle = grad;
    g.fill();
  });
}

function getSprites() {
  sprites ??= [
    marigold(["#f77f00", "#ff9505", "#ffb627", "#d45d00"]),
    marigold(["#ffb703", "#ffc93c", "#ffe066", "#e09400"]),
    blossom("#ff4d8d", "#ffc2d9", "#ffd166"),
    blossom("#e6007e", "#ff7ab8", "#ffd166"),
    rosePetal("#b5121b", "#ef4b55"),
    rosePetal("#d6336c", "#ff8fb1"),
  ];
  return sprites;
}

/* ----------------------------------------------------------------- pieces */

function confetti(x: number, y: number, vx: number, vy: number, born: number): Piece {
  const dot = Math.random() < 0.25;
  return {
    x, y, vx, vy, born,
    rot: rand(0, Math.PI * 2),
    vrot: rand(-0.12, 0.12),
    tilt: rand(0, Math.PI * 2),
    vtilt: rand(0.06, 0.16),
    sway: rand(0, Math.PI * 2),
    swayAmp: rand(0.3, 1),
    size: dot ? rand(3, 4.5) : rand(5, 8),
    drag: 0.95,
    gravity: 0.22,
    life: rand(4500, 6000),
    shape: dot ? "dot" : "rect",
    color: pick(CONFETTI),
    sprite: null,
  };
}

function flower(x: number, y: number, vx: number, vy: number, born: number): Piece {
  return {
    x, y, vx, vy, born,
    rot: rand(0, Math.PI * 2),
    vrot: rand(-0.04, 0.04),
    tilt: rand(0, Math.PI * 2),
    vtilt: rand(0.02, 0.05),
    sway: rand(0, Math.PI * 2),
    swayAmp: rand(0.4, 1.1),
    size: rand(18, 30),
    drag: 0.94,
    gravity: 0.12,
    life: 9500,
    shape: "flower",
    color: "",
    sprite: pick(getSprites()),
  };
}

/** Two cannons in the bottom corners, firing up and inwards. */
function cannons(start: number) {
  const out: Piece[] = [];
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? -10 : width + 10;
    for (let i = 0; i < 70; i++) {
      const isFlower = i % 6 === 0;
      const v = height * rand(0.034, 0.066) * (isFlower ? 0.85 : 1);
      const a = rand(0.15, 0.8); // radians from vertical, towards the middle
      const make = isFlower ? flower : confetti;
      out.push(make(x0, height + 10, -side * v * Math.sin(a), -v * Math.cos(a), start + rand(0, 160)));
    }
  }
  return out;
}

/** Everything bursts outwards from one point, biased upwards. */
function burst(ox: number, oy: number, start: number) {
  const out: Piece[] = [];
  const k = Math.max(height, 600) / 844;
  for (let i = 0; i < 120; i++) {
    const isFlower = i % 6 === 0;
    const a = rand(0, Math.PI * 2);
    const v = rand(4, 17) * k * (isFlower ? 0.8 : 1);
    const make = isFlower ? flower : confetti;
    out.push(make(ox, oy, Math.cos(a) * v, Math.sin(a) * v - 6 * k, start + rand(0, 80)));
  }
  return out;
}

/** Flowers drifting down from above the top edge. */
function shower(start: number, count: number) {
  return Array.from({ length: count }, () =>
    flower(rand(0, width), rand(-60, -20), rand(-0.6, 0.6), rand(0.5, 2), start + rand(0, 1800)),
  );
}

/* ------------------------------------------------------------------- loop */

function resize() {
  if (!canvas) return;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
}

function mount() {
  if (canvas) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "60",
  });
  ctx = canvas.getContext("2d");
  resize();
  document.body.appendChild(canvas);
  window.addEventListener("resize", resize);
}

function unmount() {
  cancelAnimationFrame(raf);
  raf = 0;
  lastFrame = 0;
  pieces = [];
  window.removeEventListener("resize", resize);
  canvas?.remove();
  canvas = null;
  ctx = null;
}

function frame(now: number) {
  if (!ctx) return;
  // Step in 60 fps units so 120 Hz screens and dropped frames move the same.
  const dt = lastFrame ? Math.min((now - lastFrame) / (1000 / 60), 3) : 1;
  lastFrame = now;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas!.width, canvas!.height);

  let alive = 0;
  for (const p of pieces) {
    const age = now - p.born;
    if (age < 0) {
      alive++;
      continue;
    }
    if (age > p.life || p.y > height + 60) continue;
    alive++;

    const drag = Math.pow(p.drag, dt);
    p.vx *= drag;
    p.vy = p.vy * drag + p.gravity * dt;
    p.sway += 0.05 * dt;
    p.x += (p.vx + Math.sin(p.sway) * p.swayAmp) * dt;
    p.y += p.vy * dt;
    p.rot += p.vrot * dt;
    p.tilt += p.vtilt * dt;

    const fade = p.life - age;
    ctx.globalAlpha = fade < FADE_MS ? fade / FADE_MS : 1;

    const cos = Math.cos(p.rot);
    const sin = Math.sin(p.rot);
    // Confetti flips fully; flowers only wobble.
    const flip = p.shape === "flower" ? 0.75 + 0.25 * Math.cos(p.tilt) : Math.cos(p.tilt);
    ctx.setTransform(dpr * cos, dpr * sin, -dpr * sin * flip, dpr * cos * flip, dpr * p.x, dpr * p.y);

    if (p.shape === "flower") {
      ctx.drawImage(p.sprite!, -p.size / 2, -p.size / 2, p.size, p.size);
    } else if (p.shape === "rect") {
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size * 0.8, p.size, p.size * 1.6);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  if (alive) raf = requestAnimationFrame(frame);
  else unmount();
}

/**
 * Fire a celebration. With `from` (viewport coordinates) everything bursts
 * out of that point; without it, two cannons fire from the bottom corners.
 * Either way flowers also drift down from the top. Calls while one is
 * running add to it.
 */
export function celebrate({ from, delay = 0 }: { from?: { x: number; y: number }; delay?: number } = {}) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  mount();
  if (!ctx) {
    unmount();
    return;
  }
  const start = performance.now() + delay;
  pieces = pieces.filter((p) => performance.now() - p.born < p.life);
  pieces.push(...(from ? burst(from.x, from.y, start) : cannons(start)), ...shower(start + 250, 26));
  if (!raf) raf = requestAnimationFrame(frame);
}
