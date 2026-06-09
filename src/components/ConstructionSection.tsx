import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ChevronDown, Mail, MapPin, Check, ShieldCheck, Sparkles } from 'lucide-react';

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
  const [courtModel, setCourtModel] = useState<'classic' | 'panoramic' | 'super'>('panoramic');

  const COURT_CONFIGS = {
    classic: {
      name: 'Classic Model',
      specs: [
        '10mm tempered safety glass panels',
        'Standard textured monofilament turf',
        '4x 200W high-efficiency LED lights',
        'Hot-dip galvanized steel structure'
      ]
    },
    panoramic: {
      name: 'Panoramic Pro',
      specs: [
        '12mm panoramic tempered safety glass',
        'WPT-grade textured monofilament turf',
        '8x 200W professional LED floodlights',
        'Seamless reinforced structure frame'
      ]
    },
    super: {
      name: 'Super Panoramic',
      specs: [
        '12mm ultimate safety glass panels',
        'Premium WPT textured turf',
        '8x 240W elite smart LED floodlights',
        'Championship double-reinforced structure'
      ]
    }
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const modelName = COURT_CONFIGS[courtModel].name;
    const message = `Hello Court Hub, I'd like to request a proposal for padel court construction.

Configuration Details:
- Court Model: ${modelName}
- Court Location: ${location}
- Contact Details: ${contact}`;
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
        {/* Bottom Gradient Transition to FAQ Section (Transparent to Sand) */}
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
            className="absolute right-6 left-6 md:left-auto md:right-16 lg:right-24 top-1/2 -translate-y-1/2 max-w-sm md:max-w-md lg:max-w-[480px] w-auto md:w-full bg-ink border border-white/10 rounded-[30px] md:rounded-[40px] p-6 md:p-8 space-y-5 z-20 opacity-0 shadow-[0_0_50px_rgba(30,90,232,0.18)] hover:shadow-[0_0_60px_rgba(30,90,232,0.25)] transition-shadow duration-500 pointer-events-auto"
          >
            {/* System telemetry header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="radar-pulse-effect absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green"></span>
                </span>
                <span className="font-mono text-[9px] tracking-wider text-green uppercase font-semibold">
                  Live Proposal System // Online
                </span>
              </div>
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
                CH-v2.0
              </span>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-lime uppercase font-bold">/// Builder Configurator ///</span>
              <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase italic leading-none">Configure Your Court</h3>
              <p className="text-[11px] md:text-xs text-white/50 leading-relaxed">
                Select a court model specs, check key features in real-time, and get a customized instant quote on WhatsApp.
              </p>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              
              {/* Interactive Tabs for Court Model */}
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold block">1. Select Court Model</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'classic', label: 'Classic' },
                    { id: 'panoramic', label: 'Panoramic' },
                    { id: 'super', label: 'Super Pro' }
                  ].map((model) => {
                    const isActive = courtModel === model.id;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => setCourtModel(model.id as any)}
                        className={`py-3 px-1 rounded-xl text-[10px] md:text-xs font-display font-bold uppercase tracking-wider transition-all duration-300 border text-center cursor-pointer ${
                          isActive
                            ? 'bg-lime text-ink border-lime shadow-[0_0_15px_rgba(200,255,61,0.25)] font-extrabold'
                            : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {model.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic specs details box */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
                    Specifications Details
                  </span>
                  <span className="font-mono text-[9px] text-lime uppercase tracking-widest font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {COURT_CONFIGS[courtModel].name}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {COURT_CONFIGS[courtModel].specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[11px] text-white/80">
                      <Check className="w-3.5 h-3.5 text-lime shrink-0 mt-0.5" />
                      <span className="leading-snug">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input for contact details */}
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold block">2. Contact Info</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-white/30 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Email or Phone Number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-11 pr-4 py-4 text-xs md:text-sm text-white placeholder:text-white/20 focus:border-lime focus:ring-1 focus:ring-lime focus:bg-white/[0.07] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Input for location select */}
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold block">3. Court Location</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-white/30 pointer-events-none">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-11 pr-10 py-4 text-xs md:text-sm text-white appearance-none focus:border-lime focus:ring-1 focus:ring-lime focus:bg-white/[0.07] outline-none transition-all cursor-pointer"
                  >
                    <option value="Dubai" className="bg-ink text-white">Dubai</option>
                    <option value="Abu Dhabi" className="bg-ink text-white">Abu Dhabi</option>
                    <option value="Sharjah" className="bg-ink text-white">Sharjah</option>
                    <option value="Ras Al Khaimah" className="bg-ink text-white">Ras Al Khaimah</option>
                    <option value="Fujairah" className="bg-ink text-white">Fujairah</option>
                    <option value="Ajman" className="bg-ink text-white">Ajman</option>
                    <option value="Umm Al Quwain" className="bg-ink text-white">Umm Al Quwain</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                </div>
              </div>

              {/* WhatsApp submit CTA */}
              <div className="pt-2 space-y-3">
                <button 
                  type="submit"
                  className="w-full py-4 bg-lime text-ink rounded-xl md:rounded-2xl font-display font-extrabold uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 button-glow-effect cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-ink" />
                  Chat on WhatsApp
                </button>
                
                <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-white/40 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-lime" />
                  <span>PROPOSAL DELIVERED SECURELY IN SECONDS</span>
                </div>
              </div>

            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
