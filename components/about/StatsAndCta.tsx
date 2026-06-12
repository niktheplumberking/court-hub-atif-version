'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COMPANY_STATS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const STATS = [
  { value: '1,400+', label: 'Rackets re-homed' }, // placeholder figure — confirm with client
  { value: '3,000+', label: 'Players served' }, // placeholder figure — confirm with client
  { value: COMPANY_STATS.courtsDelivered, label: 'Courts built' }, // shared placeholder figure (lib/constants) — confirm with client
  { value: COMPANY_STATS.foundedYear, label: 'Founded in Dubai' }, // shared placeholder figure (lib/constants) — confirm with client
] as const;

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const CTA = {
  microLabel: 'Next Rally',
  headlineLead: 'Your game.',
  headlineAccent: 'Our obsession.',
  subline:
    'Whether you need your next racket or your own court, the Court Hub team is one message away.',
  primary: { label: 'Shop Rackets', href: '/shop' },
  secondary: { label: 'Build Your Court', href: '/construct-your-court' },
} as const;

export default function StatsAndCta() {
  const statsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stats = statsRef.current;
    const cta = ctaRef.current;
    if (!stats || !cta) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Stat blocks rise in.
        gsap.from(stats.querySelectorAll('.stat-block'), {
          y: 26,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: stats, start: 'top 82%', once: true },
        });

        // Count-up numbers, parsed straight from the rendered STATS values so
        // the source of truth stays the constants above (incl. COMPANY_STATS).
        const restores: Array<() => void> = [];
        stats.querySelectorAll<HTMLElement>('.stat-value').forEach((el, i) => {
          const raw = el.textContent?.trim() ?? '';
          const match = raw.match(/^([\d,]+)(\+?)$/);
          if (!match) return;
          const target = parseInt(match[1].replace(/,/g, ''), 10);
          const grouped = match[1].includes(',');
          const suffix = match[2];
          const fmt = (v: number) =>
            (grouped ? Math.round(v).toLocaleString('en-US') : String(Math.round(v))) + suffix;
          // Years tick up from a couple decades back instead of from zero.
          const isYear = !suffix && target >= 1900 && target <= 2100;
          const counter = { v: isYear ? target - 24 : 0 };

          el.textContent = fmt(counter.v);
          restores.push(() => {
            el.textContent = raw;
          });

          gsap.to(counter, {
            v: target,
            duration: 1.8,
            delay: i * 0.12,
            ease: 'power3.out',
            snap: { v: 1 },
            scrollTrigger: { trigger: stats, start: 'top 82%', once: true },
            onUpdate: () => {
              el.textContent = fmt(counter.v);
            },
            onComplete: () => {
              el.textContent = raw;
            },
          });
        });

        // CTA content rises staggered once the curtain is mostly open.
        gsap.from(cta.querySelectorAll('.cta-rise'), {
          y: 34,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: cta, start: 'top 62%', once: true },
        });

        return () => restores.forEach((restore) => restore());
      });

      // Desktop: curtain moment — the sand band wipes down over the ink page
      // as you scroll into it, with a subtle background scale drift while in view.
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          cta.querySelector('.cta-curtain'),
          { clipPath: 'inset(0% 0% 100% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: cta, start: 'top 92%', end: 'top 38%', scrub: 1 },
          }
        );

        gsap.fromTo(
          cta.querySelector('.cta-bg'),
          { scale: 1 },
          {
            scale: 1.07,
            ease: 'none',
            scrollTrigger: { trigger: cta, start: 'top 80%', end: 'bottom top', scrub: 1.2 },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Stats band */}
      <section ref={statsRef} className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-block space-y-3 text-center md:text-left">
              <p className="stat-value font-display font-black text-4xl md:text-5xl tracking-tight text-white tabular-nums">
                {stat.value}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band — curtain wipe from ink to sand */}
      <section ref={ctaRef}>
        <div className="cta-curtain relative overflow-hidden bg-sand text-ink">
          <div
            aria-hidden="true"
            className="cta-bg absolute inset-0 pointer-events-none will-change-transform bg-[radial-gradient(90%_130%_at_85%_-10%,rgba(30,90,232,0.12),transparent_60%)]"
          />
          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 flex flex-col items-start gap-8">
            <div className="space-y-4">
              <p className="cta-rise font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
                {CTA.microLabel}
              </p>
              <h2 className="cta-rise font-display font-black uppercase text-4xl md:text-6xl leading-[0.95] tracking-tighter">
                {CTA.headlineLead} <br className="hidden md:block" />
                <span className="text-court-blue">{CTA.headlineAccent}</span>
              </h2>
              <p className="cta-rise text-ink/60 text-base md:text-lg font-medium max-w-xl leading-relaxed">
                {CTA.subline}
              </p>
            </div>

            <div className="cta-rise flex flex-col sm:flex-row gap-4">
              <Link
                href={CTA.primary.href}
                className="inline-flex items-center justify-center rounded-full bg-ink text-white font-bold px-8 py-4 text-sm hover:brightness-125 transition-all"
              >
                {CTA.primary.label}
              </Link>
              <Link
                href={CTA.secondary.href}
                className="inline-flex items-center justify-center rounded-full bg-court-blue text-white font-bold px-8 py-4 text-sm hover:brightness-110 transition-all"
              >
                {CTA.secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
