'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle } from 'lucide-react';
import Magnetic from '@/components/shared/Magnetic';
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

// Decorative, aria-hidden — mirrors the build phases. Placeholder wording (contract §8).
const MARQUEE_ITEMS = ['Site Survey', 'Design', 'Build', 'Handover'];

export default function LimeCTA() {
  const ctaHref = waHref(COPY.waMessage);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Continuous slow marquee — two identical halves loop seamlessly at -50%.
        gsap.to('[data-cta-marquee]', { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });

        gsap
          .timeline({
            scrollTrigger: { trigger: '[data-cta-body]', start: 'top 80%', once: true },
          })
          .from('[data-cta-kicker]', { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' }, 0)
          .from('[data-cta-line]', { yPercent: 110, duration: 0.9, stagger: 0.07, ease: 'power4.out' }, 0.1)
          .from('[data-cta-sub]', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' }, 0.5)
          .from('[data-cta-button]', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' }, 0.6);
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} aria-label="Start your build" className="grain relative overflow-hidden bg-lime">
      {/* Marquee strip along the band's top edge */}
      <div aria-hidden="true" className="relative z-10 select-none overflow-hidden border-b border-ink/10">
        <div data-cta-marquee className="flex w-max">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center gap-10 py-4 pr-10">
              {Array.from({ length: 3 }).flatMap((_, repeat) =>
                MARQUEE_ITEMS.map((item) => (
                  <span
                    key={`${repeat}-${item}`}
                    className="flex items-center gap-10 whitespace-nowrap font-display text-2xl font-extrabold uppercase tracking-tight text-ink/15 md:text-4xl"
                  >
                    {item}
                    <span className="h-2 w-2 shrink-0 rounded-full bg-ink/15" />
                  </span>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      <div data-cta-body className="relative z-10 px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p data-cta-kicker className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50">
              {COPY.kicker}
            </p>
            <h2 className="mt-4 font-display font-black uppercase leading-[0.92] tracking-tight text-ink text-[12vw] md:text-[6.5vw]">
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span data-cta-line className="block">{COPY.headlineLine1}</span>
              </span>
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span data-cta-line className="block">{COPY.headlineLine2}</span>
              </span>
            </h2>
            <p data-cta-sub className="mt-4 max-w-md font-medium text-ink/60">
              {COPY.subline}
            </p>
          </div>

          <div data-cta-button className="shrink-0 self-start md:self-auto">
            <Magnetic>
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-ink px-10 py-5 font-bold tracking-wide text-white transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <MessageCircle className="h-5 w-5 text-lime" />
                {COPY.cta}
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
