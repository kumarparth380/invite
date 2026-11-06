import { polar, r2 } from "./svg";

/** Thin divider with a lotus bud in the middle. */
export function Ornament({
  className = "",
  color = "#b9853f",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 20"
      className={`mx-auto block ${className}`}
      fill="none"
      stroke={color}
      strokeWidth="0.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4,11 H44" strokeOpacity="0.7" />
      <path d="M76,11 H116" strokeOpacity="0.7" />
      <circle cx="48.5" cy="11" r="1.1" fill={color} stroke="none" />
      <circle cx="71.5" cy="11" r="1.1" fill={color} stroke="none" />
      <path d="M60,2.5 C63.5,6.5 63.5,12 60,16 C56.5,12 56.5,6.5 60,2.5 Z" />
      <path d="M60,16 C55,15 51.5,11 52,6.5 C55.5,8 58.5,11.5 60,16 Z" />
      <path d="M60,16 C65,15 68.5,11 68,6.5 C64.5,8 61.5,11.5 60,16 Z" />
      <path d="M53,17.5 H67" strokeOpacity="0.6" />
    </svg>
  );
}

/** Concentric petal rings, used as a faint watermark. */
export function Mandala({ className = "" }: { className?: string }) {
  const rings = [
    { r: 40, n: 8, rx: 9, ry: 20 },
    { r: 78, n: 12, rx: 12, ry: 26 },
    { r: 122, n: 16, rx: 14, ry: 30 },
    { r: 168, n: 24, rx: 12, ry: 26 },
  ];
  return (
    <svg
      viewBox="-200 -200 400 400"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <circle r="14" />
      <circle r="24" />
      {rings.map((ring) =>
        Array.from({ length: ring.n }, (_, i) => {
          const deg = (360 / ring.n) * i;
          const p = polar(0, 0, ring.r, deg);
          return (
            <ellipse
              key={`${ring.r}-${i}`}
              cx={p.x}
              cy={p.y}
              rx={ring.rx}
              ry={ring.ry}
              transform={`rotate(${r2(deg + 90)} ${p.x} ${p.y})`}
            />
          );
        }),
      )}
      <circle r="60" strokeOpacity="0.6" />
      <circle r="100" strokeOpacity="0.6" />
      <circle r="146" strokeOpacity="0.6" />
      <circle r="196" strokeDasharray="2 6" />
    </svg>
  );
}

/** Corner flourish for the card frame (drawn for the top-left corner). */
export function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2,58 V14 Q2,2 14,2 H58" />
      <path d="M8,58 V18 Q8,8 18,8 H58" strokeOpacity="0.55" />
      <path d="M14,14 C22,10 30,14 30,22 C30,28 24,30 20,27 C17,25 18,20 22,20" />
      <path d="M30,22 C38,20 44,24 46,30" strokeOpacity="0.7" />
      <path d="M22,30 C20,38 24,44 30,46" strokeOpacity="0.7" />
      <circle cx="14" cy="14" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="48" cy="32" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="32" cy="48" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Small line icons for each ceremony. */
