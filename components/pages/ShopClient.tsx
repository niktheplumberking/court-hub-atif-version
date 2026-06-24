'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import {
  Heart,
  SlidersHorizontal,
  ShoppingBag,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Footer from '@/components/home/Footer';
import { useMouseParallax } from '@/components/shared/useMouseParallax';
import { PRODUCTS } from '@/components/shop/placeholder-products';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/components/shop/placeholder-products';

const MotionLink = motion.create(Link);

export default function ShopClient() {
  const { x: parallaxX, y: parallaxY } = useMouseParallax(26);
  const { add, count, openDrawer } = useCart();
  const [activeBrand, setActiveBrand] = useState<'ALL' | 'STEALTH' | 'HEAD' | 'Wilson'>('ALL');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'rackets' | 'used' | 'accessories'>('ALL');

  const [favorites, setFavorites] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [flyers, setFlyers] = useState<{ id: number; x: number; y: number; p: Product }[]>([]);

  const blanketRef = useRef<HTMLDivElement>(null);

  // Hydrate favorites from localStorage (SSR-guarded)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const cached = localStorage.getItem('courthub_favorites');
      if (cached) setFavorites(JSON.parse(cached));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('courthub_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleAdd = (p: Product, e: React.MouseEvent) => {
    const id = Date.now() + Math.random();
    setFlyers(prev => [...prev, { id, x: e.clientX, y: e.clientY, p }]);
    showToast(`Added ${p.name} to your bag!`);
    // Drive the cart from a deterministic timer — NOT the flyer's onAnimationComplete,
    // which Framer can pre-empt when an intervening re-render restarts the opacity
    // keyframe (the callback then never fires). After the ~0.7s flight: add the item
    // (FAB count ticks up), remove the flyer, then slide the drawer in.
    window.setTimeout(() => {
      add({ id: p.id, slug: p.id, title: p.name, price_aed: p.price, image: p.image, max_qty: 99 }, 1);
      setFlyers(prev => prev.filter(f => f.id !== id));
      window.setTimeout(() => openDrawer(), 260);
    }, 700);
  };

  const filteredProducts = PRODUCTS.filter(prod => {
    const matchesBrand = activeBrand === 'ALL' || prod.brand === activeBrand;
    const matchesCategory = activeCategory === 'ALL' || prod.category === activeCategory;
    return matchesBrand && matchesCategory;
  });

  return (
    <div className="bg-ink min-h-screen text-white selection:bg-lime/30">
      {/* Dynamic Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-lime text-ink px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-semibold text-xs tracking-wider uppercase border border-white/10"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying-number add-to-cart layer */}
      <div className="fixed inset-0 pointer-events-none z-[90]">
        {flyers.map((flyer) => {
          const fab = document.getElementById('cart-fab')?.getBoundingClientRect();
          const targetX = fab ? fab.left + fab.width / 2 : window.innerWidth - 44;
          const targetY = fab ? fab.top + fab.height / 2 : window.innerHeight - 44;
          return (
            <motion.div
              key={flyer.id}
              style={{ position: 'fixed', left: flyer.x, top: flyer.y, zIndex: 90 }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: targetX - flyer.x, y: targetY - flyer.y, scale: 0.4, opacity: [1, 1, 0] }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-9 h-9 -ml-4 -mt-4 rounded-full bg-lime text-ink font-mono font-bold flex items-center justify-center shadow-lg pointer-events-none"
            >
              {count + 1}
            </motion.div>
          );
        })}
      </div>

      <main className="">

        {/* ================= SECTION 1: RECREATED "COURT HUB" MOCK-UP HERO ================= */}
        <div className="fixed top-0 left-0 w-full h-screen min-h-[620px] sm:min-h-[720px] md:min-h-[820px] z-0 pointer-events-auto">
          <section className="relative h-full w-full p-3 sm:p-5 md:p-6 lg:p-8 bg-ink overflow-hidden text-center flex items-center justify-center">

          {/* Edge-to-Edge full screen background cinematic video / image fallback */}
          <motion.div
            style={{ x: parallaxX, y: parallaxY }}
            className="absolute inset-[-4%] z-0 select-none pointer-events-none overflow-hidden scale-105 origin-center"
          >
            <img
              src="/assets/images/court_action_landscape_1779705580138.png"
              alt=""
              aria-hidden
              className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.15] saturate-[1.15]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-transparent to-ink/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,90,232,0.2)_0%,transparent_80%)]" />
          </motion.div>

          <div className="w-full h-full max-w-[1720px] mx-auto relative z-10 flex flex-col">
            {/* The Outer Frame simulating the premium mockup panel - thin polished rounded border exactly like reference */}
            <div
              style={{ contentVisibility: 'auto' }}
              className="w-full h-full border-2 md:border-[3px] border-white/60 rounded-[28px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden relative shadow-[0_32px_120px_rgba(0,0,0,0.7)] bg-black/15 backdrop-blur-[1.5px] flex flex-col justify-between p-4 sm:p-8 md:p-10 lg:p-12"
            >

              {/* Left Floating Swipe Chevron - Confined inside white borders */}
              <MotionLink
                href="/construct-your-court"
                whileHover={{ scale: 1.15, backgroundColor: "#C8FF3D", color: "#0E0E0C" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 md:w-11 md:h-11 rounded-full border border-white/25 bg-black/50 text-white flex items-center justify-center backdrop-blur-md transition-shadow shadow-[0_4px_24px_rgba(0,0,0,0.6)] group shrink-0"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-0.5 transition-transform" />
              </MotionLink>

              {/* Right Floating Swipe Chevron - Confined inside white borders */}
              <MotionLink
                href="/contact"
                whileHover={{ scale: 1.15, backgroundColor: "#C8FF3D", color: "#0E0E0C" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 md:w-11 md:h-11 rounded-full border border-white/25 bg-black/50 text-white flex items-center justify-center backdrop-blur-md transition-shadow shadow-[0_4px_24px_rgba(0,0,0,0.6)] group shrink-0"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
              </MotionLink>

              {/* 3. Centered Title Blocks: "EQUIPMENT", "PRO SHELF" with organic, breath-like floating motions */}
              <div className="relative my-auto py-6 md:py-10 flex flex-col items-center justify-center min-h-[240px] md:min-h-[300px] z-10 select-none">
                {/* Text Row 1 */}
                <motion.div
                  animate={{ y: [0, -6, 0], x: [0, 1.5, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full flex justify-center"
                >
                  <motion.h1
                    initial={{ y: -35, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display font-black text-white text-center text-4xl sm:text-[68px] md:text-[88px] lg:text-[108px] xl:text-[124px] leading-[0.85] tracking-tighter uppercase select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                  >
                    EQUIPMENT
                  </motion.h1>
                </motion.div>

                {/* Text Row 2 */}
                <motion.div
                  animate={{ y: [0, 6, 0], x: [0, -1.5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  className="w-full flex justify-center mt-1 sm:mt-2"
                >
                  <motion.h1
                    initial={{ y: 35, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                    className="font-display font-black text-white text-center text-4xl sm:text-[68px] md:text-[88px] lg:text-[108px] xl:text-[124px] leading-[0.85] tracking-tighter uppercase select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
                  >
                    PRO SHELF
                  </motion.h1>
                </motion.div>
              </div>

              {/* 4. Glass Framed Bottom Row: Actions + Communities rating badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative z-30 w-full flex flex-col lg:flex-row justify-between items-end gap-6 border-t border-white/10 pt-4 mt-4"
              >

                {/* Left Bottom Block - Piles */}
                <div className="space-y-4 max-w-md text-left w-full lg:w-auto">
                  <p className="text-white/80 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-md">
                    Authorized drops from Stealth, HEAD, and official custom-pressurized tournament kits. Filter products and build your match tier setup below.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Pulsating Attention CTA Button wrapper */}
                    <div className="relative inline-flex group">
                      {/* Dynamic Sonar Shockwave */}
                      <motion.span
                        animate={{
                          scale: [1, 1.35, 1],
                          opacity: [0.45, 0, 0.45]
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-[#C8FF3D] rounded-full blur-md -z-10"
                      />
                      <motion.div
                        animate={{
                          rotate: [0, 1.2, -1.2, 0.8, -0.8, 0],
                          scale: [1, 1.025, 0.985, 1.025, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatDelay: 3.5,
                          ease: "easeInOut"
                        }}
                      >
                        <a
                          href="#catalog"
                          className="px-6 py-3 bg-[#C8FF3D] hover:bg-white text-ink font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md cursor-pointer block relative z-10"
                        >
                          Browse Shelf
                        </a>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Right Bottom Block - Spec details mimicking about stats */}
                <div className="max-w-xs space-y-2 text-left flex flex-col items-start lg:items-end w-full lg:w-auto">
                  <span className="font-mono text-[10px] text-lime uppercase tracking-widest font-black py-1 px-2.5 bg-lime/10 border border-lime/20 rounded">
                    STEALTH PRO DROP
                  </span>
                  <p className="font-display text-lg font-bold italic uppercase tracking-tight text-white leading-none mt-1 lg:text-right">
                    OFFICIAL TOUR DROPS
                  </p>
                  <p className="text-white/60 text-[11px] font-mono lg:text-right">High response carbon weave cores.</p>
                </div>

              </motion.div>

            </div>
          </div>
        </section>
        </div>

        {/* Spacer to allow scrolling past the fixed background hero */}
        <div className="relative w-full h-screen min-h-[620px] sm:min-h-[720px] md:min-h-[820px] pointer-events-none z-0" />

        {/* ================= BLANKET OVERLAY CONTENT ================= */}
        <div ref={blanketRef} className="relative z-10 md:pl-24 bg-sand text-ink shadow-[0_-24px_50px_rgba(0,0,0,0.15)] border-t border-sand-2">
          {/* Fine spacing grid pattern for balanced quadrants and elegant reduced opacity (0.04) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,13,24,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,13,24,0.035)_1px,transparent_1px)] bg-[size:5.0rem_5.0rem] pointer-events-none" />

          {/* Catalog container */}
          <div id="catalog" className="max-w-7xl mx-auto py-16 sm:py-20 px-6 md:px-8 space-y-12 sm:space-y-16 relative z-10">

            {/* Collection Header Block aligned with reference image layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pb-8 border-b border-ink/10">
              <div className="md:col-span-7 text-left space-y-3">
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-ink/65 font-bold block">
                  COLLECTION
                </span>
                <h2 className="text-4.5xl sm:text-5xl lg:text-6xl font-display font-black leading-[0.9] tracking-tighter uppercase text-ink">
                  DOMINATE THE GAME WITH <br className="hidden sm:inline" />
                  <span className="text-court-blue">TOP PADEL GEAR</span>
                </h2>
              </div>

              <div className="md:col-span-5 text-left md:text-right">
                <p className="text-ink/80 text-[11px] sm:text-xs leading-relaxed max-w-sm md:ml-auto font-mono uppercase tracking-wider font-semibold">
                  DOMINATE THE GAME WITH TOP PADEL GEAR DESIGNED FOR UNMATCHED PERFORMANCE, CONTROL, POWER, AND WINNING PRECISION.
                </p>
              </div>
            </div>

            {/* Sleek Custom-molded Filter Toolbar (Sleek Dark capsule on cream backdrop) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-ink p-3 md:p-4 rounded-[28px] md:rounded-full border border-white/10 shadow-xl relative z-10 text-white">
              {/* Brand Filter Row */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.03] rounded-full">
                {(['ALL', 'STEALTH', 'HEAD', 'Wilson'] as const).map(brand => {
                  const isActive = activeBrand === brand;
                  return (
                    <button
                      key={brand}
                      onClick={() => setActiveBrand(brand)}
                      className={`relative px-5 py-2.5 rounded-full text-[10px] sm:text-[11px] font-mono uppercase tracking-widest transition-all duration-300 outline-none cursor-pointer select-none font-bold ${
                        isActive ? 'text-ink' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeBrandFilter"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className="absolute inset-0 bg-lime rounded-full -z-10"
                        />
                      )}
                      {brand}
                    </button>
                  );
                })}
              </div>

              {/* Category Filter Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto justify-end">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-white/40 shrink-0" />
                  <div className="flex gap-1 bg-white/[0.03] p-1 rounded-full border border-white/5 relative">
                    {[
                      { id: 'ALL', label: 'All Items' },
                      { id: 'rackets', label: 'Pro Rackets' },
                      { id: 'used', label: 'Pre-Owned' },
                      { id: 'accessories', label: 'Gear & Balls' }
                    ].map(cat => {
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id as any)}
                          className={`relative px-4 py-2 rounded-full text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-colors duration-300 outline-none cursor-pointer select-none font-bold ${
                            isActive ? 'text-white bg-white/15' : 'text-white/45 hover:text-white/75'
                          }`}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="activeCategoryFilter"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              className="absolute inset-0 bg-white/10 rounded-full -z-10"
                            />
                          )}
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid - Expanded up to 4 columns on large screens for space */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeBrand}-${activeCategory}`}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.06 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
              >
                {filteredProducts.map((prod) => {
                  const isFav = favorites.includes(prod.id);
                  return (
                    <motion.div
                      key={prod.id}
                      className="group bg-white rounded-[20px] p-5 border border-ink/5 hover:border-ink/15 hover:shadow-[0_16px_48px_rgba(10,13,24,0.06)] flex flex-col justify-between transition-all duration-500 relative overflow-hidden text-left"
                    >
                      <div className="relative z-10 space-y-4">
                        {/* Soft premium grey-beige backplate for product photo */}
                        <div className="relative w-full aspect-[4/3] rounded-[12px] bg-[#F5F4F0] overflow-hidden border border-ink/5">
                          <Link href={`/shop/${prod.id}`} className="block w-full h-full cursor-pointer">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-700 select-none"
                              referrerPolicy="no-referrer"
                            />
                          </Link>

                          {/* Left Stacked badges like user screenshot */}
                          <div className="absolute top-4 left-4 flex flex-col gap-1 items-start pointer-events-none">
                            <span className="bg-[#5D38A2] text-white text-[9px] font-mono font-black tracking-widest px-2.5 py-1 rounded-sm uppercase leading-none">
                              BEST SELLER
                            </span>
                            {prod.brand === 'STEALTH' && (
                              <span className="bg-[#E84525] text-white text-[9px] font-mono font-black tracking-widest px-2.5 py-1 rounded-sm uppercase leading-none">
                                10% OFF
                              </span>
                            )}
                            {prod.category === 'used' && (
                              <span className="bg-[#E84525] text-white text-[9px] font-mono font-black tracking-widest px-2.5 py-1 rounded-sm uppercase leading-none">
                                15% OFF
                              </span>
                            )}
                          </div>

                          {/* Heart Icon Toggle */}
                          <button
                            onClick={() => toggleFavorite(prod.id)}
                            className="absolute top-4 right-4 p-2 bg-white hover:bg-ink text-ink hover:text-white rounded-full transition-all cursor-pointer border border-ink/5 flex items-center justify-center shadow-sm"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-fire fill-[#E84525]' : 'text-ink/40 group-hover:text-ink'}`} />
                          </button>
                        </div>

                        {/* Meta section: Brand and Stock status */}
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.15em] font-bold text-ink/50">
                          <span>{prod.brand}</span>
                          <span className="flex items-center gap-1 text-ink/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                            IN STOCK
                          </span>
                        </div>

                        {/* Title & brief description */}
                        <div className="space-y-1">
                          <Link href={`/shop/${prod.id}`} className="block group/title">
                            <h3 className="text-base font-display font-black leading-tight text-ink uppercase tracking-tight group-hover/title:text-[#1E5AE8] transition-colors line-clamp-1">
                              {prod.name}
                            </h3>
                          </Link>
                          <p className="text-ink/60 text-xs leading-relaxed line-clamp-2 min-h-[32px]">
                            {prod.desc}
                          </p>
                        </div>
                      </div>

                      {/* Bottom row: Price and Add To Bag Button */}
                      <div className="relative z-10 pt-4 border-t border-ink/5 mt-4 flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          {prod.originalPrice ? (
                            <span className="text-ink/30 text-[10px] font-mono line-through leading-none">AED {prod.originalPrice}</span>
                          ) : (
                            <span className="text-ink/30 text-[10px] font-mono leading-none">AED {Math.round(prod.price * 1.15)}</span>
                          )}
                          <span className="text-lg font-display font-black text-ink">AED {prod.price}</span>
                        </div>

                        <button
                          onClick={(e) => handleAdd(prod, e)}
                          className="px-4.5 py-2.5 bg-ink text-white hover:bg-lime hover:text-ink rounded-full font-bold uppercase text-[9px] tracking-widest transition-all cursor-pointer flex items-center gap-1.5 hover:-translate-y-0.5 shadow-md shadow-black/5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                          <span>Add to bag</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer inside its own distinct contrast block */}
          <div className="bg-ink text-white relative z-10">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
