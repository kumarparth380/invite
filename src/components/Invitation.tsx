"use client";

import { AnimatePresence, MotionConfig, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Backdrop } from "./Backdrop";
import { Blessing } from "./Blessing";
import { Closing } from "./Closing";
import { Countdown } from "./Countdown";
import { DateReveal } from "./DateReveal";
import { Events } from "./Events";
import { Gate } from "./Gate";
import { Hero } from "./Hero";
import { Rsvp } from "./Rsvp";

type Stage = "gate" | "opening" | "open";

export function Invitation() {
  const [stage, setStage] = useState<Stage>("gate");
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // Always start at the top, and keep the page still until the doors open.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = stage === "open" ? "" : "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [stage]);

  const open = () => {
    if (stage !== "gate") return;
    setStage("opening");
    window.setTimeout(() => setStage("open"), 1500);
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="@container relative mx-auto w-full max-w-[480px] overflow-x-clip text-ink shadow-[0_0_80px_rgba(60,25,10,.28)]">
        <Backdrop />
        <div className="relative">
          <Hero entered={stage === "open"} progress={heroProgress} sectionRef={heroRef} />
          <Blessing progress={heroProgress} />
          <DateReveal />
          <Countdown />
          <Events />
          <Rsvp />
          <Closing />
        </div>
      </main>

      <AnimatePresence>
        {stage !== "open" && <Gate key="gate" opening={stage === "opening"} onOpen={open} />}
      </AnimatePresence>
    </MotionConfig>
  );
}
