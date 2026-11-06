"use client";

import { motion } from "motion/react";
import { invite } from "@/content/invite";
import { googleCalendarUrl } from "@/lib/calendar";
import { ArchTop, EventIcon } from "./art/Decor";
import { CalendarIcon, MapPinIcon, Reveal, SectionHeading } from "./ui";

export function Events() {
  const couple = `${invite.bride.name} & ${invite.groom.name}`;

  return (
    <section className="relative px-[10cqw] py-[12cqw]">
      <Reveal>
        <SectionHeading label="शुभ अवसर" title="मांगलिक कार्यक्रम" />
      </Reveal>

      <ol className="mt-[9cqw] space-y-[8cqw]">
        {invite.events.map((ev) => (
          <motion.li
            key={ev.id}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <article className="relative drop-shadow-[0_10px_18px_rgba(91,38,21,0.12)]">
              <ArchTop fill="#fdf6ec" stroke="#b9853f" className="h-[24cqw]" />
              <div className="-mt-px rounded-b-[3cqw] border-x border-b border-gold bg-card">
                <div className="-mt-[16cqw] px-[5cqw] pb-[6cqw] text-center">
                  <EventIcon kind={ev.icon} color={ev.tint} className="mx-auto size-[12cqw]" />
                  <h3 className="inv-script mt-[1.5cqw] text-[8.5cqw] leading-[1.1] text-accent">{ev.title}</h3>
                  <p className="inv-label mt-[2cqw] text-[3.1cqw] text-ink">
                    {ev.dayName} · {ev.dateText}
                  </p>
                  <p className="inv-serif mt-[1cqw] text-[4cqw] text-muted italic">{ev.timeText}</p>
                  <p className="inv-serif mt-[3cqw] text-[4.6cqw] leading-tight text-ink">{ev.venue}</p>

                  <div className="mt-[5cqw] flex flex-wrap justify-center gap-[2.5cqw]">
                    <a href={ev.mapUrl} target="_blank" rel="noreferrer" className="inv-btn inv-btn-solid">
                      <MapPinIcon />
                      रास्ता देखें
                    </a>
                    <a
                      href={googleCalendarUrl({
                        title: `${ev.title} · ${couple}`,
                        start: ev.start,
                        hours: ev.hours,
                        location: ev.venue,
                        details: `${couple} के शुभ विवाह का निमंत्रण`,
                      })}
                      target="_blank"
                      rel="noreferrer"
                      className="inv-btn inv-btn-ghost"
                    >
                      <CalendarIcon />
                      तिथि सहेजें
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
