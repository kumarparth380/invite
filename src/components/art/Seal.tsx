import { Florals, garland, type Cubic, type Pt } from "./Roses";

/**
 * Gold seal with the couple's monogram. It fills its parent, which must be a
 * square with `@container` so the rings and letters scale with it.
 */
export function SealFace({ monogram, soft = false }: { monogram: string; soft?: boolean }) {
  return (
    <>
      <span
        className={`absolute inset-0 rounded-full ${
          soft ? "shadow-[0_8px_20px_-6px_rgba(91,38,21,.55)]" : "shadow-[0_14px_34px_-6px_rgba(0,0,0,.7)]"
        }`}
        style={{ background: "radial-gradient(circle at 35% 30%, #fbecb8, #d9a94e 50%, #8c6219)" }}
      />
      <span className="absolute inset-[8cqw] rounded-full border border-[#7a5414]/45" />
      <span className="absolute inset-[12.8cqw] rounded-full border border-dashed border-[#7a5414]/30" />
      <span className="inv-latin relative text-[36cqw] leading-none tracking-tight text-[#4a2c08] italic">{monogram}</span>
    </>
  );
}

const K = 0.5523; // control-point factor for a circle drawn with four cubics
const pt = (x: number, y: number): Pt => ({ x, y });
const ring = (r: number): Cubic[] => [
  [pt(0, -r), pt(r * K, -r), pt(r, -r * K), pt(r, 0)],
  [pt(r, 0), pt(r, r * K), pt(r * K, r), pt(0, r)],
  [pt(0, r), pt(-r * K, r), pt(-r, r * K), pt(-r, 0)],
  [pt(-r, 0), pt(-r, -r * K), pt(-r * K, -r), pt(0, -r)],
];

// Coral, peach and ivory: the same roses as on the Mehndi & Sangeet card.
const WREATH = garland(ring(71), {
  rose: [13, 17],
  spacing: 21,
  jitter: 6,
  tones: ["coral", "coral", "peach", "peach", "peach", "ivory", "ivory"],
  leaf: [20, 28],
  leafy: 0.9,
  seed: 11,
});

/**
 * A round jaimala of roses around the seal. Centre it on the seal at 176% of
 * the seal's size: the seal's radius is then 56.8 of the viewBox's 100.
 */
export function SealWreath({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className={`pointer-events-none overflow-visible ${className}`} aria-hidden="true">
      <g filter="url(#rose-shadow)">
        <Florals items={WREATH} />
      </g>
    </svg>
  );
}
