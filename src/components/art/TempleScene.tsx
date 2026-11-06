import { useId } from "react";
import { polar, quadPoints, r2, safeId } from "./svg";

/**
 * A Nagara-style temple at sunrise, drawn on a 480×1000 canvas. The whole
 * temple always fits (bottom-aligned); sky, hills and ground bleed past the
 * canvas so any screen shape is filled. The hero zooms into the glowing
 * doorway using TEMPLE_DOOR_ORIGIN.
 */
// The scene is scaled by min(width/480, height/1000) and bottom-aligned, so the
// door (y = 724 of 1000) sits 276 scaled units above the bottom edge.
// This assumes the container is the page's @container and is 100svh tall.
export const TEMPLE_DOOR_ORIGIN = "50% calc(100% - min(57.5cqw, 27.6svh))";

const RAYS = Array.from({ length: 32 }, (_, i) => {
  const a = i * (360 / 32);
  const p1 = polar(240, 520, 1100, a - 1.6);
  const p2 = polar(240, 520, 1100, a + 1.6);
  return `M240,520 L${p1.x},${p1.y} L${p2.x},${p2.y} Z`;
});

const SHIKHARA_BANDS = Array.from({ length: 13 }, (_, i) => 632 - i * 14);

const TORAN = quadPoints(212, 690, 240, 706, 268, 690, 9);

const pathEdge = (side: -1 | 1, y: number) =>
  r2(240 + side * (46 + ((y - 836) * 74) / 164));

const DIYAS = [860, 910, 966].flatMap((y, i) => {
  const s = 0.8 + i * 0.22;
  return [
    { x: pathEdge(-1, y) - 6, y, s },
    { x: pathEdge(1, y) + 6, y, s },
  ];
});

const MARIGOLDS = Array.from({ length: 14 }, (_, i) => {
  const y = 842 + i * 11.5;
  return [
    { x: pathEdge(-1, y) + 3, y, c: i % 2 ? "#f6b93b" : "#ef7d22" },
    { x: pathEdge(1, y) - 3, y, c: i % 2 ? "#ef7d22" : "#f6b93b" },
  ];
}).flat();

function Palm({
  x,
  y,
  crownX,
  crownY,
  fill,
  flip = false,
  scale = 1,
}: {
  x: number;
  y: number;
  crownX: number;
  crownY: number;
  fill: string;
  flip?: boolean;
  scale?: number;
}) {
  const mx = r2((x + crownX) / 2 + (flip ? -14 : 14));
  const my = r2((y + crownY) / 2);
  const leaves = [-168, -140, -112, -78, -44, -14, 16];
  return (
    <g fill={fill}>
      <path
        d={`M${x - 6},${y} Q${mx - 4},${my} ${crownX - 2},${crownY} L${crownX + 3},${crownY + 2} Q${mx + 5},${my} ${x + 7},${y} Z`}
      />
      <g transform={`translate(${crownX} ${crownY}) scale(${scale})`}>
        {leaves.map((deg) => {
          // Mirror the fan for right-hand palms; leaves pointing left are
          // flipped so every frond still droops downward.
          const a = flip ? 180 - deg : deg;
          const pointsLeft = Math.cos((a * Math.PI) / 180) < 0;
          return (
            <path
              key={deg}
              transform={`rotate(${a})${pointsLeft ? " scale(1 -1)" : ""}`}
              d="M0,0 C24,-17 58,-17 92,8 C66,-1 52,6 40,2 C30,4 16,2 0,0 Z"
            />
          );
        })}
        <circle r="5" />
      </g>
    </g>
  );
}

