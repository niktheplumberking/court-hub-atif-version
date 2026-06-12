'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from './ProductCard';
import type { Category, Product } from '@/lib/types';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  kicker: 'The Shop',
  headlineLead: 'Gear Up.',
  headlineAccent: 'Game On.',
  countSingular: 'item',
  countPlural: 'items',
  emptyBody: 'No products here yet — check back soon.',
  emptyCta: 'VIEW ALL GEAR',
} as const;
// ─── End placeholder copy ───

/**
 * Client shell for the /shop catalog: headline line-rise, pill slide-in,
 * batched grid reveals that reverse on scroll-up, result count and a styled
 * empty state. The server page keys this component by the active category so
 * a filter change remounts it and the choreography replays cleanly.
 */
export default function ShopCatalog({
  categories,
  products,
  activeCategory,
}: {
  categories: Category[];
  products: Product[];
  activeCategory?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // All motion lives inside the reduced-motion guard — initial hidden
      // states are gsap.set, never CSS, so reduced-motion users see a static page.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-shop-kicker]', { y: 12, opacity: 0, duration: 0.6, ease: 'power3.out' });
        gsap.from('[data-shop-line]', {
          yPercent: 110,
          duration: 1.0,
          ease: 'power4.out',
          stagger: 0.09,
          delay: 0.05,
        });
        gsap.from('[data-shop-pill]', {
          x: -18,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.045,
          delay: 0.2,
        });
        gsap.from('[data-shop-count]', { opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.55 });

        const cards = gsap.utils.toArray<HTMLElement>('[data-shop-card]');
        if (cards.length) {
          gsap.set(cards, { y: 28, opacity: 0 });
          ScrollTrigger.batch(cards, {
            start: 'top 88%',
            batchMax: 8, // 7 × 0.08 keeps the stagger spread under the 0.6s cap
            onEnter: (batch) =>
              gsap.to(batch, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.08,
                overwrite: true,
              }),
            // Entrances reverse on scroll-up — the user stays in control.
            onLeaveBack: (batch) =>
              gsap.to(batch, { y: 28, opacity: 0, duration: 0.4, ease: 'power3.out', overwrite: true }),
          });
        }

        if (root.querySelector('[data-shop-empty]')) {
          gsap.from('[data-shop-empty]', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.25 });
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const count = products.length;

  return (
    <div ref={rootRef}>
      <header className="px-6 md:px-12 pt-16 pb-10">
        <p data-shop-kicker className="text-lime text-xs tracking-[0.3em] uppercase mb-3">
          {COPY.kicker}
        </p>
        <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white">
          <span className="inline-block overflow-hidden align-top pb-[0.12em] -mb-[0.12em]">
            <span data-shop-line className="inline-block will-change-transform">
              {COPY.headlineLead}
              {' ' /* non-breaking — a plain space would collapse inside the mask */}
            </span>
          </span>
          <span className="inline-block overflow-hidden align-top pb-[0.12em] -mb-[0.12em]">
            <span data-shop-line className="inline-block text-lime will-change-transform">
              {COPY.headlineAccent}
            </span>
          </span>
        </h1>
      </header>

      <div className="px-6 md:px-12 flex flex-wrap items-center gap-3 pb-10">
        <Link
          data-shop-pill
          href="/shop"
          className={`px-5 py-2 rounded-full text-sm font-medium transition-[color,background-color,border-color,transform] duration-200 active:scale-95 ${!activeCategory ? 'bg-lime text-ink' : 'bg-ink-2 text-white/70 hover:text-white border border-white/10 hover:border-white/30'}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            data-shop-pill
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-[color,background-color,border-color,transform] duration-200 active:scale-95 ${activeCategory === c.slug ? 'bg-lime text-ink' : 'bg-ink-2 text-white/70 hover:text-white border border-white/10 hover:border-white/30'}`}
          >
            {c.name}
          </Link>
        ))}
        <span
          data-shop-count
          className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-white/30"
        >
          {count} {count === 1 ? COPY.countSingular : COPY.countPlural}
        </span>
      </div>

      {count > 0 ? (
        <section className="px-6 md:px-12 pb-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <div key={p.id} data-shop-card>
              <ProductCard product={p} />
            </div>
          ))}
        </section>
      ) : (
        <section className="px-6 md:px-12 pb-24">
          <div
            data-shop-empty
            className="bg-ink-2 rounded-[20px] border border-white/5 px-8 py-20 text-center space-y-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              0 {COPY.countPlural}
            </p>
            <p className="text-white/40">{COPY.emptyBody}</p>
            <Link
              href="/shop"
              className="inline-block px-8 py-4 rounded-full bg-lime text-ink font-bold tracking-wide hover:brightness-110 active:scale-95 transition-[filter,transform] duration-200"
            >
              {COPY.emptyCta}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
