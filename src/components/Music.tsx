"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { invite } from "@/content/invite";

const { src, loopStart, loopEnd, volume } = invite.music;

/** Overlap between repeats, in seconds; hides the cut in a short clip. */
const CROSSFADE = 0.35;
/** Anything quieter than this at the clip's edges is treated as silence. */
const SILENCE = 0.003; // about -50 dBFS

type AudioCtor = typeof AudioContext;

/**
 * Gapless, crossfaded loop using Web Audio. A plain <audio loop> leaves a
 * small gap (and MP3 padding) at every repeat, which is obvious on a clip
 * that is only a few seconds long.
 */
class LoopPlayer {
  private ctx: AudioContext;
  private master: GainNode;
  private buffer: AudioBuffer | null = null;
  private offset = 0;
  private duration = 0;
  private nextAt = 0;
  private timer = 0;
  private suspendTimer = 0;

  constructor(private level: number) {
    const Ctor: AudioCtor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: AudioCtor }).webkitAudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
  }

  /** Call inside a tap handler: lets the context make sound on iOS/Android. */
  unlock() {
    // Play through the iPhone silent switch, like a video would (Safari 17+).
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) session.type = "playback";
    void this.ctx.resume();
    const blip = this.ctx.createBufferSource();
    blip.buffer = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
    blip.connect(this.ctx.destination);
    blip.start();
  }

  async load(data: ArrayBuffer) {
    const buffer = await this.ctx.decodeAudioData(data.slice(0));
    this.buffer = buffer;
    let start = 0;
    let end = buffer.duration;
    if (loopEnd > 0 || loopStart > 0) {
      start = loopStart;
      end = loopEnd > 0 ? Math.min(loopEnd, buffer.duration) : buffer.duration;
    } else {
      // Skip encoder padding / silence at both ends.
      const ch = buffer.getChannelData(0);
      let a = 0;
      let b = ch.length - 1;
      while (a < b && Math.abs(ch[a]) < SILENCE) a++;
      while (b > a && Math.abs(ch[b]) < SILENCE) b--;
      start = a / buffer.sampleRate;
      end = (b + 1) / buffer.sampleRate;
    }
    this.offset = start;
    this.duration = Math.max(end - start, CROSSFADE * 4);
  }

  play() {
    if (!this.buffer) return;
    window.clearTimeout(this.suspendTimer);
    void this.ctx.resume();
    const now = this.ctx.currentTime;
    const g = this.master.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(this.level, now + 1.2);
    if (this.nextAt <= now) this.nextAt = now + 0.05;
    this.schedule();
    window.clearInterval(this.timer);
    this.timer = window.setInterval(() => this.schedule(), 300);
  }

  pause() {
    const now = this.ctx.currentTime;
    const g = this.master.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(0, now + 0.3);
    window.clearInterval(this.timer);
    // Freeze the clock once faded, so the schedule picks up where it left off.
    this.suspendTimer = window.setTimeout(() => void this.ctx.suspend(), 350);
  }

  /** Keep about two seconds of repeats queued ahead of the clock. */
  private schedule() {
    if (!this.buffer) return;
    const step = this.duration - CROSSFADE;
    while (this.nextAt < this.ctx.currentTime + 2) {
      this.queue(this.nextAt);
      this.nextAt += step;
    }
  }

  private queue(at: number) {
    const source = this.ctx.createBufferSource();
    source.buffer = this.buffer;
    const fade = this.ctx.createGain();
    // Equal-power curves keep the loudness steady through the overlap.
    const n = 32;
    const fadeIn = new Float32Array(n);
    const fadeOut = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      fadeIn[i] = Math.sin((t * Math.PI) / 2);
      fadeOut[i] = Math.cos((t * Math.PI) / 2);
    }
    // fadeIn starts at 0. (No extra event at `at`: Safari rejects curves that
    // overlap another automation event.)
    fade.gain.setValueCurveAtTime(fadeIn, at, CROSSFADE);
    fade.gain.setValueCurveAtTime(fadeOut, at + this.duration - CROSSFADE, CROSSFADE);
    source.connect(fade).connect(this.master);
    source.start(at, this.offset, this.duration);
    source.onended = () => fade.disconnect();
  }
}

