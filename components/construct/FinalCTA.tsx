'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { waHref } from '@/lib/whatsapp';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  kicker: 'Ready When You Are',
  headlineLine1: 'Break Ground',
  headlineLine2: 'This Season.',
  subline: 'One message starts the survey. The rest is on us.',
  cta: 'Start on WhatsApp',
  waMessage: "Hi Court Hub — let's talk about building my padel court.",
};

// Decorative, aria-hidden — mirrors the process steps. Placeholder wording (contract §8).
const MARQUEE_ITEMS = ['Site Survey', 'Design', 'Build', 'Handover'];

export default function FinalCTA() {
  const ctaHref = waHref(COPY.waMessage);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Continuous slow marquee — two identical halves loop seamlessly at -50%.
        gsap.to('[data-cta-marquee]', { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });

        gsap.from('[data-cta-kicker]', {
          opacity: 0,
          y: 16,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-cta-body]', start: 'top 85%', once: true },
        });
        gsap.from('[data-cta-sub]', {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-cta-body]', start: 'top 80%', once: true },
        });
        gsap.from('[data-cta-button]', {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-cta-body]', start: 'top 80%', once: true },
        });
      });

      // Desktop: the big line slides in horizontally on scrub as the band arrives.
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-cta-headline]',
          { xPercent: -10, opacity: 0.25 },
          {
            xPercent: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', end: 'top 35%', scrub: 1 },
          }
        );
      });

      // Mobile: a single lighter slide-in.
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-cta-headline]', {
          opacity: 0,
          x: -32,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-cta-body]', start: 'top 85%', once: true },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-lime overflow-hidden">
      {/* Marquee strip along the band's top edge */}
      <div aria-hidden="true" className="border-b border-ink/10 overflow-hidden select-none">
        <div data-cta-marquee className="flex w-max">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center gap-10 py-4 pr-10">
              {Array.from({ length: 3 }).flatMap((_, repeat) =>
                MARQUEE_ITEMS.map((item) => (
                  <span
                    key={`${repeat}-${item}`}
                    className="flex items-center gap-10 font-display font-extrabold uppercase tracking-tight text-ink/15 text-2xl md:text-4xl whitespace-nowrap"
                  >
                    {item}
                    <span className="w-2 h-2 rounded-full bg-ink/15 shrink-0" />
                  </span>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      <div data-cta-body className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div>
            <p data-cta-kicker className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50 font-bold">
              {COPY.kicker}
            </p>
            <h2
              data-cta-headline
              className="font-display font-black uppercase text-ink text-4xl md:text-7xl leading-[0.95] tracking-tight mt-4"
            >
              {COPY.headlineLine1}
              <br />
              {COPY.headlineLine2}
            </h2>
            <p data-cta-sub className="text-ink/60 font-medium mt-4 max-w-md">
              {COPY.subline}
            </p>
          </div>

          <div data-cta-button className="shrink-0 self-start md:self-auto">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-ink text-white font-bold tracking-wide"
            >
              <MessageCircle className="w-5 h-5 text-lime" />
              {COPY.cta}
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
