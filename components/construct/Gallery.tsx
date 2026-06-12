'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  kicker: 'Recent Builds',
  headlinePre: 'Proof, ',
  headlineLime: 'Poured In Concrete.',
  intro:
    'A selection from courts delivered across the Emirates — private villas, academies and tournament venues.',
};

type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  aspect: string;
};

// Three columns, each scrubbed at its own parallax speed on desktop.
// Explicit aspect ratios keep ScrollTrigger positions stable while images load.
const COLUMNS: { offset: string; items: GalleryItem[] }[] = [
  {
    offset: '',
    items: [
      {
        src: '/images/court_action_landscape_1779705580138.webp',
        alt: 'Match play on a Court Hub padel court',
        caption: 'Club Build · Al Quoz', // placeholder caption — confirm with client
        aspect: 'aspect-[3/4]',
      },
      {
        src: '/images/padel_championship_trophy_1779707051993.webp',
        alt: 'Championship trophy on a padel court',
        caption: 'Tournament Ready', // placeholder caption — confirm with client
        aspect: 'aspect-square',
      },
    ],
  },
  {
    offset: 'md:mt-20',
    items: [
      {
        src: '/images/hero_padel_night_view_1779713624496.png',
        alt: 'Panoramic padel court at night',
        caption: 'Panoramic · Night Spec', // placeholder caption — confirm with client
        aspect: 'aspect-[4/5]',
      },
      {
        src: '/images/tournament_crowd_night_1779707031611.webp',
        alt: 'Crowd at a night padel tournament',
        caption: 'Venue Build · Match Night', // placeholder caption — confirm with client
        aspect: 'aspect-[3/4]',
      },
    ],
  },
  {
    offset: 'md:mt-10',
    items: [
      {
        src: '/images/faq_padel_detail_1779708774500.webp',
        alt: 'Padel court surface and glass detail',
        caption: 'Surface Detail', // placeholder caption — confirm with client
        aspect: 'aspect-square',
      },
      {
        src: '/images/hero_court_background_1779705118750.png',
        alt: 'Full padel court view',
        caption: 'Full Court · Outdoor', // placeholder caption — confirm with client
        aspect: 'aspect-[3/4]',
      },
    ],
  },
];

// Per-column parallax travel in px (negative = drifts up faster than the page).
const COLUMN_SPEEDS = [-40, -110, -24];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Header + per-image clip reveals — all widths, motion allowed.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const header = gsap.timeline({
          scrollTrigger: { trigger: '[data-gallery-header]', start: 'top 85%', once: true },
        });
        header
          .from('[data-gallery-kicker]', { opacity: 0, x: -18, duration: 0.7, ease: 'power3.out' })
          .from('[data-gallery-line]', { yPercent: 110, duration: 1, ease: 'power4.out' }, 0.1)
          .from('[data-gallery-intro]', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, 0.35);

        // Each tile: clip-path wipe up + settle from 1.08 scale, chip slides in after.
        gsap.utils.toArray<HTMLElement>('[data-gallery-item]').forEach((item) => {
          const zoom = item.querySelector('[data-gallery-zoom]');
          const chip = item.querySelector('[data-gallery-chip]');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: item, start: 'top 85%', once: true },
          });
          tl.fromTo(
            item,
            { clipPath: 'inset(0% 0% 100% 0% round 20px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.1, ease: 'power4.inOut' }
          )
            .fromTo(zoom, { scale: 1.08 }, { scale: 1, duration: 1.5, ease: 'power2.out' }, 0)
            .from(chip, { opacity: 0, x: -14, duration: 0.6, ease: 'power3.out' }, 0.5);
        });
      });

      // Desktop: columns drift at different speeds while the grid is in view.
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-gallery-col]').forEach((col, i) => {
          gsap.to(col, {
            y: COLUMN_SPEEDS[i] ?? -32,
            ease: 'none',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-20 md:py-32">
      <div className="max-w-7xl mx-auto">
        <div
          data-gallery-header
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 max-w-7xl"
        >
          <div>
            <p data-gallery-kicker className="text-lime text-xs tracking-[0.3em] uppercase mb-3">
              {COPY.kicker}
            </p>
            <h2 className="font-display font-extrabold uppercase text-white text-4xl md:text-6xl leading-[0.95] tracking-tight">
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span data-gallery-line className="block">
                  {COPY.headlinePre}
                  <span className="text-lime">{COPY.headlineLime}</span>
                </span>
              </span>
            </h2>
          </div>
          <p data-gallery-intro className="text-white/50 leading-relaxed max-w-sm md:text-right">
            {COPY.intro}
          </p>
        </div>

        <div ref={gridRef} className="flex flex-col md:flex-row gap-4 md:gap-6 mt-12 md:mt-16">
          {COLUMNS.map((column, ci) => (
            <div
              key={ci}
              data-gallery-col
              className={`flex-1 flex flex-col gap-4 md:gap-6 ${column.offset}`}
            >
              {column.items.map((item) => (
                <figure
                  key={item.src}
                  data-gallery-item
                  className={`group relative rounded-[20px] overflow-hidden ${item.aspect}`}
                >
                  {/* Inner zoom wrapper carries the GSAP scale so the CSS hover
                      zoom on the img itself never fights an inline transform. */}
                  <div data-gallery-zoom className="absolute inset-0 will-change-transform">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <figcaption
                    data-gallery-chip
                    className="absolute bottom-3 left-3 md:bottom-4 md:left-4 px-3 py-1.5 rounded-full bg-ink/70 backdrop-blur-sm border border-white/10 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/80"
                  >
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
