'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  kicker: 'Why Court Hub',
  headlinePre: 'Built In-House. ',
  headlineLime: 'Backed For Years.',
  intro:
    'Most court builders assemble a project from subcontractors. We are the crew — engineers, fabricators and installers on one payroll, accountable to one name on the contract.',
  imageChip: 'Build Team · On Site',
  testimonialQuote:
    'They quoted a date, hit it, and the court still plays like day one two seasons later. Our members ask who built it — we just point at the Court Hub plate on the frame.',
  testimonialName: 'Founding Member', // placeholder attribution — confirm with client
  testimonialRole: 'Private Padel Club, Dubai Hills', // placeholder attribution — confirm with client
};

const BULLETS: { title: string; copy: string }[] = [
  {
    title: 'In-house build team',
    copy: 'Survey, steel, glass and turf handled by our own crew — one team, one standard, zero handover gaps.',
  },
  {
    title: 'FIP-standard materials',
    copy: 'Every component specified to international federation standard, sourced from audited suppliers.',
  },
  {
    title: '10-year structural warranty', // placeholder figure — confirm with client
    copy: 'Steel frame and foundation covered in writing — not a brochure promise, a contract clause.',
  },
  {
    title: 'Post-handover maintenance',
    copy: 'Scheduled grooming and inspections keep your court match-ready long after the first serve.',
  },
];

export default function Authority() {
  const sectionRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Reveals — all widths, motion allowed.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(maskRef.current, {
          opacity: 0,
          x: -48,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: maskRef.current, start: 'top 80%', once: true },
        });

        const header = gsap.timeline({
          scrollTrigger: { trigger: '[data-authority-header]', start: 'top 85%', once: true },
        });
        header
          .from('[data-authority-kicker]', { opacity: 0, x: -18, duration: 0.7, ease: 'power3.out' })
          .from('[data-authority-line]', { yPercent: 110, duration: 1, ease: 'power4.out' }, 0.1)
          .from('[data-authority-intro]', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, 0.35);

        gsap.from('[data-authority-bullet]', {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-authority-bullets]', start: 'top 80%', once: true },
        });

        // Testimonial reveals like a quote — mark slides in, body fades as a block.
        const quote = gsap.timeline({
          scrollTrigger: { trigger: '[data-authority-quote]', start: 'top 85%', once: true },
        });
        quote
          .from('[data-authority-quote]', { opacity: 0, y: 28, duration: 0.8, ease: 'power3.out' })
          .from(
            '[data-authority-quote-mark]',
            { opacity: 0, x: -28, rotate: -12, duration: 0.7, ease: 'power3.out' },
            0.15
          )
          .from('[data-authority-quote-text]', { opacity: 0, y: 14, duration: 0.7, ease: 'power3.out' }, 0.3)
          .from('[data-authority-quote-footer]', { opacity: 0, y: 12, duration: 0.6, ease: 'power3.out' }, 0.45);
      });

      // Desktop: portrait parallaxes inside its rounded mask (img oversized via scale class).
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-authority-img]',
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: { trigger: maskRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-20 md:py-32 bg-ink-2/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Visual side */}
        <div
          ref={maskRef}
          className="relative rounded-[24px] md:rounded-[32px] overflow-hidden aspect-[4/5] max-h-[620px] w-full"
        >
          <img
            data-authority-img
            src="/images/brand_authority_ref.jpg"
            alt="Court Hub build quality reference"
            className="absolute inset-0 w-full h-full object-cover scale-[1.15] will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
              {COPY.imageChip}
            </span>
          </div>
        </div>

        {/* Copy side */}
        <div>
          <div data-authority-header>
            <p data-authority-kicker className="text-lime text-xs tracking-[0.3em] uppercase mb-3">
              {COPY.kicker}
            </p>
            <h2 className="font-display font-extrabold uppercase text-white text-4xl md:text-6xl leading-[0.95] tracking-tight">
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span data-authority-line className="block">
                  {COPY.headlinePre}
                  <span className="text-lime">{COPY.headlineLime}</span>
                </span>
              </span>
            </h2>
            <p data-authority-intro className="text-white/50 leading-relaxed mt-5 max-w-xl">
              {COPY.intro}
            </p>
          </div>

          <div data-authority-bullets className="mt-10 space-y-6">
            {BULLETS.map((bullet) => (
              <div key={bullet.title} data-authority-bullet className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-lime text-ink flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-lg leading-tight">
                    {bullet.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed mt-1 max-w-md">
                    {bullet.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <blockquote
            data-authority-quote
            className="mt-12 rounded-[20px] bg-court-blue/10 border border-court-blue/25 p-7 md:p-8 relative"
          >
            <Quote data-authority-quote-mark className="w-6 h-6 text-lime mb-4" />
            <p data-authority-quote-text className="text-white/80 leading-relaxed italic">
              “{COPY.testimonialQuote}”
            </p>
            <footer data-authority-quote-footer className="mt-5 flex items-center gap-3">
              <img
                src="/images/player_portrait_1779705596398.webp"
                alt="Client portrait"
                className="w-10 h-10 rounded-full object-cover border border-white/15"
              />
              <div>
                <p className="text-white font-bold text-sm">{COPY.testimonialName}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mt-0.5">
                  {COPY.testimonialRole}
                </p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
