import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ShopSection from './components/ShopSection';
import ConstructionSection from './components/ConstructionSection';
import TournamentSection from './components/TournamentSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll with luxurious deceleration and responsive multipliers
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6, // Enhanced finger-touch scrolling responsiveness
    });

    // Connect Lenis scroll event to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Connect GSAP ticker to Lenis requestAnimationFrame
    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    // Intercept anchor clicks for smooth scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId) {
          lenis.scrollTo(targetId);
        }
      }
    };
    document.documentElement.addEventListener('click', handleAnchorClick);

    // Synchronize body overflow state with Lenis (pauses smooth scrolling when overflow is hidden)
    const checkOverflow = () => {
      if (document.body.style.overflow === 'hidden') {
        lenis.stop();
      } else {
        lenis.start();
      }
    };
    checkOverflow();

    const observer = new MutationObserver(checkOverflow);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateRaf);
      document.documentElement.removeEventListener('click', handleAnchorClick);
      observer.disconnect();
    };
  }, []);

  return (
    <main className="relative min-h-screen">
      <Header />
      <Hero />
      {/* Blanket wrapper that slides up over the fixed Hero section */}
      <div className="relative z-20 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] bg-court-blue -mt-[100vh] md:pl-24">
        <AboutSection />
        <ShopSection />
        <ConstructionSection />
        <TournamentSection />
        <FAQSection />
        <Footer />
      </div>
    </main>
  );
}

