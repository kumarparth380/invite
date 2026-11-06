import { useId } from "react";
import { polar, quadPoints, safeId } from "./svg";

/**
 * The left leaf of a carved temple door (240×1000), with a marigold toran
 * across the top. The right leaf is the same drawing mirrored, so motifs that
 * sit on the seam (x = 240) join into whole shapes when the doors are closed.
 */

const SWAGS = [
  quadPoints(-6, 34, 57, 96, 120, 34, 14),
  quadPoints(120, 34, 183, 96, 246, 34, 14),
];

const STRANDS = [0, 120, 240].map((x) =>
  Array.from({ length: 6 }, (_, i) => ({ x, y: 40 + i * 13 })),
);

const SIDE_STUDS = Array.from({ length: 18 }, (_, i) => 260 + i * 40);

function Rosette({
  cx,
  cy,
  r,
  gold,
}: {
  cx: number;
  cy: number;
  r: number;
  gold: string;
}) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <g stroke={gold} fill="none">
      <circle cx={cx} cy={cy} r={r} strokeWidth="1.4" />
      <circle cx={cx} cy={cy} r={r * 0.82} strokeOpacity="0.55" strokeDasharray="1.5 3" />
      {petals.map((deg) => {
        const p = polar(cx, cy, r * 0.48, deg);
        return (
          <ellipse
            key={deg}
            cx={p.x}
            cy={p.y}
            rx={r * 0.13}
            ry={r * 0.3}
            transform={`rotate(${deg + 90} ${p.x} ${p.y})`}
            strokeWidth="1.2"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.16} fill={gold} />
    </g>
  );
}

export function GateDoorLeaf({ className }: { className?: string }) {
  const id = safeId(useId());
  const gold = "#d4a24c";

  const panels = [
    { y: 262, h: 214, rosette: 40 },
    { y: 506, h: 238, rosette: 46 },
    { y: 774, h: 176, rosette: 32 },
  ];

  return (
    <svg
      viewBox="0 0 240 1000"
      preserveAspectRatio="xMaxYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a120d" />
          <stop offset="0.4" stopColor="#6c1e16" />
          <stop offset="0.85" stopColor="#7a251b" />
          <stop offset="1" stopColor="#5a1811" />
        </linearGradient>
        <linearGradient id={`${id}-panel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#782419" />
          <stop offset="1" stopColor="#5f1a12" />
        </linearGradient>
        <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9b6a22" />
          <stop offset="0.5" stopColor="#f2d48a" />
          <stop offset="1" stopColor="#a87426" />
        </linearGradient>
        <radialGradient id={`${id}-stud`} cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fbe7a9" />
          <stop offset="0.6" stopColor="#d4a24c" />
          <stop offset="1" stopColor="#7e5517" />
        </radialGradient>
        <pattern id={`${id}-jaali`} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="1.4" fill={gold} fillOpacity="0.35" />
        </pattern>
      </defs>

      {/* Wood and grain */}
      <rect width="240" height="1000" fill={`url(#${id}-wood)`} />
      <g stroke="#000" strokeOpacity="0.08" fill="none">
        {[30, 58, 92, 131, 166, 204].map((x, i) => (
          <path key={x} d={`M${x},0 C${x + (i % 2 ? 6 : -6)},300 ${x + (i % 2 ? -5 : 5)},650 ${x},1000`} />
        ))}
      </g>

      {/* Lintel behind the garland */}
      <rect width="240" height="34" fill="#360c08" />
      <rect y="32" width="240" height="2" fill={gold} />

      {/* Arch over the doorway */}
      <path d="M14,250 V214 C14,138 112,96 240,86 V250 Z" fill="#3f0f0a" />
      <path d="M14,250 V214 C14,138 112,96 240,86 V250 Z" fill={`url(#${id}-jaali)`} />
      <path d="M14,250 V214 C14,138 112,96 240,86" fill="none" stroke={gold} strokeWidth="2.4" />
      <path d="M26,250 V218 C26,150 118,112 240,102" fill="none" stroke={gold} strokeOpacity="0.55" />
      <Rosette cx={240} cy={176} r={44} gold={gold} />

      {/* Frame */}
      <rect x="12" y="12" width="260" height="976" fill="none" stroke={gold} strokeWidth="3" />
      <rect x="20" y="20" width="260" height="960" fill="none" stroke={gold} strokeOpacity="0.55" />

      {/* Panels */}
      {panels.map((p) => (
        <g key={p.y}>
          <rect x="44" y={p.y} width="168" height={p.h} rx="8" fill={`url(#${id}-panel)`} stroke={gold} strokeWidth="2" />
          <rect x="53" y={p.y + 9} width="150" height={p.h - 18} rx="5" fill="none" stroke={gold} strokeOpacity="0.6" />
          <Rosette cx={128} cy={p.y + p.h / 2} r={p.rosette} gold={gold} />
          {[
            [62, p.y + 18],
            [194, p.y + 18],
            [62, p.y + p.h - 18],
            [194, p.y + p.h - 18],
          ].map(([x, y]) => (
            <path
              key={`${x}-${y}`}
              d={`M${x},${y - 6} L${x + 6},${y} L${x},${y + 6} L${x - 6},${y} Z`}
              fill={gold}
              fillOpacity="0.8"
            />
          ))}
        </g>
      ))}

      {/* Brass studs */}
      {SIDE_STUDS.map((y) => (
        <circle key={y} cx="30" cy={y} r="4.5" fill={`url(#${id}-stud)`} />
      ))}
      {[491, 759].flatMap((y) =>
        Array.from({ length: 7 }, (_, i) => (
          <circle key={`${y}-${i}`} cx={52 + i * 27} cy={y} r="4.5" fill={`url(#${id}-stud)`} />
        )),
      )}

      {/* Knocker */}
      <circle cx="210" cy="600" r="9" fill={`url(#${id}-stud)`} />
      <circle cx="210" cy="626" r="18" fill="none" stroke={`url(#${id}-brass)`} strokeWidth="3.5" />

      {/* Seam molding */}
      <rect x="230" width="10" height="1000" fill={`url(#${id}-brass)`} />
      <rect x="229" width="1.2" height="1000" fill="#3a0d08" fillOpacity="0.6" />

      {/* Marigold toran */}
      {STRANDS.map((strand, si) => (
        <g key={si}>
          {strand.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r="5.6" fill={i % 2 ? "#f6b93b" : "#ee7a1f"} />
          ))}
          <path
            d={`M${strand[0].x},118 C${strand[0].x + 8},126 ${strand[0].x + 7},140 ${strand[0].x},150 C${strand[0].x - 7},140 ${strand[0].x - 8},126 ${strand[0].x},118 Z`}
            fill="#4f7a2a"
          />
        </g>
      ))}
      {SWAGS.map((swag, si) =>
        swag.map((b, i) => (
          <circle
            key={`${si}-${i}`}
            cx={b.x}
            cy={b.y}
            r="6.4"
            fill={i % 2 ? "#f6b93b" : "#ee7a1f"}
            stroke="#b9560f"
            strokeOpacity="0.4"
          />
        )),
      )}
    </svg>
  );
}
