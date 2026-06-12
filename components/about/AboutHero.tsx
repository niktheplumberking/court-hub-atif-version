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
  kicker: 'About Court Hub',
  headlineLead: 'Built by players.',
  headlineAccent: 'For players.',
  paragraphs: [
    'Court Hub started where most great padel stories in the UAE start — courtside, between matches, trading rackets out of a kit bag. What began as @used_rackets, a small Instagram page re-homing quality pre-owned rackets to players priced out of retail, quickly became one of the most trusted names in the local gear scene.',
    'Today we are a full house of padel. A curated shop of premium and certified pre-owned rackets. A construction arm building championship-grade courts across the Emirates. And a community that shows up for every tournament, every open night, every rally. Same obsession — bigger court.',
  ],
  originTag: 'Born on Instagram · @used_rackets',
  imageBadge: 'EST. DUBAI · UAE',
  whatsappLabel: 'Talk to the team',
  whatsappMessage: "Hi Court Hub — I'd love to hear more about what you do.",
} as const;

const HERO_IMAGE = {
  src: '/images/player_portrait_1779705596398.webp',
  alt: 'Court Hub player portrait under court lights',
} as const;

/** Splits a headline into per-word overflow-hidden masks so each word can rise from below. */
function StaggeredWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-top pb-[0.12em] -mb-[0.12em]"
        >
          <span className="hero-word inline-block will-change-transform">
            {word}
            {i < words.length - 1 ? '\u00A0' /* non-breaking — a plain space would collapse inside the mask */ : ''}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia(section);

      // Entrance choreography — all motion authored as from()/fromTo() so under
      // prefers-reduced-motion the content simply renders in its final state.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.hero-kicker', { y: 14, opacity: 0, duration: 0.6 }, 0)
          .from(
            '.hero-word',
            { yPercent: 115, duration: 0.9, ease: 'power4.out', stagger: 0.07 },
            0.1
          )
          .from('.hero-badge', { y: 18, opacity: 0, duration: 0.6 }, 0.55)
          .from('.hero-cta', { y: 18, opacity: 0, duration: 0.6 }, 0.7)
          // Portrait: clip-path wipe down + scale settle (settles at 1.12 to leave
          // bleed for the scroll parallax below).
          .fromTo(
            '.hero-portrait',
            { clipPath: 'inset(0% 0% 100% 0% round 32px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.1, ease: 'power3.inOut' },
            0.25
          )
          .fromTo(
            '.hero-portrait-img',
            { scale: 1.3 },
            { scale: 1.12, duration: 1.6, ease: 'power2.out' },
            0.25
          )
          .from('.hero-meta', { opacity: 0, duration: 0.5 }, 1.2);
      });

      // Desktop: gently scrubbed paragraph reveals + slow portrait y-parallax.
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.hero-para').forEach((p) => {
          gsap.fromTo(
            p,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: { trigger: p, start: 'top 96%', end: 'top 68%', scrub: 0.8 },
            }
          );
        });

        gsap.fromTo(
          '.hero-portrait-img',
          { yPercent: 4.5 },
          {
            yPercent: -4.5,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero-portrait',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });

      // Mobile: lighter once-only paragraph reveals, no scrub.
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.hero-para').forEach((p) => {
          gsap.from(p, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: p, start: 'top 92%', once: true },
          });
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 md:px-12 pt-16 md:pt-24 pb-20 md:pb-28">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Story side */}
        <div className="lg:col-span-7 space-y-8">
          <p className="hero-kicker text-lime text-xs tracking-[0.3em] uppercase">{COPY.kicker}</p>

          <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-white">
            <StaggeredWords text={COPY.headlineLead} className="block" />
            <StaggeredWords text={COPY.headlineAccent} className="block text-lime" />
          </h1>

          <div className="hero-badge">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 border border-white/10 rounded-full px-4 py-2 float-effect motion-reduce:animate-none">
              <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              {COPY.originTag}
            </span>
          </div>

          <div className="space-y-5 max-w-2xl">
            {COPY.paragraphs.map((p, i) => (
              <p key={i} className="hero-para text-white/50 text-base md:text-lg leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <div className="hero-cta">
            <motion.a
              href={waHref(COPY.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 rounded-full bg-lime text-ink px-7 py-3.5 text-sm font-bold hover:brightness-110 transition-[filter]"
            >
              <MessageCircle size={16} />
              {COPY.whatsappLabel}
            </motion.a>
          </div>
        </div>

        {/* Visual side */}
        <div className="lg:col-span-5">
          <div className="hero-portrait relative aspect-[4/5] max-h-[560px] w-full rounded-[32px] overflow-hidden border border-white/10">
            <img
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              className="hero-portrait-img absolute inset-0 w-full h-full object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent pointer-events-none" />
            <div className="hero-meta absolute bottom-6 left-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                {COPY.imageBadge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
