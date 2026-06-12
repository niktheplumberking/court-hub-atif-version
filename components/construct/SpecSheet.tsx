'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY & FIGURES — confirm all values with client (contract §8) ───
const HEADER = {
  kicker: 'The Spec Sheet',
  line1: 'Built To',
  line2: 'Tournament Numbers.',
};

// Counters scrub from 0 to value as the strip crosses the viewport.
const COUNTERS = [
  { value: 20, suffix: '×10 m', label: 'FIP court footprint' },
  { value: 12, suffix: 'mm', label: 'Tempered glass walls' },
  { value: 88, suffix: 'cm', label: 'Net height, centre' },
  { value: 500, suffix: 'lux', label: 'Match lighting' },
];

const SPECS = [
  { label: 'Foundation', value: 'Laser-levelled reinforced concrete raft' },
  { label: 'Structure', value: 'Hot-dip galvanised steel, powder-coated' },
  { label: 'Glass', value: '12 mm tempered, EN 12150 certified' },
  { label: 'Turf', value: 'Monofilament fibre, silica-sand dressed' },
  { label: 'Lighting', value: '8× LED projectors, zero glass glare' },
  { label: 'Timeline', value: '6–10 weeks, survey to first serve' },
];

export default function SpecSheet() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Header masked line reveal.
        gsap
          .timeline({
            scrollTrigger: { trigger: '[data-spec-header]', start: 'top 80%', once: true },
          })
          .from('[data-spec-kicker]', { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' }, 0)
          .from('[data-spec-line]', { yPercent: 110, duration: 0.9, stagger: 0.07, ease: 'power4.out' }, 0.1);

        // Counters: scroll position drives the count — back up, numbers rewind.
        gsap.utils.toArray<HTMLElement>('[data-spec-count]').forEach((el) => {
          const target = Number(el.dataset.specCount);
          const state = { v: 0 };
          gsap.to(state, {
            v: target,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 45%', scrub: true },
            onUpdate: () => {
              el.textContent = String(Math.round(state.v));
            },
          });
        });

        // Table rows draw in once, staggered.
        gsap.from('[data-spec-row]', {
          opacity: 0,
          y: 24,
          duration: 0.8,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-spec-table]', start: 'top 80%', once: true },
        });

        // Side photography: slow parallax drift on the wrapper — the img keeps
        // its CSS hover zoom (native `scale`) without fighting GSAP transforms.
        gsap.fromTo(
          '[data-spec-par]',
          { yPercent: -9 },
          {
            yPercent: 9,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-spec-media]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Court specifications"
      className="relative overflow-hidden bg-court-blue px-6 py-24 text-white md:px-16 md:py-36"
    >
      {/* Lime radial glow behind the media column */}
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[70vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgba(200,255,61,0.16),transparent)]" />

      <div className="relative mx-auto max-w-[1800px]">
        {/* Header */}
        <div data-spec-header>
          <p data-spec-kicker className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-lime">
            {HEADER.kicker}
          </p>
          <h2 className="font-display font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[11vw] md:text-[6vw]">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-spec-line className="block">{HEADER.line1}</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-spec-line className="block text-lime">{HEADER.line2}</span>
            </span>
          </h2>
        </div>

        {/* Scrub-driven counter strip */}
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 border-y border-white/15 py-12 md:mt-20 md:grid-cols-4">
          {COUNTERS.map((c) => (
            <div key={c.label}>
              <p className="font-display font-extrabold leading-none tracking-tight text-5xl md:text-7xl">
                <span data-spec-count={c.value}>0</span>
                <span className="ml-1 text-2xl text-lime md:text-3xl">{c.suffix}</span>
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
                {c.label}
              </p>
            </div>
          ))}
        </div>

        {/* Editorial table + photography */}
        <div className="mt-16 flex flex-col gap-14 md:mt-20 md:flex-row md:gap-20">
          <div data-spec-table className="md:w-[58%]">
            {SPECS.map((s) => (
              <div
                key={s.label}
                data-spec-row
                className="group relative flex flex-col gap-1 overflow-hidden border-b border-white/15 px-2 py-6 transition-colors duration-200 before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-lime before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:scale-x-100 sm:flex-row sm:items-baseline sm:justify-between md:px-4"
              >
                <span className="relative z-10 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-lime transition-colors duration-300 group-hover:text-ink/60">
                  {s.label}
                </span>
                <span className="relative z-10 font-display text-lg font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-ink md:text-2xl">
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* Detail photography with parallax */}
          <div data-spec-media className="md:w-[42%]">
            <div className="group relative aspect-[3/4] overflow-hidden rounded-[24px] shadow-[0_30px_80px_rgba(14,14,12,0.4)] md:sticky md:top-28">
              <div data-spec-par className="absolute -top-[10%] left-0 h-[120%] w-full will-change-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/padel_racket_set_lifestyle_1779706056285.webp"
                  alt="Padel racket and balls on a finished court surface"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 translate-y-3 rounded-full bg-ink/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                Every line certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
