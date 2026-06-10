import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowUpRight, Menu, X, ShoppingCart } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Scroll lock when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // 1. Scroll check for layout switch (Hero -> Sidebar)
  useEffect(() => {
    const handleScroll = () => {
      const heroThreshold = window.innerHeight * 3 - 60;
      if (window.scrollY >= heroThreshold) {
        setHasScrolledPastHero(true);
      } else {
        setHasScrolledPastHero(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Scroll Spy for active section highlighting
  useEffect(() => {
    const handleScrollSpy = () => {
      const heroThreshold = window.innerHeight * 3 - 100;
      if (window.scrollY < heroThreshold) {
        setActiveSection('');
        return;
      }

      const sections = ['about', 'shop', 'story', 'construction', 'faq', 'footer'];
      const scrollPos = window.scrollY + window.innerHeight * 0.35; // 35% viewport trigger offset

      let matchedSection = '';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            matchedSection = section;
            break;
          }
        }
      }
      setActiveSection(matchedSection);
    };
    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  return (
    <>
      {/* 1. DESKTOP NAV WRAPPERS (Transitions with AnimatePresence) */}
      <div className="hidden md:block">
        <AnimatePresence mode="wait">
          {!hasScrolledPastHero ? (
            <motion.header
              key="desktop-horizontal"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed top-0 left-0 right-0 z-50 px-12 md:px-16 py-6 md:py-10 pointer-events-auto"
            >
              <nav className="mx-auto flex items-center justify-between">
                {/* Links */}
                <div className="flex items-center gap-10">
                  {['About', 'Shop', 'Our Story', 'Construction', 'FAQ'].map((item) => {
                    const sectionId = item === 'Our Story' ? 'story' : item.toLowerCase();
                    const isActive = activeSection === sectionId;
                    return (
                      <a 
                        key={item} 
                        href={`#${sectionId}`}
                        className={`text-[15px] transition-all duration-300 tracking-tight relative py-1.5 ${
                          isActive 
                            ? 'text-lime font-semibold' 
                            : 'text-white/80 hover:text-white after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-lime/50 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0'
                        }`}
                      >
                        {item}
                        {isActive && (
                          <motion.span 
                            layoutId="activeHorizontalIndicator"
                            className="absolute left-0 right-0 bottom-0 h-[2px] bg-lime rounded-full shadow-[0_0_8px_#C8FF3D]"
                          />
                        )}
                      </a>
                    );
                  })}
                </div>

                {/* Center Logo */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <div className="font-display text-[22px] md:text-[26px] tracking-tight text-white flex items-center select-none">
                    <span className="font-bold uppercase tracking-tight">COURT</span>
                    <span className="font-light uppercase ml-2 opacity-80 tracking-tight">HUB</span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                  {/* Shopping Cart Icon */}
                  <a href="#shop" className="text-white/80 hover:text-lime transition-all duration-300 relative mr-2 hover:scale-110">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1.5 -right-1.5 bg-lime text-ink text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_6px_rgba(200,255,61,0.4)]">
                      2
                    </span>
                  </a>

                  {/* Book Button */}
                  <motion.a
                    href="#construction"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(255,255,255,0.15)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 py-2.5 px-6 border border-white/20 text-white text-[14px] font-medium rounded-full hover:bg-white hover:text-ink transition-all duration-300"
                  >
                    <span>Book Now</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.a>
                </div>
              </nav>
            </motion.header>
          ) : (
            <motion.aside
              key="desktop-vertical"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed top-0 left-0 bottom-0 w-24 bg-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between py-12 items-center z-50 shadow-[5px_0_30px_rgba(0,0,0,0.5)]"
            >
              {/* Vertical Logo Badge */}
              <a href="#" className="font-display text-lg tracking-wider text-white flex flex-col items-center select-none hover:text-lime transition-colors">
                <span className="font-bold">C</span>
                <span className="font-light opacity-80">H</span>
              </a>

              {/* Vertical Links (Rotated via CSS writing-mode) */}
              <div className="flex flex-col gap-10 items-center">
                {['About', 'Shop', 'Our Story', 'Construction', 'FAQ'].map((item) => {
                  const sectionId = item === 'Our Story' ? 'story' : item.toLowerCase();
                  const isActive = activeSection === sectionId;
                  return (
                    <a 
                      key={item} 
                      href={`#${sectionId}`}
                      className={`text-[13px] font-bold tracking-widest uppercase transition-all duration-300 [writing-mode:vertical-lr] rotate-180 relative py-1.5 ${
                        isActive 
                          ? 'text-lime font-black scale-105' 
                          : 'text-white/60 hover:text-white after:absolute after:-right-2 after:top-1/2 after:-translate-y-1/2 after:w-0 after:h-4 after:bg-lime/30 after:rounded-full after:transition-all after:duration-300 hover:after:w-1 hover:after:h-4'
                      }`}
                    >
                      {item}
                      {isActive && (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime shadow-[0_0_8px_#C8FF3D]"
                        />
                      )}
                    </a>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col gap-8 items-center">
                {/* Shopping Cart Icon (No search bar here) */}
                <a href="#shop" className="text-white/60 hover:text-lime transition-all duration-300 relative hover:scale-110">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 bg-lime text-ink text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_6px_rgba(200,255,61,0.4)]">
                    2
                  </span>
                </a>

                {/* Compact Book Now Button */}
                <motion.a
                  href="#construction"
                  whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#0e0e0c" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-lime text-ink rounded-full flex items-center justify-center shadow-lg transition-colors duration-300"
                  title="Book Now"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* 2. MOBILE HEADER (Always top horizontal) */}
      <div className="md:hidden relative z-[9999]">
        <header
          className={`fixed top-0 left-0 right-0 z-50 px-6 py-5 transition-all duration-300 ${
            hasScrolledPastHero 
              ? 'bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg' 
              : 'bg-transparent'
          }`}
        >
          <nav className="relative z-50 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 hover:text-lime transition-colors cursor-pointer"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo (Centered absolutely) */}
            <div className="absolute left-1/2 -translate-x-1/2 font-display text-[20px] tracking-tight text-white flex items-center select-none">
              <span className="font-bold uppercase tracking-tight">COURT</span>
              <span className="font-light uppercase ml-1 opacity-80 tracking-tight">HUB</span>
            </div>

            {/* Cart Icon (Aligned to the right, book button deleted) */}
            <div className="flex items-center p-2">
              <a href="#shop" className="text-white/80 hover:text-lime transition-colors relative hover:scale-110 block">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-lime text-ink text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_6px_rgba(200,255,61,0.4)]">
                  2
                </span>
              </a>
            </div>
          </nav>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="fixed inset-0 z-40 bg-black pt-28 pb-10 px-8 overflow-y-auto flex flex-col justify-between"
            >
              <div className="flex flex-col gap-6">
                {['About', 'Shop', 'Our Story', 'Construction', 'FAQ'].map((item) => {
                  const sectionId = item === 'Our Story' ? 'story' : item.toLowerCase();
                  const isActive = activeSection === sectionId;
                  return (
                    <a 
                      key={item} 
                      href={`#${sectionId}`}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-2xl font-display font-medium transition-colors ${
                        isActive ? 'text-lime font-bold' : 'text-white/80'
                      }`}
                    >
                      {item}
                    </a>
                  );
                })}
                {/* Cart Icon inside Mobile Menu */}
                <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-4">
                  <a href="#shop" onClick={() => setIsMenuOpen(false)} className="text-white/80 hover:text-lime flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6" />
                    <span className="text-white text-base font-semibold">Your Cart (2 items)</span>
                  </a>

                  {/* Book Now Button inside Mobile Menu */}
                  <div className="mt-4">
                    <motion.a
                      href="#construction"
                      onClick={() => setIsMenuOpen(false)}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 bg-lime text-ink rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-all duration-300"
                    >
                      <span>Book a Court</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>
              </div>

              {/* Bottom Logo inside Hamburger Menu */}
              <div className="mt-12 pt-8 flex flex-col items-center justify-center select-none border-t border-white/5">
                <div className="font-display text-[22px] tracking-tight flex items-center">
                  <span className="font-bold uppercase tracking-tight text-lime">COURT</span>
                  <span className="font-light uppercase ml-2 tracking-tight text-white">HUB</span>
                </div>
                <span className="mt-2 text-[9px] font-mono tracking-[0.25em] text-white/20 uppercase">
                  Premium Padel Experience
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
