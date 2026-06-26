'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  Activity,
  Compass,
  Grid,
  CheckCircle,
  Sparkles,
  Cpu,
  Layers,
  Shield,
  Phone,
  MessageSquare,
  Flame,
  ArrowUpRight,
  TrendingUp,
  Award,
  Zap,
  Check
} from 'lucide-react';
import Footer from '@/components/home/Footer';
import HeroFrameNav from '@/components/swipe/HeroFrameNav';
import { useMouseParallax } from '@/components/shared/useMouseParallax';

const MotionLink = motion.create(Link);

// Staggered active pulsing dot for the stats curved line graph
const GlowingDot = ({ delay, top }: { delay: number; top: string }) => {
  return (
    <div
      className="hidden md:flex absolute -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center pointer-events-none"
      style={{ left: '0px', top }}
    >
      {/* Main Core Dot Ring */}
      <span className="w-5.5 h-5.5 rounded-full border-[3px] border-white bg-court-blue shadow-[0_0_16px_rgba(30,90,232,0.9)] flex items-center justify-center relative z-10 transition-colors duration-300">
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
      </span>
    </div>
  );
};

interface CourtModel {
  id: string;
  name: string;
  badge: string;
  description: string;
  features: string[];
  image: string;
}

const COURT_MODELS: CourtModel[] = [
  {
    id: 'panoramic',
    name: 'World Tour Panoramic',
    badge: 'Elite / VIP Stadium',
    description: 'Completely unobstructed 360-degree viewing experience with no corner tube posts. Engineered with premium 12mm structural tempered glass and reinforced structural steel beams.',
    features: ['Approved for international tournament broadcasting', 'Zero corner column sightline blockage', 'Heavy duty wind load structures rated above 150 km/h', 'Integrated LED spotlight fixtures'],
    image: '/assets/images/hero_court_background_1779705118750.png'
  },
  {
    id: 'club',
    name: 'Stealth Club Classic',
    badge: 'Popular / High Traffic',
    description: 'Designed for optimal longevity in public clubs and outdoor commercial centers. Utilizes heavy-gauge galvanized structural framing for maximum resilience under severe continuous multi-session play.',
    features: ['100mm x 100mm heavy pillars for supreme load-bearing', 'Superior impact absorption properties', 'Anti-vibration neoprene gaskets', 'Optimized for high-yield commercial installations'],
    image: '/assets/images/dubai_court_night_construction_1779706759259.png'
  },
  {
    id: 'indoor',
    name: 'Indoor low-profile',
    badge: 'Optimized / Architectural',
    description: 'Specially engineered for existing warehouses, structures, and low ceiling compounds. Reduced overhead frame profiles allow simple integration underneath support joists and HVAC systems.',
    features: ['Optimized lower structural footprint', 'Modular frame configuration', 'No-anchoring-flange options for low structural disruption', 'Targeted LED glare-shield arrays'],
    image: '/assets/images/hero_padel_night_view_1779713624496.png'
  }
];

interface MoveEarthItem {
  num: string;
  category: string;
  title: string;
  desc: string;
  image: string;
  imgLeft: boolean;
}

