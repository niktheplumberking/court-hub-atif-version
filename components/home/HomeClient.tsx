'use client';
import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';

import Header from './Header';
import Hero from './Hero';
import AboutSection from './AboutSection';
import ShopSection from './ShopSection';
import StoryConstructionWrapper from './StoryConstructionWrapper';
import FAQSection from './FAQSection';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [heroProgress, setHeroProgress] = useState(0);
  const [constructionProgress, setConstructionProgress] = useState(0);

  const totalProgress = Math.round((heroProgress + constructionProgress) / 2);
  const isLoaded = heroProgress === 100 && constructionProgress === 100;

  // Lock scroll while preloading
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoaded]);

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
      {/* Elegant Unified Preloader Screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center px-6 touch-none"
          >
            <div className="text-center space-y-6 max-w-md w-full">
              <motion.h2 
                animate={{ opacity: [0.5, 1, 0.5] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white text-2xl md:text-4xl font-display font-semibold tracking-[0.15em] uppercase"
              >
                Court Hub
              </motion.h2>
              <p className="text-white/40 text-[10px] md:text-sm font-mono tracking-widest uppercase">
                Loading High-Res 3D Models...
              </p>
              
              {/* Progress Bar Container */}
              <div className="relative w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-lime transition-all duration-300 ease-out shadow-[0_0_10px_#C8FF3D]"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
              
              {/* Percentage Indicator */}
              <div className="text-lime font-mono text-sm md:text-base font-semibold">
                {totalProgress}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header />
      <Hero isLoaded={isLoaded} onProgress={setHeroProgress} />
      {/* Blanket wrapper that slides up over the fixed Hero section */}
      <div className="relative z-20 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] bg-court-blue -mt-[100vh] md:pl-24">
        <AboutSection />
        <ShopSection />
        <StoryConstructionWrapper isLoaded={isLoaded} onProgress={setConstructionProgress} />
        <FAQSection />
        <Footer />
      </div>
    </main>
  );
}

