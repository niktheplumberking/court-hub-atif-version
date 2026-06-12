'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Ruler } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  kicker: 'How It Happens',
  headlinePre: 'Survey To ',
  headlineLime: 'First Serve.',
  intro:
    'A fixed sequence, a named project lead, and a date for your first match before we break ground.',
  specKicker: 'The FIP-Standard Build',
  specHeadline: 'Every court ships to one spec sheet.',
  specNote:
    'Baseline configuration shown — panoramic, indoor and single-court variants are quoted against the same standard.',
};

type Step = { num: string; title: string; copy: string };

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Site Survey',
    copy: 'We walk your plot, check levels, soil, access and power — and tell you straight if the site needs work first.',
  },
  {
    num: '02',
    title: 'Design & Quote',
    copy: 'A rendered layout, full materials spec and a fixed line-item quote. No allowances, no surprises later.',
  },
  {
    num: '03',
    title: 'Permits & Groundwork',
    copy: 'We handle municipality approvals, then pour and cure a laser-levelled reinforced base.',
  },
  {
    num: '04',
    title: 'Build & Installation',
    copy: 'Steel, glass, turf and lighting go up in sequence — installed by our own crew, never outsourced.',
  },
  {
    num: '05',
    title: 'Handover & First Serve',
    copy: 'Final inspection together, care kit and warranty docs in hand — then you hit the first serve.',
  },
];

type Spec = { label: string; value: string };

const SPECS: Spec[] = [
  { label: 'Footprint', value: '20m × 10m regulation' }, // placeholder figure — confirm with client
  { label: 'Glass Walls', value: '12mm tempered safety glass' }, // placeholder figure — confirm with client
  { label: 'Playing Surface', value: 'WPT-grade monofilament turf · 3 colourways' }, // placeholder figure — confirm with client
  { label: 'Lighting', value: '8× LED floodlights · 500+ lux match level' }, // placeholder figure — confirm with client
  { label: 'Structure', value: 'Hot-dip galvanized steel, powder-coat finish' }, // placeholder claim — confirm with client
  { label: 'Foundation', value: 'Reinforced concrete slab, laser-levelled' }, // placeholder claim — confirm with client
];

