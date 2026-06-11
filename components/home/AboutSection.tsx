'use client';
import { motion } from 'motion/react';
import { Play, ArrowRight } from 'lucide-react';

export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <section id="about" className="bg-court-blue min-h-screen py-16 md:py-24 px-6 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
        
        {/* Left Column: Description & Portrait */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="md:col-span-3 space-y-8 md:space-y-12"
        >
          {/* Subtitle with ball */}
          <motion.div variants={itemVariants} className="space-y-6 md:space-y-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-2xl rotate-3">
              <img 
                src="/images/padel_ball_icon_1779705611997.webp" 
                alt="Padel Ball" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-white/90 text-base md:text-lg font-medium leading-snug max-w-[280px]">
              Premium courts, expert coaching, and a community built for players who want to grow and play with passion.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center bg-white rounded-full p-1 pr-6 gap-3 w-fit transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:bg-lime"
            >
              <div className="bg-court-blue rounded-full p-2 text-white">
                <ArrowRight id="btn-arrow" className="w-4 h-4 -rotate-45 transition-transform group-hover:rotate-0" />
              </div>
              <span className="text-court-blue font-bold text-sm uppercase tracking-wide transition-colors group-hover:text-ink">Book a Court</span>
            </motion.button>
          </motion.div>

          {/* Player Portrait */}
          <motion.div 
            variants={itemVariants} 
            className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl group max-w-sm md:max-w-none mx-auto md:mx-0 transition-transform duration-500 hover:scale-[1.02] hover:shadow-lime/5"
          >
             <img 
                src="/images/player_portrait_1779705596398.webp" 
                alt="Padel Player" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Center/Right Combined: Main Action Shot & Headlines */}
        <div className="md:col-span-9 flex flex-col gap-10 md:gap-12">
          
          {/* Main Action Shot & Video Thumbnail */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Action Shot */}
            <div className="aspect-[16/9] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
              <img 
                src="/images/court_action_landscape_1779705580138.webp" 
                alt="Padel Action" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Video Placeholder Overlay */}
            <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 w-24 md:w-48 aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border-2 md:border-4 border-white/10 group cursor-pointer">
              <img 
                src="/images/court_action_landscape_1779705580138.webp" 
                alt="Video" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                <Play id="play-icon" className="w-4 h-4 md:w-8 md:h-8 text-white fill-white transition-all duration-300 group-hover:scale-115 group-hover:text-lime group-hover:fill-lime" />
              </div>
            </div>
          </motion.div>

          {/* Headlines Section */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-[10px] md:text-xs font-semibold tracking-[0.15em] text-[#D4FF3F] uppercase">
              <span>Precision Engineering. Elite Performance.</span>
              <span>Built for the Padel Obsessed</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-8xl font-display font-extrabold leading-[1] md:leading-[0.9] tracking-tighter uppercase italic">
                Experience Padel <br />
                <span className="text-lime">Like Never Before</span>
              </h2>
              
              <div className="max-w-2xl mt-8 md:mt-12">
                 <p className="font-mono text-[10px] uppercase tracking-widest text-[#D4FF3F] mb-4 md:mb-6 inline-block py-1 px-3 border border-lime/30 rounded-full">
                  /// The home of premium padel ///
                </p>
                <p className="text-lg md:text-2xl font-display font-medium text-white/90 leading-relaxed md:leading-relaxed">
                  From racket to court to championship moment — Court Hub Group powers every part of the game. We stock what the pros play with, build the surfaces they win on, and stage the tournaments where careers are made.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
