'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    question: "What makes padel different from tennis?",
    answer: "Padel is played on a smaller, enclosed court with glass walls, using solid stringless rackets. It's more focused on strategy, reflexes, and positioning than raw power, making it incredibly social and faster to learn."
  },
  {
    question: "I'm a complete beginner – can I join?",
    answer: "Absolutely. Our Court Hub Academy has dedicated 'First Serve' programs for total beginners. We provide the equipment, the coach, and a friendly environment to learn the basics in your first session."
  },
  {
    question: "What do I need to get started?",
    answer: "Just athletic wear and non-marking court shoes. We provide professional-grade Bullpadel rackets and balls if you don't have your own. As you progress, we can help you choose the right gear from our Pro Shop."
  },
  {
    question: "Where do training sessions and matches take place?",
    answer: "We have primary hubs in Al Quoz (Dubai), Yas Island (Abu Dhabi), and Sharjah. Most Academy sessions are based at our Al Quoz HQ, which features 12 indoor, climate-controlled championship courts."
  },
  {
    question: "How do I reserve a court or sign up for training?",
    answer: "You can book directly via our mobile app (available on iOS and Android) or through the 'Book Now' portal on our website. For Academy programs, we recommend a trial assessment first to find your perfect level."
  },
  {
    question: "Can I rent rackets and buy balls at the court?",
    answer: "Yes, our Pro Shop rents top-tier Bullpadel and Head rackets for AED 30 per session. We also stock professional tournament balls, grips, and technical sportswear."
  },
  {
    question: "Is there private parking available at the Al Quoz HQ?",
    answer: "Yes, we have 50+ dedicated free parking slots directly in front of the arena for all players, coaches, and visitors."
  }
];

interface FAQ {
  question: string;
  answer: string;
}

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItem({ faq, isOpen, onToggle, index }: FAQItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of individual FAQ item
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 90%", "end 10%"]
  });

  // Scale: slightly smaller at edges, peaks at 1.05 in center
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.95, 1, 1.05, 1, 0.95]);

  // Opacity: fades out to 0 at top/bottom thresholds (below 20% or above 80% scroll progress)
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Blur: blurs out to 10px at top/bottom thresholds
  const blur = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]
  );

  // Dynamic shadow that peaks when item is in the center
  const shadow = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [
      "0px 0px 0px rgba(0,0,0,0)",
      "0px 0px 0px rgba(0,0,0,0)",
      "0px 20px 40px rgba(0,0,0,0.06)",
      "0px 0px 0px rgba(0,0,0,0)",
      "0px 0px 0px rgba(0,0,0,0)"
    ]
  );

  return (
    <motion.div
      ref={itemRef}
      style={{ scale, opacity, filter: blur, boxShadow: shadow }}
      className={`rounded-[24px] md:rounded-[32px] transition-colors duration-500 overflow-hidden border ${
        isOpen 
          ? 'bg-court-blue text-white border-court-blue md:translate-x-4 shadow-xl' 
          : 'bg-white hover:bg-white/90 text-ink border-black/5'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full p-6 md:p-10 flex items-center justify-between text-left group"
      >
        <span className={`text-lg md:text-2xl font-display font-bold tracking-tight ${
          isOpen ? 'text-white' : 'text-ink'
        }`}>
          {faq.question}
        </span>
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
          isOpen ? 'bg-white text-court-blue' : 'bg-court-blue text-white group-hover:scale-110'
        }`}>
          {isOpen ? <ChevronUp className="w-4 h-4 md:w-5 md:h-5" /> : <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6 pb-8 md:px-10 md:pb-12 border-t border-white/10 pt-4 md:pt-6">
              <p className="text-base md:text-xl font-medium leading-relaxed opacity-80 max-w-2xl">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQSupportBox() {
  const boxRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of support box
  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start 90%", "end 10%"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.95, 1, 1.02, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const blur = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]
  );

  return (
    <motion.div
      ref={boxRef}
      style={{ scale, opacity, filter: blur }}
      className="mt-6 p-8 bg-court-blue/10 border border-court-blue/20 rounded-[32px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
    >
      <div>
        <h4 className="text-ink font-display font-bold text-lg md:text-xl uppercase italic">Still have questions?</h4>
        <p className="text-ink/60 text-xs md:text-sm mt-1">Our support team is ready to assist you anytime.</p>
      </div>
      <motion.a 
        href="#construction"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-court-blue text-white rounded-2xl font-bold uppercase tracking-wider text-[11px] hover:bg-lime hover:text-ink transition-all shadow-md cursor-pointer"
      >
        Contact Support
      </motion.a>
    </motion.div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <section id="faq" ref={containerRef} className="bg-sand py-20 md:py-32 px-6 md:px-8 overflow-x-hidden lg:overflow-x-visible">
      <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
        
        {/* Header Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start md:items-end">
          <div className="md:col-span-8">
            <h2 className="text-4xl md:text-8xl font-display font-black leading-[1] md:leading-[0.9] tracking-tighter uppercase text-ink">
              Common Questions, <br />
              Clear Answers
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-ink/60 text-base md:text-lg font-medium leading-snug md:text-right max-w-xs md:ml-auto">
              Everything you need to know about booking, academy coaching, and court construction.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
          
          {/* Visual Side - Sticky Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit hidden lg:block">
            <motion.div 
              style={{ scale }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] max-h-[440px] rounded-[48px] overflow-hidden shadow-2xl group"
            >
              <motion.img 
                style={{ y: useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]) }}
                src="/images/faq_padel_detail_1779708774500.webp" 
                alt="Padel Player" 
                className="absolute top-0 left-0 w-full h-[120%] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-white italic">Academy Hub · Live</span>
              </div>
            </motion.div>
          </div>

          {/* Accordion Side */}
          <div className="lg:col-span-8 flex flex-col gap-3 md:gap-4">
            {FAQS.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                index={i}
              />
            ))}

            {/* Support Callout Box to increase scroll height and add CTA */}
            <FAQSupportBox />
          </div>

        </div>

      </div>
    </section>
  );
}