export function EventIcon({
  kind,
  className = "",
  color,
}: {
  kind: "haldi" | "mehndi" | "wedding";
  className?: string;
  color: string;
}) {
  const common = {
    viewBox: "0 0 48 48",
    className,
    fill: "none",
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (kind === "haldi") {
    // A bowl of turmeric paste with a sprig of leaves.
    return (
      <svg {...common}>
        <path d="M8,26 H40 C40,35 33,41 24,41 C15,41 8,35 8,26 Z" fill={color} fillOpacity="0.14" />
        <path d="M13,26 C15,20 33,20 35,26" fill={color} fillOpacity="0.35" />
        <path d="M18,41 L17,44 H31 L30,41" />
        <path d="M30,20 C31,13 35,9 40,8 C40,14 36,18 30,20 Z" />
        <path d="M30,20 C27,15 22,13 18,14 C20,19 24,21 30,20 Z" />
        <circle cx="24" cy="32" r="1.4" fill={color} stroke="none" />
        <circle cx="18" cy="31" r="1" fill={color} stroke="none" />
        <circle cx="30" cy="31" r="1" fill={color} stroke="none" />
      </svg>
    );
  }

  if (kind === "mehndi") {
    // A hennaed palm (dipped fingertips, a flower in the palm, a dotted cuff)
    // with a pair of notes for the sangeet.
    const fingers = [
      { l: 16, r: 20, top: 10.6 },
      { l: 20, r: 24, top: 7.6 },
      { l: 24, r: 28, top: 9.2 },
      { l: 28, r: 31.6, top: 13 },
    ];
    const palm = { x: 23.8, y: 29.6 };
    return (
      <svg {...common}>
        <g transform="translate(-2.4 0)">
          <path d="M18,44 L17.6,37.5 C15.2,35.6 12.4,31.6 10.4,27.6 C9.4,25.6 11.6,23.9 13.2,25.4 L16,28.4 V13.4 C16,10.6 20,10.6 20,13.4 V21 V10.4 C20,7.6 24,7.6 24,10.4 V21 V12 C24,9.2 28,9.2 28,12 V21.6 V15.6 C28,13 31.6,13 31.6,15.6 V30 C31.6,34.4 30.4,37 29.6,38 L29.6,44" />
          {fingers.map((f) => (
            <g key={f.l} fill={color} stroke="none">
              <path d={`M${f.l},${r2(f.top + 3.4)} V${r2(f.top + 2.8)} C${f.l},${f.top} ${f.r},${f.top} ${f.r},${r2(f.top + 2.8)} V${r2(f.top + 3.4)} Z`} />
              <circle cx={r2((f.l + f.r) / 2)} cy={r2(f.top + 6.6)} r="0.7" />
            </g>
          ))}
          <circle cx={palm.x} cy={palm.y} r="1.1" fill={color} stroke="none" />
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const p = polar(palm.x, palm.y, 2.5, deg - 90);
            return <circle key={deg} cx={p.x} cy={p.y} r="1.25" strokeWidth="0.9" fill={color} fillOpacity="0.16" />;
          })}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const p = polar(palm.x, palm.y, 5.4, deg - 90);
            return <circle key={deg} cx={p.x} cy={p.y} r="0.6" fill={color} stroke="none" />;
          })}
          <path d="M18,40.6 H29.6" strokeOpacity="0.75" />
          {[20.4, 23.8, 27.2].map((x) => (
            <circle key={x} cx={x} cy="42.6" r="0.65" fill={color} stroke="none" />
          ))}
          <g strokeWidth="1.3" strokeOpacity="0.9">
            <ellipse cx="36.6" cy="13" rx="1.7" ry="1.25" transform="rotate(-22 36.6 13)" fill={color} />
            <ellipse cx="42.2" cy="11.2" rx="1.7" ry="1.25" transform="rotate(-22 42.2 11.2)" fill={color} />
            <path d="M38.1,12.6 V5.6 L43.7,3.8 V10.8 M38.1,7.6 L43.7,5.8" />
          </g>
        </g>
      </svg>
    );
  }

  // A kalash: round pot, five mango leaves fanned behind a coconut.
  return (
    <svg {...common}>
      {[-64, -32, 0, 32, 64].map((a) => (
        <path
          key={a}
          transform={`translate(24 19) rotate(${a})`}
          d="M0,0 C-3,-4 -3,-10 0,-14 C3,-10 3,-4 0,0 Z"
          fill={color}
          fillOpacity="0.18"
        />
      ))}
      <path d="M24,7.5 C28,10 29.5,14.5 27.6,17.6 C26.2,19.6 21.8,19.6 20.4,17.6 C18.5,14.5 20,10 24,7.5 Z" fill="#fdf6ec" />
      <path d="M24,7.5 C28,10 29.5,14.5 27.6,17.6 C26.2,19.6 21.8,19.6 20.4,17.6 C18.5,14.5 20,10 24,7.5 Z" fill={color} fillOpacity="0.3" />
      <path d="M13,20 H35" />
      <path d="M16,20 L18,24 H30 L32,20" />
      <path d="M18,24 C9,27 8,39 15,43 H33 C40,39 39,27 30,24" fill={color} fillOpacity="0.14" />
      <path d="M11.5,32 H36.5" strokeOpacity="0.6" />
      <circle cx="19" cy="37" r="1.2" fill={color} stroke="none" />
      <circle cx="24" cy="38" r="1.2" fill={color} stroke="none" />
      <circle cx="29" cy="37" r="1.2" fill={color} stroke="none" />
    </svg>
  );
}
