import { Fragment } from "react";
import { polar, r2 } from "./svg";

/**
 * English (garden) roses, buds and foliage, drawn once as SVG <defs> and then
 * stamped with <use>. <RoseDefs /> must be on the page (it is rendered once by
 * <Invitation />); every wreath and spray references its ids.
 */

type Palette = { light: string; mid: string; deep: string; core: string };

export const ROSE_TONES = {
  blush: { light: "#fff2f0", mid: "#f8bfc5", deep: "#e08494", core: "#b04f68" },
  ivory: { light: "#fffefa", mid: "#faefdc", deep: "#e6cfa8", core: "#b39062" },
  peach: { light: "#fff1e4", mid: "#fdc59c", deep: "#f09262", core: "#c2603a" },
  raspberry: { light: "#fdbfd5", mid: "#ec6f9c", deep: "#c43a6e", core: "#86164a" },
  mauve: { light: "#f9e3e8", mid: "#e2a5b4", deep: "#b86c80", core: "#844052" },
  coral: { light: "#ffe0d6", mid: "#ffa48d", deep: "#ea6a54", core: "#b33d33" },
  butter: { light: "#fffbe6", mid: "#fde9a8", deep: "#efc463", core: "#b8862a" },
} satisfies Record<string, Palette>;

export type RoseTone = keyof typeof ROSE_TONES;
const TONES = Object.keys(ROSE_TONES) as RoseTone[];

/** A broad, rounded petal pointing up, its base at the origin. */
const petal = (L: number, w: number) => {
  return (
    `M0,0 C${r2(-w * 0.95)},${r2(-L * 0.2)} ${r2(-w * 1.12)},${r2(-L * 0.78)} ${r2(-w * 0.42)},${r2(-L * 0.97)}` +
    ` Q0,${r2(-L * 1.06)} ${r2(w * 0.42)},${r2(-L * 0.97)}` +
    ` C${r2(w * 1.12)},${r2(-L * 0.78)} ${r2(w * 0.95)},${r2(-L * 0.2)} 0,0 Z`
  );
};

/** The curled rim of an inner petal: a crescent along a circle of radius `rad`. */
const rim = (rad: number, deg: number, spread: number, depth: number) => {
  const a = polar(0, 0, rad, deg - spread);
  const b = polar(0, 0, rad, deg + spread);
  const c = polar(0, 0, rad * depth, deg);
  return `M${a.x},${a.y} A${rad},${rad} 0 0 1 ${b.x},${b.y} Q${c.x},${c.y} ${a.x},${a.y} Z`;
};

const OUTER = [0, 72, 144, 216, 288];
const SECOND = OUTER.map((a) => a + 36);
/** The bowl's rim, then a spiral of ever smaller petals curling into the heart. */
const BOWL = [10, 82, 154, 226, 298].map((deg) => ({ rad: 31, deg, spread: 46, depth: 0.74 }));
const SPIRAL = Array.from({ length: 9 }, (_, i) => ({
  rad: r2(26 * Math.pow(0.8, i)),
  deg: 40 + i * 118,
  spread: 84 - i * 4,
  depth: 0.62,
}));

/** Rose head, radius 50, centred on the origin. */
function RoseShape({ tone }: { tone: RoseTone }) {
  const t = ROSE_TONES[tone];
  const edge = { stroke: t.core, strokeOpacity: 0.28, strokeWidth: 1.1 };
  return (
    <g id={`rose-${tone}`}>
      {OUTER.map((a) => (
        <path key={a} d={petal(47, 25)} transform={`rotate(${a}) translate(0 -3)`} fill={`url(#petal-${tone})`} {...edge} />
      ))}
      <circle r="44" fill="url(#rose-halo-44)" />
      {SECOND.map((a) => (
        <path key={a} d={petal(40, 22)} transform={`rotate(${a}) translate(0 -2)`} fill={`url(#petal-${tone})`} {...edge} />
      ))}
      <circle r="37" fill="url(#rose-halo-37)" />
      <circle r="32" fill={`url(#cup-${tone})`} />
      {[...BOWL, ...SPIRAL].map((p) => (
        <path
          key={`${p.rad}-${p.deg}`}
          d={rim(p.rad, p.deg, p.spread, p.depth)}
          fill={`url(#rim-${tone})`}
          stroke={t.core}
          strokeOpacity="0.32"
          strokeWidth="0.9"
        />
      ))}
      <circle r="2.6" fill={t.core} />
    </g>
  );
}

