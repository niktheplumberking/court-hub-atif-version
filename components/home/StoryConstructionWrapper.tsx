'use client';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OurStorySection, { OurStoryContent, OurStoryVideoBlock } from './OurStorySection';
import ConstructionSection from './ConstructionSection';

gsap.registerPlugin(ScrollTrigger);

// Constants for tuning
const SCROLL_LENGTH = '+=490%';
const FRAME_SMOOTHING = 0.5;

// Desktop reverse-scroll timeline phase weights (proportioned across SCROLL_LENGTH;
// at +=490% each unit ≈ one viewport height of scroll):
//   DWELL  — Our Story holds full-screen before the reverse scroll begins (so the
//            user gets breathing room instead of an instant flip).
//   TRAVEL — camera slides Construction down into view (the reverse scroll). Its
//            speed is preserved from the original 0.55-of-350% ratio (~0.52 camera
//            vh per scroll vh) so the motion feels exactly as before.
//   SCRUB  — construction frames reproduce, and ONLY once Construction is 100% in
//            view (i.e. after TRAVEL completes).
//   FORM   — the configurator fades in, and ONLY after the final frame has played.
const PHASE_DWELL = 0.5;
const PHASE_TRAVEL = 1.9;
const PHASE_SCRUB = 2.0;
const PHASE_FORM = 0.5;

interface StoryConstructionWrapperProps {
  isLoaded: boolean;
  onProgress: (progress: number) => void;
}

