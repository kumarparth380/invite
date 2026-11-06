"use client";

import { useEffect, useState } from "react";
import { invite } from "@/content/invite";
import { Reveal, SectionHeading } from "./ui";

type Left = { d: number; h: number; m: number; s: number };

function timeLeft(target: number): Left | null {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown() {
  const { wedding } = invite;
  const target = new Date(wedding.start).getTime();
  // undefined = not yet measured (server render), null = the day has arrived
  const [left, setLeft] = useState<Left | null | undefined>(undefined);

  useEffect(() => {
    const tick = () => setLeft(timeLeft(target));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [target]);

  const cells: [string, string][] = [
    [left ? String(left.d) : left === null ? "0" : "--", "दिन"],
    [left ? pad(left.h) : left === null ? "00" : "--", "घंटे"],
    [left ? pad(left.m) : left === null ? "00" : "--", "मिनट"],
    [left ? pad(left.s) : left === null ? "00" : "--", "सेकंड"],
  ];

  return (
    <section className="relative px-[12cqw] py-[12cqw]">
      <Reveal>
        <SectionHeading label="उलटी गिनती" title="मंगल घड़ी में शेष" />
        <div className="mt-[8cqw] grid grid-cols-4 gap-[2.5cqw]" aria-live="off">
          {cells.map(([value, unit]) => (
            <div
              key={unit}
              className="inv-glass flex aspect-[4/5] flex-col items-center justify-center rounded-[3cqw]"
            >
              <span className="inv-serif text-[9cqw] leading-none text-accent tabular-nums">{value}</span>
              <span className="inv-label mt-[2cqw] text-[2.8cqw] text-muted">{unit}</span>
            </div>
          ))}
        </div>
        <p className="inv-serif mt-[5cqw] text-center text-[3.8cqw] text-muted">
          {left === null
            ? "शुभ घड़ी आ गई है — नवदम्पति को हार्दिक शुभकामनाएँ!"
            : (
              <>
                {wedding.dayName}, {wedding.dateText}
                <br />
                {wedding.place}
              </>
            )}
        </p>
      </Reveal>
    </section>
  );
}