// Gutter matching the max-w-7xl px-12 shell — used for the progress line; the track
// uses the equivalent literal Tailwind classes (kept literal for JIT detection).
const TRACK_GUTTER = 'max(3rem,calc((100vw-80rem)/2+3rem))';

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Header reveal — all widths, motion allowed.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const header = gsap.timeline({
          scrollTrigger: { trigger: '[data-process-header]', start: 'top 85%', once: true },
        });
        header
          .from('[data-process-kicker]', { opacity: 0, x: -18, duration: 0.7, ease: 'power3.out' })
          .from('[data-process-line]', { yPercent: 110, duration: 1, ease: 'power4.out' }, 0.1)
          .from('[data-process-intro]', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, 0.35);
      });

      // ── DESKTOP SIGNATURE PIECE ─────────────────────────────────────
      // Pin the stage and scrub horizontally through the five steps while a
      // progress line fills and the giant outlined numbers lag behind their
      // cards for parallax depth. (One of this page's max-2 pins.)
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const stage = stageRef.current;
        const track = trackRef.current;
        if (!stage || !track) return;
        const distance = () => Math.max(1, track.scrollWidth - stage.clientWidth);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => '+=' + Math.round(distance() + window.innerHeight * 0.2),
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -distance(), ease: 'none' }, 0);
        tl.fromTo(
          '[data-process-progress]',
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: 'left center', ease: 'none' },
          0
        );
        // Ghost numbers drift slightly slower than the track (relative rightward lag).
        tl.to('[data-step-ghost]', { xPercent: 24, ease: 'none' }, 0);

        // ── SPEC SHEET — scrubbed clip-path inset wipe + cascading rows ──
        gsap.fromTo(
          '[data-spec-panel]',
          { clipPath: 'inset(12% 7% 12% 7% round 48px)', scale: 0.96 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 32px)',
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-spec-panel]', start: 'top 92%', end: 'top 45%', scrub: 1 },
          }
        );
        gsap.fromTo(
          '[data-spec-headline]',
          { scale: 0.95, opacity: 0.4, transformOrigin: 'left center' },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-spec-panel]', start: 'top 85%', end: 'top 40%', scrub: 1 },
          }
        );
        gsap.fromTo(
          '[data-spec-row]',
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: '[data-spec-rows]', start: 'top 90%', end: 'top 40%', scrub: 1 },
          }
        );
      });

      // ── MOBILE — vertical timeline: connector draws in, steps stagger ──
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-process-mobile-line]',
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: { trigger: trackRef.current, start: 'top 75%', end: 'bottom 75%', scrub: 1 },
          }
        );
        gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step) => {
          gsap.from(step, {
            opacity: 0,
            y: 28,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 88%', once: true },
          });
        });
        gsap.from('[data-spec-panel]', {
          opacity: 0,
          y: 36,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-spec-panel]', start: 'top 85%', once: true },
        });
        gsap.from('[data-spec-row]', {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-spec-rows]', start: 'top 85%', once: true },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-ink-2/40 border-y border-white/5">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-32">
        <div data-process-header className="max-w-2xl">
          <p data-process-kicker className="text-lime text-xs tracking-[0.3em] uppercase mb-3">
            {COPY.kicker}
          </p>
          <h2 className="font-display font-extrabold uppercase text-white text-4xl md:text-6xl leading-[0.95] tracking-tight">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-process-line className="block">
                {COPY.headlinePre}
                <span className="text-lime">{COPY.headlineLime}</span>
              </span>
            </span>
          </h2>
          <p data-process-intro className="text-white/50 leading-relaxed mt-5">
            {COPY.intro}
          </p>
        </div>
      </div>

      {/* Steps — pinned horizontal scrub on md+, drawn vertical timeline on mobile */}
      <div
        ref={stageRef}
        className="relative md:h-screen md:flex md:flex-col md:justify-center md:overflow-hidden"
      >
        <div className="relative max-w-7xl mx-auto w-full px-6 mt-12 md:mt-0 md:max-w-none md:px-0">
          {/* Mobile connector: faint base line + lime fill drawn in by scroll */}
          <div className="md:hidden absolute left-6 top-1.5 bottom-2 w-px bg-white/10" />
          <div
            data-process-mobile-line
            className="md:hidden absolute left-6 top-1.5 bottom-2 w-px bg-lime"
          />

          <div
            ref={trackRef}
            className="relative flex flex-col md:flex-row md:items-stretch md:w-max md:gap-8 md:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] md:pr-[max(3rem,calc((100vw-80rem)/2+3rem))] will-change-transform"
          >
            {STEPS.map((step) => (
              <div
                key={step.num}
                data-step
                className="relative pl-8 pb-12 last:pb-0 md:pl-0 md:pb-0 md:w-[420px] lg:w-[460px] md:shrink-0 md:pt-28"
              >
                {/* Mobile timeline dot */}
                <span className="md:hidden absolute -left-1 top-1.5 w-[9px] h-[9px] rounded-full bg-lime" />
                {/* Desktop ghost number — outlined lime, parallaxes behind its card */}
                <span
                  aria-hidden="true"
                  data-step-ghost
                  className="hidden md:block absolute -top-2 -left-3 font-display font-extrabold leading-none select-none pointer-events-none text-[140px] lg:text-[170px] text-transparent"
                  style={{ WebkitTextStroke: '1.5px rgba(200,255,61,0.55)' }}
                >
                  {step.num}
                </span>
                <div className="relative z-10 md:h-full md:bg-ink-2 md:border md:border-white/10 md:rounded-[20px] md:p-8">
                  <span className="font-mono text-lime text-sm tracking-[0.2em]">{step.num}</span>
                  <h3 className="font-display font-bold uppercase text-white text-lg mt-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed mt-2 max-w-xs">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop progress line — fills beneath the track as you scrub */}
          <div
            className="hidden md:block mt-16"
            style={{ paddingLeft: TRACK_GUTTER, paddingRight: TRACK_GUTTER }}
          >
            <div className="relative h-px w-full bg-white/10">
              <div data-process-progress className="absolute inset-0 bg-lime" />
            </div>
            <div className="flex justify-between mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              <span>01 · Survey</span>
              <span>05 · First Serve</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SPEC SHEET — court-blue panel ──────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-32">
        <div
          data-spec-panel
          className="mt-16 md:mt-24 rounded-[24px] md:rounded-[32px] bg-court-blue p-8 md:p-14 overflow-hidden relative"
        >
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Ruler className="w-5 h-5 text-lime" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
              {COPY.specKicker}
            </span>
          </div>
          <h3
            data-spec-headline
            className="font-display font-extrabold uppercase text-white text-3xl md:text-5xl leading-[0.95] tracking-tight max-w-2xl"
          >
            {COPY.specHeadline}
          </h3>

          <div data-spec-rows className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-10">
            {SPECS.map((spec) => (
              <div
                key={spec.label}
                data-spec-row
                className="flex items-baseline justify-between gap-6 border-b border-white/15 py-4"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 shrink-0">
                  {spec.label}
                </span>
                <span className="text-white font-medium text-sm md:text-base text-right">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mt-8">
            {COPY.specNote}
          </p>
        </div>
      </div>
    </section>
  );
}