function MoveEarthRow({ item }: { item: MoveEarthItem; key?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Calculate high-fidelity spring-softened scroll progress to eliminate any jittering or stuttering
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 18,
    restDelta: 0.001
  });

  // Balanced depth scaling, cinematic fade-in/out, and translational movement on smooth scroll
  const opacity = useTransform(smoothScroll, [0, 0.22, 0.78, 0.98], [0, 1, 1, 0]);
  const scale = useTransform(smoothScroll, [0, 0.22, 0.78, 0.98], [0.93, 1, 1, 0.95]);
  const y = useTransform(smoothScroll, [0, 0.22, 0.78, 1], [80, 0, 0, -80]);

  // Custom rotation vector that moves elegantly on scroll for real spatial depth
  const rotate = useTransform(smoothScroll, [0, 0.25, 0.75, 1], [item.imgLeft ? -3 : 3, 0, 0, item.imgLeft ? 3 : -3]);

  // Perfectly staggered scroll-linked spawning transforms for each text element
  const categoryOpacity = useTransform(smoothScroll, [0.05, 0.22, 0.78, 0.95], [0, 1, 1, 0]);
  const categoryY = useTransform(smoothScroll, [0.05, 0.22, 0.78, 0.95], [30, 0, 0, -30]);

  const titleOpacity = useTransform(smoothScroll, [0.08, 0.25, 0.75, 0.92], [0, 1, 1, 0]);
  const titleY = useTransform(smoothScroll, [0.08, 0.25, 0.75, 0.92], [40, 0, 0, -40]);

  const descOpacity = useTransform(smoothScroll, [0.12, 0.28, 0.72, 0.88], [0, 1, 1, 0]);
  const descY = useTransform(smoothScroll, [0.12, 0.28, 0.72, 0.88], [55, 0, 0, -55]);

  const btnOpacity = useTransform(smoothScroll, [0.16, 0.32, 0.68, 0.84], [0, 1, 1, 0]);
  const btnY = useTransform(smoothScroll, [0.16, 0.32, 0.68, 0.84], [30, 0, 0, -30]);

  // Dedicated mouse moving parallax effect for individual images (mirroring the premium hero section physics)
  const { x: imageMouseX, y: imageMouseY } = useMouseParallax(18);

  return (
    <div
      ref={ref}
      style={{ perspective: "1500px" }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-center py-20 md:py-28 overflow-visible w-full"
    >
      {/* Interactive Image Container with smooth translations */}
      <motion.div
        style={{
          opacity,
          scale,
          y,
          rotate
        }}
        className={`w-full lg:col-span-6 relative flex items-center justify-center ${
          item.imgLeft ? 'order-1' : 'order-1 lg:order-2'
        }`}
      >
        {/* Curved image container - light-theme optimized with elegant shadow and overflow hidden */}
        <motion.div
          whileHover="hover"
          className="relative w-full aspect-[1.4/1] rounded-[40px] overflow-hidden shadow-[0_32px_64px_rgba(14,14,12,0.12)] border border-ink/5 z-10 bg-white cursor-pointer"
        >
          <motion.div
            style={{ x: imageMouseX, y: imageMouseY }}
            variants={{
              hover: { scale: 1.05 }
            }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="absolute -top-7 -left-7 -right-7 -bottom-7"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Balanced Content Column with high-end staggered, individual scroll element triggers */}
      <div
        className={`w-full lg:col-span-6 text-left space-y-6 md:space-y-8 xl:pr-8 ${
          item.imgLeft ? 'order-2' : 'order-2 lg:order-1'
        }`}
      >
        {/* Category Label */}
        <motion.div
          style={{ opacity: categoryOpacity, y: categoryY }}
          className="flex items-center gap-2 text-court-blue font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.25em] w-fit"
        >
          <span>{item.num}</span>
          <span>/</span>
          <span>{item.category}</span>
        </motion.div>

        {/* Title - Ultra bold, premium widescreen displays with hover text scaling & lime color changes */}
        <motion.h3
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] font-display font-black uppercase tracking-tight text-ink leading-[0.88] max-w-3xl cursor-default select-none group/title"
        >
          {item.title.split(' ').map((word, idx) => (
            <motion.span
              key={idx}
              className="inline-block mr-[0.22em] last:mr-0 transition-colors duration-200 hover:text-lime origin-left"
              whileHover={{
                scale: 1.08,
                x: 6
              }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h3>

        {/* Description Paragraph - High contrast, readable, smaller and thinner layout */}
        <motion.p
          style={{ opacity: descOpacity, y: descY }}
          className="text-ink/70 text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl leading-relaxed font-normal max-w-xl xl:max-w-2xl cursor-default transition-colors duration-300"
        >
          {item.desc}
        </motion.p>

        {/* Price This Build - scrolling CTA trigger */}
        <motion.div
          style={{ opacity: btnOpacity, y: btnY }}
          className="pt-4"
        >
          <a
            href="#configurator"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-ink hover:text-court-blue pb-1.5 border-b-2 border-ink/10 hover:border-court-blue transition-colors group"
          >
            <span>PRICE THIS BUILD</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">&#x2192;</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}

export default function ConstructClient() {
  const { x: parallaxX, y: parallaxY } = useMouseParallax(26);
  // Configurator States
  const [selectedModel, setSelectedModel] = useState<string>('panoramic');
  const [selectedTurf, setSelectedTurf] = useState<string>('Mondo Supercourt XN');
  const [selectedGlass, setSelectedGlass] = useState<string>('12mm Tempered Structural Glass');
  const [selectedColor, setSelectedColor] = useState<string>('Tour Ocean Blue');
  const [clientName, setClientName] = useState<string>('');
  const [clientLocation, setClientLocation] = useState<string>('Dubai');
  const [comments, setComments] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(1);

  // Sticky Horizontal Gallery Scroll Parameters
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [scrollMaxRange, setScrollMaxRange] = useState(600);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateScrollRange = () => {
      if (cardsContainerRef.current) {
        const totalContainerWidth = cardsContainerRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        // The maximum translation is total container width minus screen width plus comfortable padding
        const maxRange = Math.max(0, totalContainerWidth - viewportWidth + 200);
        setScrollMaxRange(maxRange);
      }
    };

    updateScrollRange();
    const timer = setTimeout(updateScrollRange, 100);
    window.addEventListener('resize', updateScrollRange);
    return () => {
      window.removeEventListener('resize', updateScrollRange);
      clearTimeout(timer);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const smoothScrollX = useSpring(scrollYProgress, {
    stiffness: 90, // customized for elite cinematic control
    damping: 24,
    mass: 0.2
  });

  // Calculate high-fidelity spring-softened horizontal position.
  // 0.0 to 0.60 is strictly horizontal scroll. Then it locks.
  const translateX = useTransform(smoothScrollX, [0, 0.60, 1.0], [0, -scrollMaxRange, -scrollMaxRange]);

  // Read scroll state reactively and select active card index based on 0 to 0.60 of horizontal progress
  useMotionValueEvent(smoothScrollX, "change", (latestVal) => {
    const cardProgress = Math.min(0.60, latestVal) / 0.60;
    const index = Math.min(5, Math.max(0, Math.round(cardProgress * 5)));
    setActiveIndex(index);
  });

  // Same-Viewport Dynamic Transitions between Section 4 (Gallery Showcase) and Section 5 (Authority)
  // When horizontal scrolling is complete (smoothScrollX >= 0.60):
  // 1. Gallery Showcase slides down off the bottom of the screen (0vh to 100vh).
  const galleryY = useTransform(smoothScrollX, [0.60, 0.85, 1.0], ["0vh", "100vh", "100vh"]);
  const galleryOpacity = useTransform(smoothScrollX, [0.60, 0.85], [1, 0]);

  // 2. Authority Section slides down from the top of the screen into center (-100vh to 0vh).
  const authorityY = useTransform(smoothScrollX, [0.60, 0.85, 1.0], ["-100vh", "0vh", "0vh"]);
  const authorityOpacity = useTransform(smoothScrollX, [0.60, 0.72, 1.0], [0, 1, 1]);

  // Safe reactive state to handle pointer events without invalid CSS value injection of raw MotionValues to elements
  const [showAuthority, setShowAuthority] = useState(false);
  useMotionValueEvent(smoothScrollX, "change", (latestVal) => {
    setShowAuthority(latestVal >= 0.70);
  });

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // 3. STEP-BY-STEP SCROLL-LOCKED REVEAL FOR SECTION 3 (FOUR WAYS WE MOVE EARTH)
  const headerSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: headerScrollProgress } = useScroll({
    target: headerSectionRef,
    offset: ["start start", "end end"]
  });

  const smoothHeader = useSpring(headerScrollProgress, {
    stiffness: 30, // ultra-gentle, velvety slow spring
    damping: 24,
    restDelta: 0.001
  });

  // Step-by-step scroll reveal tuned to trigger sooner and leave a luxurious locked resting state for reading
  const badgeOpacity = useTransform(smoothHeader, [0.01, 0.15], [0, 1]);
  const badgeY = useTransform(smoothHeader, [0.01, 0.15], [20, 0]);

  const titleOpacity = useTransform(smoothHeader, [0.12, 0.38], [0, 1]);
  const titleY = useTransform(smoothHeader, [0.12, 0.38], [30, 0]);

  const descOpacity = useTransform(smoothHeader, [0.32, 0.54], [0, 1]);
  const descY = useTransform(smoothHeader, [0.32, 0.54], [25, 0]);

  // Active court object
  const activeModelObj = useMemo(() => {
    return COURT_MODELS.find(m => m.id === selectedModel) || COURT_MODELS[0];
  }, [selectedModel]);

  // Generates custom WhatsApp pre-filled text
  const whatsappUrl = useMemo(() => {
    const phone = '971500000000'; // Target official Court Hub estimating desk
    const text = `Hello Court Hub Group! *New Custom Court Design Proposal* 🎾\n\nI am inquiring about constructing a custom padel court in the GCC. Here are my selected specifications:\n\n• *Model:* ${activeModelObj.name}\n• *Turf System:* ${selectedTurf}\n• *Turf Color:* ${selectedColor}\n• *Glass Specification:* ${selectedGlass}\n• *Project Location:* ${clientLocation}\n• *My Name:* ${clientName || 'Inquirer'}\n• *Site Details:* ${comments || 'No initial remarks'}\n\nPlease generate an architectural estimate sheet for this specification layout! Thank you.`;
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
  }, [activeModelObj, selectedTurf, selectedColor, selectedGlass, clientLocation, clientName, comments]);

  return (
    <div className="bg-ink min-h-screen text-white selection:bg-lime/30 font-sans">

      <main className="">

        {/* ================= SECTION 1: RECREATED "COURT HUB" MOCK-UP HERO ================= */}
        <div className="fixed top-0 left-0 w-full h-[100dvh] md:h-screen min-h-[620px] sm:min-h-[720px] md:min-h-[820px] z-0 pointer-events-auto">
          <section className="relative h-full w-full p-3 sm:p-5 md:p-6 lg:p-8 bg-ink overflow-hidden text-center flex items-center justify-center">

          {/* Edge-to-Edge full screen background cinematic video / image fallback */}
          <motion.div
            style={{ x: parallaxX, y: parallaxY }}
            className="absolute inset-[-4%] z-0 select-none pointer-events-none overflow-hidden scale-105 origin-center"
          >
            <img
              src="/assets/images/dubai_court_night_construction_1779706759259.png"
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
              className="w-full h-full border-2 md:border-[3px] border-white/60 rounded-[28px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden relative shadow-[0_32px_120px_rgba(0,0,0,0.7)] bg-black/15 backdrop-blur-[1.5px] flex flex-col justify-between p-4 pb-10 sm:p-8 md:p-10 lg:p-12"
            >

              {/* Left Floating Swipe Chevron - Confined inside white borders */}
              <MotionLink
                href="/about"
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
                href="/shop"
                whileHover={{ scale: 1.15, backgroundColor: "#C8FF3D", color: "#0E0E0C" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 md:w-11 md:h-11 rounded-full border border-white/25 bg-black/50 text-white flex items-center justify-center backdrop-blur-md transition-shadow shadow-[0_4px_24px_rgba(0,0,0,0.6)] group shrink-0"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
              </MotionLink>

              {/* In-frame hero navbar (the design's integrated sub-header row) */}
              <HeroFrameNav active="construct" />

              {/* 3. Centered Title Blocks: "ENGINEER THE", "BESPOKE ARENA" with organic, breath-like floating motions */}
              <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 z-10 select-none pointer-events-none">
                {/* Mobile-only levitation wrapper (CSS .ch-levitate floats the whole title
                    on <768px, static on desktop). Kept separate from the inner Framer
                    transforms so the CSS float and Framer animations never conflict. */}
                <div className="ch-levitate w-full flex flex-col items-center justify-center">
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
                      className="font-display font-black text-white text-center text-5xl sm:text-[68px] md:text-[88px] lg:text-[108px] xl:text-[124px] leading-[0.85] tracking-tighter uppercase select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                    >
                      ENGINEER THE
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
                      className="font-display font-black text-white text-center text-5xl sm:text-[68px] md:text-[88px] lg:text-[108px] xl:text-[124px] leading-[0.85] tracking-tighter uppercase select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
                    >
                      BESPOKE ARENA
                    </motion.h1>
                  </motion.div>
                </div>
              </div>

              {/* 4. Glass Framed Bottom Row: Actions + Communities rating badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative z-30 w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-t border-white/10 pt-4 mt-auto"
              >

                {/* Left Bottom Block - Piles */}
                <div className="space-y-4 max-w-md text-left w-full lg:w-auto">
                  <p className="text-white/80 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-md">
                    From soil engineering to certified 12mm safety glass alignments and Mondo turf sod calculations. Turnkey GCC excellence.
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
                          href="#configurator"
                          className="px-6 py-3 bg-[#C8FF3D] hover:bg-white text-ink font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md cursor-pointer block relative z-10"
                        >
                          Bespoke Designer
                        </a>
                      </motion.div>
                    </div>

                    <a
                      href="#authority"
                      className="px-6 py-3 border border-white/30 backdrop-blur-sm bg-white/5 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white/10 text-white transition-all text-center cursor-pointer"
                    >
                      Our Certifications
                    </a>
                  </div>
                </div>

                {/* Right Bottom Block - Spec details mimicking about stats */}
                <div className="max-w-xs space-y-2 text-left flex flex-col items-start lg:items-end w-full lg:w-auto">
                  <span className="font-mono text-[10px] text-lime uppercase tracking-widest font-black py-1 px-2.5 bg-lime/10 border border-lime/20 rounded">
                    DUBAI MASTER PROJECT
                  </span>
                  <p className="font-display text-lg font-bold italic uppercase tracking-tight text-white leading-none mt-1 lg:text-right">
                    PANORAMIC STADIUM
                  </p>
                  <p className="text-white/60 text-[11px] font-mono lg:text-right">Calibrated to 420 Lux night index.</p>
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




        {/* ================= SECTION 3: PROCESS / WORKFLOW ("FOUR WAYS WE MOVE EARTH.") ================= */}
        {/* Sticky Scroll-Locked Header Reveal */}
        <section ref={headerSectionRef} className="relative h-[500vh] bg-sand text-ink border-t border-ink/5">
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center pl-6 pr-6 md:pl-32 md:pr-12 lg:pr-16 xl:pr-24 bg-sand select-none">

            {/* Fine grid background mapping aligned to the brand aesthetic */}
            <div className="absolute inset-x-0 top-0 h-full w-full pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,13,24,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,13,24,0.04)_1px,transparent_1px)] bg-[size:5.0rem_5.0rem] pointer-events-none z-0" />
            </div>

            <div className="max-w-[1720px] mx-auto w-full relative z-10 flex flex-col justify-center gap-6 text-left">

              {/* Step 1: Badge / Segment Control Numbers */}
              <motion.div
                style={{ opacity: badgeOpacity, y: badgeY }}
                className="flex items-center gap-3 w-fit"
              >
                <div className="w-8 h-8 rounded-full bg-[#0E0E0C] text-[#C8FF3D] font-mono text-xs flex items-center justify-center font-black">
                  1
                </div>
                <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold border border-ink/10 px-4 py-1.5 rounded-full bg-[#0E0E0C]/5 text-[#0E0E0C] shadow-sm">
                  WHAT WE BUILD
                </div>
              </motion.div>

              {/* Step 2: Main Display Headline - Reverted to massive typographic hierarchy */}
              <motion.h2
                style={{ opacity: titleOpacity, y: titleY }}
                className="text-6xl sm:text-8xl md:text-9xl lg:text-10xl xl:text-[11rem] font-display font-black uppercase italic leading-[0.85] tracking-tighter text-[#0E0E0C]"
              >
                FOUR WAYS <br />
                WE <br />
                <span className="relative inline-block text-court-blue">
                  MOVE EARTH
                  {/* Lime drawn underline — pure-CSS loop (.ch-underline-draw in globals.css);
                      runs regardless of OS reduce-motion, unlike the old Framer keyframe loop. */}
                  <span
                    aria-hidden
                    className="ch-underline-draw absolute left-0 bottom-1 sm:bottom-2 h-2 sm:h-3 bg-[#C8FF3D] w-full -z-10 rounded-full opacity-80"
                  />
                </span>.
              </motion.h2>

              {/* Step 3: Subtitle / Paragraph */}
              <motion.p
                style={{ opacity: descOpacity, y: descY }}
                className="text-ink/75 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed font-semibold pt-2"
              >
                No catalogue courts. Every project is engineered for its site — villa garden, club floor or open desert lot.
              </motion.p>

            </div>

          </div>
        </section>

        {/* Sequential list of built types */}
        <section className="py-24 md:py-36 bg-sand text-ink relative overflow-hidden border-t border-ink/5">
          {/* Fine grid background */}
          <div className="absolute inset-x-0 top-0 h-full w-full pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,13,24,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,13,24,0.04)_1px,transparent_1px)] bg-[size:5.0rem_5.0rem] pointer-events-none z-0" />
          </div>

          <div className="max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 relative z-10 w-full">

            {/* Widescreen Dynamic Grid matching reference */}
            <div className="space-y-24 md:space-y-36 lg:space-y-48">
              {[
                {
                  num: '01',
                  category: 'FULL BUILD . TURNKEY',
                  title: 'PANORAMIC COURTS',
                  desc: 'The full build. Laser-levelled foundations, hot-dip galvanised steel and 12 mm tempered glass walls with nothing between the crowd and the rally. FIP tournament geometry, delivered turnkey.',
                  image: '/assets/images/dubai_court_night_construction_1779706759259.png',
                  imgLeft: true
                },
                {
                  num: '02',
                  category: 'SURFACE . REFIT',
                  title: 'RESURFACING & TURF',
                  desc: 'Tired court, true bounce restored. We strip, re-tension and re-dress with monofilament turf and calibrated silica sand — the surface pros ask for, fitted in days, not weeks.',
                  image: '/assets/images/padel_racket_set_lifestyle_1779706056285.png',
                  imgLeft: false
                },
                {
                  num: '03',
                  category: 'LIGHT . SHADE',
                  title: 'LIGHTING & CANOPY',
                  desc: 'Play through August. Shade canopies engineered for UAE wind loads and LED arrays tuned to 500 lux with zero glare on the glass — night matches that feel like television.',
                  image: '/assets/images/hero_padel_night_view_1779713624496.png',
                  imgLeft: true
                },
                {
                  num: '04',
                  category: 'PLANS . PRIORITY',
                  title: 'CARE & MAINTENANCE',
                  desc: 'Quarterly turf brushing, infill top-ups, glass and fixing inspections, net calibration. Clubs on a Court Hub plan get priority call-out — your court never has an off-season.',
                  image: '/assets/images/court_action_landscape_1779705580138.png',
                  imgLeft: false
                }
              ].map((item) => (
                <MoveEarthRow key={item.num} item={item} />
              ))}
            </div>

          </div>
        </section>


        {/* ================= SECTION 4: GALLERY SHOWCASE (STICKY HORIZONTAL VIEWPORT SCROLL) ================= */}
        <section ref={sectionRef} className="relative h-[600vh] bg-ink">

          <div className="sticky top-0 h-screen w-full overflow-hidden relative select-none border-t border-b border-white/5 bg-ink">

            {/* Horizontal Builds Gallery Content (Visible first, slides out) */}
            <motion.div
              style={{
                y: galleryY,
                opacity: galleryOpacity,
                pointerEvents: showAuthority ? "none" : "auto"
              }}
              className="absolute inset-0 w-full h-full flex flex-col justify-between pt-24 pb-10 md:py-14 z-10 animate-fade-in"
            >
              {/* Header Block exactly like reference */}
              <div className="pl-6 pr-6 md:pl-32 md:pr-12 lg:pr-16 xl:pr-24">
                <span className="font-mono text-xs text-lime uppercase tracking-[0.25em] font-black pb-1 block">
                  RECENT BUILDS
                </span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black uppercase tracking-[0.02em] text-white leading-[0.9]">
                  PROOF, POURED IN CONCRETE.
                </h2>
              </div>

              {/* Middle Interactive Scroll-Linked Strip */}
              <div className="flex-1 w-full flex items-center overflow-visible relative">
                <motion.div
                  ref={cardsContainerRef}
                  style={{ x: translateX }}
                  className="flex gap-10 sm:gap-14 md:gap-16 lg:gap-20 items-center px-12 md:px-24 lg:px-32 xl:px-44 py-8 w-fit select-none"
                >
                  {[
                    {
                      num: "01",
                      category: "COMMERCIAL CLUB",
                      title: "DIFC Urban Compound",
                      desc: "6 Panoramic World Tour Courts installed",
                      image: "/assets/images/hero_court_background_1779705118750.png"
                    },
                    {
                      num: "02",
                      category: "ELITE COMPLEX",
                      title: "Meydan Night Arena",
                      desc: "Calibrated 420 Lux floodlights & reinforced frame",
                      image: "/assets/images/dubai_court_night_construction_1779706759259.png"
                    },
                    {
                      num: "03",
                      category: "ARCHITECTURAL MODEL",
                      title: "Suspended Rooftop Spec",
                      desc: "Ultra-lightweight high wind tolerance chassis",
                      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=600&h=800"
                    },
                    {
                      num: "04",
                      category: "TOURNAMENT ARENA",
                      title: "Al Thanya Stadium",
                      desc: "5,000 capacity center court system with glass rails",
                      image: "/assets/images/tournament_crowd_night_1779707031611.png"
                    },
                    {
                      num: "05",
                      category: "PRIVATE RESIDENCE",
                      title: "Jumeirah Waterfront Villa",
                      desc: "1 Double Custom Navy and Slate Club System",
                      image: "/assets/images/hero_padel_night_view_1779713624496.png"
                    },
                    {
                      num: "06",
                      category: "BEACH CLUB",
                      title: "Palm Jumeirah Marina",
                      desc: "Anti-corrosion double design under high moisture",
                      image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=600&h=800"
                    }
                  ].map((item, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <motion.div
                        key={idx}
                        animate={{
                          scale: isActive ? 1.06 : 0.92,
                          opacity: isActive ? 1 : 0.40,
                          filter: isActive ? "brightness(1) contrast(1.05)" : "brightness(0.5) contrast(0.8) grayscale(0.25)",
                          borderColor: isActive ? "rgba(212,255,63,0.35)" : "rgba(255,255,255,0.06)",
                          boxShadow: isActive ? "0 32px 80px rgba(212,255,63,0.12)" : "0 16px 32px rgba(0,0,0,0.4)"
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 140,
                          damping: 24
                        }}
                        className="h-[34vh] sm:h-[36vh] md:h-[38vh] lg:h-[40vh] xl:h-[42vh] max-h-[380px] aspect-[3/4] shrink-0 rounded-[28px] overflow-hidden border relative bg-black select-none"
                      >
                        <motion.img
                          src={item.image}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 flex flex-col justify-end pointer-events-none select-none z-10" />
                        <div className="absolute bottom-6 left-6 right-6 pointer-events-none select-none z-20">
                          <span className="font-mono text-[9px] uppercase bg-white/15 backdrop-blur-md text-lime px-2.5 py-1 rounded-md border border-lime/10 font-bold tracking-wider inline-block">
                            {item.category}
                          </span>
                          <h4 className="text-xl font-display font-bold text-white uppercase italic mt-2.5 leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-white/50 text-[10px] font-mono uppercase mt-1 tracking-wider leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Bottom Pagination & Instructions Bar — left padding clears the fixed
                  rail (matches the "RECENT BUILDS" header block), so "01 / 06 BUILDS"
                  no longer tucks under the navbar. */}
              <div className="pl-6 pr-6 md:pl-32 md:pr-12 lg:pr-16 xl:pr-24 flex justify-between items-center text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/40 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-white font-black">{String(activeIndex + 1).padStart(2, '0')}</span>
                  <span>/</span>
                  <span>06 builds</span>
                </div>
                <div className="hidden sm:block text-right tracking-[0.2em] text-white/35 font-semibold">
                  KEEP SCROLLING — THE STRIP DRIVES SIDEWAYS
                </div>
              </div>
            </motion.div>

            {/* Same-Viewport Opposite Scrolling Section 5 (Authority / Why Partner With Us) - Enters directly from bottom */}
            <motion.div
              id="authority"
              style={{
                y: authorityY,
                opacity: authorityOpacity,
                pointerEvents: showAuthority ? "auto" : "none"
              }}
              className="absolute inset-0 bg-sand text-ink z-20 flex flex-col justify-between p-6 sm:p-10 lg:py-12 lg:px-20 xl:py-16 xl:px-28 select-none"
            >
              {/* Soft decorative brand ambient glow */}
              <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-court-blue/10 rounded-full blur-[100px] pointer-events-none z-0" />

              {/* Grid Background with fine spacing for balanced quadrants and elegant reduced opacity (0.04) */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,13,24,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,13,24,0.04)_1px,transparent_1px)] bg-[size:5.0rem_5.0rem] pointer-events-none z-0" />

              <div className="max-w-[1500px] mx-auto w-full flex-1 flex flex-col justify-between relative z-10">

                {/* Header Grid: Two columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start w-full">

                  {/* Left Column (Authority Badges) */}
                  <div className="lg:col-span-4 flex flex-col items-start gap-4 sm:gap-6 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-court-blue text-white flex items-center justify-center font-mono text-base font-bold shadow-sm ring-2 ring-court-blue/20">
                        ★
                      </div>
                      <div className="border border-ink/15 rounded-full px-5 py-2 bg-white text-ink font-mono text-xs lg:text-sm font-bold uppercase tracking-widest shadow-[0_1px_2px_rgba(0,0,0,0.02)] select-none">
                        WHY PARTNER WITH US
                      </div>
                    </div>

                    {/* Group of team portrait elements */}
                    <div className="space-y-3 pt-2 font-bold">
                      <div className="flex items-center -space-x-4 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120"
                          alt="Team Portrait 1"
                          className="inline-block h-12 w-12 rounded-full ring-2 ring-sand object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120"
                          alt="Team Portrait 2"
                          className="inline-block h-12 w-12 rounded-full ring-2 ring-sand object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120"
                          alt="Team Portrait 3"
                          className="inline-block h-12 w-12 rounded-full ring-2 ring-sand object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-court-blue text-white font-mono text-xs font-black ring-2 ring-sand pointer-events-none select-none">
                          15+
                        </div>
                      </div>
                      <p className="text-xs lg:text-sm font-mono uppercase tracking-[0.18em] text-ink/70 font-bold">
                        TRUSTED BY ELITE DEVELOPERS
                      </p>
                    </div>

                  </div>

                  {/* Right Column with premium hierarchy */}
                  <div className="lg:col-span-8 flex flex-col items-start gap-4 sm:gap-5 text-left w-full">

                    <div className="space-y-3 lg:space-y-4 text-left w-full">
                      <h3 className="text-2xl sm:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-display font-black text-ink uppercase tracking-tight italic select-none leading-[1.1] text-left">
                        CRAFTING THE <span className="text-court-blue">ULTIMATE</span> <span className="relative inline-block text-ink">
                          ADVANTAGE.
                          <span className="absolute left-0 bottom-1 sm:bottom-2 h-1.5 sm:h-2 bg-[#C8FF3D] w-full -z-10 -rotate-1 rounded-full opacity-80" />
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-ink/75 font-sans leading-relaxed tracking-wide text-left max-w-4xl">
                        At <strong className="text-ink font-bold">Court Hub</strong>, we do not build shortcuts. We build legacies. Padel is a high-speed, high-impact sport that demands absolute precision. Elite residential projects, municipal facilities, and world-class commercial academies choose us because they require flawless engineering, laser-accurate sub-base preparation, and lifetime structural integrity.
                      </p>
                    </div>

                    <div className="w-full space-y-4 lg:space-y-6 text-left">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-3 lg:pt-4 border-t border-ink/10 w-full">
                        <div className="space-y-1.5">
                          <span className="font-mono text-xs text-court-blue font-bold">01 / MICROPRECISION</span>
                          <h5 className="font-display font-black text-sm lg:text-base uppercase text-ink">Laser Grading</h5>
                          <p className="text-xs lg:text-[13px] text-ink/75 leading-relaxed font-sans">Sub-millimeter grading ensures a 100% flat bounce and rapid moisture drainage.</p>
                        </div>
                        <div className="space-y-1.5">
                          <span className="font-mono text-xs text-court-blue font-bold">02 / ENDURABILITY</span>
                          <h5 className="font-display font-black text-sm lg:text-base uppercase text-ink flex items-center gap-1.5">Windproof Frame</h5>
                          <p className="text-xs lg:text-[13px] text-ink/75 leading-relaxed font-sans">Reinforce structural posts designed to withstand severe wind forces effortlessly.</p>
                        </div>
                        <div className="space-y-1.5">
                          <span className="font-mono text-xs text-court-blue font-bold">03 / IN-HOUSE CONTROL</span>
                          <h5 className="font-display font-black text-sm lg:text-base uppercase text-ink">Turnkey Mastery</h5>
                          <p className="text-xs lg:text-[13px] text-ink/75 leading-relaxed font-sans">From deep excavation to final glass installation, we manage everything ourselves.</p>
                        </div>
                      </div>

                      <div className="pt-2 lg:pt-3">
                        <Link
                          href="/about"
                          className="inline-flex items-center gap-3 bg-court-blue hover:bg-ink text-white font-sans font-bold text-xs lg:text-sm uppercase tracking-widest px-6 py-3 lg:px-8 lg:py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 select-none group"
                        >
                          <span>DISCOVER OUR METHOD</span>
                          <ArrowUpRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* Bottom curves and stats — wrapped to the SAME centered max-w-[1500px] as the
                  header above (it was a full-bleed w-full sibling, so its left edge started left
                  of the "WHY PARTNER" column). Now the line + nodes + stats left-align with the
                  content above. X-only shift; no Y change. */}
              <div className="relative w-full max-w-[1500px] mx-auto h-auto mt-6 md:mt-10 pb-4 select-none overflow-visible">

                {/* Horizontal Curved Graph on Desktop/Tablet (md and up) */}
                <div className="hidden md:block absolute top-[20px] left-0 w-full h-[120px] pointer-events-none z-0 overflow-visible">
                  <svg className="w-full h-full text-ink/20 overflow-visible" viewBox="0 0 1000 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="line-pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1E5AE8" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#1E5AE8" stopOpacity="1.0" />
                        <stop offset="100%" stopColor="#1E5AE8" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    {/* Base grey line for grid integrity */}
                    <path
                      d="M 0,-8 C 280,16 580,44 1000,61"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                    {/* Premium glowing overlay gradient curve with slower stroke travel pulse */}
                    <motion.path
                      d="M 0,-8 C 280,16 580,44 1000,61"
                      fill="none"
                      stroke="url(#line-pulse-grad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray="200 800"
                      animate={{
                        strokeDashoffset: [1000, 0]
                      }}
                      transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </svg>
                </div>

                {/* Content grid with border dividers acting as vertical lines */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 md:gap-y-0 relative z-10 pt-4 md:pt-[24px]">

                  {/* Stat 1 */}
                  <div className="relative pt-4 md:pt-20 pl-0 md:pl-8 text-left group/stat cursor-pointer transition-all duration-300">
                    {/* Vertical dashed line starting from the dot and running to the bottom */}
                    <div
                      className="hidden md:block absolute left-0 border-l border-dashed border-ink/15 pointer-events-none"
                      style={{ top: '-12px', bottom: '0px' }}
                    />
                    {/* Glow Dot at the top-left intersection on desktop with delay=0 */}
                    <GlowingDot delay={0} top="-12px" />

                    <span className="font-mono text-xs lg:text-[13px] text-ink/65 group-hover/stat:text-lime font-bold uppercase tracking-widest block mb-2 sm:mb-2.5 transition-colors duration-300">Completed</span>
                    <motion.p
                      whileHover={{ scale: 1.15, color: '#C8FF3D', textShadow: '0 4px 12px rgba(10,13,24,0.1)' }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="font-sans text-3.5xl md:text-5xl lg:text-[3.5rem] font-black italic tracking-tighter leading-none text-ink origin-left inline-block"
                    >
                      124<span className="text-xl lg:text-2xl font-sans font-bold text-court-blue group-hover/stat:text-lime transition-colors duration-300 ml-0.5 shrink-0">+</span>
                    </motion.p>
                    <p className="text-[10px] lg:text-xs font-mono text-ink/50 group-hover/stat:text-ink/80 uppercase tracking-wider leading-relaxed mt-2.5 max-w-[170px] transition-colors duration-300">PRO-GRADE PROJECTS</p>
                  </div>

                  {/* Stat 2 */}
                  <div className="relative pt-4 md:pt-20 pl-0 md:pl-8 text-left group/stat cursor-pointer transition-all duration-300">
                    {/* Vertical dashed line starting from the dot and running to the bottom */}
                    <div
                      className="hidden md:block absolute left-0 border-l border-dashed border-ink/15 pointer-events-none"
                      style={{ top: '11px', bottom: '0px' }}
                    />
                    {/* Glow Dot at the top-left intersection on desktop with delay=1.2 */}
                    <GlowingDot delay={1.2} top="11px" />

                    <span className="font-mono text-xs lg:text-[13px] text-ink/65 group-hover/stat:text-lime font-bold uppercase tracking-widest block mb-2 sm:mb-2.5 transition-colors duration-300">WIND SPEED AT</span>
                    <motion.p
                      whileHover={{ scale: 1.15, color: '#C8FF3D', textShadow: '0 4px 12px rgba(10,13,24,0.1)' }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="font-sans text-3.5xl md:text-5xl lg:text-[3.5rem] font-black italic tracking-tighter leading-none text-ink origin-left inline-block"
                    >
                      145<span className="text-xs lg:text-sm uppercase font-sans font-bold text-court-blue group-hover/stat:text-lime transition-colors duration-300 ml-1.5 shrink-0">KM/H</span>
                    </motion.p>
                    <p className="text-[10px] lg:text-xs font-mono text-ink/50 group-hover/stat:text-ink/80 uppercase tracking-wider leading-relaxed mt-2.5 max-w-[170px] transition-colors duration-300">CERTIFIED RESISTANCE</p>
                  </div>

                  {/* Stat 3 */}
                  <div className="relative pt-4 md:pt-20 pl-0 md:pl-8 text-left group/stat cursor-pointer transition-all duration-300">
                    {/* Vertical dashed line starting from the dot and running to the bottom */}
                    <div
                      className="hidden md:block absolute left-0 border-l border-dashed border-ink/15 pointer-events-none"
                      style={{ top: '30px', bottom: '0px' }}
                    />
                    {/* Glow Dot at the top-left intersection on desktop with delay=2.4 */}
                    <GlowingDot delay={2.4} top="30px" />

                    <span className="font-mono text-xs lg:text-[13px] text-ink/65 group-hover/stat:text-lime font-bold uppercase tracking-widest block mb-2 sm:mb-2.5 transition-colors duration-300">PATENTED SILICA</span>
                    <motion.p
                      whileHover={{ scale: 1.15, color: '#C8FF3D', textShadow: '0 4px 12px rgba(10,13,24,0.1)' }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="font-sans text-3.5xl md:text-5xl lg:text-[3.5rem] font-black italic tracking-tighter leading-none text-ink origin-left inline-block"
                    >
                      99.8<span className="text-xl lg:text-2xl font-sans font-bold text-court-blue group-hover/stat:text-lime transition-colors duration-300 ml-0.5 shrink-0">%</span>
                    </motion.p>
                    <p className="text-[10px] lg:text-xs font-mono text-ink/50 group-hover/stat:text-ink/80 uppercase tracking-wider leading-relaxed mt-2.5 max-w-[170px] transition-colors duration-300">GRAIN SPHERICITY</p>
                  </div>

                  {/* Stat 4 */}
                  <div className="relative pt-4 md:pt-20 pl-0 md:pl-8 text-left group/stat cursor-pointer transition-all duration-300">
                    {/* Vertical dashed line starting from the dot and running to the bottom */}
                    <div
                      className="hidden md:block absolute left-0 border-l border-dashed border-ink/15 pointer-events-none"
                      style={{ top: '46px', bottom: '0px' }}
                    />
                    {/* Glow Dot at the top-left intersection on desktop with delay=3.6 */}
                    <GlowingDot delay={3.6} top="46px" />

                    <span className="font-mono text-xs lg:text-[13px] text-ink/65 group-hover/stat:text-lime font-bold uppercase tracking-widest block mb-1 sm:mb-1.5 transition-colors duration-300">GLASS COEF INDEX</span>
                    <motion.p
                      whileHover={{ scale: 1.15, color: '#C8FF3D', textShadow: '0 4px 12px rgba(10,13,24,0.1)' }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="font-sans text-3.5xl md:text-5xl lg:text-[3.5rem] font-black italic tracking-tighter leading-none text-court-blue origin-left inline-block"
                    >
                      12<span className="text-xs lg:text-sm uppercase font-sans font-bold text-ink/60 group-hover/stat:text-lime transition-colors duration-300 ml-1.5 shrink-0">MM</span>
                    </motion.p>
                    <p className="text-[10px] lg:text-xs font-mono text-ink/50 group-hover/stat:text-ink/80 uppercase tracking-wider leading-relaxed mt-2.5 max-w-[170px] transition-colors duration-300">TEMPERED MONOLITHIC</p>
                  </div>

                </div>
              </div>
            </motion.div>

          </div>
        </section>


        {/* Dynamic Process Sliding Strap */}
        <div className="w-full overflow-hidden bg-[#C8FF3D] py-4 sm:py-5 border-b border-ink/10 relative z-10 select-none flex">
          <motion.div
            className="flex shrink-0 items-center font-display font-black uppercase italic tracking-widest text-black text-xl sm:text-2xl md:text-3xl"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 55, repeat: Infinity }}
            style={{ willChange: 'transform' }}
          >
            {/* Two identical halves; each half repeats the phrase enough times to
                overflow the widest viewport, so x: 0% -> -50% wraps with NO empty gap. */}
            {[0, 1].map((half) => (
              <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex shrink-0 items-center gap-12 sm:gap-20 pr-12 sm:pr-20">
                    <span>SITE SURVEY</span>
                    <span className="text-black/25">•</span>
                    <span>DESIGN</span>
                    <span className="text-black/25">•</span>
                    <span>BUILD</span>
                    <span className="text-black/25">•</span>
                    <span>HANDOVER</span>
                    <span className="text-black/25">•</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ================= SECTION 6: INQUIRY FLOW (Guided multi-step pipeline configurator) ================= */}
        <section id="configurator" className="py-20 md:py-24 lg:py-0 lg:h-screen lg:min-h-[750px] lg:max-h-[920px] bg-ink px-6 md:px-8 relative text-white flex flex-col justify-center overflow-hidden">

          <div className="max-w-7xl w-full mx-auto space-y-8 lg:space-y-4 relative z-10">

            <div className="text-center space-y-4 lg:space-y-2.5 pb-4 lg:pb-1">
              <span className="inline-flex items-center gap-2 bg-court-blue/10 border border-court-blue/25 rounded-full px-4 py-1.5 lg:py-1 text-court-blue text-xs lg:text-[11px] uppercase tracking-widest font-mono select-none">
                <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse" />
                <span>Interactive Intelligent Configurator</span>
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-3xl xl:text-[2.25rem] font-display font-extrabold uppercase italic tracking-tight text-white leading-tight">
                CONFIGURE & <span className="text-lime">INQUIRE ON WHATSAPP</span>
              </h2>
              <p className="text-white/50 text-sm sm:text-base lg:text-xs xl:text-sm max-w-2xl mx-auto leading-relaxed hidden sm:block">
                Experience supreme guidance. Step through our blueprint selection. Watch your specifications build into a digital estimate payload in real-time.
              </p>
            </div>

            {/* Dynamic Interactive Pipeline Progress Tracker */}
            <div className="bg-[#1A1A17]/80 border border-white/5 rounded-[24px] lg:rounded-[20px] p-6.5 lg:p-4 lg:py-3 max-w-4xl w-full mx-auto backdrop-blur-md relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-32 h-32 bg-lime/10 blur-3xl rounded-full pointer-events-none" />

              {/* Desktop view: Horizontal Connected Pipeline nodes */}
              <div className="hidden md:flex items-center justify-between relative px-8 lg:px-6 py-0.5">
                {/* Horizontal progress connection wires */}
                <div className="absolute top-[23px] lg:top-[18px] left-[70px] lg:left-[55px] right-[70px] lg:right-[55px] h-[3px] lg:h-[2px] bg-white/5 z-0">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-lime to-court-blue shadow-[0_0_12px_rgba(200,255,61,0.6)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((activeStep - 1) / 4) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>

                {[
                  { id: 1, name: 'Frame Structure', desc: 'Model class' },
                  { id: 2, name: 'Underlay Sod', desc: 'Turf fibers' },
                  { id: 3, name: 'Sod Colorway', desc: 'Field shade' },
                  { id: 4, name: 'Structural Pane', desc: 'Glass face' },
                  { id: 5, name: 'GCC Site Base', desc: 'Inquiry details' }
                ].map((step) => {
                  const isCompleted = step.id < activeStep;
                  const isActive = step.id === activeStep;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className="flex flex-col items-center gap-2.5 lg:gap-1.5 relative z-10 focus:outline-none transition-all group cursor-pointer"
                    >
                      {/* Interactive circular checkpoint node */}
                      <div className={`w-11.5 h-11.5 lg:w-9 lg:h-9 rounded-full flex items-center justify-center font-mono text-xs sm:text-sm lg:text-[11px] font-black transition-all duration-200 ${
                        isCompleted
                          ? 'bg-lime text-ink ring-4 ring-lime/10 shadow-[0_0_16px_rgba(200,255,61,0.35)]'
                          : isActive
                            ? 'bg-ink border-2 border-lime text-lime shadow-[0_0_24px_rgba(200,255,61,0.5)] ring-4 ring-lime/5'
                            : 'bg-[#1A1A17] border border-white/10 text-white/30 group-hover:border-white/30 group-hover:text-white/60'
                      }`}>
                        {isCompleted ? <Check className="w-5 h-5 lg:w-3.5 lg:h-3.5 stroke-[3.5] lg:stroke-[3]" /> : `0${step.id}`}
                      </div>

                      {/* Responsive Labels */}
                      <div className="text-center">
                        <p className={`text-[11px] sm:text-xs lg:text-[10px] tracking-wider uppercase font-black transition-colors ${isActive ? 'text-lime' : isCompleted ? 'text-white/90' : 'text-white/35'}`}>
                          {step.name}
                        </p>
                        <p className={`text-[9px] sm:text-[10px] lg:text-[8px] font-mono text-white/20 mt-0.5 lg:mt-0 transition-colors ${isActive ? 'text-lime/50' : ''}`}>
                          {step.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Mobile View: Compact Slide Tracker */}
              <div className="md:hidden flex items-center justify-between px-3">
                <div className="space-y-1.5 text-left">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-lime bg-lime/10 px-3 py-1.5 rounded-md font-black select-none">
                    STEP 0{activeStep} / 05
                  </span>
                  <h5 className="font-display font-black text-base uppercase italic text-white tracking-wide">
                    {activeStep === 1 && "Frame Structure"}
                    {activeStep === 2 && "Underlay Sod"}
                    {activeStep === 3 && "Sod Colorway"}
                    {activeStep === 4 && "Structural Pane"}
                    {activeStep === 5 && "GCC Site Base"}
                  </h5>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((stepId) => (
                    <button
                      key={stepId}
                      onClick={() => setActiveStep(stepId)}
                      className={`w-6 h-2.5 rounded-full transition-all duration-300 ${
                        stepId === activeStep ? 'bg-lime w-9' : stepId < activeStep ? 'bg-lime/60' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Centered Guided Workspace */}
            <div className="pt-2">

              {/* Focused Specification View Card */}
              <div className="max-w-4xl mx-auto w-full bg-gradient-to-br from-ink-2 to-[#1A1A17]/80 p-8 sm:p-10 lg:p-6 rounded-[32px] lg:rounded-[24px] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[580px] md:min-h-[620px] lg:min-h-[460px] gap-8 lg:gap-4">
                <div className="absolute top-0 left-0 w-32 h-32 bg-court-blue/5 blur-3xl rounded-full pointer-events-none" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-6 flex-grow flex flex-col justify-between"
                  >
                    {/* Header describing active step selection */}
                    <div className="border-b border-white/5 pb-5 lg:pb-3">
                      <span className="font-mono text-xs sm:text-sm lg:text-[11px] font-bold text-lime tracking-widest uppercase block mb-1.5 lg:mb-1 matches-glow font-black">
                        SPECIFICATION STAGE 0{activeStep}
                      </span>
                      <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-xl xl:text-2xl uppercase italic text-white tracking-wide leading-tight">
                        {activeStep === 1 && "Select Frame Structural Model"}
                        {activeStep === 2 && "Choose Turf Sod Underlay"}
                        {activeStep === 3 && "Pick Turf Color Aesthetics"}
                        {activeStep === 4 && "Choose Glass Structural face Load"}
                        {activeStep === 5 && "Define GCC Region & Project Details"}
                      </h3>
                      <p className="text-white/50 text-sm sm:text-base lg:text-xs xl:text-sm mt-2.5 lg:mt-1.5 leading-relaxed text-left">
                        {activeStep === 1 && "Select our heavy duty premium chassis models. Highly reinforced profiles withstand severe weather vectors."}
                        {activeStep === 2 && "Our premium grass systems represent optimal energy rebound coefficients, sand integration ratios, and play feel."}
                        {activeStep === 3 && "Establish optimal visual colorway. Blue represents standards, while black details premium bespoke stadiums."}
                        {activeStep === 4 && "Wind shear tolerances. Heavy-impact 12mm structural templates stand optimal for severe beachfront pressure."}
                        {activeStep === 5 && "Complete your inquiry portfolio fields below. Instantly pre-encode your transmission WhatsApp packet."}
                      </p>
                    </div>

                    {/* Stage 1: Frame selection list */}
                    {activeStep === 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 lg:gap-3 py-1 lg:py-0.5">
                        {COURT_MODELS.map(opt => {
                          const isActive = selectedModel === opt.id;
                          return (
                            <motion.button
                              key={opt.id}
                              onClick={() => setSelectedModel(opt.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-5.5 lg:p-4 rounded-xl text-left border relative overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer select-none min-h-[140px] lg:min-h-[110px] group/btn ${
                                isActive
                                  ? 'bg-lime/5 border-lime text-white shadow-[0_0_32px_rgba(200,255,61,0.08)]'
                                  : 'bg-ink border-white/5 text-white/40 hover:border-white/15'
                              }`}
                            >
                              {isActive && (
                                <div className="absolute top-0 right-0 w-16 lg:w-12 h-16 lg:h-12 bg-lime/10 blur-xl rounded-full" />
                              )}

                              <div className="flex items-start justify-between gap-2.5 w-full relative z-10">
                                <span className={`font-display font-black text-xs sm:text-sm lg:text-xs uppercase italic tracking-wide transition-colors ${isActive ? 'text-lime' : 'text-white'}`}>
                                  {opt.name.replace("World Tour ", "")}
                                </span>
                                <div className={`w-5 h-5 lg:w-4 lg:h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                  isActive ? 'border-lime bg-lime' : 'border-white/15 bg-white/5'
                                }`}>
                                  {isActive && <Check className="w-3 h-3 lg:w-2 lg:h-2 text-black stroke-[4]" />}
                                </div>
                              </div>

                              <div className="relative z-10 flex flex-col mt-6 lg:mt-3">
                                <span className="font-mono text-[9px] lg:text-[8px] uppercase tracking-wider text-white/30">Class rating</span>
                                <span className={`font-mono text-[10px] sm:text-xs lg:text-[9.5px] uppercase tracking-tight mt-0.5 transition-colors ${isActive ? 'text-white/95 font-bold' : 'text-white/50'}`}>
                                  {opt.badge}
                                </span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    {/* Stage 2: Turf design list */}
                    {activeStep === 2 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-3 py-1 lg:py-0.5">
                        {[
                          { name: 'Mondo Supercourt XN', badge: 'WPT OFFICIAL GRADE', desc: 'World Padel Tour texturized fibers. extreme play speed, supreme sand containment.' },
                          { name: 'Classic Monofilament Club', badge: 'CLUB RESILIENCE', desc: 'Robust uniform fibers optimized for maximum lifetime density in high traffic centers.' }
                        ].map(opt => {
                          const isActive = selectedTurf === opt.name;
                          return (
                            <motion.button
                              key={opt.name}
                              onClick={() => setSelectedTurf(opt.name)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-5.5 lg:p-4 rounded-xl text-left border relative overflow-hidden transition-all duration-300 cursor-pointer select-none group/btn flex flex-col justify-between min-h-[140px] lg:min-h-[110px] gap-2 lg:gap-1.5 ${
                                isActive
                                  ? 'bg-lime/5 border-lime text-white shadow-[0_0_32px_rgba(200,255,61,0.08)]'
                                  : 'bg-ink border-white/5 text-white/40 hover:border-white/15'
                              }`}
                            >
                              {isActive && (
                                <div className="absolute top-0 right-0 w-16 lg:w-12 h-16 lg:h-12 bg-lime/10 blur-xl rounded-full" />
                              )}

                              <div className="w-full relative z-10 space-y-1.5 lg:space-y-1">
                                <div className="flex items-center justify-between w-full gap-2">
                                  <span className={`font-display font-black text-xs sm:text-sm lg:text-xs uppercase italic tracking-wide transition-colors ${isActive ? 'text-lime' : 'text-white'}`}>
                                    {opt.name}
                                  </span>
                                  <div className={`w-5 h-5 lg:w-4 lg:h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                    isActive ? 'border-lime bg-lime' : 'border-white/15 bg-white/5'
                                  }`}>
                                    {isActive && <Check className="w-3 h-3 lg:w-2 lg:h-2 text-black stroke-[4]" />}
                                  </div>
                                </div>
                                <span className={`inline-block font-mono text-[9px] lg:text-[8px] uppercase tracking-widest px-2 py-0.5 rounded leading-none ${
                                  isActive ? 'bg-lime/15 text-lime font-bold' : 'bg-white/5 text-white/30'
                                }`}>
                                  {opt.badge}
                                </span>
                                <p className={`text-xs sm:text-[13px] lg:text-[10.5px] leading-relaxed lg:leading-normal transition-colors ${isActive ? 'text-white/80' : 'text-white/45'}`}>
                                  {opt.desc}
                                </p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    {/* Stage 3: Colorway and swatches */}
                    {activeStep === 3 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 lg:gap-3 py-1 lg:py-0.5">
                        {[
                          { name: 'Tour Ocean Blue', bg: 'bg-court-blue', desc: 'WPT Touring standard' },
                          { name: 'Classic Forest Green', bg: 'bg-green', desc: 'Symmetrical look' },
                          { name: 'Stealth Matte Black', bg: 'bg-black border border-white/20', desc: 'Bespoke design' }
                        ].map(opt => {
                          const isActive = selectedColor === opt.name;
                          return (
                            <motion.button
                              key={opt.name}
                              onClick={() => setSelectedColor(opt.name)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-5 lg:p-3 rounded-xl border flex items-center justify-center gap-3 lg:gap-1.5 transition-all duration-300 cursor-pointer select-none min-h-[140px] lg:min-h-[110px] flex-col text-center ${
                                isActive
                                  ? 'bg-lime/5 border-lime text-white shadow-[0_0_32px_rgba(200,255,61,0.08)]'
                                  : 'bg-ink border-white/5 text-white/40 hover:border-white/15'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-3 lg:gap-1.5">
                                <div className={`w-10 lg:w-7 h-10 lg:h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                  isActive ? 'ring-2 ring-lime ring-offset-4 lg:ring-offset-2 ring-offset-ink animate-pulse' : 'ring-1 ring-white/10'
                                }`}>
                                  <div className={`w-7 lg:w-5 h-7 lg:h-5 rounded-full shadow-inner ${opt.bg}`} />
                                </div>
                                <div className="text-center space-y-1 lg:space-y-0.5">
                                  <span className={`text-[13px] sm:text-sm lg:text-xs font-mono font-bold leading-none block ${isActive ? 'text-lime' : 'text-white/85'}`}>{opt.name.replace("Tour ", "").replace("Classic ", "").replace("Stealth ", "")}</span>
                                  <span className="text-[10px] sm:text-xs lg:text-[9px] text-white/35 block tracking-normal">{opt.desc}</span>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    {/* Stage 4: Glass Structural face options */}
                    {activeStep === 4 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-3 py-1 lg:py-0.5">
                        {[
                          { name: '12mm Tempered Structural Glass', badge: 'HEAVY IMPACT / RATED', desc: '12mm safety profiles built for severe gusting wind pressures and open coastline areas.' },
                          { name: '10mm Toughened Standard Glass', badge: 'STANDARD LOAD / INDOOR', desc: '10mm sturdy tempered glass optimized for wind-shielded venues, domes & arenas.' }
                        ].map(opt => {
                          const isActive = selectedGlass === opt.name;
                          return (
                            <motion.button
                              key={opt.name}
                              onClick={() => setSelectedGlass(opt.name)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-5.5 lg:p-4 rounded-xl text-left border relative overflow-hidden transition-all duration-300 cursor-pointer select-none flex flex-col justify-between min-h-[140px] lg:min-h-[110px] gap-2 lg:gap-1.5 ${
                                isActive
                                  ? 'bg-lime text-ink border-lime shadow-[0_0_32px_rgba(200,255,61,0.15)]'
                                  : 'bg-ink border-white/5 text-white/40 hover:border-white/15'
                              }`}
                            >
                              {isActive && (
                                <div className="absolute top-0 right-0 w-16 lg:w-12 h-16 lg:h-12 bg-white/25 blur-xl rounded-full" />
                              )}

                              <div className="w-full relative z-10 space-y-1.5 lg:space-y-1">
                                <div className="flex items-start justify-between w-full gap-2">
                                  <span className={`font-display font-black text-xs sm:text-sm lg:text-xs uppercase italic tracking-wide leading-tight ${isActive ? 'text-ink' : 'text-white'}`}>
                                    {opt.name}
                                  </span>
                                  <div className={`w-5 h-5 lg:w-4 lg:h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                    isActive ? 'border-ink bg-ink' : 'border-white/15 bg-white/5'
                                  }`}>
                                    {isActive && <Check className="w-3 h-3 lg:w-2 lg:h-2 text-lime stroke-[4]" />}
                                  </div>
                                </div>
                                <span className={`inline-block font-mono text-[9px] lg:text-[8px] uppercase tracking-widest px-2 py-0.5 rounded leading-none ${
                                  isActive ? 'bg-black/15 text-black font-bold' : 'bg-white/5 text-white/30'
                                }`}>
                                  {opt.badge}
                                </span>
                                <p className={`text-xs sm:text-[13px] lg:text-[10.5px] leading-relaxed lg:leading-normal transition-colors ${isActive ? 'text-ink/80' : 'text-white/45'}`}>
                                  {opt.desc}
                                </p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    {/* Stage 5: Region metadata input fields */}
                    {activeStep === 5 && (
                      <div className="space-y-4 lg:space-y-3 py-1.5 lg:py-0.5 flex flex-col justify-between">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-3">
                          <div className="space-y-1.5 lg:space-y-1 text-left">
                            <label className="font-mono text-[10px] sm:text-xs lg:text-[9.5px] text-white/40 uppercase tracking-widest font-black block">Your Full Name</label>
                            <div className="relative">
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                                <Compass className="w-4 h-4" />
                              </div>
                              <input
                                type="text"
                                value={clientName || ''}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="e.g. Nicolas K."
                                className="w-full bg-[#0E0E0C] border border-white/10 rounded-xl lg:rounded-lg pl-10 pr-4 py-3 lg:py-2 text-xs sm:text-sm text-white placeholder:text-white/20 focus:border-lime/50 focus:ring-1 focus:ring-lime/30 outline-none transition-all duration-300 shadow-inner"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5 lg:space-y-1 text-left">
                            <label className="font-mono text-[10px] sm:text-xs lg:text-[9.5px] text-white/40 uppercase tracking-widest font-black block">Project GCC Region</label>
                            <div className="relative">
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <select
                                value={clientLocation}
                                onChange={(e) => setClientLocation(e.target.value)}
                                className="w-full bg-[#0E0E0C] border border-white/10 rounded-xl lg:rounded-lg pl-10 pr-10 py-3 lg:py-2 text-xs sm:text-sm text-white focus:border-lime/50 focus:ring-1 focus:ring-lime/30 outline-none transition-all duration-300 cursor-pointer appearance-none shadow-inner"
                              >
                                <option>Dubai</option>
                                <option>Abu Dhabi</option>
                                <option>Sharjah</option>
                                <option>Riyadh (Saudi Arabia)</option>
                                <option>Doha (Qatar)</option>
                                <option>Other GCC Area</option>
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-[9px]">▼</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 lg:space-y-1 text-left">
                          <label className="font-mono text-[10px] sm:text-xs lg:text-[9.5px] text-white/40 uppercase tracking-widest font-black block">Soil & Ground Notes (Optional)</label>
                          <div className="relative">
                            <div className="absolute left-3.5 top-3.5 lg:top-2.5 text-white/30 pointer-events-none">
                              <Layers className="w-4 h-4" />
                            </div>
                            <textarea
                              value={comments || ''}
                              onChange={(e) => setComments(e.target.value)}
                              placeholder="Describe actual terrain, dimensions or any specific constraints..."
                              rows={2}
                              className="w-full bg-[#0E0E0C] border border-white/10 rounded-xl lg:rounded-lg pl-10 pr-4 py-3 lg:py-2 text-xs sm:text-sm text-white placeholder:text-white/20 focus:border-lime/50 focus:ring-1 focus:ring-lime/30 outline-none transition-all duration-300 resize-none h-[75px] lg:h-[50px] shadow-inner"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Integrated Guidance Insight Desk */}
                    <div className="bg-[#1A1A17]/60 border border-white/5 rounded-2xl lg:rounded-xl p-5.5 lg:p-3.5 space-y-1.5 lg:space-y-1 select-none relative overflow-hidden group text-left mt-4 lg:mt-2.5 border-l-2 border-l-lime/30">
                      <div className="absolute top-0 right-0 px-2 py-0.5 font-mono text-[8.5px] lg:text-[7.5px] text-lime/50 bg-lime/10 rounded-bl tracking-widest font-black uppercase">ADVISOR</div>
                      <div className="flex items-center gap-2 text-lime">
                        <Sparkles className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-lime shrink-0" />
                        <span className="font-mono text-[10px] sm:text-xs lg:text-[9px] uppercase tracking-widest font-black">
                          {activeStep === 1 && "FRAME ASSEMBLY ADVISORY"}
                          {activeStep === 2 && "TURF FIBER REBOUND ANALYSIS"}
                          {activeStep === 3 && "AESTHETICS & CONTRAST INDEX"}
                          {activeStep === 4 && "EXTREME WIND PRESSURE ADVISORY"}
                          {activeStep === 5 && "INTELLIGENT PRE-PACKAGING ACTIVE"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13.5px] lg:text-[10.5px] leading-relaxed text-white/60 pl-6 lg:pl-5">
                        {activeStep === 1 && "For outdoor or high-exposure facilities, Panoramic models allow maximum branding visibility."}
                        {activeStep === 2 && "Mondo Supercourt fibers reduce systemic joint fatigue. Classic Monofilament provides massive durability."}
                        {activeStep === 3 && "Tour Blue offers ideal broadcast luminosity. Matte Black establishes extreme, bespoke stadium luxury."}
                        {activeStep === 4 && "Coastal winds require 12mm Tempered Safety Glass. Toughened 10mm provides ideal budget efficiency outdoors."}
                        {activeStep === 5 && "Your selections have drafted a proposal payload. Launching WhatsApp delivers this package to our Dubai office."}
                      </p>
                    </div>

                  </motion.div>
                </AnimatePresence>

                {/* Bottom Navigation Floor */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 lg:pt-3.5 border-t border-white/5 mt-auto gap-4 lg:gap-3">
                  <div className="flex items-center gap-4.5 w-full sm:w-auto">
                    <button
                      onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                      disabled={activeStep === 1}
                      className={`px-6 py-3.5 lg:px-4 lg:py-2.5 w-full sm:w-auto rounded-xl lg:rounded-lg border border-white/10 font-mono text-xs lg:text-[10.5px] uppercase font-extrabold tracking-wider flex items-center justify-center gap-2 transition-all ${
                        activeStep === 1
                          ? 'opacity-35 cursor-not-allowed text-white/25 border-white/5 bg-transparent'
                          : 'bg-ink hover:bg-white/5 text-white/80 hover:text-white cursor-pointer active:scale-95'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 lg:w-3.5 lg:h-3.5" />
                      <span>Back</span>
                    </button>
                  </div>

                  {activeStep === 5 && (
                    <div className="flex items-center gap-2 text-white/50 font-mono text-xs lg:text-[10px] uppercase tracking-wider select-none py-1">
                      <Clock className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-lime animate-pulse" />
                      <span>Direct WhatsApp Dispatch</span>
                    </div>
                  )}

                  <div className="w-full sm:w-auto">
                    {activeStep < 5 ? (
                      <button
                        onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                        className="w-full sm:w-auto px-7 py-3.5 lg:px-5 lg:py-2.5 bg-lime hover:bg-[#C8FF3D] text-ink font-mono text-xs lg:text-[11px] uppercase font-black tracking-widest rounded-xl lg:rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-lime/10 transition-all cursor-pointer active:scale-95"
                      >
                        <span>Next Step</span>
                        <ChevronRight className="w-4 h-4 lg:w-3.5 lg:h-3.5 stroke-[3]" />
                      </button>
                    ) : (
                      <motion.a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.02, backgroundColor: "#FFFFFF" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto px-8 py-4 lg:px-6 lg:py-3 bg-lime hover:bg-[#C8FF3D] text-ink transition-all font-mono font-black text-xs sm:text-[13px] lg:text-[11px] tracking-widest rounded-xl lg:rounded-lg flex items-center justify-center gap-2 shadow-2xl shadow-lime/10 cursor-pointer select-none"
                      >
                        <MessageSquare className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-ink" />
                        <span>LAUNCH ESTIMATE VIA WHATSAPP</span>
                        <ArrowUpRight className="w-3.5 h-3.5 lg:w-3 lg:h-3 text-ink stroke-[2.5]" />
                      </motion.a>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        <Footer hideTopBorder />

        </div>
      </main>
    </div>
  );
}