function SideTower({ cx, id }: { cx: number; id: string }) {
  const d = `M${cx - 34},662 C${cx - 35},614 ${cx - 20},580 ${cx - 4},556 L${cx + 4},556 C${cx + 20},580 ${cx + 35},614 ${cx + 34},662 Z`;
  return (
    <g>
      <clipPath id={`${id}-clip-${cx}`}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={`url(#${id}-tower)`} />
      <g clipPath={`url(#${id}-clip-${cx})`} stroke="#8a3f24" strokeOpacity="0.35">
        {[648, 636, 624, 612, 600, 588, 576, 564].map((y) => (
          <line key={y} x1={cx - 40} x2={cx + 40} y1={y} y2={y} />
        ))}
        <rect x={cx - 5} y="550" width="10" height="120" fill="#eaa36b" fillOpacity="0.45" stroke="none" />
      </g>
      <ellipse cx={cx} cy="552" rx="13" ry="4.5" fill="#c06d40" />
      <path d={`M${cx - 5},549 C${cx - 7},543 ${cx - 3},538 ${cx},538 C${cx + 3},538 ${cx + 7},543 ${cx + 5},549 Z`} fill="#d79b45" />
    </g>
  );
}

function Diya({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r2(s)})`}>
      <circle cy="-6" r="10" fill="#ffd36b" fillOpacity="0.28" />
      <path className="inv-flame" d="M0,-14 C3,-9 3,-5 0,-3 C-3,-5 -3,-9 0,-14 Z" fill="#ffcf4a" />
      <path d="M-9,-2 Q0,9 9,-2 Z" fill="#9c3f24" />
      <path d="M-9,-2 L9,-2" stroke="#e7a25c" strokeWidth="1.2" />
    </g>
  );
}

function LampPost({ x }: { x: number }) {
  return (
    <g>
      <circle cx={x} cy="708" r="12" fill="#ffd36b" fillOpacity="0.3" />
      <rect x={x - 3} y="714" width="6" height="46" fill="#9c4a2a" />
      {[724, 738, 750].map((y) => (
        <rect key={y} x={x - 9} y={y} width="18" height="3" rx="1.5" fill="#b85d35" />
      ))}
      <path d={`M${x - 8},714 Q${x},720 ${x + 8},714 Z`} fill="#b85d35" />
      <path className="inv-flame" d={`M${x},700 C${x + 3.5},705 ${x + 3},710 ${x},712 C${x - 3},710 ${x - 3.5},705 ${x},700 Z`} fill="#ffcf4a" />
    </g>
  );
}

export function TempleScene({ className }: { className?: string }) {
  const id = safeId(useId());
  const u = (name: string) => `url(#${id}-${name})`;

  const shikhara =
    "M158,640 C156,560 182,495 226,452 L254,452 C298,495 324,560 322,640 Z";

  return (
    <svg
      viewBox="0 0 480 1000"
      preserveAspectRatio="xMidYMax meet"
      overflow="visible"
      className={className}
      role="img"
      aria-label="सूर्योदय के समय एक मंदिर"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fdf4e4" />
          <stop offset="0.32" stopColor="#fbe7c8" />
          <stop offset="0.55" stopColor="#f8d09c" />
          <stop offset="0.7" stopColor="#f2b67c" />
          <stop offset="1" stopColor="#e99a5e" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="240" cy="520" r="330" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff8e3" stopOpacity="1" />
          <stop offset="0.35" stopColor="#ffe6ac" stopOpacity="0.8" />
          <stop offset="0.7" stopColor="#fbc679" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fbc679" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffbe9" />
          <stop offset="0.75" stopColor="#ffe9b4" />
          <stop offset="1" stopColor="#fdd88f" />
        </radialGradient>
        <linearGradient id={`${id}-shikhara`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b9623a" />
          <stop offset="0.45" stopColor="#d98a55" />
          <stop offset="0.55" stopColor="#d4844f" />
          <stop offset="1" stopColor="#a5522f" />
        </linearGradient>
        <linearGradient id={`${id}-tower`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b35f38" />
          <stop offset="0.5" stopColor="#cf7f4b" />
          <stop offset="1" stopColor="#9f4e2d" />
        </linearGradient>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8743f" />
          <stop offset="1" stopColor="#a9562f" />
        </linearGradient>
        <radialGradient id={`${id}-door`} cx="0.5" cy="0.62" r="0.7">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="0.45" stopColor="#ffe3a0" />
          <stop offset="1" stopColor="#f7a948" />
        </radialGradient>
        <radialGradient id={`${id}-doorhalo`} cx="240" cy="724" r="80" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff2c4" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff2c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="800" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e4a46b" />
          <stop offset="0.45" stopColor="#c47444" />
          <stop offset="1" stopColor="#7e3b21" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="860" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4a1d10" stopOpacity="0" />
          <stop offset="1" stopColor="#4a1d10" stopOpacity="0.55" />
        </linearGradient>
        <clipPath id={`${id}-shikhara-clip`}>
          <path d={shikhara} />
        </clipPath>
      </defs>

      {/* Sky, sun and rays */}
      <rect x="-600" y="-1000" width="1680" height="2200" fill={u("sky")} />
      <g fill="#fff3d2" opacity="0.16">
        {RAYS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <circle cx="240" cy="520" r="330" fill={u("glow")} />
      <circle cx="240" cy="520" r="112" fill={u("sun")} />

      {/* Clouds */}
      <g fill="#fff4e0">
        <ellipse cx="86" cy="560" rx="72" ry="5" opacity="0.7" />
        <ellipse cx="120" cy="574" rx="42" ry="3.5" opacity="0.55" />
        <ellipse cx="404" cy="590" rx="64" ry="5" opacity="0.65" />
        <ellipse cx="372" cy="603" rx="36" ry="3" opacity="0.5" />
      </g>

      {/* Birds */}
      <g fill="none" stroke="#7a3a22" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
        <path d="M352,474 q6,-6 12,0 q6,-6 12,0" />
        <path d="M382,458 q5,-5 10,0 q5,-5 10,0" />
        <path d="M372,494 q4,-4 8,0 q4,-4 8,0" />
      </g>

      {/* Hills */}
      <path
        d="M-600,694 C-400,670 -200,668 0,690 C60,662 120,652 180,668 C230,644 300,652 340,664 C400,642 450,652 480,664 C680,640 880,672 1080,668 L1080,820 L-600,820 Z"
        fill="#e7a873"
        opacity="0.75"
      />
      <path
        d="M-600,724 C-400,712 -200,716 0,732 C80,708 150,714 220,730 C300,708 380,714 480,726 C680,708 880,716 1080,726 L1080,820 L-600,820 Z"
        fill="#d68f5c"
        opacity="0.75"
      />

      {/* Palms */}
      <Palm x={36} y={900} crownX={80} crownY={612} fill="#7c3a22" />
      <Palm x={104} y={860} crownX={112} crownY={704} fill="#8d4429" scale={0.62} />
      <Palm x={448} y={910} crownX={412} crownY={636} fill="#7c3a22" flip />
      <Palm x={384} y={860} crownX={372} crownY={716} fill="#8d4429" flip scale={0.55} />
      <Palm x={-60} y={880} crownX={-40} crownY={680} fill="#8d4429" scale={0.8} />
      <Palm x={540} y={890} crownX={520} crownY={690} fill="#8d4429" flip scale={0.8} />

      {/* Side towers and walls */}
      <SideTower cx={162} id={id} />
      <SideTower cx={318} id={id} />
      <rect x="128" y="656" width="224" height="104" fill={u("wall")} />
      {[146, 316].map((x) => (
        <path
          key={x}
          d={`M${x},720 L${x},700 Q${x + 9},688 ${x + 18},700 L${x + 18},720 Z`}
          fill="#8f4327"
        />
      ))}

      {/* Main shikhara */}
      <path d={shikhara} fill={u("shikhara")} />
      <g clipPath={u("shikhara-clip")}>
        <g stroke="#7f371f" strokeOpacity="0.32" strokeWidth="1.2">
          {SHIKHARA_BANDS.map((y) => (
            <line key={y} x1="150" x2="330" y1={y} y2={y} />
          ))}
        </g>
        <g stroke="#7f371f" strokeOpacity="0.22">
          <path d="M200,640 C200,560 215,500 232,456" fill="none" />
          <path d="M280,640 C280,560 265,500 248,456" fill="none" />
        </g>
        <rect x="231" y="440" width="18" height="210" fill="#efb07a" fillOpacity="0.45" />
      </g>
      <ellipse cx="240" cy="446" rx="32" ry="10" fill="#c06d40" />
      <g stroke="#8a3f24" strokeOpacity="0.5">
        {[-24, -16, -8, 0, 8, 16, 24].map((dx) => (
          <line key={dx} x1={240 + dx} x2={240 + dx * 0.9} y1="438" y2="454" />
        ))}
      </g>
      <ellipse cx="240" cy="434" rx="20" ry="6" fill="#cf7c49" />
      <path d="M231,430 C226,421 230,411 240,410 C250,411 254,421 249,430 Z" fill="#d9a14a" />
      <circle cx="240" cy="406" r="3.5" fill="#d9a14a" />
      <line x1="240" y1="404" x2="240" y2="374" stroke="#6b2e1c" strokeWidth="2" />
      <path className="inv-flag" d="M241,376 Q259,378 280,388 Q259,393 241,400 Z" fill="#ea7428" />

      {/* Mandapa roof */}
      <path d="M170,670 L186,654 L294,654 L310,670 Z" fill="#b25c35" />
      <path d="M190,654 L204,640 L276,640 L290,654 Z" fill="#c36b3f" />
      <path d="M208,640 L222,628 L258,628 L272,640 Z" fill="#cf7a49" />
      <path d="M234,628 C230,620 234,613 240,612 C246,613 250,620 246,628 Z" fill="#d9a14a" />

      {/* Mandapa body */}
      <rect x="164" y="668" width="152" height="92" fill="#c06a3d" />
      <rect x="158" y="666" width="164" height="8" fill="#93452a" />
      {[176, 196, 276, 296].map((x) => (
        <g key={x}>
          <rect x={x} y="676" width="8" height="84" fill="#e3a26c" />
          <rect x={x - 2} y="674" width="12" height="5" fill="#f0b780" />
          <rect x={x - 2} y="755" width="12" height="5" fill="#a5522f" />
        </g>
      ))}

      {/* Doorway */}
      <circle cx="240" cy="724" r="80" fill={u("doorhalo")} />
      <path
        d="M214,760 L214,712 C214,698 226,688 240,684 C254,688 266,698 266,712 L266,760 Z"
        fill={u("door")}
        stroke="#f6cf86"
        strokeWidth="2.5"
      />
      <g>
        {TORAN.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.2" fill={i % 2 ? "#f6b93b" : "#ef7d22"} />
        ))}
      </g>

      <LampPost x={136} />
      <LampPost x={344} />

      {/* Platform and steps */}
      <rect x="110" y="760" width="260" height="22" fill="#c97548" />
      <rect x="110" y="760" width="260" height="2.5" fill="#efb27c" />
      <rect x="96" y="782" width="288" height="18" fill="#b5633b" />

      {/* Ground */}
      <rect x="-600" y="800" width="1680" height="400" fill={u("ground")} />
      <path d="M194,836 L286,836 L362,1000 L118,1000 Z" fill="#f2c18b" opacity="0.55" />
      <path d="M206,800 L274,800 L280,812 L200,812 Z" fill="#dc9a64" />
      <path d="M200,812 L280,812 L286,824 L194,824 Z" fill="#cf8b57" />
      <path d="M194,824 L286,824 L290,836 L190,836 Z" fill="#c27c4b" />
      {MARIGOLDS.map((m, i) => (
        <circle key={i} cx={m.x} cy={m.y} r={r2(2.4 + (m.y - 840) / 80)} fill={m.c} />
      ))}
      {DIYAS.map((d, i) => (
        <Diya key={i} {...d} />
      ))}

      <rect x="-600" y="860" width="1680" height="340" fill={u("shade")} />
    </svg>
  );
}
