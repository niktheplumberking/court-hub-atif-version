'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, ArrowDown } from 'lucide-react';
import Magnetic from '@/components/shared/Magnetic';
import { waHref } from '@/lib/whatsapp';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  kicker: 'Court Construction · UAE',
  // Each entry is one masked reveal line of the display headline.
  headline: [
    { text: 'From Dirt', lime: false },
    { text: 'To Drop Shot.', lime: true },
  ],
  sub: 'FIP-standard padel courts engineered end-to-end — survey, steel, glass, turf, light. We hand you the keys at first serve.',
  ctaPrimary: 'Start on WhatsApp',
  ctaSecondary: 'Plan My Build',
  waMessage: "Hi Court Hub — I'd like to talk about building a padel court.",
  scrollCue: 'Scroll — the build begins',
};

export default function ConstructHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Cinematic open: video settles from 1.12, headline lines rise out of
        // their masks, then sub + CTAs + cue fade up. Plays once on load.
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.fromTo(
          videoWrapRef.current,
          { scale: 1.12 },
          { scale: 1, duration: 2.2, ease: 'expo.out' },
          0
        )
          .from('[data-hero-kicker]', { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' }, 0.3)
          .from('[data-hero-line]', { yPercent: 110, duration: 0.9, stagger: 0.07 }, 0.45)
          .from('[data-hero-sub]', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' }, 0.9)
          .from('[data-hero-cta]', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 1.05)
          .from('[data-hero-cue]', { opacity: 0, duration: 0.8, ease: 'power2.out' }, 1.4);

        // Endless slow Ken Burns drift on the still — keeps the frame alive.
        gsap.to('[data-hero-media]', {
          scale: 1.07,
          duration: 14,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });

        // Slow parallax: media drifts as the hero scrolls away.
        gsap.to(videoWrapRef.current, {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        // Scroll cue fades as soon as the user commits.
        gsap.to('[data-hero-cue]', {
          opacity: 0,
          y: 16,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '12% top',
            scrub: true,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Court construction"
      className="grain relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink"
    >
      {/* Full-bleed night court — settles on load, drifts forever (Ken Burns), parallaxes away on scroll */}
      <div ref={videoWrapRef} className="absolute inset-0 will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-hero-media
          src="/images/hero_padel_night_view_1779713624496.png"
          alt="Floodlit panoramic padel court at night"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Legibility vignette + lime ground-glow behind the headline */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink/90" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[60vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(200,255,61,0.14),transparent)]" />

      {/* Copy block */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 md:px-12 md:pb-28">
        <div className="mx-auto w-full max-w-[1800px]">
          <p
            data-hero-kicker
            className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-lime md:text-[11px]"
          >
            {COPY.kicker}
          </p>

          <h1 className="font-display font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-white text-[13.5vw] md:text-[8.5vw]">
            {COPY.headline.map((line) => (
              <span key={line.text} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span data-hero-line className={`block ${line.lime ? 'text-lime' : ''}`}>
                  {line.text}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
            <p data-hero-sub className="max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              {COPY.sub}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div data-hero-cta>
                <Magnetic>
                  <a
                    href={waHref(COPY.waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-full bg-lime px-9 py-4 text-[12px] font-bold uppercase tracking-[0.15em] text-ink transition-colors duration-300 hover:bg-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {COPY.ctaPrimary}
                  </a>
                </Magnetic>
              </div>
              <div data-hero-cta>
                <Magnetic>
                  <a
                    href="#inquiry"
                    className="inline-flex items-center gap-3 rounded-full border border-white/30 px-9 py-4 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:border-lime hover:text-lime"
                  >
                    {COPY.ctaSecondary}
                    <ArrowDown className="h-4 w-4" />
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-hero-cue
        className="pointer-events-none absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 text-white/40"
      >
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em]">
          {COPY.scrollCue}
        </span>
        <span className="relative block h-8 w-px overflow-hidden bg-white/15">
          <span className="absolute left-0 top-0 h-3 w-px animate-bounce bg-lime" />
        </span>
      </div>
    </section>
  );
}
