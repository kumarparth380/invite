"use client";

import { AnimatePresence, MotionConfig, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { celebrate } from "@/lib/celebrate";
import { startSmoothScroll, stopSmoothScroll } from "@/lib/smooth-scroll";
import { RoseDefs } from "./art/Roses";
import { Backdrop } from "./Backdrop";
import { Blessing } from "./Blessing";
import { Closing } from "./Closing";
import { Countdown } from "./Countdown";
import { DateReveal } from "./DateReveal";
import { Events } from "./Events";
import { Gate } from "./Gate";
import { Hero } from "./Hero";
import { MusicButton, useMusic } from "./Music";

type Stage = "gate" | "opening" | "open";

export function Invitation() {
  const [stage, setStage] = useState<Stage>("gate");
  const music = useMusic();
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
    if (stage === "open") startSmoothScroll();
    return () => {
      root.style.overflow = "";
    };
  }, [stage]);

  useEffect(() => stopSmoothScroll, []);

  const open = () => {
    if (stage !== "gate") return;
    music.start(); // inside the tap, so the browser allows sound
    setStage("opening");
    celebrate({ delay: 700 }); // as the doors part
    window.setTimeout(() => setStage("open"), 1500);
  };

  return (
    <MotionConfig reducedMotion="user">
      <RoseDefs />
      <main className="@container relative mx-auto w-full max-w-[480px] overflow-x-clip text-ink shadow-[0_0_80px_rgba(60,25,10,.28)]">
        <Backdrop />
        <div className="relative">
          <Hero entered={stage === "open"} progress={heroProgress} sectionRef={heroRef} />
          <Blessing progress={heroProgress} />
          <DateReveal />
          <Countdown />
          <Events />
          <Closing />
        </div>
      </main>

      <AnimatePresence>
        {stage !== "open" && <Gate key="gate" opening={stage === "opening"} onOpen={open} />}
      </AnimatePresence>

      <MusicButton show={stage === "open" && music.available} playing={music.playing} onToggle={music.toggle} />
    </MotionConfig>
  );
}
