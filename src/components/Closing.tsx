"use client";

import { invite } from "@/content/invite";
import { Ornament } from "./art/Decor";
import { Reveal, ShareIcon } from "./ui";

export function Closing() {
  const share = async () => {
    const url = window.location.href.split("#")[0];
    const text = `${invite.meta.title}\n${invite.meta.description}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: invite.meta.title, text, url });
        return;
      } catch {
        return; // dismissed
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative px-[12cqw] pt-[10cqw] pb-[calc(8svh+12cqw)] text-center">
      <Reveal>
        <Ornament className="w-[30cqw]" />
        <p className="inv-serif mt-[5cqw] text-[5cqw] leading-snug text-ink italic">
          आपकी गरिमामयी उपस्थिति एवं स्नेहाशीष ही हमारे लिए सबसे अनमोल उपहार है।
        </p>
        <p className="inv-script mt-[5cqw] text-[11cqw] leading-[1.15] text-accent">
          {invite.bride.name} एवं {invite.groom.name}
        </p>

        <div className="mt-[9cqw]">
          <p className="inv-label text-[4.2cqw] font-semibold text-accent">प्रेषक</p>
          <div className="mt-[2cqw] space-y-[1cqw]">
            {invite.senders.map((s) => (
              <p key={s} className="inv-serif text-[4.4cqw] leading-snug text-ink">
                {s}
              </p>
            ))}
          </div>
          <p className="inv-serif mt-[1.5cqw] text-[3.8cqw] text-muted italic">{invite.senderAddress}</p>
        </div>

        <button type="button" onClick={share} className="inv-btn inv-btn-ghost mt-[9cqw]">
          <ShareIcon />
          निमंत्रण साझा करें
        </button>

        <p className="mx-auto mt-[10cqw] max-w-[70cqw] font-sans text-[2.4cqw] leading-relaxed text-muted/70">
          Photos:{" "}
          <a className="underline" href="https://commons.wikimedia.org/wiki/File:Ram_Mandir_temple_(93827).jpg" target="_blank" rel="noreferrer">
            Ram Mandir, Ayodhya
          </a>{" "}
          by Aliva Sahoo,{" "}
          <a className="underline" href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">
            CC BY-SA 3.0
          </a>{" "}
          (cropped, sky and colour edited) ·{" "}
          <a className="underline" href="https://unsplash.com/photos/a-large-wooden-door-with-intricate-carvings-on-it-oA4l0UWK4Vc" target="_blank" rel="noreferrer">
            Door
          </a>{" "}
          by Darshan Patel, Unsplash
        </p>
      </Reveal>
    </section>
  );
}
