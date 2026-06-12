'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { waHref } from '@/lib/whatsapp';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───

const SECTION_HEADER = {
  microLabel: 'FAQ',
  headlinePre: 'Questions,',
  headlineLime: 'Answered.',
  sub: "Everything you need to know about the shop, shipping, gear, and court builds — and a direct line to us when it isn't here.",
};

const CATEGORIES = [
  'All',
  'Shop & Orders',
  'Shipping & Delivery',
  'Rackets & Gear',
  'Court Construction',
] as const;

type Category = (typeof CATEGORIES)[number];
type FaqCategory = Exclude<Category, 'All'>;

interface Faq {
  category: FaqCategory;
  question: string;
  answer: string;
}

const FAQS: Faq[] = [
  // ── Shop & Orders ──
  {
    category: 'Shop & Orders',
    question: 'How does your condition grading work for pre-owned rackets?',
    answer:
      'Every pre-owned racket passes a 12-point inspection before it earns a place in the shop. We grade from 9/10 (near-new, barely played) down to 7/10 (honest cosmetic wear, full structural integrity). The grade, detailed photos, and any cosmetic notes sit on every product page — what you see is exactly what arrives.', // placeholder figure (12-point, grade scale) — confirm with client
  },
  {
    category: 'Shop & Orders',
    question: "What does 'one-of-one' stock mean?",
    answer:
      "Almost everything in the shop is a unique piece — one racket, one listing, one owner. When it sells, it's gone and the listing is retired for good. If something catches your eye, move fast or ask us to hold it on WhatsApp.",
  },
  {
    category: 'Shop & Orders',
    question: 'Which payment methods do you accept?',
    answer:
      'Checkout runs on Stripe — Visa, Mastercard, and Apple Pay — with every price in AED. Payments are processed securely end to end; we never see or store your card details.',
  },
  {
    category: 'Shop & Orders',
    question: 'Can you hold an item while I decide?',
    answer:
      "Yes. Message us on WhatsApp and we'll place a 24-hour hold on any in-stock piece. After that it goes back on general sale — one-of-one stock means we can't hold items indefinitely.", // placeholder figure (24-hour hold) — confirm with client
  },

  // ── Shipping & Delivery ──
  {
    category: 'Shipping & Delivery',
    question: 'Do you deliver across the UAE?',
    answer:
      'We deliver to all seven emirates via tracked courier. Dubai and Sharjah orders typically arrive within 1–2 business days; Abu Dhabi and the Northern Emirates within 2–3. You get a tracking link the moment your order leaves us.', // placeholder figures (delivery times) — confirm with client
  },
  {
    category: 'Shipping & Delivery',
    question: 'What does delivery cost?',
    answer:
      "Checkout covers your gear only — delivery across the UAE is arranged after you order, and we confirm timing and any courier fee with you on WhatsApp before anything is dispatched. Every racket ships in rigid protective packaging — no loose boxes, no surprises.", // placeholder — confirm delivery arrangements and fees with client
  },
  {
    category: 'Shipping & Delivery',
    question: 'Can I collect my order in person?',
    answer:
      "Yes. Once your order is placed, message us on WhatsApp and we'll arrange collection from our Al Quoz hub in Dubai — we'll confirm a pickup time as soon as your order is ready, usually the same day.", // placeholder — confirm collection point and timing with client
  },

  // ── Rackets & Gear ──
  {
    category: 'Rackets & Gear',
    question: "What's your return policy on pre-owned gear?",
    answer:
      "You get a 48-hour inspection window from delivery. If the racket doesn't match its listed grade, return it unused in the original packaging for a full refund. Because every piece is one-of-one, we can't accept change-of-mind returns once it's been played.", // placeholder figure (48-hour window) — confirm with client
  },
  {
    category: 'Rackets & Gear',
    question: 'How do I choose the right racket shape and weight?',
    answer:
      "Round shapes give control and forgiveness for developing players; teardrop balances power and control; diamond rewards advanced, attack-first games. Weight matters too — around 350g for speed and manoeuvrability, 370g and up for punch. Not sure? Send us your level on WhatsApp and we'll shortlist three rackets for you.", // placeholder figures (weights) — confirm with client
  },
  {
    category: 'Rackets & Gear',
    question: 'Do pre-owned rackets come with any warranty?',
    answer:
      "Every racket carries our structural guarantee: 30 days against frame defects our inspection should have caught. It doesn't cover normal play wear or impact damage — but if we missed something, we'll make it right.", // placeholder figure (30 days) — confirm with client
  },

  // ── Court Construction ──
  {
    category: 'Court Construction',
    question: 'How much does a padel court build cost?',
    answer:
      'A full panoramic court — steelwork, 12mm tempered glass, championship turf, and LED lighting — typically lands between AED 180,000 and AED 280,000. Site conditions, canopy options, and finish level move the number, so every project starts with a free site survey and a fixed quote.', // placeholder figures (cost range) — confirm with client
  },
  {
    category: 'Court Construction',
    question: 'How long does a court build take?',
    answer:
      'From signed contract to first serve: 6–10 weeks for most builds. That covers groundwork, steel and glass installation, turf laying, and final certification. We share a milestone schedule up front and report progress weekly.', // placeholder figure (6–10 weeks) — confirm with client
  },
  {
    category: 'Court Construction',
    question: 'Do you offer court maintenance plans?',
    answer:
      'Yes — quarterly and bi-annual plans covering turf brushing and infill top-ups, glass and fixing inspections, lighting checks, and net tension calibration. Clubs on a Court Hub maintenance plan also get priority call-out for repairs.',
  },
  {
    category: 'Court Construction',
    question: 'What warranty covers a court build?',
    answer:
      'Structural steelwork is covered for 10 years, glass and fixings for 5, and turf for 3 — all backed by our local Dubai team. No overseas claims process, no waiting on a distributor.', // placeholder figures (warranty terms) — confirm with client
  },
];

