import { motion, useScroll, useTransform } from 'motion/react';
import { Clock, MapPin, ChevronDown } from 'lucide-react';
import { useRef } from 'react';

export default function ConstructionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "5%"]);

  return (
    <section id="construction" ref={containerRef} className="bg-ink min-h-screen py-20 md:py-32 px-6 md:px-8 overflow-x-hidden lg:overflow-x-visible">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
          
          {/* Left Column: Copy & Visual */}
          <div className="space-y-8 md:space-y-12">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4 md:space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-lime" />
                <span className="font-mono text-xs tracking-widest text-lime uppercase font-bold">Build a Court</span>
              </div>
              <h2 className="text-4xl md:text-8xl font-display font-extrabold leading-[1] md:leading-[0.9] tracking-tighter uppercase">
                Your <br />
                <span className="text-white">courts.</span> <br className="hidden md:block" />
                <span className="text-lime italic">Engineer <br className="hidden md:block" /> to win.</span>
              </h2>
              <p className="max-w-md text-white/50 text-base md:text-lg leading-relaxed font-normal">
                Full turnkey construction — from soil survey to glass install to floodlights tuned for night play. We've built across Dubai, Abu Dhabi, and Sharjah for clubs, hotels, and private estates.
              </p>
            </motion.div>

            {/* Visual Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-[30px] md:rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group"
            >
              <motion.img 
                style={{ y }}
                src="/images/dubai_court_night_construction_1779706759259.webp" 
                alt="Dubai Court" 
                className="absolute top-0 left-0 w-full h-[120%] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-lime animate-pulse" />
                  <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-lime/80 italic">Live 3D · Drag to inspect</span>
                </div>
              </div>
            </motion.div>

            {/* Trust Badge */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 p-5 md:p-6 bg-lime/5 border border-lime/20 rounded-[24px] md:rounded-3xl"
            >
              <div className="bg-lime/10 p-2.5 md:p-3 rounded-xl md:rounded-2xl">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-lime" />
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <h4 className="text-[13px] md:text-sm font-bold text-white uppercase tracking-wider">24-hour response, guaranteed.</h4>
                <p className="text-[11px] md:text-xs text-white/40 leading-snug">Send your details and we'll come back with a tailored scope.</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Lead Form */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32 h-fit bg-ink-2 p-8 md:p-12 rounded-[30px] md:rounded-[48px] border border-white/5 space-y-8 md:space-y-10 shadow-3xl"
          >
            <div className="space-y-1 md:space-y-2">
              <h3 className="text-xl md:text-2xl font-display font-bold italic tracking-tight uppercase">Request a proposal</h3>
              <p className="text-white/40 text-xs md:text-sm">Our engineering team will get in touch shortly.</p>
            </div>

            <form className="space-y-6 md:space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Full name <span className="text-lime text-[14px]">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Your name"
                  className="w-full bg-ink border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm md:text-base text-white placeholder:text-white/20 focus:border-lime/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Phone or email <span className="text-lime text-[14px]">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="+971 50 000 0000 or hello@you.com"
                  className="w-full bg-ink border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm md:text-base text-white placeholder:text-white/20 focus:border-lime/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Court location
                </label>
                <div className="relative">
                  <select className="w-full bg-ink border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm md:text-base text-white appearance-none focus:border-lime/50 outline-none transition-all cursor-pointer">
                    <option>Select emirate</option>
                    <option>Dubai</option>
                    <option>Abu Dhabi</option>
                    <option>Sharjah</option>
                    <option>Ras Al Khaimah</option>
                    <option>Fujairah</option>
                    <option>Ajman</option>
                    <option>Umm Al Quwain</option>
                  </select>
                  <ChevronDown className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                </div>
              </div>

              <div className="relative w-full">
                {/* Ambient glow light */}
                <motion.div 
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.35, 0.7, 0.35]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-lime rounded-xl md:rounded-2xl filter blur-xl pointer-events-none"
                />
                
                {/* Button itself */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full py-4 md:py-5 bg-lime text-ink font-bold uppercase tracking-[0.2em] rounded-xl md:rounded-2xl transition-all hover:bg-white text-[11px] md:text-sm z-10"
                >
                  Request a proposal
                </motion.button>
              </div>
            </form>
            
            <div className="pt-6 md:pt-8 border-t border-white/5 flex items-center gap-3 text-white/20">
               <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
               <span className="text-[9px] uppercase tracking-widest font-bold">HQ: Al Quoz, Dubai, UAE</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
