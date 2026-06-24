'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Wifi,
  Battery,
  Plus,
  Package
} from 'lucide-react';
import Footer from '@/components/home/Footer';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { useMouseParallax } from '@/components/shared/useMouseParallax';

const MotionLink = motion.create(Link);

export interface ProductSlotConfig {
  id: string;
  slotNumber: string;
  defaultTitle: string;
  isEmpty: boolean; // Keep true as requested to show premium empty layouts
  title?: string;
  price?: string;
  badge?: string;
  stockStatus?: string;
  description?: string;
  accentColor?: string;
}

export const FEATURED_PRODUCTS_SLOTS: ProductSlotConfig[] = [
  {
    id: "slot-1",
    slotNumber: "01",
    defaultTitle: "AERO-PROPEL PADEL RACKET",
    isEmpty: true,
    title: "Aero-Propel Padel Racket",
    price: "AED 1,200",
    badge: "BEST SELLER",
    stockStatus: "84 IN STOCK",
    description: "Laser-balanced aerospace carbon framework",
    accentColor: "from-[#E84525] to-[#0A0D18]"
  },
  {
    id: "slot-2",
    slotNumber: "02",
    defaultTitle: "COURT-SPEED TURF PROS",
    isEmpty: true,
    title: "Court-Speed Turf Pros",
    price: "AED 640",
    badge: "BEST SELLER",
    stockStatus: "120 IN STOCK",
    description: "Sub-millimeter response traction thread",
    accentColor: "from-[#1E5AE8] to-[#0A0D18]"
  },
  {
    id: "slot-3",
    slotNumber: "03",
    defaultTitle: "HYPER-FLAT DUBAI SPECIAL BALLS",
    isEmpty: true,
    title: "Dubai Special 3-Pack Balls",
    price: "AED 95",
    badge: "BEST SELLER",
    stockStatus: "500+ IN STOCK",
    description: "Consistent pressurized bounce core for hot desert play",
    accentColor: "from-[#C8FF3D] to-[#0A0D18]"
  },
  {
    id: "slot-4",
    slotNumber: "04",
    defaultTitle: "STEALTH SPORTS BAG XL",
    isEmpty: true,
    title: "Stealth Sports Bag XL",
    price: "AED 450",
    badge: "BEST SELLER",
    stockStatus: "65 IN STOCK",
    description: "Insulated dust-protected padel gear chamber",
    accentColor: "from-[#E84525] to-[#0A0D18]"
  },
  {
    id: "slot-5",
    slotNumber: "05",
    defaultTitle: "SUPER-GRIP OVERGRIP 10X",
    isEmpty: true,
    title: "Super-Grip Overgrip 10x",
    price: "AED 110",
    badge: "BEST SELLER",
    stockStatus: "200 IN STOCK",
    description: "Ultra-absorbent high tack polyurethane wrap",
    accentColor: "from-[#C8FF3D] to-[#0A0D18]"
  }
];

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
  title: string;
  statusTheme?: 'light' | 'dark';
  key?: any;
}

