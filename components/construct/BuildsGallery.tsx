'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY & CAPTIONS — confirm with client (contract §8) ───
const HEADER = {
  kicker: 'Recent Builds',
  line: 'Proof, Poured In Concrete.',
};

type Panel = { src: string; alt: string; caption: string; meta: string };

const PANELS: Panel[] = [
  {
    src: '/images/court_action_landscape_1779705580138.webp',
    alt: 'Match play on a Court Hub padel court',
    caption: 'Club Build',
    meta: 'Al Quoz · Dubai',
  },
  {
    src: '/images/hero_padel_night_view_1779713624496.png',
    alt: 'Panoramic padel court at night',
    caption: 'Panoramic Court',
    meta: 'Night Spec',
  },
  {
    src: '/construction-frames/ezgif-frame-150.webp',
    alt: 'Court structure nearing completion',
    caption: 'Steel & Glass',
    meta: 'Build Phase 03',
  },
  {
    src: '/images/tournament_crowd_night_1779707031611.webp',
    alt: 'Crowd at a night padel tournament',
    caption: 'Venue Build',
    meta: 'Match Night',
  },
  {
    src: '/images/dubai_court_night_construction_1779706759259.webp',
    alt: 'Dubai court under floodlit construction',
    caption: 'Floodlit Install',
    meta: 'Dubai Marina',
  },
  {
    src: '/images/hero_court_background_1779705118750.png',
    alt: 'Completed outdoor padel court',
    caption: 'Full Court',
    meta: 'Outdoor · Handover',
  },
];

export default function BuildsGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Header reveal — all widths.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: '[data-rb-header]', start: 'top 80%', once: true },
          })
          .from('[data-rb-kicker]', { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' }, 0)
          .from('[data-rb-line]', { yPercent: 110, duration: 0.9, ease: 'power4.out' }, 0.1);
      });

      // Mobile: native swipe strip — panels scale-settle as they enter.
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-rb-panel]').forEach((panel) => {
          gsap.fromTo(
            panel.querySelector('[data-rb-par]'),
            { scale: 1.18 },
            {
              scale: 1,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
            }
          );
        });
      });

      // Desktop: the strip is pinned and scroll drives it sideways.
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current!;
        const section = sectionRef.current!;
        const distance = () => track.scrollWidth - section.clientWidth;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (railRef.current) railRef.current.style.transform = `scaleX(${self.progress})`;
              if (counterRef.current) {
                const idx = Math.min(
                  PANELS.length,
                  Math.floor(self.progress * PANELS.length) + 1
                );
                counterRef.current.textContent = String(idx).padStart(2, '0');
              }
            },
          },
        });

        // Counter-drift parallax inside each frame as it crosses the viewport.
        // GSAP moves the wrapper; the img keeps its CSS hover zoom untouched.
        gsap.utils.toArray<HTMLElement>('[data-rb-panel]').forEach((panel) => {
          gsap.fromTo(
            panel.querySelector('[data-rb-par]'),
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Recent builds gallery"
      className="grain relative overflow-hidden bg-ink py-20 md:flex md:h-screen md:flex-col md:justify-between md:py-0"
    >
      {/* Blue ambient glow behind the strip */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-[60vh] w-[60vw] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(30,90,232,0.18),transparent)]" />

      {/* Header */}
      <div data-rb-header className="relative z-10 px-6 md:px-16 md:pt-20">
        <p data-rb-kicker className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-lime">
          {HEADER.kicker}
        </p>
        <h2 className="font-display font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white text-[9vw] md:text-[4.2vw]">
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span data-rb-line className="block">{HEADER.line}</span>
          </span>
        </h2>
      </div>

      {/* Strip — scrubbed sideways on desktop, swiped on mobile */}
      <div className="relative z-10 mt-10 md:mt-0">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 will-change-transform [scrollbar-width:none] md:snap-none md:gap-6 md:overflow-visible md:px-16 md:pb-0"
        >
          {PANELS.map((p) => (
            <figure
              key={p.src}
              data-rb-panel
              className="group relative aspect-[4/5] w-[76vw] shrink-0 snap-center overflow-hidden rounded-[20px] sm:w-[52vw] md:aspect-[3/4] md:w-[26vw] md:min-w-[320px]"
            >
              <div data-rb-par className="absolute -left-[8%] top-0 h-full w-[116%] will-change-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale-[40%] transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-90" />
              {/* Caption block slides up on hover (always visible on touch) */}
              <figcaption className="absolute inset-x-0 bottom-0 p-5 md:translate-y-4 md:opacity-0 md:transition-all md:duration-500 md:ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <p className="font-display text-xl font-extrabold uppercase tracking-tight text-white md:text-2xl">
                  {p.caption}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-lime">
                  {p.meta}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Progress rail (desktop) / swipe hint (mobile) */}
      <div className="relative z-10 px-6 pt-10 md:px-16 md:pb-16">
        <div className="hidden items-end justify-between md:flex">
          <p className="font-display text-2xl font-bold text-white/90">
            <span ref={counterRef}>01</span>
            <span className="ml-2 text-sm text-white/40">/ {String(PANELS.length).padStart(2, '0')} Builds</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Keep scrolling — the strip drives sideways
          </p>
        </div>
        <div className="mt-4 hidden h-px w-full bg-white/15 md:block">
          <div
            ref={railRef}
            className="h-px w-full origin-left scale-x-0 bg-lime shadow-[0_0_12px_rgba(200,255,61,0.6)]"
          />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:hidden">
          Swipe →
        </p>
      </div>
    </section>
  );
}