/**
 * Background music. `start()` must be called from a tap handler (the gate's
 * seal), because browsers block sound until the visitor interacts.
 */
export function useMusic() {
  const player = useRef<LoopPlayer | null>(null);
  const data = useRef<Promise<ArrayBuffer> | null>(null);
  const userPaused = useRef(false);
  const resumeOnReturn = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(Boolean(src));

  // Fetch the (small) file early so the music starts the moment the seal is tapped.
  useEffect(() => {
    if (!src) return;
    const p = fetch(src).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))));
    p.catch(() => setAvailable(false));
    data.current = p;
  }, []);

  const start = useCallback(() => {
    if (!src || !data.current || player.current) return;
    let p: LoopPlayer;
    try {
      p = new LoopPlayer(volume);
    } catch {
      setAvailable(false);
      return;
    }
    player.current = p;
    p.unlock();
    userPaused.current = false;
    data.current
      .then((buf) => p.load(buf))
      .then(() => {
        if (userPaused.current) return;
        p.play();
        setPlaying(true);
      })
      .catch(() => setAvailable(false));
  }, []);

  const toggle = useCallback(() => {
    const p = player.current;
    if (!p) return;
    if (playing) {
      userPaused.current = true;
      p.pause();
      setPlaying(false);
    } else {
      userPaused.current = false;
      p.play();
      setPlaying(true);
    }
  }, [playing]);

  // Pause while the guest is in another app (e.g. WhatsApp after RSVP) and
  // pick up again when they come back.
  useEffect(() => {
    const onVisibility = () => {
      const p = player.current;
      if (!p) return;
      if (document.hidden) {
        resumeOnReturn.current = playing;
        if (playing) p.pause();
      } else if (resumeOnReturn.current && !userPaused.current) {
        resumeOnReturn.current = false;
        p.play();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [playing]);

  return { start, toggle, playing, available };
}

/** Floating play/pause button, bottom right of the invitation. */
export function MusicButton({
  show,
  playing,
  onToggle,
}: {
  show: boolean;
  playing: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center">
      <div className="@container relative w-full max-w-[480px]">
        <AnimatePresence>
          {show && (
            <motion.button
              key="music"
              type="button"
              onClick={onToggle}
              aria-pressed={playing}
              aria-label={playing ? "संगीत रोकें" : "संगीत चलाएँ"}
              title={playing ? "संगीत रोकें" : "संगीत चलाएँ"}
              className="pointer-events-auto absolute right-[4.5cqw] bottom-[calc(4.5cqw+env(safe-area-inset-bottom))] grid size-[13cqw] max-h-14 max-w-14 min-h-11 min-w-11 place-items-center rounded-full border border-[#e9c46a]/70 bg-ink text-[#f6dd9a] shadow-[0_10px_24px_-8px_rgba(40,15,5,.7)] outline-none focus-visible:ring-4 focus-visible:ring-[#e9c46a]/50"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.9 }}
            >
              {playing && <span className="inv-ping absolute inset-0 rounded-full border border-[#e9c46a]/60" />}
              {playing ? <EqualizerIcon /> : <MutedNoteIcon />}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EqualizerIcon() {
  return (
    <span className="flex h-[42%] items-end gap-[12%]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="inv-eq block h-full w-[3px] rounded-full bg-current"
          style={{ animationDelay: `${i * -0.22}s` }}
        />
      ))}
    </span>
  );
}

function MutedNoteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[46%]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18V6l10-2v11" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="15" r="2.5" />
      <path d="M3 3l18 18" />
    </svg>
  );
}
