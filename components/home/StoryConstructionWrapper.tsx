'use client';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OurStorySection, { OurStoryContent, OurStoryVideoBlock } from './OurStorySection';
import ConstructionSection from './ConstructionSection';

gsap.registerPlugin(ScrollTrigger);

// Constants for tuning
const SCROLL_LENGTH = '+=350%';
const CAMERA_TRAVEL_END = 0.55;
const FRAME_SMOOTHING = 0.5;

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
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraWorldRef = useRef<HTMLDivElement>(null);
  const desktopCanvasRef = useRef<HTMLCanvasElement>(null);
  const desktopFormRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

  // 1. Detect screen size (desktop >= 1024px)
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
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
    if (!isLoaded || !isDesktop || !stageRef.current || !cameraWorldRef.current || !desktopCanvasRef.current) return;

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

      // Phase A: CameraWorld translateY from -100vh to 0 over progress 0 -> 0.55
      tl.fromTo(cameraWorldRef.current, 
        { y: '-100vh' },
        { y: '0px', ease: 'none', duration: CAMERA_TRAVEL_END },
        0
      );

      // Phase B: hold CameraWorld at translateY 0 (progress 0.55 -> 1.0)
      tl.to({}, { duration: 1.0 - CAMERA_TRAVEL_END }, CAMERA_TRAVEL_END);

      // Frame sequence: drive the construction frame index across the FULL 0 -> 1.0 timeline
      tl.to(playhead, {
        frame: 149,
        ease: 'none',
        duration: 1.0,
        onUpdate: () => {
          drawFrame(playhead.frame);
        }
      }, 0);

      // Form fade-in on the right side of construction canvas
      tl.fromTo(desktopFormRef.current,
        { opacity: 0, x: 50, pointerEvents: 'none' },
        { opacity: 1, x: 0, pointerEvents: 'auto', ease: 'power2.out', duration: 0.2 },
        0.75
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
  }, [isLoaded, isDesktop]);

  // Trigger ScrollTrigger.refresh() on font load, video metadata load, etc.
  useEffect(() => {
    if (isLoaded && isDesktop) {
      const handleLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', handleLoad);
      document.fonts.ready.then(handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
      };
    }
  }, [isLoaded, isDesktop]);

  return (
    <>
      {/* 1. Mobile & Tablet Layout (<1024px) - Completely untouched */}
      {!isDesktop && (
        <>
          <OurStorySection />
          <ConstructionSection 
            isLoaded={isLoaded} 
            onProgress={() => {}} // progress managed by wrapper
            preloadedImages={imagesRef}
          />
        </>
      )}

      {/* 2. Desktop Layout (>= 1024px) - Reverse-direction Scroll Stage */}
      {isDesktop && (
        <>
          {/* Pin Stage */}
          <div 
            ref={stageRef} 
            className="relative w-full h-screen overflow-hidden bg-sand z-10 select-none"
          >
            {/* Camera World (200vh tall container stacked vertically) */}
            <div 
              ref={cameraWorldRef} 
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