const CTA_COPY = {
  microLabel: 'Support',
  headlinePre: 'Still stuck?',
  headlineLime: 'Talk to us.',
  body: 'A real person from the Court Hub team — not a bot — replies within business hours, seven days a week.',
  whatsappLabel: 'Chat on WhatsApp',
  whatsappMessage: "Hi Court Hub — I have a question that isn't covered in your FAQ.",
};

// ─── End placeholder copy ───

const WHATSAPP_HREF = waHref(CTA_COPY.whatsappMessage);

interface FaqItemProps {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FaqItem({ faq, isOpen, onToggle, index }: FaqItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.2), ease: 'easeOut' }}
      className={`rounded-[20px] border overflow-hidden transition-colors duration-300 ${
        isOpen
          ? 'bg-court-blue border-court-blue'
          : 'bg-ink-2 border-white/10 hover:border-white/20'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full p-5 md:p-7 flex items-center justify-between gap-4 text-left group cursor-pointer"
      >
        <div className="space-y-1.5">
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.2em] block transition-colors ${
              isOpen ? 'text-white/50' : 'text-white/20'
            }`}
          >
            {faq.category}
          </span>
          <span className="font-display font-bold text-base md:text-xl tracking-tight text-white">
            {faq.question}
          </span>
        </div>
        <div
          className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
            isOpen
              ? 'bg-white text-court-blue'
              : 'bg-white/5 border border-white/10 text-white group-hover:bg-lime group-hover:border-lime group-hover:text-ink'
          }`}
        >
          {isOpen ? (
            <ChevronUp className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-5 pb-6 md:px-7 md:pb-8 pt-4 border-t border-white/10">
              <p className="text-sm md:text-base leading-relaxed text-white/80 max-w-2xl">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [openKey, setOpenKey] = useState<string | null>(FAQS[0]?.question ?? null);

  const visible =
    activeCategory === 'All' ? FAQS : FAQS.filter((f) => f.category === activeCategory);

  const selectCategory = (category: Category) => {
    setActiveCategory(category);
    setOpenKey(null);
  };

  // One-time scroll reveals for the section chrome (header, pills, count line).
  // Accordion items keep their own whileInView reveal so they re-animate
  // gracefully when the category filter remounts them.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-faq-header] > *', {
          y: 24,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-faq-header]', start: 'top 85%', once: true },
        });
        gsap.from('[data-faq-pill]', {
          x: 28,
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-faq-pills]', start: 'top 90%', once: true },
        });
        gsap.from('[data-faq-count]', {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-faq-pills]', start: 'top 90%', once: true },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faq" className="scroll-mt-24 px-6 md:px-12 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div data-faq-header className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25 font-bold mb-3">
            {SECTION_HEADER.microLabel}
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white leading-[1.05] tracking-tight">
            {SECTION_HEADER.headlinePre}{' '}
            <span className="text-lime">{SECTION_HEADER.headlineLime}</span>
          </h2>
          <p className="mt-4 text-white/50 text-base md:text-lg max-w-xl">{SECTION_HEADER.sub}</p>
        </div>

        {/* Category filter */}
        <div data-faq-pills className="flex flex-wrap gap-3 pb-6">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              data-faq-pill
              onClick={() => selectCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === category
                  ? 'bg-lime text-ink'
                  : 'bg-ink-2 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Accordion list */}
        <p data-faq-count className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 mb-4">
          {visible.length} question{visible.length === 1 ? '' : 's'} · {activeCategory}
        </p>
        <div className="max-w-4xl mx-auto flex flex-col gap-3 md:gap-4 pb-12">
          {visible.map((faq, i) => (
            <FaqItem
              key={faq.question}
              faq={faq}
              isOpen={openKey === faq.question}
              onToggle={() => setOpenKey(openKey === faq.question ? null : faq.question)}
              index={i}
            />
          ))}
        </div>

        {/* Still-stuck CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-4xl mx-auto rounded-[24px] bg-court-blue p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {CTA_COPY.microLabel}
            </p>
            <h3 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight text-white leading-tight">
              {CTA_COPY.headlinePre} <span className="text-lime">{CTA_COPY.headlineLime}</span>
            </h3>
            <p className="text-white/70 text-sm md:text-base max-w-md">{CTA_COPY.body}</p>
          </div>
          <motion.a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-lime text-ink font-bold text-sm hover:brightness-110 transition-all shrink-0 self-start md:self-auto"
          >
            <MessageCircle className="w-4 h-4" />
            {CTA_COPY.whatsappLabel}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
