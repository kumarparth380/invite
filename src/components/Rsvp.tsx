"use client";

import { useState, type FormEvent } from "react";
import { invite } from "@/content/invite";
import { Reveal, SectionHeading, WhatsAppIcon } from "./ui";

const MAX_GUESTS = 20;

/** RSVP form that composes a WhatsApp message; nothing is stored anywhere. */
export function Rsvp() {
  const [attending, setAttending] = useState(true);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(2);
  const [events, setEvents] = useState<string[]>(() => invite.events.map((e) => e.id));
  const [note, setNote] = useState("");

  const toggleEvent = (id: string) =>
    setEvents((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const couple = `${invite.bride.name} & ${invite.groom.name}`;
    const chosen = invite.events.filter((ev) => events.includes(ev.id)).map((ev) => ev.title);

    const lines = [
      `🙏 ${couple} के शुभ विवाह हेतु उत्तर`,
      "",
      `नाम: ${name.trim()}`,
      `उत्तर: ${attending ? "सहर्ष पधारेंगे" : "क्षमा करें, नहीं आ पाएँगे"}`,
    ];
    if (attending) {
      lines.push(`अतिथियों की संख्या: ${guests}`);
      if (chosen.length) lines.push(`कार्यक्रम: ${chosen.join(", ")}`);
    }
    if (note.trim()) lines.push("", `संदेश: ${note.trim()}`);

    const text = encodeURIComponent(lines.join("\n"));
    const num = invite.rsvp.whatsappNumber.replace(/\D/g, "");
    const url = num ? `https://wa.me/${num}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="rsvp" className="relative px-[10cqw] py-[12cqw]">
      <Reveal>
        <SectionHeading label="आपका उत्तर" title="क्या आप पधारेंगे?" />
        <p className="inv-serif mt-[3cqw] text-center text-[3.8cqw] text-muted">
          कृपया {invite.rsvp.deadline} तक उत्तर दें
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <form onSubmit={submit} className="inv-glass mt-[8cqw] space-y-[5.5cqw] rounded-[4cqw] p-[6cqw]">
          <div className="grid grid-cols-2 gap-[2.5cqw]">
            {[
              { v: true, label: "सहर्ष पधारेंगे" },
              { v: false, label: "क्षमा, नहीं आ पाएँगे" },
            ].map((opt) => (
              <button
                key={String(opt.v)}
                type="button"
                aria-pressed={attending === opt.v}
                onClick={() => setAttending(opt.v)}
                className="inv-chip inv-label py-[3cqw] text-[3.5cqw]"
              >
                {opt.label}
              </button>
            ))}
          </div>

          <label className="block">
            <span className="inv-label text-[3cqw] text-muted">आपका नाम</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="जैसे — शर्मा परिवार"
              autoComplete="name"
              className="inv-input inv-serif mt-[2cqw]"
            />
          </label>

          {attending && (
            <>
              <div className="flex items-center justify-between">
                <span className="inv-label text-[3cqw] text-muted">अतिथियों की संख्या</span>
                <div className="flex items-center gap-[3cqw]">
                  <button
                    type="button"
                    aria-label="कम करें"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    className="inv-chip size-[10cqw] text-[5cqw] leading-none"
                  >
                    −
                  </button>
                  <span className="inv-serif w-[7cqw] text-center text-[6.5cqw] text-accent tabular-nums" aria-live="polite">
                    {guests}
                  </span>
                  <button
                    type="button"
                    aria-label="बढ़ाएँ"
                    onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                    className="inv-chip size-[10cqw] text-[5cqw] leading-none"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <span className="inv-label text-[3cqw] text-muted">किन कार्यक्रमों में पधारेंगे</span>
                <div className="mt-[2.5cqw] flex flex-wrap gap-[2cqw]">
                  {invite.events.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      aria-pressed={events.includes(ev.id)}
                      onClick={() => toggleEvent(ev.id)}
                      className="inv-chip inv-label px-[3.8cqw] py-[1.8cqw] text-[3.3cqw]"
                    >
                      {ev.title}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <label className="block">
            <span className="inv-label text-[3cqw] text-muted">नवदम्पति के लिए संदेश</span>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="वैकल्पिक"
              className="inv-input inv-serif mt-[2cqw] resize-none"
            />
          </label>

          <button type="submit" className="inv-btn inv-btn-solid min-h-[12.5cqw] w-full text-[3.9cqw]">
            <WhatsAppIcon />
            WhatsApp पर उत्तर भेजें
          </button>
        </form>
      </Reveal>
    </section>
  );
}