/** Closed bud on a short stem with sepals, pointing up, base at the origin. Length ≈ 34. */
function BudShape({ tone }: { tone: RoseTone }) {
  const t = ROSE_TONES[tone];
  return (
    <g id={`bud-${tone}`}>
      <path d="M0,4 V-2" stroke="#56794d" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M0,-6 C-8,-9 -9,-21 0,-32 C9,-21 8,-9 0,-6 Z" fill={`url(#budfill-${tone})`} stroke={t.core} strokeOpacity="0.3" strokeWidth="0.8" />
      <path d="M0,-30 C-4,-24 -4,-15 1,-10" fill="none" stroke={t.core} strokeOpacity="0.35" strokeWidth="0.9" />
      <path d="M0,-3 C-5,-6 -9,-12 -9,-19 C-5,-14 -2,-11 0,-9 Z" fill="#6f9465" />
      <path d="M0,-3 C5,-6 9,-12 9,-19 C5,-14 2,-11 0,-9 Z" fill="#5f8657" />
      <path d="M0,-3 C-2,-8 -1,-14 1,-17 C2,-12 2,-8 0,-3 Z" fill="#7da371" />
    </g>
  );
}

function Foliage() {
  return (
    <>
      {/* Rose leaf, pointing right, base at the origin, length 40. */}
      <g id="leaf">
        <path d="M0,0 C9,-11 25,-12.5 40,0 C25,12 9,11 0,0 Z" fill="url(#leaf-fill)" stroke="#3f5f3a" strokeOpacity="0.35" strokeWidth="0.8" />
        <path d="M2,0 Q20,-1.2 37,0" fill="none" stroke="#dfeccb" strokeOpacity="0.55" strokeWidth="1" />
        <path d="M12,-0.6 L18,-6.5 M20,-0.8 L26,-6 M14,0 L20,5.6 M22,0 L28,5" fill="none" stroke="#dfeccb" strokeOpacity="0.3" strokeWidth="0.7" />
      </g>
      {/* Eucalyptus leaf: round and silvery. Base at the origin, length ≈ 24. */}
      <g id="euc">
        <path d="M0,0 C2,-10 15,-13 22,-6 C27,0 20,10 10,10 C3,10 -1,5 0,0 Z" fill="url(#euc-fill)" stroke="#5d7a66" strokeOpacity="0.35" strokeWidth="0.7" />
        <path d="M1,0 Q10,-1 20,-2" fill="none" stroke="#eef4ec" strokeOpacity="0.45" strokeWidth="0.8" />
      </g>
      {/* Gypsophila (baby's breath): a spray of tiny white florets. */}
      <g id="gyp">
        {[
          [0, 0, 2.6],
          [-5, -3, 2.1],
          [5, -2.5, 2.2],
          [-2.5, -7, 2],
          [3, -7.5, 1.9],
          [-7, 2.5, 1.8],
          [7, 2, 1.8],
          [0.5, 5, 1.7],
        ].map(([x, y, rad]) => (
          <circle key={`${x},${y}`} cx={x} cy={y} r={rad} fill="#fffcf5" stroke="#e7d9c0" strokeWidth="0.5" />
        ))}
      </g>
    </>
  );
}

