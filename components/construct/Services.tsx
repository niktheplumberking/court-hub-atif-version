'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { Hammer, Layers, Lightbulb, Wrench, type LucideIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  kicker: 'What We Build',
  headlinePre: 'One Crew. ',
  headlineLime: 'Every Court.',
  intro:
    'From bare sand to championship surface, Court Hub handles the full scope in-house — no subcontractor roulette, no handover gaps.',
};

type Service = {
  icon: LucideIcon;
  title: string;
  copy: string;
  tag: string;
};

const SERVICES: Service[] = [
  {
    icon: Hammer,
    title: 'Full Court Construction',
    tag: 'Turnkey',
    copy: 'Complete turnkey builds on villas, rooftops, clubs and commercial plots. We pour the base, raise the steel, fit the glass and hand you the keys to a match-ready court.',
  },
  {
    icon: Layers,
    title: 'Resurfacing & Upgrades',
    tag: 'Renew',
    copy: 'Tired turf, faded lines or older-generation glass? We strip, re-lay and upgrade existing courts to current FIP spec — usually without weeks of downtime.',
  },
  {
    icon: Lightbulb,
    title: 'Lighting, Roofing & Canopies',
    tag: 'Extend',
    copy: 'Match-level LED arrays, full steel roofing and tensile canopies engineered for UAE summers. Play at midnight in July, glare-free and shaded by day.',
  },
  {
    icon: Wrench,
    title: 'Maintenance & Support',
    tag: 'Protect',
    copy: 'Scheduled turf grooming, glass and structure inspections, and rapid call-out repairs. A court that earns revenue should never sit out of service.',
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Header reveal + icon-chip idle float — all widths, motion allowed.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const header = gsap.timeline({
          scrollTrigger: { trigger: '[data-services-header]', start: 'top 85%', once: true },
        });
        header
          .from('[data-services-kicker]', { opacity: 0, x: -18, duration: 0.7, ease: 'power3.out' })
          .from('[data-services-line]', { yPercent: 110, duration: 1, ease: 'power4.out' }, 0.1)
          .from('[data-services-intro]', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, 0.35);

        // Gentle perpetual float on the icon chips, phase-shifted per card.
        gsap.to('[data-service-chip]', {
          y: -5,
          duration: 2.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.4 },
        });
      });

      // Desktop: cards rise with a perspective rotateX stagger (parent has perspective).
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-service-card]', {
          opacity: 0,
          y: 64,
          rotateX: -12,
          transformOrigin: '50% 0%',
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-services-grid]', start: 'top 80%', once: true },
        });
      });

      // Mobile: lighter stagger reveal, one trigger per card.
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-service-card]').forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 32,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          });
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-20 md:py-32">
      <div className="max-w-7xl mx-auto">
        <div data-services-header className="max-w-2xl">
          <p data-services-kicker className="text-lime text-xs tracking-[0.3em] uppercase mb-3">
            {COPY.kicker}
          </p>
          <h2 className="font-display font-extrabold uppercase text-white text-4xl md:text-6xl leading-[0.95] tracking-tight">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-services-line className="block">
                {COPY.headlinePre}
                <span className="text-lime">{COPY.headlineLime}</span>
              </span>
            </span>
          </h2>
          <p data-services-intro className="text-white/50 leading-relaxed mt-5">
            {COPY.intro}
          </p>
        </div>

        <div
          data-services-grid
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-16 [perspective:1200px]"
        >
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            const limeChip = i % 2 === 0;
            return (
              // Outer div: GSAP entrance (rotateX rise). Inner motion.div: hover lift —
              // separated so the two transform systems never fight.
              <div key={service.title} data-service-card className="h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="h-full rounded-[20px] bg-ink-2 border border-white/10 p-7 md:p-8 flex flex-col gap-5 hover:border-lime/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div
                      data-service-chip
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        limeChip ? 'bg-lime text-ink' : 'bg-court-blue text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
                      {service.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-white text-xl leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">{service.copy}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
