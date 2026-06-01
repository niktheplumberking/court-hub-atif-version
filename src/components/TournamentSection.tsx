import { motion } from 'motion/react';
import { Trophy, Calendar, MapPin, Users, Award, Star } from 'lucide-react';
import { useState, useEffect } from 'react';


export default function TournamentSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 34,
    hrs: 3,
    min: 0,
    sec: 53
  });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.sec > 0) return { ...prev, sec: prev.sec - 1 };
        if (prev.min > 0) return { ...prev, min: prev.min - 1, sec: 59 };
        if (prev.hrs > 0) return { ...prev, hrs: prev.hrs - 1, min: 59, sec: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hrs: 23, min: 59, sec: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Periodic calendar icon shake effect (every 6 seconds)
  useEffect(() => {
    const shakeInterval = setInterval(() => {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
    }, 6000);
    return () => clearInterval(shakeInterval);
  }, []);

  return (
    <section id="tournaments" className="bg-court-blue py-20 md:py-32 px-6 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20 md:space-y-32">
        
        {/* Tournament Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* Countdown Card (Swapped to Left) */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-xl rounded-[30px] md:rounded-[48px] p-5 md:p-10 border border-white/20 shadow-3xl space-y-8 md:space-y-10"
          >
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                 <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-lime/80 font-bold">Next up · 28 Jun 2026</span>
                 <h3 className="text-2xl md:text-4xl font-display font-bold italic">Court Hub Open 2026</h3>
                 <div className="flex items-center gap-2 text-white/60 text-xs md:text-sm">
                   <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                   <span>Dubai · Court Hub Arena</span>
                 </div>
               </div>
               <motion.div 
                 animate={shouldShake ? {
                   scale: [1, 1.15, 1.18, 1.15, 1.18, 1.15, 1],
                   rotate: [12, 18, -10, 18, -10, 15, 12],
                   x: [0, -3, 3, -3, 3, -1.5, 0]
                 } : { 
                   scale: 1,
                   rotate: 12,
                   x: 0
                 }}
                 transition={{ duration: 0.8, ease: "easeInOut" }}
                 className="bg-lime text-ink p-2.5 md:p-3 rounded-xl md:rounded-2xl origin-center"
               >
                 <Calendar className="w-5 h-5 md:w-6 md:h-6" />
               </motion.div>
            </div>

            <div className="grid grid-cols-4 gap-2 md:gap-4">
               {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hrs', value: timeLeft.hrs },
                { label: 'Min', value: timeLeft.min },
                { label: 'Sec', value: timeLeft.sec }
              ].map((unit) => (
                <div key={unit.label} className="bg-black/20 rounded-2xl md:rounded-3xl p-2 md:p-4 flex flex-col items-center gap-1 border border-white/5">
                  <span className="text-xl md:text-4xl font-display font-black text-white">
                    {unit.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">{unit.label}</span>
                </div>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: '#D4FF3F', color: '#0E0E0C' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 md:py-5 bg-white text-court-blue font-bold uppercase tracking-[0.2em] rounded-xl md:rounded-2xl transition-all text-[11px] md:text-sm"
            >
              Register your team
            </motion.button>
          </motion.div>

          {/* Hero details (Swapped to Right) */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-lime" />
              <span className="font-mono text-xs tracking-widest text-lime uppercase font-bold">Tournaments</span>
            </div>
            <h2 className="text-4xl md:text-8xl font-display font-extrabold leading-[1] md:leading-[0.9] tracking-tighter uppercase italic text-white md:max-w-none max-w-[300px]">
              The biggest <br />
              <motion.span 
                className="text-lime inline-block origin-center"
                animate={{ 
                  x: [0, -12, 12, -12, 12, -12, -12, 12, 12, 0],
                  y: [0, -10, -10, 10, 10, -10, 10, -10, 10, 0]
                }}
                transition={{ 
                  duration: 18, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                padel night
              </motion.span> <br className="hidden md:block" />
              in the Gulf.
            </h2>
            <p className="max-w-lg text-white/80 text-lg md:text-xl font-medium leading-relaxed">
              We stage the events that matter — pro circuit qualifiers, amateur ladders, and once-a-year showpieces. Floodlit. Streamed. Stadium energy from first serve to match point.
            </p>
          </motion.div>

        </div>

        {/* Structure & Categories - REDESIGNED with Sidebar Layout */}
        <div className="space-y-12 md:space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 border-b border-white/5 pb-10 md:pb-12">
            <h3 className="text-3xl md:text-5xl font-display font-extrabold uppercase italic leading-tight tracking-tighter">
              Tournament Structure & <br className="hidden md:block" /> Playing Categories
            </h3>
            <p className="text-white/40 text-sm max-w-xs text-left md:text-right hidden md:block">
              Matches are organized to ensure competitive balance, fair play, and a smooth progression for all participants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {/* Sidebar Categories */}
            <div className="w-full md:col-span-3 flex flex-row md:flex-col overflow-x-auto pb-4 md:pb-0 gap-3 md:gap-4 scrollbar-hide">
              {[
                { label: 'Mixed Doubles', active: true },
                { label: 'Men\'s Doubles', active: false },
                { label: 'Women\'s Doubles', active: false }
              ].map((cat) => (
                <div 
                  key={cat.label}
                  className={`px-6 py-4 md:px-8 md:py-5 rounded-xl md:rounded-2xl border transition-all cursor-pointer font-display font-bold text-sm md:text-lg whitespace-nowrap shrink-0 ${
                    cat.active ? 'bg-white/10 border-white/40 text-white' : 'border-transparent text-white/40 hover:text-white/60'
                  }`}
                >
                  {cat.label}
                </div>
              ))}
            </div>

            {/* Structure Cards Grid (Right Side) */}
            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { title: 'Group Stage', desc: 'Round Robin. Guaranteed 3 Matches.', image: '/images/court_action_landscape_1779705580138.webp' },
                { title: 'The Cut', desc: 'Quarter & Semi Finals. Best of 3 Sets.', image: '/images/dubai_court_night_construction_1779706759259.webp' },
                { title: 'Grand Final', desc: 'Center Court. Livestreamed.', image: '/images/tournament_crowd_night_1779707031611.webp' }
              ].map((stage, i) => (
                <motion.div 
                  key={stage.title}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{
                    y: { duration: 0.8, delay: i * 0.1 },
                    scale: { type: "spring", stiffness: 120, damping: 18 },
                    filter: { duration: 0.45, ease: "easeOut" },
                    opacity: hoveredIndex === null ? { duration: 0.8, delay: i * 0.1 } : { duration: 0.45 }
                  }}
                  viewport={{ once: true }}
                  animate={{
                    scale: hoveredIndex === null ? 1 : (hoveredIndex === i ? 1.06 : 0.94),
                    filter: hoveredIndex === null ? "blur(0px)" : (hoveredIndex === i ? "blur(0px)" : "blur(3px)"),
                    opacity: hoveredIndex === null ? 1 : (hoveredIndex === i ? 1 : 0.7),
                  }}
                  style={{
                    zIndex: hoveredIndex === i ? 10 : 1,
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group bg-white rounded-[30px] md:rounded-[40px] overflow-hidden text-ink flex flex-col h-full cursor-pointer relative shadow-md"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={stage.image} alt={stage.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-6 md:p-8 space-y-2 mt-auto">
                    <h4 className="text-lg md:text-xl font-display font-bold uppercase italic leading-none">{stage.title}</h4>
                    <p className="text-ink/60 text-[11px] md:text-xs leading-snug">{stage.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Podium / Trophies Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
           <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[30px] md:rounded-[40px] overflow-hidden bg-white/5 border border-white/10 p-8 md:p-12 flex items-center justify-center"
           >
              <img 
                src="/images/padel_championship_trophy_1779707051993.webp" 
                alt="Trophy" 
                className="w-full h-full object-contain drop-shadow-[0_0_80px_rgba(30,90,232,0.4)]"
              />
              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-2xl flex items-center justify-center">
                 <p className="text-[10px] md:text-xs font-bold text-ink uppercase tracking-widest text-center">Official tournament trophies awarded to champions and finalists.</p>
              </div>
           </motion.div>

           <div className="space-y-8 md:space-y-12">
             <div className="space-y-4 md:space-y-6">
                <h3 className="text-3xl md:text-6xl font-display font-extrabold uppercase italic leading-[1] md:leading-[0.9]">
                  Earn Your Place <br /> on the Podium
                </h3>
                <p className="text-white/40 text-sm">Rewarding top performances with meaningful prizes and official tournament recognition.</p>
             </div>

             <div className="space-y-3 md:space-y-4">
                {[
                  { label: 'Championship Trophies', icon: Trophy, active: true },
                  { label: 'Medals & Certificates', icon: Award, active: false },
                  { label: 'Sponsor & Partner Rewards', icon: Star, active: false },
                  { label: 'Official Media & Highlights', icon: Users, active: false }
                ].map((item) => (
                  <motion.div 
                    key={item.label}
                    whileHover={{ x: 10 }}
                    className={`flex items-center justify-between p-5 md:p-6 rounded-[24px] md:rounded-3xl border transition-all cursor-pointer ${
                      item.active ? 'bg-white border-white text-court-blue shadow-xl' : 'border-white/10 hover:border-white/30 text-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.active ? 'text-court-blue' : 'text-white/20'}`} />
                      <span className="font-display font-bold text-lg md:text-xl">{item.label}</span>
                    </div>
                  </motion.div>
                ))}
             </div>
           </div>
        </div>

      </div>
    </section>
  );
}
