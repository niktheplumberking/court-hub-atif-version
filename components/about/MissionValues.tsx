'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeartHandshake, BadgeCheck, Trophy, type LucideIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  microLabel: 'Mission · Values',
  headlineLead: 'Why we show up',
  headlineAccent: 'every match day.',
  intro:
    'One mission drives everything from a single regripped racket to a full court build: make world-class padel reachable for every player in the UAE.',
} as const;

interface Value {
  icon: LucideIcon;
  title: string;
  body: string;
}

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const VALUES: Value[] = [
  {
    icon: HeartHandshake,
    title: 'Players First',
    body: 'Every decision starts on court, not in a spreadsheet. We recommend the racket that suits your game — even when it is not the most expensive one on the wall.',
  },
  {
    icon: BadgeCheck,
    title: 'Honest Gear',
    body: 'Every pre-owned racket is inspected, graded, and listed with zero spin. What you see in the photos is exactly what lands in your hands.',
  },
  {
    icon: Trophy,
    title: 'Championship Standard',
    body: 'From tournament-grade rackets to the courts we build, we hold one bar: good enough for a final. If it would not survive championship play, we do not sell it.',
  },
];

export default function MissionValues() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia(section);

      // Header reveal — shared across breakpoints.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.mv-head', {
          y: 26,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        });
      });

      // Desktop: cards rise with a rotationX tilt under the grid's perspective,
      // then icons pop in after their cards.
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '.mv-grid', start: 'top 78%', once: true },
        });
        tl.from('.value-card', {
          y: 70,
          opacity: 0,
          rotationX: -16,
          transformOrigin: '50% 100%',
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.14,
          clearProps: 'transform,opacity',
        }).from(
          '.value-icon',
          {
            scale: 0.3,
            opacity: 0,
            duration: 0.55,
            ease: 'back.out(2.4)',
            stagger: 0.14,
            clearProps: 'transform,opacity',
          },
          0.35
        );
      });

      // Mobile: lighter per-card rise, no 3D tilt.
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.value-card').forEach((card) => {
          gsap.from(card, {
            y: 36,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          });
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-20 md:py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="mv-head md:col-span-8 space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
              {COPY.microLabel}
            </p>
            <h2 className="font-display font-extrabold uppercase text-3xl md:text-5xl leading-[1] tracking-tight text-white">
              {COPY.headlineLead} <span className="text-lime">{COPY.headlineAccent}</span>
            </h2>
          </div>
          <p className="mv-head md:col-span-4 text-white/40 text-sm md:text-base leading-relaxed md:text-right">
            {COPY.intro}
          </p>
        </div>

        {/* Value cards — perspective parent for the rotationX rise */}
        <div className="mv-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:[perspective:1200px]">
          {VALUES.map((value) => (
            <div key={value.title} className="value-card group h-full will-change-transform">
              <div className="h-full rounded-[20px] bg-ink-2 border border-white/10 p-8 space-y-5 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-lime/30">
                <div className="value-icon w-12 h-12 rounded-2xl bg-lime/10 flex items-center justify-center">
                  <value.icon className="w-6 h-6 text-lime" />
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
                  {value.title}
                </h3>
                <p className="text-white/40 text-sm md:text-base leading-relaxed">{value.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
