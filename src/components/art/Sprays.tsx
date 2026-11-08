import { Florals, type FloralItem, type RoseTone } from "./Roses";

/**
 * Corner spray of English roses: one full rose in the corner, smaller roses
 * and buds trailing along both edges, with leaves, eucalyptus and baby's
 * breath. Drawn for the top-left corner of a 200 × 200 box.
 */
function sprayItems([main, second, third]: [RoseTone, RoseTone, RoseTone]): FloralItem[] {
  return [
    { kind: "leaf", x: 50, y: 22, rot: -14, s: 1.25 },
    { kind: "euc", x: 92, y: 30, rot: -22, s: 1.5 },
    { kind: "leaf", x: 100, y: 14, rot: 6, s: 1.15 },
    { kind: "leaf", x: 132, y: 22, rot: 24, s: 1 },
    { kind: "euc", x: 146, y: 12, rot: -14, s: 1.15 },
    { kind: "leaf", x: 22, y: 50, rot: 104, s: 1.25 },
    { kind: "euc", x: 30, y: 92, rot: 112, s: 1.5 },
    { kind: "leaf", x: 14, y: 100, rot: 84, s: 1.15 },
    { kind: "leaf", x: 22, y: 132, rot: 66, s: 1 },
    { kind: "euc", x: 12, y: 146, rot: 104, s: 1.15 },
    { kind: "leaf", x: 46, y: 46, rot: 45, s: 1.45 },
    { kind: "euc", x: 58, y: 40, rot: 18, s: 1.3 },
    { kind: "euc", x: 40, y: 58, rot: 72, s: 1.3 },
    { kind: "bud", tone: second, x: 168, y: 20, rot: 80, s: 0.95 },
    { kind: "bud", tone: third, x: 150, y: 34, rot: 112, s: 0.75 },
    { kind: "bud", tone: second, x: 20, y: 168, rot: 190, s: 0.95 },
    { kind: "bud", tone: third, x: 34, y: 150, rot: 158, s: 0.75 },
    { kind: "gyp", x: 84, y: 50, rot: 0, s: 1.1 },
    { kind: "gyp", x: 50, y: 84, rot: 40, s: 1.1 },
    { kind: "gyp", x: 126, y: 36, rot: 20, s: 0.9 },
    { kind: "gyp", x: 36, y: 126, rot: 80, s: 0.9 },
    { kind: "rose", tone: third, x: 120, y: 18, rot: 20, s: 0.28 },
    { kind: "rose", tone: third, x: 18, y: 120, rot: 140, s: 0.28 },
    { kind: "rose", tone: second, x: 84, y: 22, rot: 60, s: 0.4 },
    { kind: "rose", tone: second, x: 22, y: 84, rot: 200, s: 0.4 },
    { kind: "rose", tone: third, x: 66, y: 64, rot: 300, s: 0.3 },
    { kind: "rose", tone: main, x: 36, y: 36, rot: 10, s: 0.62 },
  ];
}

const FLIP = {
  tl: "",
  tr: "translate(200 0) scale(-1 1)",
  bl: "translate(0 200) scale(1 -1)",
  br: "translate(200 200) scale(-1 -1)",
};

export function CornerSpray({
  tones,
  corner = "tl",
  className = "",
}: {
  /** Corner rose, the trailing roses and buds, the small accents. */
  tones: [RoseTone, RoseTone, RoseTone];
  corner?: keyof typeof FLIP;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" className={`pointer-events-none overflow-visible ${className}`} aria-hidden="true">
      {/* Flip inside the shadow filter, so the shadow always falls downwards. */}
      <g filter="url(#rose-shadow)">
        <g transform={FLIP[corner] || undefined}>
          <Florals items={sprayItems(tones)} />
        </g>
      </g>
    </svg>
  );
}
