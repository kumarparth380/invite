"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { invite } from "@/content/invite";
import { celebrate } from "@/lib/celebrate";
import { Address, Reveal, SectionHeading } from "./ui";

const BRUSH = 26; // px radius of the scratch brush
const REVEAL_AT = 0.45; // fraction scratched before the foil clears itself

/** Gold foil over the wedding date; the guest scratches it off. */
export function DateReveal() {
  const { wedding } = invite;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    const box = wrapRef.current?.getBoundingClientRect();
    celebrate(box ? { from: { x: box.left + box.width / 2, y: box.top + box.height / 2 } } : {});
  }, []);

  // Paint the foil, and repaint it if the card is resized before it is revealed.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let cancelled = false;
    const paint = async () => {
      const { width, height } = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, "#e9c46a");
      g.addColorStop(0.3, "#c9963b");
      g.addColorStop(0.55, "#f5dd96");
      g.addColorStop(0.8, "#b8862f");
      g.addColorStop(1, "#e2b85a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // Glitter
      for (let i = 0; i < 260; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.35})`;
        ctx.fillRect(Math.random() * width, Math.random() * height, 1.4, 1.4);
      }

      // Inner border
      ctx.strokeStyle = "rgba(255,248,225,.7)";
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, width - 20, height - 20);
      ctx.strokeStyle = "rgba(122,84,20,.35)";
      ctx.strokeRect(14, 14, width - 28, height - 28);

      await document.fonts?.ready;
      if (cancelled) return;
      const family = getComputedStyle(canvas).fontFamily;
      ctx.fillStyle = "rgba(74,44,8,.85)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${Math.round(width * 0.075)}px ${family}`;
      ctx.fillText("✦  यहाँ खुरचें  ✦", width / 2, height / 2 - width * 0.03);
      ctx.font = `${Math.round(width * 0.042)}px ${family}`;
      ctx.fillStyle = "rgba(74,44,8,.65)";
      ctx.fillText("शुभ तिथि जानने के लिए", width / 2, height / 2 + width * 0.07);
    };

    paint();
    const ro = new ResizeObserver(() => {
      if (!revealedRef.current) paint();
    });
    ro.observe(wrap);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, []);

  const pointAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const scratch = (to: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const from = last.current ?? to;
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "#000"; // opaque, so each stroke erases the foil fully
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = BRUSH * 2;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    last.current = to;

    if (++moves.current % 8 === 0) {
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let clear = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 4 * 24) {
        total++;
        if (data[i] === 0) clear++;
      }
      if (clear / total > REVEAL_AT) reveal();
    }
  };

  return (
    <section className="relative px-[12cqw] py-[14cqw]">
      <Reveal>
        <SectionHeading label="शुभ मुहूर्त" title="विवाह की तिथि" />
      </Reveal>

      <Reveal delay={0.1}>
        <div ref={wrapRef} className="inv-glass relative mt-[8cqw] overflow-visible rounded-[4cqw]">
          <div className="flex flex-col items-center px-[6cqw] py-[9cqw] text-center">
            <p className="inv-label text-[3.2cqw] text-muted">{wedding.dayName}</p>
            <p className="inv-serif mt-[2cqw] text-[19cqw] leading-none text-accent">{wedding.day}</p>
            <p className="inv-label mt-[2cqw] text-[3.8cqw] text-ink">
              {wedding.month} · {wedding.year}
            </p>
            <p className="inv-serif mt-[3cqw] text-[4cqw] leading-snug text-muted italic">
              <Address text={wedding.address} />
            </p>
          </div>

          <canvas
            ref={canvasRef}
            role="img"
            aria-label="विवाह की तिथि देखने के लिए खुरचें"
            className={`inv-serif absolute inset-0 h-full w-full touch-none rounded-[inherit] transition-opacity duration-700 ${
              revealed ? "pointer-events-none opacity-0" : "cursor-grab active:cursor-grabbing"
            }`}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              last.current = null;
              scratch(pointAt(e));
            }}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
              scratch(pointAt(e));
            }}
            onPointerUp={() => {
              last.current = null;
            }}
          />
        </div>

        <button
          type="button"
          onClick={reveal}
          className={`inv-serif mx-auto mt-[4cqw] block text-[3.4cqw] text-muted underline underline-offset-4 transition-opacity ${
            revealed ? "invisible opacity-0" : "opacity-80"
          }`}
        >
          या तिथि देखने के लिए यहाँ स्पर्श करें
        </button>
      </Reveal>
    </section>
  );
}
