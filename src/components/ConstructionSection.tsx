import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ConstructionSectionProps {
  isLoaded: boolean;
  onProgress: (progress: number) => void;
}

export default function ConstructionSection({ isLoaded, onProgress }: ConstructionSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const formRef = useRef<HTMLDivElement>(null);
  
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('Dubai');

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello Court Hub, I'd like to request a proposal for padel court construction.\n\nContact: ${contact}\nLocation: ${location}`;
    const whatsappUrl = `https://wa.me/971500000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // 1. Preload construction frames
  useEffect(() => {
    let active = true;
    const frameCount = 150;
    const folderPath = '/construction-frames';
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
        console.error(`Failed to load construction frame: ${frameNum}`);
        handleLoad();
      };

      img.src = `${folderPath}/ezgif-frame-${frameNum}.webp`;
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      active = false;
    };
  }, []);

  // 2. Setup GSAP ScrollTrigger Sequence
  useEffect(() => {
    if (!isLoaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions to 1920x1080 for 1:1 hardware acceleration
    canvas.width = 1920;
    canvas.height = 1080;

    const drawFrame = (index: number) => {
      const roundedIndex = Math.round(index);
      const img = imagesRef.current[roundedIndex];
      if (img && img.complete && img.naturalWidth !== 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    // Draw first frame initially
    drawFrame(0);

    const ctx = gsap.context(() => {
      const playhead = { frame: 0 };
      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: isMobile ? 0.3 : 0.8,
        }
      });

      // Frame scrubbing animation
      tl.to(playhead, {
        frame: 149,
        snap: { frame: 1 },
        ease: 'none',
        duration: 3,
        onUpdate: () => {
          drawFrame(playhead.frame);
        }
      }, 0);

      // Form fade-in animation during the final reserve phase
      tl.fromTo(formRef.current,
        { opacity: 0, x: 50, pointerEvents: 'none' },
        { opacity: 1, x: 0, pointerEvents: 'auto', duration: 1.0, ease: 'power2.out' },
        3.2
      );

      // Final reserve phase for visual completion
      tl.to({}, { duration: 1.5 }, 3.0);

    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <div className="relative">

      {/* 2. Main Scroll Container */}
      <section 
        ref={containerRef}
        id="construction"
        className="relative w-full h-[400vh] bg-sand"
      >
        {/* Top Gradient Transition from Shop Section (Dark Ink to Transparent) */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-ink to-transparent z-10 pointer-events-none" />

        {/* Bottom Gradient Transition to Story Section (Transparent to Sand) */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sand to-transparent z-10 pointer-events-none" />

        {/* Sticky Viewport Frame Wrapper */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
          
          {/* Background Canvas Sequence */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* WhatsApp Request Panel Overlay (Appears on the right side once court finishes building) */}
          <div 
            ref={formRef}
            className="absolute right-6 left-6 md:left-auto md:right-16 lg:right-24 top-1/2 -translate-y-1/2 max-w-sm md:max-w-md w-auto md:w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-[30px] md:rounded-[40px] p-6 md:p-8 space-y-6 z-20 opacity-0 shadow-2xl pointer-events-auto"
          >
            <div className="space-y-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-lime uppercase font-bold">/// Builder Proposal ///</span>
              <h3 className="text-2xl md:text-4xl font-display font-black text-white uppercase italic leading-none">Build Your <br /> Padel Court</h3>
              <p className="text-[11px] md:text-xs text-white/50 leading-relaxed">
                From premium shock-absorbing glass structures to professional turf. Send us your requirements to receive a customized WhatsApp estimate.
              </p>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">Contact Info</label>
                <input 
                  type="text" 
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Email or Phone Number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 text-xs md:text-sm text-white placeholder:text-white/20 focus:border-lime/40 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">Court Location</label>
                <div className="relative">
                  <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 text-xs md:text-sm text-white appearance-none focus:border-lime/40 outline-none transition-all cursor-pointer"
                  >
                    <option value="Dubai" className="bg-ink">Dubai</option>
                    <option value="Abu Dhabi" className="bg-ink">Abu Dhabi</option>
                    <option value="Sharjah" className="bg-ink">Sharjah</option>
                    <option value="Ras Al Khaimah" className="bg-ink">Ras Al Khaimah</option>
                    <option value="Fujairah" className="bg-ink">Fujairah</option>
                    <option value="Ajman" className="bg-ink">Ajman</option>
                    <option value="Umm Al Quwain" className="bg-ink">Umm Al Quwain</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-lime text-ink rounded-xl md:rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
