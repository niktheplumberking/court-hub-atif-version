import { useState, useEffect, useRef } from 'react';
import storyVideo from '../../public/infinityloopvideo_edited_done.mp4';
import storyMobileVideo from '../../public/our_story_mobile_video.mp4';

export default function OurStorySection() {
  const [videoSrc, setVideoSrc] = useState(storyVideo);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Dynamic responsive video source selection to prevent autoplay blocks
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVideoSrc(storyMobileVideo);
      } else {
        setVideoSrc(storyVideo);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Bulletproof autoplay and infinite loop handler
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay blocked:", err);
      });
    }
  }, [videoSrc]);

  return (
    <section 
      id="story" 
      className="relative min-h-screen pt-20 pb-[42vh] md:py-32 px-6 md:px-8 bg-sand text-ink z-20 flex items-start md:items-center overflow-hidden"
    >
      {/* HTML5 Infinite Loop Video Background (Single instance to guarantee loop and bypass browser block) */}
      <video 
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        poster="/images/our_story_racket.jpg"
        onEnded={(e) => {
          e.currentTarget.play().catch(() => {});
        }}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Subtle overlay to ensure high readability of text */}
      <div className="absolute inset-0 bg-white/15 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">

          {/* Left Column: Story & Philosophy - Scaled down on mobile to fit above elements */}
          <div className="lg:col-span-5 space-y-6 md:space-y-12">
            <div className="space-y-4 md:space-y-6">
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-court-blue font-bold">
                /// Our Story ///
              </p>

              <h2 className="text-2xl md:text-7xl font-display font-extrabold leading-[0.95] tracking-tighter uppercase italic text-ink">
                Crafted <br />
                For The <br />
                <span className="text-court-blue">Obsessed.</span>
              </h2>
            </div>

            <div className="space-y-4 md:space-y-6">
              <p className="text-xs md:text-lg leading-relaxed text-ink/80 font-normal">
                We believe padel is more than just a sport—it is a pursuit of pure precision, relentless speed, and the raw joy of the perfect shot. From our hand-laid court surfaces to the balanced carbon core of our rackets, Court Hub is built by players, for players.
              </p>
              <p className="text-[11px] md:text-base leading-relaxed text-ink/70 font-light">
                Every detail is engineered to perform at the highest level. We source the finest materials, collaborate with world-class engineers, and design for those who live and play with passion.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-6 border-t border-ink/10">
              <div className="space-y-1 md:space-y-2">
                <span className="font-mono text-[9px] md:text-xs text-court-blue font-bold">01 / CARBON</span>
                <h4 className="font-display font-bold text-xs md:text-sm uppercase">Elite Fiber</h4>
                <p className="text-[10px] md:text-[11px] text-ink/60 leading-snug">Premium Japanese carbon weave for responsive stiffness.</p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <span className="font-mono text-[9px] md:text-xs text-court-blue font-bold">02 / GEOMETRY</span>
                <h4 className="font-display font-bold text-xs md:text-sm uppercase">Optimized Sweetspot</h4>
                <p className="text-[10px] md:text-[11px] text-ink/60 leading-snug">Aerodynamic frame layouts maximizing power transfer.</p>
              </div>
              <div className="space-y-1 md:space-y-2">
                <span className="font-mono text-[9px] md:text-xs text-court-blue font-bold">03 / SURFACES</span>
                <h4 className="font-display font-bold text-xs md:text-sm uppercase">Elite Courts</h4>
                <p className="text-[10px] md:text-[11px] text-ink/60 leading-snug">Multi-layered shock-absorbing court engineering.</p>
              </div>
            </div>
          </div>

          {/* Right side left empty so that the background image is clearly visible */}
          <div className="hidden lg:block lg:col-span-7" />

        </div>
      </div>
    </section>
  );
}