/** Shared gradients, shapes and the soft drop shadow for every rose motif. */
export function RoseDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {TONES.map((tone) => {
          const t = ROSE_TONES[tone];
          return (
            <Fragment key={tone}>
              <linearGradient id={`petal-${tone}`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor={t.deep} />
                <stop offset="0.5" stopColor={t.mid} />
                <stop offset="1" stopColor={t.light} />
              </linearGradient>
              <radialGradient id={`cup-${tone}`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="32">
                <stop offset="0" stopColor={t.core} />
                <stop offset="0.4" stopColor={t.deep} />
                <stop offset="0.8" stopColor={t.mid} />
              </radialGradient>
              <radialGradient id={`rim-${tone}`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="32">
                <stop offset="0" stopColor={t.deep} />
                <stop offset="0.55" stopColor={t.mid} />
                <stop offset="1" stopColor={t.light} />
              </radialGradient>
              <linearGradient id={`budfill-${tone}`} x1="0" y1="1" x2="0.3" y2="0">
                <stop offset="0" stopColor={t.deep} />
                <stop offset="0.6" stopColor={t.mid} />
                <stop offset="1" stopColor={t.light} />
              </linearGradient>
            </Fragment>
          );
        })}
        {/* Soft shade cast by each ring of petals onto the ring below it. */}
        {[44, 37].map((r) => (
          <radialGradient key={r} id={`rose-halo-${r}`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r={r}>
            <stop offset="0.72" stopColor="#5a1a22" stopOpacity="0.26" />
            <stop offset="1" stopColor="#5a1a22" stopOpacity="0" />
          </radialGradient>
        ))}
        <linearGradient id="leaf-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fb07f" />
          <stop offset="0.5" stopColor="#6c9160" />
          <stop offset="1" stopColor="#4d7046" />
        </linearGradient>
        <linearGradient id="euc-fill" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#c4d3bf" />
          <stop offset="1" stopColor="#87a38e" />
        </linearGradient>
        <filter id="rose-shadow" x="-10%" y="-10%" width="120%" height="125%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" floodColor="#2a0f05" floodOpacity="0.5" />
        </filter>
        {TONES.map((tone) => (
          <Fragment key={tone}>
            <RoseShape tone={tone} />
            <BudShape tone={tone} />
          </Fragment>
        ))}
        <Foliage />
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------ garlands */

export type Pt = { x: number; y: number };
/** A cubic Bézier: start, two controls, end. */
export type Cubic = [Pt, Pt, Pt, Pt];

export type FloralItem = {
  kind: "rose" | "bud" | "leaf" | "euc" | "gyp";
  tone?: RoseTone;
  x: number;
  y: number;
  /** Degrees. */
  rot: number;
  /** Scale applied to the motif's own size (rose radius 50, leaf length 40…). */
  s: number;
};

/** Deterministic random numbers, so the server and the browser draw the same wreath. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const bez = (c: Cubic, t: number): Pt => {
  const u = 1 - t;
  const [p0, p1, p2, p3] = c;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
};

/** Points every `step` units along a chain of cubics, with the direction of travel in degrees. */
function along(curves: Cubic[], step: number) {
  const dense: Pt[] = [];
  for (const c of curves) for (let i = 0; i <= 60; i++) dense.push(bez(c, i / 60));
  const out: (Pt & { deg: number })[] = [];
  let next = 0; // how far into the current segment the next point falls
  for (let i = 1; i < dense.length; i++) {
    const a = dense[i - 1];
    const b = dense[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (seg === 0) continue;
    const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    for (; next <= seg; next += step) {
      const k = next / seg;
      out.push({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, deg });
    }
    next -= seg;
  }
  return out;
}

export type GarlandStyle = {
  /** Rose radius range. */
  rose: [number, number];
  /** Distance between roses in each of the rope's two staggered rows. */
  spacing: number;
  /** How far roses wander either side of the line. */
  jitter: number;
  /** Tones to pick from; repeat a tone to make it more common. */
  tones: RoseTone[];
  /** Leaf length range. */
  leaf: [number, number];
  /** Share of leaf slots that get a leaf (0–1). Default 0.65. */
  leafy?: number;
  seed: number;
};

/** A thick rope of roses with leaves tucked along both edges, like a jaimala. */
export function garland(curves: Cubic[], style: GarlandStyle): FloralItem[] {
  const rnd = seeded(style.seed);
  const range = ([a, b]: [number, number]) => a + rnd() * (b - a);
  const tone = () => style.tones[Math.floor(rnd() * style.tones.length)];
  const leaves: FloralItem[] = [];
  const fill: FloralItem[] = [];
  const roses: FloralItem[] = [];
  const pts = along(curves, style.spacing / 2);

  pts.forEach((p, i) => {
    const rad = (p.deg * Math.PI) / 180;
    const nx = -Math.sin(rad);
    const ny = Math.cos(rad);
    const at = (off: number) => ({ x: p.x + nx * off, y: p.y + ny * off });
    // Two staggered rows of roses make the rope round and full.
    const row = i % 2 === 0 ? 1 : -1;
    const edge = style.jitter + style.rose[1] * 0.55;

    // Leaves peek out from under the roses on both edges, angled back along the rope.
    if (i % 2 === 0 || rnd() < 0.5) {
      for (const side of [1, -1]) {
        if (rnd() > (style.leafy ?? 0.65)) continue;
        const euc = rnd() < 0.3;
        leaves.push({
          kind: euc ? "euc" : "leaf",
          ...at(side * edge * (0.55 + rnd() * 0.3)),
          rot: p.deg + side * (55 + rnd() * 55) + (rnd() - 0.5) * 30,
          s: range(style.leaf) / (euc ? 24 : 40),
        });
      }
    }

    if (rnd() < 0.35) {
      fill.push({
        kind: "gyp",
        ...at(-row * edge * (0.75 + rnd() * 0.2)),
        rot: rnd() * 360,
        s: (style.rose[1] / 20) * (0.75 + rnd() * 0.4),
      });
    }

    roses.push({
      kind: "rose",
      tone: tone(),
      ...at(row * style.jitter * (0.5 + rnd() * 0.6)),
      rot: rnd() * 360,
      s: range(style.rose) / 50,
    });
  });

  return [...leaves, ...fill, ...roses];
}

/** Renders floral items. Put it inside an <svg> whose coordinates the items use. */
export function Florals({ items }: { items: FloralItem[] }) {
  return (
    <>
      {items.map((it, i) => {
        const id = it.kind === "rose" || it.kind === "bud" ? `${it.kind}-${it.tone}` : it.kind;
        return (
          <use
            key={i}
            href={`#${id}`}
            transform={`translate(${r2(it.x)} ${r2(it.y)}) rotate(${r2(it.rot)}) scale(${r2(it.s * 1000) / 1000})`}
          />
        );
      })}
    </>
  );
}