function PhoneMockup({ children, className = "", style = {}, title, statusTheme = 'dark' }: PhoneMockupProps) {
  const isDarkStatusBar = statusTheme === 'dark';
  return (
    <motion.div
      style={style}
      whileHover={{ scale: 1.12, rotate: 0, y: -15, zIndex: 100 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={`relative flex-shrink-0 w-[185px] sm:w-[245px] md:w-[305px] lg:w-[335px] xl:w-[365px] aspect-[1.5/1] rounded-[18px] sm:rounded-[24px] md:rounded-[28px] bg-white border border-ink/8 p-[3px] sm:p-[4px] md:p-[5px] shadow-[0_15px_40px_-10px_rgba(14,14,12,0.1)] overflow-hidden flex flex-col select-none ${className}`}
    >
      {/* Outer elegant glass rim */}
      <div className="absolute inset-0 rounded-[17px] sm:rounded-[23px] md:rounded-[27px] border-2 border-white/30 pointer-events-none z-30" />

      {/* Screen Content Wrapper */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-[#FCFAF6] rounded-[14px] sm:rounded-[20px] border border-ink/5 text-left h-full">
        {/* Screen Status Bar */}
        <div className={`absolute top-0 left-0 right-0 flex justify-between items-center px-3 pt-1.5 pb-1 text-[5px] sm:text-[7.5px] font-mono z-30 pointer-events-none select-none ${
          isDarkStatusBar ? 'text-white/80' : 'text-ink/65'
        }`}>
          <span className="font-semibold tracking-tight">9:41</span>
          <div className="flex gap-0.5 sm:gap-1 items-center">
            <Wifi className="w-[5px] h-[5px] sm:w-[8px] sm:h-[8px]" />
            <Battery className="w-[7px] h-[4px] sm:w-[11px] sm:h-[6px]" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 flex flex-col justify-between text-ink relative z-10 h-full pt-4 sm:pt-5">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

const TOPICS = [
  {
    id: '01',
    title: 'Our Mission: Empowering Champions',
    desc: 'To construct world-class, structurally silent padel arenas across the GCC that inspire community bonding, peak wellness, and elite athletic performance.',
    seoText: 'We apply strict aerospace tolerance specifications to every padel court model we manufacture in Al Quoz, Dubai. Fusing Spanish structural tempered glass with custom vibration dampener mechanisms, we deliver uncompromised court performance engineered for extreme desert heat.',
    image: '/assets/images/dubai_court_night_construction_1779706759259.png',
    badge: 'OUR MISSION'
  },
  {
    id: '02',
    title: 'Our Vision: Smarter Connected Spaces',
    desc: 'To build the world\'s most innovative sports complexes by merging bio-tracking sensors, automated 4K match capture, and eco-friendly structural designs.',
    seoText: 'Padel courts are evolving from simple playing grounds into highly integrated wellness sanctuaries. By designing pre-wired camera systems and smart gameplay diagnostics, we convert typical physical matches into full-fledged digital training libraries.',
    image: '/assets/images/hero_court_background_1779705118750.png',
    badge: 'BRAND VISION'
  },
  {
    id: '03',
    title: 'Core Pillar: Structural Acoustics',
    desc: 'Eliminating urban noise reverberation by implementing specialized high-density neoprene gaskets that absorb high-frequency glass vibrations.',
    seoText: 'High-frequency noise pollution is a major friction point in premium residential neighborhoods. Our patented double-layered glass dampening cores actively absorb glass vibrations, reducing structural noise by 14.2 decibels without altering optimal ball bounce physics.',
    image: '/assets/images/premium_padel_racket_black_lime_1779706021226.png',
    badge: 'ACOUSTIC PILLAR'
  },
  {
    id: '04',
    title: 'Core Pillar: Elite Climatic Shield',
    desc: 'Forging heavy-duty hot-zinc galvanized metal frames and powder-coated barriers engineered to resist sandstorms, beach salinity, and extreme heat.',
    seoText: 'Vicious humidity and coastal salinity normally lead to structural rust and turf peeling within months. Court Hub frames undergo multi-layered fusion thermal powder coating, guaranteeing over ten years of rust longevity and supreme wind speed resistance above 145km/h.',
    image: '/assets/images/faq_padel_detail_1779708774500.png',
    badge: 'LONGEVITY PILLAR'
  }
];

export default function AboutClient() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { x: parallaxX, y: parallaxY } = useMouseParallax(26);
  const { x: imgParallaxX, y: imgParallaxY } = useMouseParallax(12);
  const { x: ctaParallaxX, y: ctaParallaxY } = useMouseParallax(16);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = rect.height;
      const viewHeight = window.innerHeight;

      // Calculate how far we have scrolled past the start of the section
      const scrolledPastStart = -rect.top;
      const activeScrollRange = totalHeight - viewHeight;

      if (activeScrollRange > 0) {
        // progress maps from 0 (top of section) to 1 (end of scroll track)
        const progress = Math.max(0, Math.min(1, scrolledPastStart / activeScrollRange));
        setScrollProgress(progress);

        // We only show topics for progress 0.0 to 0.50.
        // Let's scale progress to [0, 1] for topics
        const topicsProgress = Math.min(1, progress / 0.50);
        const sectionIndex = Math.min(TOPICS.length - 1, Math.floor(topicsProgress * TOPICS.length));
        setActiveSection(sectionIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Call once initially to set correct state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const absoluteContainerTop = rect.top + window.scrollY;
    const totalHeight = rect.height;
    const viewHeight = window.innerHeight;
    const activeScrollRange = totalHeight - viewHeight;
    // Scale step fraction so clicking on scrollspy categories scrolls to the appropriate portion in [0.0, 0.50]
    const stepFraction = ((index + 0.5) / TOPICS.length) * 0.50;
    const targetScrollY = absoluteContainerTop + stepFraction * activeScrollRange;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  let percentX = 100;
  if (scrollProgress >= 0.50) {
    if (scrollProgress <= 0.65) {
      const progressInInterval = (scrollProgress - 0.50) / (0.65 - 0.50);
      percentX = 100 - (progressInInterval * 100);
    } else {
      percentX = 0;
    }
  }

  // Calculate reveal progress for step-by-step scroll-triggered fading once 100% in view
  // Finishing reveal at 0.88 instead of 1.00 grants luxurious scrolling headroom at the end
  const revealProgress = scrollProgress >= 0.65
    ? Math.min(1, (scrollProgress - 0.65) / (0.88 - 0.65))
    : 0;

  // Step 1: "FOUNDED AT" and "2024" highlight box (First category)
  // Widened track range (0.35 duration) and y-displacement of 40px for majestic, solid structural feeling
  const opacityStep1 = Math.min(1, Math.max(0, (revealProgress - 0.0) / 0.35));
  const yStep1 = 40 * (1 - opacityStep1);

  // Step 2: "1 ABOUT COURT HUB" badge + main headline text (Second category)
  // Carefully paced separation (starts at 0.35) and 0.35 duration for slow, luxurious reveal
  const opacityStep2 = Math.min(1, Math.max(0, (revealProgress - 0.35) / 0.35));
  const yStep2 = 40 * (1 - opacityStep2);

  // Step 3: Images & description / bottom grids (Third category)
  // Paced late in the cycle (starts at 0.70) with 0.30 duration, finishing elegantly at 1.0
  const opacityStep3 = Math.min(1, Math.max(0, (revealProgress - 0.70) / 0.30));
  const yStep3 = 40 * (1 - opacityStep3);

  return (
    <div className="bg-ink min-h-screen text-white selection:bg-lime/30 font-sans antialiased">

      <main className="">

        {/* ================= SECTION 1: RECREATED "COURT HUB" MOCK-UP HERO ================= */}
        <div className="fixed top-0 left-0 w-full h-screen min-h-[620px] sm:min-h-[720px] md:min-h-[820px] z-0 pointer-events-auto">
          <section className="relative h-full w-full p-3 sm:p-5 md:p-6 lg:p-8 bg-ink overflow-hidden text-center flex items-center justify-center">

          {/* Edge-to-Edge full screen background cinematic video / image fallback */}
          <motion.div
            style={{ x: parallaxX, y: parallaxY }}
            className="absolute inset-[-4%] z-0 select-none pointer-events-none overflow-hidden scale-105 origin-center"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/images/hero_padel_night_view_1779713624496.png"
              className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.15] saturate-[1.15]"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-stadium-at-night-42211-large.mp4" type="video/mp4" />
            </video>
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
                href="/contact"
                whileHover={{ scale: 1.15, backgroundColor: "#C8FF3D", color: "#0A0D18" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 md:w-11 md:h-11 rounded-full border border-white/25 bg-black/50 text-white flex items-center justify-center backdrop-blur-md transition-shadow shadow-[0_4px_24px_rgba(0,0,0,0.6)] group shrink-0"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-0.5 transition-transform" />
              </MotionLink>

              {/* Right Floating Swipe Chevron - Confined inside white borders */}
              <MotionLink
                href="/construct-your-court"
                whileHover={{ scale: 1.15, backgroundColor: "#C8FF3D", color: "#0A0D18" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 md:w-11 md:h-11 rounded-full border border-white/25 bg-black/50 text-white flex items-center justify-center backdrop-blur-md transition-shadow shadow-[0_4px_24px_rgba(0,0,0,0.6)] group shrink-0"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
              </MotionLink>

              {/* 3. Centered Title Blocks: "EXPERIENCE PADEL", "ELEVATED" with organic, breath-like floating motions */}
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
                    EXPERIENCE PADEL
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
                    ELEVATED
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
                    Experience state-of-the-art courts, curated wellness zones, and a social atmosphere built around play.
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
                        <Link
                          href="/contact"
                          className="px-6 py-3 bg-[#C8FF3D] hover:bg-white text-ink font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md block relative z-10"
                        >
                          Become a Member
                        </Link>
                      </motion.div>
                    </div>

                    <Link
                      href="/construct-your-court"
                      className="px-6 py-3 border border-white/30 backdrop-blur-sm bg-white/5 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white/10 text-white transition-all text-center"
                    >
                      Book a Court
                    </Link>
                  </div>
                </div>

                {/* Right Bottom Block - Avatar row mimicking rating block */}
                <div className="max-w-sm space-y-3 text-left flex flex-col items-start lg:items-end w-full lg:w-auto">
                  {/* Clean rounded pill card for avatars */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-full py-2 px-4 flex items-center shadow-2xl">
                    <div className="flex -space-x-2.5">
                      {[
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                      ].map((src, i) => (
                        <motion.img
                          key={i}
                          whileHover={{ scale: 1.25, zIndex: 10 }}
                          transition={{ type: "spring", stiffness: 450, damping: 15 }}
                          className="w-8 h-8 rounded-full border-2 border-[#0A0D18] object-cover relative cursor-pointer"
                          src={src}
                          alt="Member"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-white/80 text-[11px] sm:text-xs leading-relaxed max-w-[280px] lg:text-right font-medium drop-shadow-md">
                    We're committed to creating a premium play experience with a friendly, inclusive community for every member.
                  </p>
                </div>

              </motion.div>

            </div>
          </div>
        </section>
        </div>

        {/* Spacer to allow scrolling past the fixed background hero */}
        <div className="relative w-full h-screen min-h-[620px] sm:min-h-[720px] md:min-h-[820px] pointer-events-none z-0" />

        {/* ================= BLANKET OVERLAY CONTENT ================= */}
        <div className="relative z-10 bg-ink shadow-[0_-24px_50px_rgba(0,0,0,0.6)]">

        {/* ================= SECTION 2: COMPANY STORY (Premium Sand/#EDE8E1 Theme / Editorial Feel) ================= */}
        <section className="min-h-screen flex flex-col justify-center py-20 sm:py-28 md:py-36 px-6 md:px-12 lg:px-16 xl:px-20 bg-sand text-ink relative overflow-hidden">
          {/* Playful abstract geometric court lines background */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none text-ink">
            <svg width="100%" height="100%">
              <line x1="10%" y1="0" x2="10%" y2="100%" stroke="currentColor" strokeWidth="2" />
              <line x1="90%" y1="0" x2="90%" y2="100%" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
              <circle cx="50%" cy="50%" r="200" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(30,90,232,0.03)_0%,transparent_60%)] pointer-events-none" />

          {/* Main content container with absolute hierarchy: Title -> Photo -> Text & Stats */}
          <div className="max-w-7xl mx-auto w-full space-y-12 md:space-y-16 relative z-10">

            {/* 1. TITLE BLOCK: First visual anchor */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-left space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0A0D18] text-[#C8FF3D] font-mono text-xs flex items-center justify-center font-black">
                  1
                </div>
                <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold border border-ink/10 px-4 py-1.5 rounded-full bg-[#0A0D18]/5 text-[#0A0D18] shadow-sm">
                  Our Story
                </div>
              </div>
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black uppercase italic leading-[0.85] tracking-tighter text-[#0A0D18]">
                METALLURGY <span className="text-court-blue">MEETS</span> <br className="hidden sm:inline" />
                <span className="relative inline-block text-ink">
                  SPORT SCIENCE
                  {/* Decorative playful vector underline slash with left-to-right drawing animation loop */}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: [0, 1, 1, 0, 0] }}
                    transition={{
                      duration: 9.5,
                      times: [0, 1 / 9.5, 6.5 / 9.5, 7.5 / 9.5, 1],
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ originX: 0 }}
                    className="absolute left-0 bottom-1 sm:bottom-2 h-2 sm:h-3 bg-[#C8FF3D] w-full -z-10 -rotate-1 rounded-full opacity-80"
                  />
                </span>.
              </h2>
            </motion.div>

            {/* Structured Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

              {/* 2. PHOTO COLUMN: Styled as primary visual highlight (Second visual anchor) */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 space-y-6"
              >
                <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden border border-ink/10 shadow-2xl group cursor-pointer">
                  <img
                    src="/assets/images/padel_racket_set_lifestyle_1779706056285.png"
                    alt="Aesthetic Padel Court Action Closeup"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104 group-hover:rotate-0.5"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D18]/95 via-transparent to-transparent p-6 sm:p-8 flex flex-col justify-end" />
                  <div className="absolute bottom-6 left-6 text-white text-left mr-6 space-y-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider bg-[#C8FF3D] text-ink px-2.5 py-1 rounded font-black inline-block">DEVELOPMENT LAB</span>
                    <p className="font-display text-sm sm:text-base md:text-lg font-bold italic uppercase text-white leading-tight">Synthesizing high-density composites for extreme athletic output.</p>
                  </div>
                </div>
              </motion.div>

              {/* 3. NARRATIVES & STATS: Fully playful third visual anchor */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 space-y-8 text-left"
              >
                <p className="text-ink/85 text-sm sm:text-base md:text-lg leading-relaxed font-sans font-medium">
                  Court Hub was not conceived in a corporate boardroom. It was forged in a specialized marine metalwork foundry in Al Quoz, Dubai. Our engineers observed that typical imported courts were structural templates—vulnerable to extreme GCC desert heat, coastal salinity, and deafening playground sound repercussions.
                </p>
                <p className="text-ink/70 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                  We set out to re-engineer court diagnostics. Fusing Spanish glass technologies with aerospace structural metal alloy formulations, we designed playing frames that ignore high winds and custom rackets that preserve muscles. Today, we craft sports spaces where architectural integrity meets ultimate player stamina.
                </p>                 {/* Playful counting statistics row with zoom and brand color-exchanging hover animations */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-ink/10 text-left">
                  <div className="group/stat cursor-pointer">
                    <motion.p
                      whileHover={{ scale: 1.15, color: '#C8FF3D', textShadow: '0 4px 12px rgba(10,13,24,0.12)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-court-blue tracking-tighter origin-left inline-block"
                    >
                      <AnimatedCounter value={180} suffix="+" />
                    </motion.p>
                    <p className="text-[9px] sm:text-[10px] font-mono text-ink/50 uppercase tracking-widest mt-1.5 leading-snug font-bold transition-colors group-hover/stat:text-ink/85">Pre-Calibrated Arenas</p>
                  </div>
                  <div className="group/stat cursor-pointer">
                    <motion.p
                      whileHover={{ scale: 1.15, color: '#C8FF3D', textShadow: '0 4px 12px rgba(10,13,24,0.12)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-ink tracking-tighter origin-left inline-block"
                    >
                      <AnimatedCounter value={18} suffix="%" />
                    </motion.p>
                    <p className="text-[9px] sm:text-[10px] font-mono text-ink/50 uppercase tracking-widest mt-1.5 leading-snug font-bold transition-colors group-hover/stat:text-ink/85">Larger Sweetspot</p>
                  </div>
                  <div className="group/stat cursor-pointer">
                    <motion.p
                      whileHover={{ scale: 1.15, color: '#C8FF3D', textShadow: '0 4px 12px rgba(10,13,24,0.12)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-court-blue tracking-tighter origin-left inline-block"
                    >
                      <AnimatedCounter value={2.1} decimals={1} suffix="x" />
                    </motion.p>
                    <p className="text-[9px] sm:text-[10px] font-mono text-ink/50 uppercase tracking-widest mt-1.5 leading-snug font-bold transition-colors group-hover/stat:text-ink/85">Vibration Dampening</p>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </section>
        {/* ================= SECTION 3: STRATEGIC BLUEPRINT (High-Fidelity Scrollspy Section) ================= */}
        <section ref={containerRef} className="relative h-[750vh] bg-court-blue border-t border-b border-white/15">
          <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(212,255,63,0.08)_0%,transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-8">

              {/* Split layout: left sticky card (Pics), right list content (text) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative">

                {/* Left Column: Sticky Image Card - Highly Interactive Tactile Stacked Deck Sequence (SWAPPED to Left) */}
                <div className="hidden lg:block lg:col-span-6 h-[580px] w-full relative">
                  <div className="relative w-full h-full flex items-center justify-center">

                    {TOPICS.map((topic, i) => {
                      // Determine stacked state relative to active index
                      const isPast = i < activeSection;
                      const isActive = i === activeSection;
                      const isFuture = i > activeSection;

                      // Base card layout parameters
                      let rotate = 0;
                      let yOffset = 0;
                      let scale = 1;
                      let opacity = 1;

                      if (isActive) {
                        rotate = 0;
                        yOffset = 0;
                        scale = 1;
                        opacity = 1;
                      } else if (isPast) {
                        // Past cards go under and rotate to show a stacked aesthetic
                        // We alternate the rotation directions (even index rotates counter-clockwise, odd rotates clockwise)
                        rotate = i % 2 === 0 ? -6 : 6;
                        yOffset = -8; // slight stack lift
                        scale = 0.95; // slightly nested behind
                        opacity = 0.75; // peek support
                      } else if (isFuture) {
                        // Future cards slide in from the bottom
                        rotate = 10;
                        yOffset = 620;
                        scale = 1.05;
                        opacity = 0;
                      }

                      // Seamless dynamic blend as scroll progress changes through segment intervals
                      const topicsCount = TOPICS.length;
                      const segmentProgress = (scrollProgress / 0.50) * topicsCount - activeSection;
                      const clampedSegmentOffset = Math.max(0, Math.min(1, segmentProgress));

                      // 1. If this is the next upcoming card, slide up over the current deck as user scrolls
                      if (activeSection + 1 === i) {
                        yOffset = 620 - (clampedSegmentOffset * 620);
                        rotate = 10 - (clampedSegmentOffset * 10);
                        opacity = clampedSegmentOffset;
                        scale = 1.05 - (clampedSegmentOffset * 0.05);
                      }

                      // 2. If this is the currently active card, rotate away underneath as the next card climbs
                      if (isActive && activeSection < topicsCount - 1) {
                        const targetRotation = i % 2 === 0 ? -6 : 6;
                        rotate = clampedSegmentOffset * targetRotation;
                        scale = 1 - (clampedSegmentOffset * 0.05);
                        opacity = 1 - (clampedSegmentOffset * 0.25);
                        yOffset = clampedSegmentOffset * -8;
                      }

                      return (
                        <motion.div
                          key={topic.id}
                          style={{
                            zIndex: 10 + i,
                          }}
                          animate={{
                            y: yOffset,
                            rotate: rotate,
                            scale: scale,
                            opacity: opacity,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 24,
                            mass: 0.9
                          }}
                          className="absolute inset-0 w-full h-full rounded-[32px] overflow-hidden border border-white/15 bg-black/40 shadow-[0_24px_60px_rgba(0,0,0,0.35)] origin-bottom"
                        >
                          <img
                            src={topic.image}
                            alt={topic.title}
                            className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1] saturate-[1.1]"
                            referrerPolicy="no-referrer"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[black]/95 via-[black]/20 to-transparent p-8 flex flex-col justify-end text-left" />

                          {/* Floating Indicator */}
                          <div className="absolute top-6 right-6 font-mono text-[9px] uppercase tracking-wider bg-[#C8FF3D] text-[#0A0D18] px-3.5 py-1.5 rounded-full font-bold shadow-lg">
                            {topic.badge}
                          </div>

                          {/* Summary details on image */}
                          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1 z-10 text-left">
                            <span className="font-mono text-[10px] uppercase text-[#C8FF3D] tracking-widest font-semibold block">/// Active Layer Analysis</span>
                            <h4 className="font-display text-lg font-bold italic uppercase tracking-tight text-white leading-tight">
                              {topic.title}
                            </h4>
                          </div>
                        </motion.div>
                      );
                    })}

                  </div>
                </div>

                {/* Right Column: Topics / Scroll anchors (SWAPPED to Right) */}
                <div className="lg:col-span-6 space-y-8 text-left">

                  {/* Simulated Badge matching the reference screenshot exactly with color contrast calibration */}
                  <div id="dna-strategy-trigger" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0A0D18] text-[#C8FF3D] font-mono text-xs flex items-center justify-center font-black">
                      2
                    </div>
                    <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold border border-white/10 px-4 py-1.5 rounded-full bg-white/10 text-white shadow-sm">
                      Our Mission & Vision
                    </div>
                  </div>

                  {/* Subtitle / Main heading matching screenshot layout with vivid lime highlighted focus */}
                  <h2 className="text-4xl md:text-5xl font-display font-black uppercase italic tracking-tight text-white leading-[0.95] mt-4">
                    Pioneering the Future of <br />
                    <span className="text-[#C8FF3D]">Court Design</span>
                  </h2>

                  {/* Categories container */}
                  <div className="mt-8 space-y-0 text-left">
                    {TOPICS.map((topic, index) => {
                      const isActive = activeSection === index;
                      return (
                        <div
                          key={topic.id}
                          id={`dna-topic-${index}`}
                          onClick={() => scrollToSection(index)}
                          className="group pt-6 pb-6 flex flex-col cursor-pointer select-none border-t border-white/15 transition-colors"
                        >
                          <div className="flex gap-6 items-start">
                            {/* Number index */}
                            <span className={`font-mono text-xs font-bold transition-all duration-300 ${isActive ? 'text-[#C8FF3D]' : 'text-white/40'}`}>
                              {topic.id}
                            </span>

                            {/* Text elements */}
                            <div className="space-y-2 flex-1 text-left">
                              <h3 className={`text-lg md:text-xl font-display font-black uppercase italic tracking-tight transition-all duration-300 ${isActive ? 'text-white scale-102 origin-left' : 'text-white/40 scale-100 group-hover:text-white/70'}`}>
                                {topic.title}
                              </h3>

                              {/* Expandable description with Framer Motion. Smooth and performant */}
                              <motion.div
                                initial={false}
                                animate={{
                                  height: isActive ? 'auto' : 0,
                                  opacity: isActive ? 1 : 0
                                }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <p className="text-xs md:text-sm text-white/85 leading-relaxed font-sans font-medium mt-1">
                                  {topic.desc}
                                </p>

                                {/* SEO text */}
                                <p className="text-[11px] md:text-xs text-white/70 leading-relaxed font-mono mt-2 mb-1 border-l-2 border-[#C8FF3D] pl-3 italic bg-black/15 p-2.5 rounded-r-xl">
                                  {topic.seoText}
                                </p>

                                {/* Mobile inline graphic fallback */}
                                <div className="lg:hidden mt-3 aspect-[16/10] rounded-[20px] overflow-hidden border border-white/10 relative shadow-md">
                                  <img
                                    src={topic.image}
                                    alt={topic.title}
                                    className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1] saturate-[1.1]"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                    <span className="font-mono text-[9px] uppercase tracking-wider bg-[#C8FF3D] text-[#0A0D18] px-2 py-0.5 rounded font-bold">
                                      {topic.badge}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
            </div>

          {/* The sliding Brand Positioning panel */}
          <motion.div
            style={{ x: `${percentX}%` }}
            className="absolute inset-0 bg-[#EDE8E1] text-[#0A0D18] z-30 flex items-center overflow-y-auto lg:overflow-y-auto px-6 md:px-8 py-6 sm:py-8 lg:py-10 border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Grid Background with fine spacing for balanced quadrants and elegant reduced opacity (0.04) */}
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(10,13,24,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,13,24,0.04)_1px,transparent_1px)] bg-[size:5.0rem_5.0rem] pointer-events-none" />

            <div className="max-w-[85rem] xl:max-w-[90rem] 2xl:max-w-[96rem] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10 lg:my-auto py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start text-left">

                {/* Left Column: Foundation Year Anchor - STEP 1 */}
                <motion.div
                  animate={{ opacity: opacityStep1, y: yStep1 }}
                  transition={{ type: "spring", stiffness: 45, damping: 22, mass: 1.2 }}
                  className="lg:col-span-3 lg:sticky lg:top-24 space-y-3"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-[#0A0D18]/60 font-semibold block">
                    Founded at:
                  </span>

                  {/* Highlight box matching reference screenshot layout exactly */}
                  <div className="w-full max-w-[220px] aspect-[2.1/1] bg-[#C8FF3D] text-[#0A0D18] flex items-center justify-center rounded-[24px] shadow-[0_12px_36px_rgba(212,255,62,0.18)] select-none border border-[#C8FF3D] hover:scale-[1.12] hover:-rotate-3 hover:shadow-[0_20px_48px_rgba(212,255,62,0.35)] transition-all duration-300 ease-out">
                    <span className="font-sans text-5xl md:text-6xl font-black italic tracking-tighter leading-none select-none">
                      2024
                    </span>
                  </div>
                </motion.div>

                {/* Right Column: Hero copy and multi-aspect imagery */}
                <div className="lg:col-span-9 space-y-6 lg:space-y-8">

                  {/* Indicator Badge + Header - STEP 2 with high-end typography hierarchy */}
                  <motion.div
                    animate={{ opacity: opacityStep2, y: yStep2 }}
                    transition={{ type: "spring", stiffness: 45, damping: 22, mass: 1.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0A0D18] text-[#C8FF3D] font-mono text-xs flex items-center justify-center font-black">
                        3
                      </div>
                      <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold border border-ink/10 px-4 py-1.5 rounded-full bg-white text-ink shadow-sm">
                        About Court Hub
                      </div>
                    </div>

                    <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-display font-black uppercase italic leading-[0.85] tracking-tighter text-[#0A0D18]">
                      ENGINEERING <span className="text-court-blue">THE</span> <br className="hidden sm:inline" />
                      <span className="relative inline-block text-ink">
                        FUTURE OF PLAY
                        {/* Decorative playful vector underline slash with left-to-right drawing animation loop */}
                        <motion.span
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: [0, 1, 1, 0, 0] }}
                          transition={{
                            duration: 9.5,
                            times: [0, 1 / 9.5, 6.5 / 9.5, 7.5 / 9.5, 1],
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          style={{ originX: 0 }}
                          className="absolute left-0 bottom-1 sm:bottom-2 h-2 sm:h-3 bg-[#C8FF3D] w-full -z-10 -rotate-1 rounded-full opacity-80"
                        />
                      </span>.
                    </h2>

                    <p className="text-xs sm:text-sm md:text-base lg:text-base font-sans font-medium text-[#0A0D18]/80 leading-relaxed max-w-4xl pt-1">
                      Court Hub was engineered from a deep-seated obsession with high-fidelity materials and the scientific belief that architecture can redefine elite sports communities.
                    </p>
                  </motion.div>

                  {/* Grid for Left Vertical Portrait and Right Landscape + Detail Section - STEP 3 */}
                  <motion.div
                    animate={{ opacity: opacityStep3, y: yStep3 }}
                    transition={{ type: "spring", stiffness: 45, damping: 22, mass: 1.2 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center pt-1"
                  >

                    {/* Left portrait image column with safe capped height constraint and mouse parallax */}
                    <div className="md:col-span-6 relative h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[350px] w-full rounded-[32px] overflow-hidden border border-ink/10 shadow-xl group cursor-pointer bg-black animate-none">
                      <motion.div
                        style={{ x: imgParallaxX, y: imgParallaxY }}
                        className="absolute inset-[-6%] w-[112%] h-[112%] origin-center"
                      >
                        <img
                          src="/assets/images/player_portrait_1779705596398.png"
                          alt="Player Execution Stroke Portrait"
                          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-112 group-hover:rotate-2 group-hover:brightness-[1.02] filter contrast-[1.05] brightness-[0.95]"
                          referrerPolicy="no-referrer"
                        />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D18]/85 via-transparent to-transparent p-6 flex flex-col justify-end pointer-events-none" />
                      <div className="absolute bottom-6 left-6 text-white text-left space-y-1.5 z-10 font-sans pointer-events-none">
                        <span className="font-mono text-[9px] uppercase tracking-[0.15em] bg-court-blue text-white px-2.5 py-1 rounded font-bold inline-block">STRIKE GEOMETRY</span>
                        <p className="font-display text-xs sm:text-sm font-bold italic uppercase tracking-wider text-white">Refining accurate rebound angles.</p>
                      </div>
                    </div>

                    {/* Right landscape image + descriptor column */}
                    <div className="md:col-span-6 space-y-4 lg:space-y-6 flex flex-col justify-between text-left">

                      {/* Landscape image column with mouse parallax and increased height for improved crop/fit */}
                      <div className="relative h-[110px] sm:h-[130px] md:h-[150px] lg:h-[170px] xl:h-[180px] w-full rounded-[32px] overflow-hidden border border-ink/10 shadow-xl group hidden md:block cursor-pointer bg-black">
                        <motion.div
                          style={{ x: imgParallaxX, y: imgParallaxY }}
                          className="absolute inset-[-6%] w-[112%] h-[112%] origin-center"
                        >
                          <img
                            src="/assets/images/court_action_landscape_1779705580138.png"
                            alt="Play action on synthetic blue turf court"
                            className="w-full h-full object-cover object-[center_30%] transition-all duration-700 ease-out group-hover:scale-112 group-hover:-rotate-2 group-hover:brightness-[1.02] filter contrast-[1.05] brightness-[0.95]"
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D18]/85 via-transparent to-transparent p-4 flex flex-col justify-end pointer-events-none" />
                        <div className="absolute bottom-4 left-4 text-white text-left space-y-1 z-10 font-sans pointer-events-none">
                          <span className="font-mono text-[9px] uppercase tracking-[0.15em] bg-[#C8FF3D] text-ink px-2.5 py-1 rounded font-black font-semibold inline-block">SYNTHETIC SCIENCE</span>
                          <p className="font-display text-xs sm:text-sm font-bold italic uppercase tracking-wider text-white">Maximized traction coefficient.</p>
                        </div>
                      </div>

                      <div className="space-y-4 flex-1 flex flex-col items-start bg-white/40 p-4 sm:p-5 rounded-3xl border border-ink/5 shadow-sm hover:bg-white/50 transition-colors duration-300">
                        <p className="text-xs sm:text-sm lg:text-sm text-ink/85 leading-relaxed font-sans font-medium">
                          Starting from casual weekend exhibition matches, we have structured ourselves into a high-octane network of luxury athletic sanctuaries, where raw physical action and structural design elements operate in perfect equilibrium.
                        </p>

                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 group text-xs font-mono font-bold uppercase tracking-widest text-[#0A0D18] hover:text-court-blue border border-ink/15 px-5 py-2.5 rounded-full bg-white hover:bg-white/80 transition-all shadow-md group shrink-0"
                        >
                          <span>Learn more</span>
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#0A0D18]" />
                        </Link>
                      </div>

                    </div>

                  </motion.div>

                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>
        {/* ================= SECTION 5: CALL TO ACTION (CTA - Dark Card Wheel Concept) ================= */}
        <section className="pt-16 sm:pt-20 px-6 md:px-8 text-center relative overflow-hidden bg-ink pb-0">
          {/* Symmetrical ambient radial light gradient matching the image */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,255,61,0.06)_0%,transparent_60%)] pointer-events-none" />

          <motion.div
            style={{ x: ctaParallaxX, y: ctaParallaxY }}
            className="max-w-4xl mx-auto space-y-4 sm:space-y-6 relative z-10"
          >
            <span className="font-mono text-[10px] md:text-sm uppercase bg-lime/10 px-4 py-1.5 border border-lime/20 rounded-full text-lime inline-block tracking-widest font-bold">
              /// Join our premier partners list
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase italic tracking-tight text-white leading-none mt-4">
              READY TO BUILD OR <br />
              <span className="text-lime">STOCK THE GEAR?</span>
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Let's bypass formal lag. Coordinate directly with structural managers and commercial partners over direct pre-routed GCC WhatsApp lines.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <MotionLink
                href="/construct-your-court"
                animate={{
                  boxShadow: [
                    "0 4px 14px 0px rgba(200,255,61,0.25)",
                    "0 6px 30px 6px rgba(200,255,61,0.65)",
                    "0 4px 14px 0px rgba(200,255,61,0.25)"
                  ],
                  scale: [1, 1.03, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.08 }}
                className="px-8 py-4 bg-lime text-ink rounded-full font-mono font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-lime/15"
              >
                <span>Construct Your Court</span>
                <ArrowUpRight className="w-4 h-4 text-ink" />
              </MotionLink>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-mono text-xs uppercase font-bold tracking-widest hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
              >
                Instant Communication Desks
              </Link>
            </div>
          </motion.div>

          {/* Symmetrical overlapping wide-screen card flow perfectly mimicking the shared screenshot */}
          <div className="relative w-full max-w-6xl mx-auto mt-12 sm:mt-16 overflow-visible flex flex-col items-center justify-center scale-[0.85] sm:scale-[0.95] md:scale-100 origin-center pb-12">

            {/* Ambient lime shadow glow beneath the cards */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4/5 h-[80px] sm:h-[130px] bg-lime/10 blur-3xl rounded-full pointer-events-none z-0" />            {/* Perfect symmetrical fanned-out list of aspect-[1.5/1] cards with overlapping negative spacing */}
            <div className="flex flex-nowrap justify-center items-center -space-x-16 sm:-space-x-24 md:-space-x-32 lg:-space-x-40 xl:-space-x-[155px] w-full overflow-visible py-8 relative z-10 select-none pb-12">

              {FEATURED_PRODUCTS_SLOTS.map((slot, index) => {
                const styleConfig = [
                  { rotate: -12, y: 35, zIndex: 10, opacity: 0.65, statusTheme: 'light' as const },
                  { rotate: -6, y: 12, zIndex: 20, opacity: 0.85, statusTheme: 'dark' as const },
                  { rotate: 0, y: 0, zIndex: 30, opacity: 1, statusTheme: 'dark' as const, isCenter: true },
                  { rotate: 6, y: 12, zIndex: 25, opacity: 0.85, statusTheme: 'dark' as const },
                  { rotate: 12, y: 35, zIndex: 10, opacity: 0.65, statusTheme: 'light' as const }
                ][index];

                return (
                  <PhoneMockup
                    key={slot.id}
                    title={`${slot.slotNumber} / ${slot.isEmpty ? 'SLOT RESERVED' : (slot.title?.toUpperCase() || slot.defaultTitle)}`}
                    statusTheme={styleConfig.statusTheme}
                    style={{ rotate: styleConfig.rotate, y: styleConfig.y, zIndex: styleConfig.zIndex, opacity: styleConfig.opacity }}
                    className={`cursor-pointer ${styleConfig.isCenter ? 'border border-[#E84525]/20 shadow-[0_22px_55px_-12px_rgba(232,69,37,0.18)]' : ''}`}
                  >
                    {slot.isEmpty ? (
                      /* Minimalist highly elegant empty/placeholder card requested by user */
                      <div className="flex-1 flex flex-col justify-between h-full bg-[#FCFAF6] p-2 sm:p-3 text-left">
                        <div className="flex-1 flex flex-col justify-between border-2 border-dashed border-ink/10 rounded-[12px] sm:rounded-[16px] p-2.5 sm:p-3 bg-sand/15 hover:bg-lime/5 transition-all duration-300 relative overflow-hidden group">
                          {/* Symmetrical wireframe vector details */}
                          <div className="absolute top-0 right-0 w-6 h-6 bg-lime/10 rounded-bl-full pointer-events-none" />

                          <div className="flex justify-between items-start">
                            <span className="text-[4px] sm:text-[6px] font-mono font-bold text-ink/35 tracking-widest uppercase">
                              SLOT {slot.slotNumber}
                            </span>
                            <div className="flex items-center gap-0.5">
                              <span className="w-1 h-1 rounded-full bg-lime/40" />
                              <span className="text-[3.5px] sm:text-[5px] font-mono text-ink/30 uppercase font-black">Ready to Sync</span>
                            </div>
                          </div>

                          <div className="my-auto flex flex-col items-center text-center justify-center py-1 sm:py-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-ink/5 border border-ink/5 flex items-center justify-center text-ink/25 mb-1 sm:mb-1.5 group-hover:bg-lime/15 group-hover:text-lime group-hover:border-lime/30 transition-all duration-300">
                              <Package className="w-3 sm:w-4 h-3 sm:h-4" />
                            </div>
                            <h5 className="font-display font-black text-[5.5px] sm:text-[8px] md:text-[9.5px] text-ink/45 uppercase tracking-tight leading-tight max-w-[120px] sm:max-w-none">
                              {slot.defaultTitle}
                            </h5>
                            <p className="text-[4px] sm:text-[6px] text-ink/30 leading-snug mt-0.5 max-w-[100px] sm:max-w-[130px] font-sans">
                              Empty slot. Custom live product connects instantly inside <code className="font-mono bg-ink/5 px-0.5 rounded font-black text-ink/50">AboutPage.tsx</code>.
                            </p>
                          </div>

                          <div className="flex justify-between items-center text-[4px] sm:text-[6px] font-mono border-t border-ink/5 pt-1 sm:pt-1.5 mt-0.5 sm:mt-1">
                            <span className="text-ink/25 font-bold tracking-tighter">AED ----</span>
                            <span className="text-ink/45 font-black uppercase flex items-center gap-0.5 group-hover:text-lime transition-colors">
                              <Plus className="w-1.5 h-1.5 text-lime" /> Connect Item
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Connected active best selling product state */
                      <div className="flex-1 flex flex-col justify-between h-full bg-[#FCFAF6] p-2.5 sm:p-4 text-left">
                        <div className="space-y-1.5 sm:space-y-2.5 flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-center text-ink/40">
                            <span className="text-[4px] sm:text-[6px] uppercase tracking-wider font-bold text-ink/55 bg-lime/20 px-1.5 py-0.5 rounded leading-none">
                              ★ {slot.badge || "BEST SELLER"}
                            </span>
                            <span className="text-[4px] sm:text-[6.5px] font-mono text-emerald-600 font-black flex items-center gap-0.5">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> {slot.stockStatus || "IN STOCK"}
                            </span>
                          </div>

                          <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${slot.accentColor || 'from-[#E84525] to-[#0A0D18]' } text-white relative overflow-hidden flex-1 flex flex-col justify-between min-h-[50px] sm:min-h-[70px] shadow-sm`}>
                            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none" />

                            <div className="relative z-10 flex justify-between items-start">
                              <ShoppingBag className="w-3 sm:w-4.5 h-3 sm:h-4.5 text-lime" />
                              <span className="text-[4px] sm:text-[5.5px] font-mono font-bold bg-white/20 px-1 py-0.5 rounded tracking-widest">
                                ACTIVE
                              </span>
                            </div>

                            <div className="relative z-10 select-none">
                              <p className="text-[4px] sm:text-[5.5px] font-mono font-bold text-white/75 leading-none uppercase">Apex Gear</p>
                              <h4 className="font-display font-black text-[7px] sm:text-[11px] text-white leading-tight uppercase mt-0.5 tracking-tight">
                                {slot.title}
                              </h4>
                            </div>
                          </div>

                          <span className="text-[4.5px] sm:text-[6.5px] text-ink/65 font-sans leading-tight block">
                            {slot.description}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-ink/5 flex justify-between items-center text-[4.5px] sm:text-[6.5px] leading-none">
                          <span className="font-mono text-ink/30 font-bold uppercase tracking-tight">VIP SERVICE</span>
                          <span className="font-display font-black text-[#E84525] uppercase text-xs sm:text-sm">{slot.price}</span>
                        </div>
                      </div>
                    )}
                  </PhoneMockup>
                );
              })}

            </div>

            {/* Seamless Bottom Gradient Fade into Footers */}
            <div className="absolute bottom-0 left-0 w-full h-[60px] sm:h-[80px] bg-gradient-to-t from-ink via-ink/85 to-transparent pointer-events-none z-25" />
          </div>
        </section>

        {/* Standard Joint Footer */}
        <Footer />

        </div>
      </main>

    </div>
  );
}
