import { motion } from 'motion/react';
import { ShoppingBag, Star, ArrowRight, Heart } from 'lucide-react';

const PRODUCTS = [
  {
    id: 1,
    name: "Speed Motion 2024",
    price: "1,049",
    brand: "HEAD",
    image: "/images/premium_padel_racket_black_lime_1779706021226.webp",
    tag: "Pro Series",
    color: "lime"
  },
  {
    id: 2,
    name: "Nighthawk Edition",
    price: "1,249",
    brand: "STEALTH",
    image: "/images/premium_padel_racket_stealth_blue_1779706040552.webp",
    tag: "Limited",
    color: "court-blue"
  },
  {
    id: 3,
    name: "Castor Limited",
    price: "879",
    brand: "DOPADEL",
    image: "/images/premium_padel_racket_black_lime_1779706021226.webp",
    tag: "Best Seller",
    color: "green"
  }
];

export default function ShopSection() {

  const BRANDS = ['STEALTH', 'DOPADEL', 'MUSA', 'WILSON', 'HEAD', 'BULLPADEL'];
  const duplicatedBrands = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section id="shop" className="bg-ink py-20 md:py-32 px-6 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4 md:space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-lime" />
              <span className="font-mono text-xs tracking-widest text-lime uppercase font-bold">The Rack</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-display font-extrabold leading-tight uppercase">
              The paddles <br />
              <span className="relative inline-block text-lime italic overflow-hidden">
                the pros play with.
                <motion.span
                  className="absolute inset-0 select-none pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 50%, transparent)",
                    backgroundSize: "200px 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  animate={{
                    backgroundPosition: ["-100% 0", "150% 0"],
                    opacity: [0, 1, 0.8, 0]
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    repeatDelay: 5.5,
                    ease: [0.45, 0.05, 0.1, 1],
                    times: [0, 0.2, 0.6, 1]
                  }}
                >
                  the pros play with.
                </motion.span>
              </span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 md:gap-4"
          >
             {['HEAD', 'Wilson', 'Pre-Owned'].map((brand, i) => (
               <button 
                key={brand}
                className={`px-6 py-2 md:px-8 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border transition-all ${
                  i === 0 ? 'bg-lime text-ink border-lime' : 'border-white/10 text-white/60 hover:border-white/40'
                }`}
               >
                 {brand}
               </button>
             ))}
          </motion.div>
        </div>

        {/* Bento Grid Deals */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto">
          {/* Main Deal Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-4 bg-ink-2 rounded-[30px] md:rounded-[40px] p-6 md:p-8 relative overflow-hidden flex flex-col justify-between border border-white/5 hover:border-lime/30 hover:shadow-[0_15px_30px_rgba(200,255,61,0.05)] transition-all duration-500 group min-h-[400px]"
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img 
                src="/images/premium_background.jpg?v=6" 
                alt="" 
                className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
            </div>

            <div className="z-10 flex justify-between items-start">
               <div className="space-y-1">
                 <span className="text-2xl md:text-3xl font-display font-bold italic">$420</span>
                 <p className="text-white/40 text-[10px] md:text-xs max-w-[180px]">Finder Pro Limited Edition x Ale Cervellati. Tour-proven carbon face.</p>
               </div>
               <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md px-2 py-1 md:px-3 md:py-1 rounded-full group-hover:bg-lime/20 transition-all duration-300">
                  <Star className="w-3 h-3 text-lime fill-lime group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] md:text-xs font-bold text-white">4.9</span>
               </div>
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-8">
               <img 
                src="/images/racket_lime_nobg.webp?v=6" 
                alt="Lime Padel Racket" 
                className="w-full h-full max-h-[300px] object-contain drop-shadow-[0_0_50px_rgba(200,255,61,0.35)] transition-transform duration-700 scale-[0.68] group-hover:scale-[0.76] group-hover:rotate-6"
              />
            </div>

            <div className="z-10 flex gap-3 md:gap-4">
               <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-colors border border-white/10 shrink-0">
                 <Heart className="w-5 h-5 text-white hover:text-red-500 hover:fill-red-500 transition-colors" />
               </button>
               <motion.button 
                 whileHover={{ scale: 1.03, backgroundColor: "#C8FF3D" }}
                 whileTap={{ scale: 0.97 }}
                 className="flex-1 py-4 bg-white text-ink rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2 transition-colors duration-300 cursor-pointer"
               >
                  <ShoppingBag className="w-4 h-4" />
                  Add to bag
               </motion.button>
            </div>
          </motion.div>

          {/* Right Section Bento */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Great Value Deals */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-ink-2 rounded-[30px] md:rounded-[40px] p-6 md:p-8 relative overflow-hidden flex items-center justify-between border border-white/5 hover:border-white/10 hover:shadow-2xl transition-all duration-500 group min-h-[200px]"
            >
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img 
                  src="/images/premium_background_blue.webp?v=6" 
                  alt="" 
                  className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/80" />
              </div>

              <div className="flex flex-col gap-6 md:gap-8 z-10">
                <h3 className="text-2xl md:text-4xl font-display font-extrabold italic text-white leading-none">
                  Elite Outlet
                </h3>
                <p className="text-white/40 text-[10px] md:text-xs max-w-[200px]">Acquire past-season frames and tournament-certified rackets at up to 70% off.</p>
                <motion.button 
                  whileHover={{ scale: 1.03, backgroundColor: "#C8FF3D" }}
                  whileTap={{ scale: 0.97 }}
                  className="self-start flex items-center gap-2 md:gap-3 bg-white text-ink px-5 md:px-6 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase transition-colors duration-300 cursor-pointer"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4 transition-transform" />
                </motion.button>
              </div>

              <div className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 w-[45%] h-[110%] flex items-center justify-center pointer-events-none overflow-visible">
                <img 
                  src="/images/racket_blue_nobg.webp?v=6" 
                  alt="Blue Padel Racket" 
                  className="w-[110%] h-[110%] object-contain drop-shadow-[0_0_40px_rgba(30,90,232,0.3)] transition-transform duration-700 rotate-[15deg] scale-[0.74] group-hover:scale-[0.82] group-hover:rotate-[20deg]"
                />
              </div>
            </motion.div>

            {/* Exclusive Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-court-blue rounded-[30px] md:rounded-[40px] p-6 md:p-8 relative overflow-hidden flex flex-col justify-between group border border-white/5 hover:border-white/20 transition-all duration-500 min-h-[250px]"
            >
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img 
                  src="/images/premium_background_blue.webp?v=6" 
                  alt="" 
                  className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: 'center 12%' }}
                />
                {/* 20% opacity blue cover overlay */}
                <div className="absolute inset-0 bg-court-blue/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
              </div>

              <div className="z-10 space-y-3 md:space-y-4">
                 <span className="bg-white text-court-blue px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Exclusive</span>
                 <h4 className="text-xl md:text-2xl font-display font-bold italic">Stealth Series</h4>
                 <div className="text-[9px] md:text-[10px] text-white/60 space-y-0.5 md:space-y-1 font-mono uppercase tracking-widest">
                    <p>Carbon Precision</p>
                    <p>Pro Line</p>
                 </div>
              </div>

              <div className="absolute right-0 bottom-0 z-10 h-full w-[55%] overflow-visible pointer-events-none flex items-end justify-end">
                 <img 
                  src="/images/racket_blue_nobg.webp?v=6" 
                  alt="Blue Padel Racket" 
                  className="h-[110%] object-contain translate-x-2 translate-y-6 rotate-[15deg] drop-shadow-[0_0_40px_rgba(30,90,232,0.35)] scale-[0.76] group-hover:scale-[0.84] group-hover:rotate-[18deg] transition-all duration-700"
                />
              </div>

              <button className="z-10 flex items-center justify-center p-3.5 md:p-4 bg-white/10 backdrop-blur-md rounded-2xl w-fit group-hover:bg-white text-white group-hover:text-court-blue transition-all duration-300">
                <ArrowRight id="r-arrow" className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-rotate-45" />
              </button>
            </motion.div>

            {/* Super Sale Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-ink-2 rounded-[30px] md:rounded-[40px] p-6 md:p-8 relative overflow-hidden flex flex-col justify-between border border-white/5 min-h-[250px] group"
            >
               {/* Background Image Layer */}
               <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                 <img 
                   src="/images/premium_background.jpg?v=6" 
                   alt="" 
                   className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
               </div>

               <div className="space-y-3 md:space-y-4 z-10">
                  <h4 className="text-xl md:text-2xl font-display font-bold text-white italic leading-tight">Speed Motion</h4>
                  <p className="text-white/60 text-[9px] md:text-[10px] font-medium">Carbon core. 50% off limited allocation.</p>
               </div>

               <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-visible">
                 <img 
                   src="/images/racket_lime_nobg.webp?v=6" 
                   alt="Lime Padel Racket" 
                   className="w-[60%] h-[60%] object-contain drop-shadow-2xl transition-transform duration-700 rotate-[85deg] scale-[0.9] translate-x-8 translate-y-2 group-hover:scale-[1.0]"
                 />
               </div>
            </motion.div>
          </div>
        </div>

        {/* Top Sellers Shelf */}
        <div className="space-y-8 md:space-y-12">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl md:text-3xl font-display font-bold italic tracking-tight">Top Sellers</h3>
            <button className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40 hover:text-lime transition-colors">
              View More <ArrowRight className="w-4 h-4 ml-1 md:ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {PRODUCTS.map((prod, idx) => {
              const isBlue = prod.color === 'court-blue';
              const racketSrc = isBlue ? "/images/racket_blue_nobg.webp?v=6" : "/images/racket_lime_nobg.webp?v=6";
              const bgSrc = isBlue ? "/images/premium_background_blue.webp?v=6" : "/images/premium_background.jpg?v=6";

              return (
                <motion.div 
                  key={prod.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-[#121210] rounded-[24px] md:rounded-[48px] p-4 md:p-8 flex flex-col items-center gap-4 md:gap-8 border border-white/5 hover:border-lime/20 transition-all duration-500"
                >
                  {/* Product Image Container with Gradient Background */}
                  <div className="relative w-full aspect-square rounded-[24px] md:rounded-[32px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-transparent to-black/40">
                     <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <img 
                          src={bgSrc} 
                          alt="" 
                          className={
                            isBlue
                              ? "w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                              : "w-full h-full object-cover scale-[1.15] opacity-70 transition-transform duration-500 group-hover:scale-[1.2]"
                          }
                          style={isBlue ? { objectPosition: 'center 12%' } : undefined}
                        />
                        {isBlue && (
                          <>
                            {/* 20% opacity blue cover overlay */}
                            <div className="absolute inset-0 bg-court-blue/20 z-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-0" />
                          </>
                        )}
                     </div>

                     {/* Shining Light matching racket color */}
                     <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--gradient-color)_0%,_transparent_75%)] z-10" 
                          style={{ '--gradient-color': prod.color === 'lime' ? '#C8FF3D' : prod.color === 'court-blue' ? '#1E5AE8' : '#07C66A' } as any} />
                     
                      <img 
                      src={racketSrc} 
                      alt={prod.name} 
                      className={`z-20 w-[80%] h-[80%] object-contain transition-transform duration-500 group-hover:-rotate-6 ${
                        isBlue 
                          ? 'scale-[0.68] group-hover:scale-[0.76]' 
                          : 'scale-[0.62] group-hover:scale-[0.70]'
                      }`}
                     />
                     <button className="absolute top-3 right-3 md:top-4 md:right-4 p-2.5 md:p-3 bg-black/40 backdrop-blur-md rounded-full text-white/40 hover:text-pink-500 transition-colors z-30">
                       <Heart className="w-4 h-4 md:w-5 md:h-5" />
                     </button>
                     <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 flex shrink-0 z-30">
                       <span className="bg-black/60 backdrop-blur-md text-white/50 text-[8px] md:text-[9px] font-mono px-2 md:px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">{prod.tag}</span>
                     </div>
                  </div>

                  {/* Info */}
                  <div className="w-full space-y-4 md:space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">{prod.brand}</p>
                        <h4 className="text-sm md:text-xl font-display font-bold">{prod.name}</h4>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">AED</p>
                         <p className="text-sm md:text-xl font-display font-bold text-lime">{prod.price}</p>
                      </div>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 bg-white/5 group-hover:bg-lime group-hover:text-ink rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 transition-all duration-300 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em]">Add to cart</span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Brands Ticker (Scrolling & Fading at Grid Boundaries) */}
        <div 
          className="pt-16 md:pt-24 border-t border-white/5 w-full overflow-hidden relative"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <motion.div 
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              ease: "linear",
              duration: 44,
              repeat: Infinity
            }}
            className="flex items-center gap-12 md:gap-24 opacity-30 whitespace-nowrap w-max"
          >
             {duplicatedBrands.map((brand, idx) => (
               <span key={`${brand}-${idx}`} className="text-xl md:text-3xl font-display font-black tracking-tighter italic select-none">
                 {brand}
               </span>
             ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
