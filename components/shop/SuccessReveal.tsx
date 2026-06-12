'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Entrance choreography for the order-success page: the check badge pops in
 * (back.out — the one sanctioned springy ease), then the copy and summary rise.
 * Server markup tags targets with data-success-pop / data-success-line /
 * data-success-rise; with reduced motion everything renders statically.
 */
export default function SuccessReveal({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('[data-success-pop]', { scale: 0, duration: 0.5, ease: 'back.out(1.4)' }, 0)
          .from('[data-success-line]', { yPercent: 110, duration: 1.0, ease: 'power4.out' }, 0.15);
        if (root.querySelector('[data-success-rise]')) {
          tl.from(
            '[data-success-rise]',
            { y: 24, opacity: 0, duration: 0.8, stagger: 0.09 },
            0.35
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
