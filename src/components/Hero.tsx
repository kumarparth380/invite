"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import type { Ref } from "react";
import { invite } from "@/content/invite";
import { scrollToY } from "@/lib/smooth-scroll";
import { BottomShade, TEMPLE_ZOOM_ORIGIN, TempleImage, TopHaze } from "./art/Photos";
import { CornerSpray } from "./art/Sprays";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Full-screen temple photo. Scrolling walks through the archway while the
 * invitation (next section, which overlaps this one) rises into view.
 * `progress` runs 0→1 over the pinned part of this section.
 */
export function Hero({
  entered,
  progress,
  sectionRef,
}: {
  entered: boolean;
  progress: MotionValue<number>;
  sectionRef: Ref<HTMLElement>;
}) {
  const reduceMotion = useReducedMotion();

  // Every range spans 0→1 on purpose: these run on the browser's native
  // ScrollTimeline, where a missing end keyframe falls back to the default
  // style (opacity 1) and the title would fade back in.
  const scale = useTransform(progress, [0, 0.7, 1], [1, 2.3, 3.2]);
  const sceneOpacity = useTransform(progress, [0, 0.55, 0.9, 1], [1, 1, 0, 0]);
  const titleOpacity = useTransform(progress, [0, 0.3, 1], [1, 0, 0]);
  const titleY = useTransform(progress, [0, 0.3, 1], [0, -60, -60]);
  const cueOpacity = useTransform(progress, [0, 0.06, 1], [1, 0, 0]);

  const item = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: 1, ease: EASE, delay },
  });

  const { bride, groom, wedding } = invite;

  return (
    <section ref={sectionRef} className="relative h-[200svh]">
      <motion.div
        className="sticky top-0 h-svh w-full overflow-hidden [--u:min(1cqw,0.44svh)]"
        style={{ opacity: sceneOpacity }}
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: reduceMotion ? 1 : scale, transformOrigin: TEMPLE_ZOOM_ORIGIN }}
        >
          <TempleImage />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ opacity: titleOpacity }}>
          <TopHaze />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ opacity: cueOpacity }}>
          <BottomShade />
        </motion.div>

        <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: titleOpacity, y: titleY }}>
          <motion.div {...item(0.9)}>
            <CornerSpray tones={["blush", "peach", "ivory"]} className="absolute top-[1cqw] left-[1cqw] w-[calc(32*var(--u))]" />
            <CornerSpray tones={["blush", "peach", "ivory"]} corner="tr" className="absolute top-[1cqw] right-[1cqw] w-[calc(32*var(--u))]" />
          </motion.div>
        </motion.div>

        <motion.div className="absolute inset-x-[10%] top-[5.5%]" style={{ opacity: titleOpacity, y: titleY }}>
          <div className="flex flex-col items-center text-center [text-shadow:0_0_18px_rgba(255,244,230,.95)]">
            <motion.p {...item(0.1)} className="inv-label text-[calc(3.8*var(--u))] text-accent">
              ॥ श्री गणेशाय नमः ॥
            </motion.p>
            <motion.h1 {...item(0.3)} className="mt-[calc(3*var(--u))] flex flex-col items-center">
              <span className="inv-script text-[calc(15*var(--u))] leading-[1.05] text-accent">{bride.name}</span>
              <span className="inv-script my-[calc(1*var(--u))] text-[calc(8*var(--u))] leading-none text-ink">संग</span>
              <span className="inv-script text-[calc(15*var(--u))] leading-[1.05] text-accent">{groom.name}</span>
            </motion.h1>
            <motion.p {...item(0.55)} className="inv-label mt-[calc(3*var(--u))] text-[calc(3.2*var(--u))] text-ink">
              {wedding.dayName} · {wedding.dateText}
            </motion.p>
            <motion.p {...item(0.7)} className="inv-serif mt-[calc(1*var(--u))] text-[calc(4.2*var(--u))] text-ink italic">
              {wedding.place}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-[3.5%] left-1/2 z-10 -translate-x-1/2"
          style={{ opacity: cueOpacity }}
        >
          <motion.button
            type="button"
            {...item(1.2)}
            onClick={() => scrollToY(window.innerHeight)}
            className="flex flex-col items-center gap-1 px-[6cqw] py-[2cqw] text-white [text-shadow:0_1px_8px_rgba(0,0,0,.6)]"
          >
            <span className="inv-label text-[3cqw]">मंदिर की ओर बढ़ें</span>
            <svg viewBox="0 0 24 24" className="inv-bob size-[5cqw]" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
