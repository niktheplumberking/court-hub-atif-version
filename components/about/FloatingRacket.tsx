'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * The "soul piece": a scroll-scrubbed racket that drifts down the page between
 * the hero and the values section, tumbling on rotation + rotationX/rotationY
 * with a transform perspective so it reads like a slowly spinning 3D model.
 *
 * Mount it as the FIRST child of a `relative` wrapper that spans the sections
 * it should drift across; the sections themselves follow in a `relative` div
 * so they paint above it. Decorative only — hidden below lg and from a11y tree.
 */
export default function FloatingRacket() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const racketRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const racket = racketRef.current;
    if (!wrap || !racket) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia(wrap);

      // Desktop-only showpiece; under reduced motion the racket simply sits
      // static in its authored top-right position.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(racket, {
          transformPerspective: 900,
          rotation: -18,
          rotationX: 10,
          rotationY: -25,
        });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: 'bottom 75%',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        // Two-beat tumble: swing left across the hero seam, then settle back
        // toward center as it sinks behind the values cards.
        tl.to(racket, {
          y: () => wrap.offsetHeight * 0.4,
          x: () => -wrap.offsetWidth * 0.3,
          rotation: 140,
          rotationX: -16,
          rotationY: -150,
          duration: 1,
        }).to(racket, {
          y: () => wrap.offsetHeight * 0.72,
          x: () => -wrap.offsetWidth * 0.06,
          rotation: 312,
          rotationX: 12,
          rotationY: -330,
          duration: 1,
        });
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden lg:block overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={racketRef}
        src="/images/racket_lime_nobg.webp"
        alt=""
        className="absolute top-[6%] right-[7%] w-60 xl:w-72 opacity-90 will-change-transform [filter:drop-shadow(0_45px_45px_rgba(0,0,0,0.55))]"
      />
    </div>
  );
}
