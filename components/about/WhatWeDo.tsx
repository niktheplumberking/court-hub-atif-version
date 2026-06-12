'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  microLabel: 'What We Do',
  headlineLead: 'Three arms.',
  headlineAccent: 'One game.',
} as const;

interface Tile {
  tag: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  image: { src: string; alt: string };
}

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const TILES: Tile[] = [
  {
    tag: 'Retail',
    title: 'The Shop',
    body: 'Premium rackets fresh off the line, and certified pre-owned frames inspected and graded by players who know the difference.',
    href: '/shop',
    cta: 'Browse rackets',
    image: {
      src: '/images/padel_racket_set_lifestyle_1779706056285.webp',
      alt: 'Premium padel racket set on court',
    },
  },
  {
    tag: 'Build',
    title: 'Court Construction',
    body: 'Championship-grade padel courts engineered for the Gulf climate — design, build, and certification handled end to end.',
    href: '/construct-your-court',
    cta: 'Build your court',
    image: {
      src: '/images/dubai_court_night_construction_1779706759259.webp',
      alt: 'Padel court construction in Dubai at night',
    },
  },
  {
    tag: 'Scene',
    title: 'The Community',
    body: 'Tournaments, open nights, and a scene that keeps growing. If padel is happening in the UAE, Court Hub is courtside.',
    href: '/contact', // placeholder destination until a community page exists — confirm with client
    cta: 'Join the scene',
    image: {
      src: '/images/tournament_crowd_night_1779707031611.webp',
      alt: 'Tournament crowd at a night padel match',
    },
  },
];

export default function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia(section);

      // Header reveal — shared across breakpoints.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.what-head', {
          y: 26,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', once: true },
        });
      });

      // Desktop: outer tiles slide in from the sides, middle rises; images
      // get a slow y-parallax scrub while their tile crosses the viewport.
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.what-tile').forEach((tile, i) => {
          const fromVars = i === 0 ? { x: -90 } : i === 2 ? { x: 90 } : { y: 70 };
          gsap.from(tile, {
            ...fromVars,
            opacity: 0,
            duration: 1,
            delay: i * 0.1,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: '.what-grid', start: 'top 78%', once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('.tile-parallax').forEach((layer) => {
          gsap.fromTo(
            layer,
            { yPercent: 0 },
            {
              yPercent: -12,
              ease: 'none',
              scrollTrigger: {
                trigger: layer.closest('.what-tile') as Element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
        });
      });

      // Mobile: tiles alternate sliding in from left/right, once, no parallax.
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.what-tile').forEach((tile, i) => {
          gsap.from(tile, {
            x: i % 2 ? 64 : -64,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: tile, start: 'top 88%', once: true },
          });
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-6 md:px-12 py-20 md:py-28 border-t border-white/5 overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        {/* Header */}
        <div className="what-head space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
            {COPY.microLabel}
          </p>
          <h2 className="font-display font-extrabold uppercase text-3xl md:text-5xl leading-[1] tracking-tight text-white">
            {COPY.headlineLead} <span className="text-lime">{COPY.headlineAccent}</span>
          </h2>
        </div>

        {/* Tiles */}
        <div className="what-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {TILES.map((tile) => (
            <div key={tile.href} className="what-tile will-change-transform">
              <Link
                href={tile.href}
                className="group block rounded-[24px] bg-ink-2 border border-white/10 overflow-hidden h-full transition-[transform,border-color] duration-300 hover:-translate-y-2 hover:border-lime/30"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* Parallax layer is taller than its frame so the y-scrub never exposes edges */}
                  <div className="tile-parallax absolute inset-x-0 top-0 h-full md:h-[115%] will-change-transform">
                    <img
                      src={tile.image.src}
                      alt={tile.image.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 bg-ink/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                    {tile.tag}
                  </span>
                </div>
                <div className="p-7 space-y-4">
                  <h3 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
                    {tile.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">{tile.body}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-lime">
                    {tile.cta}
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
