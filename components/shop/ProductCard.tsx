'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import type { Product } from '@/lib/types';
import { formatAED } from '@/lib/utils';

const conditionLabel: Record<string, string> = {
  new: 'New', 'like-new': 'Like New', good: 'Good', fair: 'Fair',
};

// Underline reveal — enters from the left, exits toward the right (origin swap).
const UNDERLINE =
  'relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:bg-lime ' +
  'after:origin-right after:scale-x-0 group-hover:after:origin-left group-hover:after:scale-x-100 ' +
  'after:[transition:transform_350ms_cubic-bezier(0.65,0,0.35,1)]';

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];
  const hoverImg = product.images?.[1];
  const out = product.quantity <= 0;
  const tiltRef = useRef<HTMLDivElement>(null);

  // Subtle card tilt — fine pointers only, and on its own transform owner (this
  // inner div) so it never fights the catalog's grid-reveal transform, which the
  // outer [data-shop-card] wrapper owns.
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { transformPerspective: 900 });
      const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2.out' });
      const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power2.out' });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        rotY(dx * 10); // ±5deg — subtle, under the bible's ±6 cap
        rotX(-dy * 10);
      };
      const onLeave = () => {
        // overwrite kills the in-flight quickTo tweens; gsap 3.11+ quickTo
        // transparently recreates its tween on the next call.
        gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div
        ref={tiltRef}
        className="bg-ink-2 rounded-[20px] overflow-hidden border border-white/5 group-hover:border-lime/40 transition-colors duration-300"
      >
        <div className="relative aspect-square bg-ink overflow-hidden">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 font-display text-sm tracking-widest">
              COURT HUB
            </div>
          )}
          {img && hoverImg && (
            // Second shot crossfades in on hover, zooming in lockstep with the first.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hoverImg}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-[1.06] [transition-property:opacity,transform] [transition-duration:350ms,700ms] [transition-timing-function:cubic-bezier(0.65,0,0.35,1),cubic-bezier(0.25,1,0.5,1)]"
            />
          )}
          {product.condition && product.condition !== 'new' && (
            <span className="absolute top-3 left-3 bg-court-blue text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
              {conditionLabel[product.condition]}
            </span>
          )}
          {out && (
            <span className="absolute inset-0 bg-ink/70 flex items-center justify-center text-white font-display font-bold tracking-widest">
              SOLD OUT
            </span>
          )}
        </div>
        <div className="p-5 space-y-1">
          {product.brand && (
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/40">{product.brand}</p>
          )}
          <h3 className="font-display font-semibold text-white leading-snug group-hover:text-lime transition-colors">
            <span className={`inline ${UNDERLINE}`}>{product.title}</span>
          </h3>
          <div className="flex items-baseline gap-2 pt-1">
            <span className={`text-lime font-semibold ${UNDERLINE}`}>{formatAED(product.price_aed)}</span>
            {product.compare_at_price && (
              <span className="text-white/30 line-through text-sm">{formatAED(product.compare_at_price)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