export default function StoryConstructionWrapper({ isLoaded, onProgress }: StoryConstructionWrapperProps) {
  // Plain false initial state: the server always renders the mobile branch, so the
  // first client render MUST match it (reading matchMedia in the initializer caused a
  // guaranteed hydration mismatch on desktop). The matchMedia effect below flips this
  // post-mount; the unified preload no longer depends on isDesktop, so nothing regresses.
  const [isDesktop, setIsDesktop] = useState(false);
  // Reduced motion: false on the server and first client render (SSR parity);
  // flipped post-mount. When true on desktop we fall back to the stacked,
  // normal-scroll layout instead of the 490% pinned reverse-scroll stage — the
  // whole codebase gates motion this way, and this is the heaviest scene on the
  // page, so honoring the OS preference here matters most.
  const [reduceMotion, setReduceMotion] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraWorldRef = useRef<HTMLDivElement>(null);
  const desktopCanvasRef = useRef<HTMLCanvasElement>(null);
  const desktopFormRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

  // The cinematic reverse-scroll stage runs only on a real desktop AND only when
  // the user hasn't asked for reduced motion. Otherwise everyone gets the stacked
  // layout, which presents the very same Our Story + Construction + configurator
  // content in a plain, fully scrollable form.
  const useReverseStage = isDesktop && !reduceMotion;

  // 1. Detect screen size (desktop >= 1024px)
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // 1b. Detect reduced-motion preference (and respond if it changes live)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(media.matches);
    const listener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // 2. Preload construction frames once for both mobile/desktop layouts.
  // Both branches use the same deployed sequence: /construction-frames, 150 webp.
  // (The old mobile folder '/construction frames mobile only' never existed → 90x 404 spam.)
  useEffect(() => {
    let active = true;
    const frameCount = 150;
    const folderPath = '/construction-frames';
    const ext = 'webp';
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      
      const handleLoad = () => {
        if (!active) return;
        loadedCount++;
        const progress = Math.round((loadedCount / frameCount) * 100);
        onProgress(progress);
      };

      img.onload = () => {
        if ('decode' in img) {
          img.decode().then(() => {
            if (active) handleLoad();
          }).catch(() => {
            if (active) handleLoad();
          });
        } else {
          handleLoad();
        }
      };

      img.onerror = () => {
        if (!active) return; // don't spam the console after unmount/cleanup
        console.error(`Failed to load construction frame: ${frameNum}`);
        handleLoad();
      };

      img.src = `${folderPath}/ezgif-frame-${frameNum}.${ext}`;
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      active = false;
    };
  }, [onProgress]);

  // 3. Setup GSAP ScrollTrigger Sequence for Desktop
  useEffect(() => {
    if (!isLoaded || !useReverseStage || !stageRef.current || !cameraWorldRef.current || !desktopCanvasRef.current) return;

    const canvas = desktopCanvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const drawFrame = (index: number) => {
      const roundedIndex = Math.min(149, Math.max(0, Math.round(index)));
      const img = imagesRef.current[roundedIndex];
      if (img && img.complete && img.naturalWidth !== 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    // Draw first frame initially
    drawFrame(0);

    // Visibility observer for video inside stage to autoplay/loop properly
    const video = desktopVideoRef.current;
    if (video) {
      video.play().catch(() => {});
    }

    const ctx = gsap.context(() => {
      const playhead = { frame: 0 };

      // Configurator initial state: hidden AND non-interactive. An opacity:0
      // element still hit-tests, so pointer-events must be off until it actually
      // appears — otherwise the invisible form would silently intercept clicks
      // over the canvas during the dwell/travel/scrub phases.
      gsap.set(desktopFormRef.current, { opacity: 0, x: 50, pointerEvents: 'none' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          end: SCROLL_LENGTH,
          pin: true,
          scrub: FRAME_SMOOTHING,
          anticipatePin: 1,
        }
      });

      // Phase 0 — DWELL: reserve scroll while Our Story stays full-screen, giving
      // the user a few scrolls of breathing room before the reverse scroll. The
      // camera fromTo below uses immediateRender (default), so the -100vh start is
      // applied on creation and simply held through this dwell.
      tl.to({}, { duration: PHASE_DWELL }, 0);

      // Phase A — TRAVEL: camera slides from Our Story (-100vh) up to Construction
      // (0). This is the "reverse scroll"; its speed matches the original. fromTo
      // pins the start value deterministically across forward/backward scrubbing.
      tl.fromTo(cameraWorldRef.current,
        { y: '-100vh' },
        { y: '0px', ease: 'none', duration: PHASE_TRAVEL },
        PHASE_DWELL
      );

      // Phase B — SCRUB: construction frames reproduce, starting ONLY once the
      // camera has fully arrived (Construction 100% in view). Until then the
      // canvas holds frame 0, so sliding the section in never animates frames.
      tl.to(playhead, {
        frame: 149,
        ease: 'none',
        duration: PHASE_SCRUB,
        onUpdate: () => {
          drawFrame(playhead.frame);
        }
      }, PHASE_DWELL + PHASE_TRAVEL);

      // Phase C — FORM: the configurator fades in, starting ONLY after the last
      // frame has played (frames 100% reproduced).
      tl.to(desktopFormRef.current,
        { opacity: 1, x: 0, pointerEvents: 'auto', ease: 'power2.out', duration: PHASE_FORM },
        PHASE_DWELL + PHASE_TRAVEL + PHASE_SCRUB
      );

    }, stageRef);

    // Refresh layout calculations
    ScrollTrigger.refresh();

    // Trigger video play inside ScrollTrigger visibility observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && desktopVideoRef.current) {
            desktopVideoRef.current.play().catch(() => {});
          }
        });
      },
      { threshold: 0.05 }
    );
    if (video) {
      observer.observe(video);
    }

    return () => {
      ctx.revert();
      if (video) {
        observer.disconnect();
      }
    };
  }, [isLoaded, useReverseStage]);

  // Trigger ScrollTrigger.refresh() on font load, video metadata load, etc.
  useEffect(() => {
    if (isLoaded && useReverseStage) {
      const handleLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', handleLoad);
      document.fonts.ready.then(handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
      };
    }
  }, [isLoaded, useReverseStage]);

  return (
    <>
      {/* 1. Stacked layout — mobile/tablet (<1024px) AND any reduced-motion user.
          Same Our Story + Construction content, plain scroll, no pinned stage. */}
      {!useReverseStage && (
        <>
          <OurStorySection />
          <ConstructionSection
            isLoaded={isLoaded}
            onProgress={() => {}} // progress managed by wrapper
            preloadedImages={imagesRef}
          />
        </>
      )}

      {/* 2. Desktop Layout (>= 1024px, motion allowed) - Reverse-direction Scroll Stage */}
      {useReverseStage && (
        <>
          {/* Pin Stage */}
          <div 
            ref={stageRef} 
            className="relative w-full h-screen overflow-hidden bg-sand z-10 select-none"
          >
            {/* Camera World (200vh tall container stacked vertically) */}
            <div
              ref={cameraWorldRef}
              data-camera-world
              className="w-full h-[200vh] flex flex-col relative will-change-transform bg-sand"
            >
              {/* Top Layer: ConstructionSection (100vh) */}
              <div className="w-full h-screen relative overflow-hidden bg-sand flex-shrink-0">
                <ConstructionSection 
                  isLoaded={isLoaded} 
                  onProgress={() => {}} 
                  preloadedImages={imagesRef}
                  isDesktop={true}
                  canvasRef={desktopCanvasRef}
                  formRef={desktopFormRef}
                />
              </div>

              {/* Bottom Layer: Our Story video block (100vh) with overlaid text */}
              <div id="story" className="w-full h-screen relative overflow-hidden bg-sand flex-shrink-0">
                <div className="absolute inset-0 w-full h-full z-0">
                  <OurStoryVideoBlock 
                    videoRef={desktopVideoRef} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="relative z-10 h-full flex items-center px-8 text-ink">
                  <div className="max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
                      <OurStoryContent isDesktop={true} />
                      <div className="hidden lg:block lg:col-span-7" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
