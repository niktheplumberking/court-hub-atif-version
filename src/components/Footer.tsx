import { motion } from 'motion/react';
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink text-white py-16 md:py-24 px-6 md:px-8 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-12 md:gap-16">
        
        {/* Brand & Mission */}
        <div className="md:col-span-4 space-y-6 md:space-y-8">
          <div className="flex items-center gap-1.5 font-display font-bold text-2xl md:text-3xl tracking-tight">
            <span>COURT</span>
            <span className="text-lime">HUB</span>
          </div>
          <p className="text-white/40 text-base md:text-lg font-medium leading-relaxed max-w-sm">
            Powers every part of the game. Professional courts, elite equipment, and the championship spirit.
          </p>
          <div className="flex gap-3 md:gap-4">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <motion.a 
                key={i}
                href="#"
                whileHover={{ y: -5, color: '#C8FF3D' }}
                className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="md:col-span-2 space-y-4 md:space-y-6">
          <h4 className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">Menu</h4>
          <nav className="flex flex-col gap-3 md:gap-4">
            {['About', 'Shop', 'Our Story', 'Construction', 'FAQ'].map((item) => (
              <motion.a 
                key={item} 
                href={`#${item === 'Our Story' ? 'story' : item.toLowerCase()}`} 
                whileHover={{ scale: 1.08, originX: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-white font-display font-bold md:text-lg hover:text-lime transition-colors w-fit block"
              >
                {item}
              </motion.a>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2 space-y-4 md:space-y-6">
          <h4 className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">Company</h4>
          <nav className="flex flex-col gap-3 md:gap-4">
            {['About Us', 'Careers', 'Partner Program', 'Terms', 'Privacy'].map((item) => (
              <motion.a 
                key={item} 
                href="#" 
                whileHover={{ scale: 1.08, originX: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-white/60 font-medium hover:text-white transition-colors w-fit block"
              >
                {item}
              </motion.a>
            ))}
          </nav>
        </div>

        {/* Newsletter / Contact */}
        <div className="md:col-span-4 space-y-6 md:space-y-8">
          <h4 className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">Newsletter</h4>
          <div className="space-y-4">
            <p className="text-xs md:text-sm text-white/60">Join the circuit for exclusive drops and tournament invites.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="hello@courthub.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm md:text-base text-white placeholder:text-white/20 focus:border-lime/50 outline-none transition-all"
              />
              <button className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-2 bg-lime text-ink rounded-lg font-bold text-[10px] md:text-xs uppercase tracking-widest">
                Join
              </button>
            </div>
          </div>
          <div className="pt-6 md:pt-8 space-y-3 md:space-y-4 border-t border-white/5">
            <div className="flex items-center gap-3 text-white/40 text-[11px] md:text-xs">
              <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>contact@courthub.com</span>
            </div>
            <div className="flex items-center gap-3 text-white/40 text-[11px] md:text-xs">
              <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>+971 4 000 0000</span>
            </div>
            <div className="flex items-center gap-3 text-white/40 text-[11px] md:text-xs">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="leading-snug">Al Quoz Industrial 3, Dubai, UAE</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-16 md:mt-24 pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
        <p className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 text-center md:text-left">
          © 2026 COURT HUB GROUP. ALL RIGHTS RESERVED.
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
          <a href="#" className="hover:text-white transition-colors text-lime font-bold italic">MADE FOR LEADERS</a>
          <span className="opacity-10 text-white font-bold hidden md:inline">|</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green" />
            SYSTEM OPERATIONAL
          </span>
        </div>
      </div>
    </footer>
  );
}
