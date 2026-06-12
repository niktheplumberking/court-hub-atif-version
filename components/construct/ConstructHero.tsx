'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, ArrowDown } from 'lucide-react';
import { waHref } from '@/lib/whatsapp';
import { COMPANY_STATS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  kicker: 'Construct Your Court',
  headlineTop: 'Your Court.',
  headlineLime: 'Built To Win.',
  subline:
    'FIP-standard padel courts engineered, built and handed over anywhere in the UAE — from site survey to first serve, by one in-house team.',
  ctaPrimary: 'Get a Quote on WhatsApp',
  ctaSecondary: 'Plan My Build',
  waMessage: "Hi Court Hub — I'd like a quote for building a padel court.",
  heroChip: 'Build Division · UAE',
};

// Figures sourced from the shared COMPANY_STATS module (placeholder figures — confirm with client)
// so this strip can never contradict the About page.
const STATS: { value: string; label: string }[] = [
  { value: COMPANY_STATS.courtsDelivered, label: 'Courts Delivered' },
  { value: COMPANY_STATS.yearsBuilding, label: 'Years Building' },
  { value: COMPANY_STATS.emiratesCovered, label: 'Emirates Covered' },
  { value: COMPANY_STATS.avgBuildWeeks, label: 'Weeks Avg. Build' },
];

export default function ConstructHero() {
  const ctaHref = waHref(COPY.waMessage);
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Load-in choreography + stat count-ups — all widths, motion allowed.
      // Content is authored visible; from()/fromTo() only run inside these blocks,
      // so under prefers-reduced-motion everything simply renders in place.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from('[data-hero-frame]', { scale: 1.12, opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
          .from('[data-hero-chip]', { opacity: 0, y: 16, duration: 0.7 }, 0.4)
          // Kicker "tracks in" — wide horizontal stretch settling to 1 (transform-only).
          .from(
            '[data-hero-kicker]',
            { opacity: 0, scaleX: 1.35, transformOrigin: 'left center', duration: 0.9, ease: 'power3.out' },
            0.5
          )
          .from('[data-hero-line]', { yPercent: 110, duration: 1.1, stagger: 0.14 }, 0.6)
          .from('[data-hero-sub]', { opacity: 0, y: 28, duration: 0.9 }, 1.05)
          .from('[data-hero-cta]', { opacity: 0, y: 24, duration: 0.8, stagger: 0.1 }, 1.2)
          .from('[data-hero-cue]', { opacity: 0, duration: 0.6, ease: 'power2.out' }, 1.5);

        // Scroll cue — a lime pulse travelling down the hairline, forever.
        gsap.fromTo(
          '[data-hero-cue-dot]',
          { yPercent: -110 },
          { yPercent: 320, duration: 1.6, ease: 'power1.inOut', repeat: -1, repeatDelay: 0.4 }
        );

        // Stats: count up once on enter, preserving any suffix ('25+' → 0+ … 25+).
        gsap.utils.toArray<HTMLElement>('[data-stat-value]').forEach((el) => {
          const match = (el.dataset.statValue ?? '').match(/^(\d+)(.*)$/);
          if (!match) return;
          const target = parseInt(match[1], 10);
          const suffix = match[2];
          const proxy = { value: 0 };
          gsap.to(proxy, {
            value: target,
            duration: 1.8,
            ease: 'power2.out',
            snap: { value: 1 },
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onStart: () => {
              el.textContent = `0${suffix}`;
            },
            onUpdate: () => {
              el.textContent = `${Math.round(proxy.value)}${suffix}`;
            },
          });
        });
        gsap.from('[data-stat-label]', {
          opacity: 0,
          y: 18,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-stats]', start: 'top 85%', once: true },
        });
      });

      // Scroll-away scrub — desktop only: background grows + drifts while the
      // copy block lifts and fades, selling depth as you leave the hero.
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-hero-bg]',
          { scale: 1, yPercent: 0 },
          {
            scale: 1.12,
            yPercent: 8,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
          }
        );
        gsap.to('[data-hero-copy]', {
          yPercent: -18,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '70% top', scrub: 0.8 },
        });
        gsap.fromTo(
          '[data-hero-cue]',
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: 16,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '20% top', scrub: true },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[88vh] flex items-end overflow-hidden">
        {/* Full-bleed background — outer frame handles the load-in scale,
            inner img handles the scroll scrub (nested transforms compose). */}
        <div data-hero-frame className="absolute inset-0 overflow-hidden">
          <img
            data-hero-bg
            src="/images/dubai_court_night_construction_1779706759259.webp"
            alt="Padel court under construction at night in Dubai"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
          />
        </div>
        {/* Ink gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

        <div data-hero-copy className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-20 md:pb-28">
          <div data-hero-chip className="flex items-center gap-3 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              {COPY.heroChip}
            </span>
          </div>

          <p data-hero-kicker className="text-lime text-xs tracking-[0.3em] uppercase mb-4">
            {COPY.kicker}
          </p>

          <h1 className="font-display font-extrabold text-white text-5xl md:text-8xl leading-[0.95] tracking-tight">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-hero-line className="block">{COPY.headlineTop}</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-hero-line className="block text-lime">{COPY.headlineLime}</span>
            </span>
          </h1>

          <p data-hero-sub className="text-white/50 max-w-xl leading-relaxed mt-6 text-base md:text-lg">
            {COPY.subline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a
              data-hero-cta
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-lime text-ink font-bold tracking-wide hover:brightness-110 transition-all button-glow-effect"
            >
              <MessageCircle className="w-4 h-4" />
              {COPY.ctaPrimary}
            </a>
            <a
              data-hero-cta
              href="#inquiry"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/15 text-white font-bold tracking-wide hover:border-lime/50 transition-colors"
            >
              {COPY.ctaSecondary}
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Scroll cue at the hero's bottom edge */}
        <div
          data-hero-cue
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none select-none"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
          <span className="relative block w-px h-12 bg-white/15 overflow-hidden">
            <span data-hero-cue-dot className="absolute top-0 left-0 block w-px h-4 bg-lime" />
          </span>
        </div>
      </section>

      {/* ── STATS STRIP ────────────────────────────────────────────────── */}
      <section data-stats className="border-y border-white/10 bg-ink-2/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {STATS.map((stat) => (
            <div key={stat.label} className="space-y-2">
              {/* Authored with the final figure so reduced-motion users see it as-is;
                  the count-up rewrites textContent only when animation actually runs. */}
              <p
                data-stat-value={stat.value}
                className="font-display font-extrabold text-4xl md:text-5xl text-white"
              >
                {stat.value}
              </p>
              <p
                data-stat-label
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30"
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
