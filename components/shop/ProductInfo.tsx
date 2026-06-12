'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import AddToCart from './AddToCart';
import { formatAED } from '@/lib/utils';
import type { Product } from '@/lib/types';

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  lowStock: (n: number) => `Only ${n} left in stock`,
  uniqueNote: "Unique item — only one available. When it's gone, it's gone.",
} as const;
// ─── End placeholder copy ───

/** Splits the product title into per-word overflow-hidden masks for the line-rise. */
function MaskedWords({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top pb-[0.12em] -mb-[0.12em]">
          <span data-pi-word className="inline-block will-change-transform">
            {word}
            {i < words.length - 1 ? ' ' /* non-breaking — a plain space would collapse inside the mask */ : ''}
          </span>
        </span>
      ))}
    </>
  );
}

/**
 * Animated right column of the product page: title word-rise, price ticker,
 * staggered spec rows and the AddToCart block. Commerce logic stays inside
 * AddToCart — this component is presentation only.
 */
export default function ProductInfo({ product, sold }: { product: Product; sold: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const specEntries = Object.entries(product.specs ?? {}).filter(([, v]) => v);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        const has = (sel: string) => root.querySelector(sel) !== null;

        if (has('[data-pi-brand]')) tl.from('[data-pi-brand]', { y: 12, opacity: 0, duration: 0.5 }, 0);
        tl.from('[data-pi-word]', { yPercent: 115, duration: 0.9, ease: 'power4.out', stagger: 0.05 }, 0.05);
        tl.from('[data-pi-meta]', { y: 10, opacity: 0, duration: 0.5 }, 0.4);
        tl.from('[data-pi-price]', { y: 14, opacity: 0, duration: 0.5 }, 0.45);
        if (has('[data-pi-desc]')) tl.from('[data-pi-desc]', { y: 18, opacity: 0, duration: 0.7 }, 0.55);
        if (has('[data-pi-spec]'))
          tl.from('[data-pi-spec]', { y: 14, opacity: 0, duration: 0.6, stagger: 0.06 }, 0.65);
        tl.from('[data-pi-cta]', { y: 16, opacity: 0, duration: 0.6 }, 0.75);
        if (has('[data-pi-note]')) tl.from('[data-pi-note]', { opacity: 0, duration: 0.5 }, 0.9);

        // Price ticker — counts up once, fast. The element is opacity-0 until
        // ~0.45s so the reset to AED 0 never visibly flashes.
        const priceEl = root.querySelector<HTMLElement>('[data-pi-price-value]');
        if (priceEl) {
          const counter = { v: 0 };
          priceEl.textContent = formatAED(0);
          gsap.to(counter, {
            v: product.price_aed,
            duration: 0.8,
            delay: 0.45,
            ease: 'power3.out',
            snap: { v: 1 },
            onUpdate: () => {
              priceEl.textContent = formatAED(counter.v);
            },
            onComplete: () => {
              priceEl.textContent = formatAED(product.price_aed);
            },
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, [product.price_aed]);

  return (
    <div ref={rootRef} className="space-y-6">
      <div>
        {product.brand && (
          <p data-pi-brand className="text-lime text-xs tracking-[0.3em] uppercase mb-2">{product.brand}</p>
        )}
        <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white leading-tight">
          <MaskedWords text={product.title} />
        </h1>
        <p data-pi-meta className="text-white/40 text-sm mt-2">
          {product.categories?.name}
          {product.condition ? ` · Condition: ${product.condition.replace('-', ' ')}` : ''}
        </p>
      </div>
      <div data-pi-price className="flex items-baseline gap-3">
        <span data-pi-price-value className="text-3xl font-display font-bold text-lime">
          {formatAED(product.price_aed)}
        </span>
        {product.compare_at_price && (
          <span className="text-white/30 line-through">{formatAED(product.compare_at_price)}</span>
        )}
      </div>
      {product.description && (
        <p data-pi-desc className="text-white/60 leading-relaxed whitespace-pre-line">{product.description}</p>
      )}
      {specEntries.length > 0 && (
        <div className="bg-ink-2 rounded-[20px] p-6 grid grid-cols-2 gap-4 border border-white/5">
          {specEntries.map(([k, v]) => (
            <div key={k} data-pi-spec>
              <p className="text-white/30 text-[11px] uppercase tracking-wider">{k.replace(/_/g, ' ')}</p>
              <p className="text-white font-medium">{v}</p>
            </div>
          ))}
        </div>
      )}
      <div data-pi-cta>
        <AddToCart product={product} />
      </div>
      {!product.is_unique && product.quantity > 0 && product.quantity <= 5 && (
        <p data-pi-note className="text-fire text-sm">{COPY.lowStock(product.quantity)}</p>
      )}
      {product.is_unique && !sold && (
        <p data-pi-note className="text-white/40 text-sm">{COPY.uniqueNote}</p>
      )}
    </div>
  );
}
