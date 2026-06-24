'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Subpage counterpart of HomeClient's Lenis setup — same luxurious deceleration,
// wired to ScrollTrigger so scrubbed/pinned animations track the smoothed scroll.
// Smooth scroll runs for everyone (the owner wants the buttery feel site-wide).
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Smooth scroll runs for everyone (the owner wants the buttery Lenis feel
    // site-wide, matching the Construct cross-slide); we intentionally do NOT
    // bail under prefers-reduced-motion here.
    const lenis = new Lenis({
      lerp: 0.1, // gentle, not slow — page settles ~150-250ms after the wheel stops
      duration: 1.2, // applies to scrollTo (anchor) animations
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const updateRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    // Smooth-scroll same-page anchors (e.g. the construct hero's "Plan My Build" → #inquiry).
    // Bare '#' placeholders and modified clicks stay native; Lenis already honors the target's
    // scroll-margin-top (scroll-mt-24), so no extra offset here.
    const handleAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement).closest('a');
      const href = anchor?.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return;
      if (!document.getElementById(href.slice(1))) return;
      e.preventDefault();
      lenis.scrollTo(href);
      history.pushState(null, '', href);
    };
    document.documentElement.addEventListener('click', handleAnchorClick);

    return () => {
      document.documentElement.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Every in-group navigation must land at the TOP of the target page. Next's App
  // Router resets the document scrollTop, but Lenis keeps its OWN virtual offset —
  // so without this the visitor lands wherever they were on the previous page
  // (the "I clicked About from the middle of Shop and arrived mid-About" bug).
  // Force Lenis (and the raw window, as a belt-and-suspenders) back to 0 instantly
  // on each pathname change. `force` overrides any in-flight/stopped state.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    // Raw reset too, in case the route swapped before Lenis re-measured.
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}
