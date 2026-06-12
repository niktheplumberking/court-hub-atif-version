'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * BUILD SEQUENCE — the page's cinematic centerpiece.
 * Scroll scrubs a 150-frame court-construction sequence on a full-bleed canvas
 * (same mechanic as the homepage hero/construction scenes), while narrative
 * chapters fade through in sync. Scroll position IS the timeline — the user
 * is in control, Cartier/Apple style.
 *
 * Frames: /public/construction-frames/ezgif-frame-001..150.webp (already deployed).
 * Reduced motion: static final frame + stacked captions, no pin.
 */

const FRAME_COUNT = 150;
const frameSrc = (i: number) =>
  `/construction-frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`;

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const CHAPTERS = [
  { num: '01', title: 'The Blueprint', copy: 'Every Court Hub build starts on paper — dimensions, orientation, sightlines, drainage. Approved before a single tool moves.' },
  { num: '02', title: 'Groundwork', copy: 'A laser-levelled, reinforced concrete base. The part nobody sees is the part that decides how the court plays for twenty years.' },
  { num: '03', title: 'Steel & Glass', copy: 'Galvanised structure, 12mm tempered panoramic glass, tensioned mesh — assembled to FIP tournament tolerances.' },
  { num: '04', title: 'The Surface', copy: 'Monofilament turf dressed with calibrated silica sand. Consistent bounce, true roll, all-weather grip.' },
  { num: '05', title: 'First Serve', copy: 'Floodlights on. Lines true. Net at 88 centimetres. Your court — ready for its first match.' },
];

export default function BuildSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  // Reduced motion renders a static scene (poster + stacked captions) — state,
  // not a ref, because the JSX branches on it.
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReduced(true); // poster stays, captions render stacked, no pin
      return;
    }

    const canvas = canvasRef.current!;
    const ctx2d = canvas.getContext('2d')!;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let currentFrame = -1;
    let lastDrawn = 0;
    let posterCleared = false;

    // DPR-aware cover draw
    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (idx: number) => {
      const img = images[idx];
      if (!img || !img.complete || !img.naturalWidth) return false;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx2d.clearRect(0, 0, w, h);
      ctx2d.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      lastDrawn = idx;
      // First successful paint: fade the poster out — until this moment the
      // poster guarantees the section is never a black hole.
      if (!posterCleared && posterRef.current) {
        posterCleared = true;
        posterRef.current.style.opacity = '0';
      }
      return true;
    };

    const requestDraw = (idx: number) => {
      if (idx === currentFrame) return;
      currentFrame = idx;
      // Draw the exact frame if loaded, else the nearest loaded one below it
      if (!draw(idx)) {
        for (let j = idx; j >= 0; j--) if (draw(j)) break;
      }
    };

    // Preload: first frame immediately, then sweep the rest; redraw if a
    // just-loaded image is the one the scroll position currently wants.
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = () => {
        if (i === currentFrame || (currentFrame === -1 && i === 0)) draw(i);
        else if (i > lastDrawn && i <= currentFrame) draw(i);
      };
      images[i] = img;
    }

    sizeCanvas();
    const onResize = () => { sizeCanvas(); if (currentFrame >= 0) draw(currentFrame); else draw(0); };
    window.addEventListener('resize', onResize);

    // Chapter visibility windows across progress 0..1 (equal slices, soft edges)
    const slice = 1 / CHAPTERS.length;
    const setChapter = (p: number) => {
      chapterRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = i * slice;
        const center = start + slice / 2;
        // 0 at slice edges → 1 at slice center
        const local = 1 - Math.min(1, Math.abs(p - center) / (slice * 0.55));
        const o = Math.max(0, local);
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 28}px)`;
        el.style.visibility = o <= 0.01 ? 'hidden' : 'visible';
      });
      if (counterRef.current) {
        const idx = Math.min(CHAPTERS.length - 1, Math.floor(p / slice));
        counterRef.current.textContent = CHAPTERS[idx].num;
      }
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      if (headlineRef.current) {
        const ho = Math.max(0, 1 - p / 0.12); // headline clears in the first 12%
        headlineRef.current.style.opacity = String(ho);
        headlineRef.current.style.transform = `translateY(${(1 - ho) * -30}px)`;
      }
    };

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=320%',
      pin: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        requestDraw(Math.round(self.progress * (FRAME_COUNT - 1)));
        setChapter(self.progress);
      },
    });

    requestDraw(0);
    setChapter(0);

    return () => {
      st.kill();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="How we build your court"
      className="relative h-screen w-full overflow-hidden bg-ink"
    >
      {/* Poster floor: a mid-sequence frame that sits behind the canvas so the
          section is never pure black — covers slow connections, no-JS, and
          reduced motion. Fades out the moment the canvas paints its first frame. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={posterRef}
        src={frameSrc(74)}
        alt="Padel court mid-construction"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
      />
      {/* Frame canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Cinematic vignette for text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_40%,rgba(14,14,12,0.55)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink/90 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />

      {/* Opening headline — clears as the scrub begins */}
      <div
        ref={headlineRef}
        className="absolute inset-x-0 top-[16vh] z-10 px-6 text-center md:px-12"
      >
        <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-lime">Scroll To Build</p>
        <h2 className="font-display text-[clamp(2.4rem,6.5vw,6.5rem)] font-extrabold leading-[0.95] tracking-tight text-white">
          Blueprint To <span className="text-lime">First Serve.</span>
        </h2>
      </div>

      {isReduced ? (
        /* Reduced motion: the five phases read as a static stacked list over
           the poster — no pin, no scrub, nothing hidden. */
        <div className="absolute inset-x-0 bottom-[8vh] z-10 px-6 md:px-12">
          <div className="mx-auto max-w-3xl space-y-2 rounded-[20px] bg-ink/60 p-6 text-center backdrop-blur-sm">
            {CHAPTERS.map((c) => (
              <p key={c.num} className="text-[11px] uppercase tracking-[0.3em] text-lime">
                {c.num} — {c.title}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Chapters — fade through in sync with the frames */}
          <div className="absolute inset-x-0 bottom-[12vh] z-10 px-6 md:bottom-[14vh] md:px-12">
            <div className="relative mx-auto h-[9.5rem] max-w-3xl md:h-[8.5rem]">
              {CHAPTERS.map((c, i) => (
                <div
                  key={c.num}
                  ref={(el) => { chapterRefs.current[i] = el; }}
                  className="absolute inset-0 text-center opacity-0"
                  style={{ visibility: 'hidden' }}
                >
                  <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-lime">
                    {c.num} — {c.title}
                  </p>
                  <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
                    {c.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress rail + chapter counter */}
          <div className="absolute inset-x-6 bottom-[7vh] z-10 md:inset-x-12">
            <div className="mb-3 flex items-end justify-between">
              <span ref={counterRef} className="font-display text-2xl font-bold text-white/90">01</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">/ 05 Build Phases</span>
            </div>
            <div className="h-px w-full bg-white/15">
              <div ref={progressRef} className="h-px w-full origin-left scale-x-0 bg-lime shadow-[0_0_12px_rgba(200,255,61,0.6)]" />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
