'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const HEADER = {
  kicker: 'What We Build',
  line1: 'Four Ways We',
  line2: 'Move Earth.',
  intro:
    'No catalogue courts. Every project is engineered for its site — villa garden, club floor or open desert lot.',
};

type Row = {
  num: string;
  title: string;
  copy: string;
  img: string;
  alt: string;
  tag: string;
};

const ROWS: Row[] = [
  {
    num: '01',
    title: 'Panoramic Courts',
    copy:
      'The full build. Laser-levelled foundations, hot-dip galvanised steel and 12 mm tempered glass walls with nothing between the crowd and the rally. FIP tournament geometry, delivered turnkey.',
    img: '/images/hero_padel_night_view_1779713624496.png',
    alt: 'Panoramic padel court at night',
    tag: 'Full Build · Turnkey',
  },
  {
    num: '02',
    title: 'Resurfacing & Turf',
    copy:
      'Tired court, true bounce restored. We strip, re-tension and re-dress with monofilament turf and calibrated silica sand — the surface pros ask for, fitted in days, not weeks.',
    img: '/images/faq_padel_detail_1779708774500.webp',
    alt: 'Padel court surface and glass detail',
    tag: 'Surface · Refit',
  },
  {
    num: '03',
    title: 'Lighting & Canopy',
    copy:
      'Play through August. Shade canopies engineered for UAE wind loads and LED arrays tuned to 500 lux with zero glare on the glass — night matches that feel like television.',
    img: '/images/dubai_court_night_construction_1779706759259.webp',
    alt: 'Dubai court under night construction lighting',
    tag: 'Light · Shade',
  },
  {
    num: '04',
    title: 'Care & Maintenance',
    copy:
      'Quarterly turf brushing, infill top-ups, glass and fixing inspections, net calibration. Clubs on a Court Hub plan get priority call-out — your court never has an off-season.',
    img: '/images/court_action_landscape_1779705580138.webp',
    alt: 'Match play on a maintained padel court',
    tag: 'Plans · Priority',
  },
];

export default function WhatWeBuild() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Header: masked line reveal at 80% viewport, body fade-up.
        gsap
          .timeline({
            scrollTrigger: { trigger: '[data-wwb-header]', start: 'top 80%', once: true },
          })
          .from('[data-wwb-kicker]', { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' }, 0)
          .from('[data-wwb-line]', { yPercent: 110, duration: 0.9, stagger: 0.07, ease: 'power4.out' }, 0.1)
          .from('[data-wwb-intro]', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' }, 0.45);

        // Rows: numeral slides in, image frame wipes open, copy rises.
        gsap.utils.toArray<HTMLElement>('[data-wwb-row]').forEach((row) => {
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: 'top 80%', once: true } })
            .from(row.querySelector('[data-wwb-num]'), {
              opacity: 0,
              x: -40,
              duration: 1,
              ease: 'power4.out',
            })
            .fromTo(
              row.querySelector('[data-wwb-frame]'),
              { clipPath: 'inset(100% 0% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.inOut' },
              0
            )
            .from(
              row.querySelectorAll('[data-wwb-copy] > *'),
              { opacity: 0, y: 24, duration: 0.8, stagger: 0.08, ease: 'power3.out' },
              0.3
            );

          // Slow parallax inside each frame — the GSAP transform lives on the
          // wrapper so the img's CSS hover zoom (native `scale`) never fights it.
          gsap.fromTo(
            row.querySelector('[data-wwb-par]'),
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: 'none',
              scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="What we build"
      className="relative overflow-hidden bg-sand px-6 py-24 text-ink md:px-16 md:py-36"
    >
      <div className="mx-auto max-w-[1800px]">
        {/* Header */}
        <div data-wwb-header className="max-w-4xl">
          <p data-wwb-kicker className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ink/50">
            {HEADER.kicker}
          </p>
          <h2 className="font-display font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[11vw] md:text-[6.5vw]">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-wwb-line className="block">{HEADER.line1}</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-wwb-line className="block text-court-blue">{HEADER.line2}</span>
            </span>
          </h2>
          <p data-wwb-intro className="mt-6 max-w-md text-base leading-relaxed text-ink/60 md:text-lg">
            {HEADER.intro}
          </p>
        </div>

        {/* Editorial rows */}
        <div className="mt-20 flex flex-col gap-24 md:mt-28 md:gap-36">
          {ROWS.map((row, i) => {
            const flipped = i % 2 === 1;
            return (
              <article
                key={row.num}
                data-wwb-row
                className={`relative flex flex-col gap-8 md:items-center md:gap-16 ${
                  flipped ? 'md:flex-row-reverse' : 'md:flex-row'
                }`}
              >
                {/* Giant outlined numeral bleeding behind the row */}
                <span
                  data-wwb-num
                  aria-hidden="true"
                  className={`numeral-outline-ink pointer-events-none absolute -top-14 z-0 select-none font-display text-[34vw] font-extrabold leading-none md:-top-24 md:text-[17vw] ${
                    flipped ? 'right-0 md:-right-6' : 'left-0 md:-left-6'
                  }`}
                >
                  {row.num}
                </span>

                {/* Photography — parallax inside, lift + color on hover */}
                <div className="relative z-10 w-full md:w-[55%]">
                  <div
                    data-wwb-frame
                    className="group relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-[0_24px_70px_rgba(14,14,12,0.18)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_34px_90px_rgba(14,14,12,0.28)] md:aspect-[16/10]"
                  >
                    <div data-wwb-par className="absolute -top-[12%] left-0 h-[124%] w-full will-change-transform">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={row.img}
                        alt={row.alt}
                        loading="lazy"
                        className="h-full w-full object-cover grayscale-[35%] transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
                    {/* Caption chip slides up on hover */}
                    <span className="absolute bottom-4 left-4 translate-y-3 rounded-full bg-ink/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {row.tag}
                    </span>
                  </div>
                </div>

                {/* Copy */}
                <div data-wwb-copy className="relative z-10 w-full md:w-[45%]">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-court-blue">
                    {row.num} / {row.tag}
                  </p>
                  <h3 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-5xl">
                    {row.title}
                  </h3>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-ink/65">{row.copy}</p>
                  <a
                    href="#inquiry"
                    className="link-underline mt-7 inline-block font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-ink"
                  >
                    Price this build →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
