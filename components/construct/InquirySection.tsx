'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronDown, MessageCircle, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '@/components/shared/Magnetic';
import { submitInquiry } from '@/lib/actions/inquiries';
import { waHref } from '@/lib/whatsapp';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  kicker: 'Start Your Build',
  line1: 'Tell Us About',
  line2: 'Your Site.',
  intro:
    'Fill this in and we continue the conversation on WhatsApp — your details come pre-loaded so you never type them twice. A build consultant replies within one working day.', // placeholder claim — confirm with client
  trustLine: 'Surveys across all seven emirates · Fixed line-item quotes · Replies within one working day', // placeholder claims — confirm with client
  submitIdle: 'Send & Continue on WhatsApp',
  submitLoading: 'Sending…',
  successTitle: 'We got it — continuing in WhatsApp.',
  successBody:
    'Your inquiry is in. WhatsApp should have opened with your details pre-filled — if it didn’t, use the button below.',
  successReopen: 'Open WhatsApp',
  dbFailNote:
    'Heads up: our backup system couldn’t log this one, but your WhatsApp message carries everything we need.',
  trustFootnote: 'Sent via WhatsApp — we keep a backup copy',
  fields: {
    name: { label: 'Name *', placeholder: 'Your full name' },
    phone: { label: 'Phone *', placeholder: '+971 50 000 0000' },
    email: { label: 'Email', placeholder: 'you@example.com' },
    courtType: { label: 'Court Type' },
    location: { label: 'Location' },
    message: {
      label: 'Message',
      placeholder: 'Plot size, timeline, indoor/outdoor — anything that helps us quote faster.',
    },
  },
};

const COURT_TYPES = ['Indoor', 'Outdoor', 'Panoramic', 'Single', 'Not sure yet'] as const;
const LOCATIONS = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain',
  'Other',
] as const;

// Editorial inputs: a drawn line instead of a box — the line brightens to lime on focus.
const inputClass =
  'w-full bg-transparent border-0 border-b border-white/15 rounded-none px-0 py-3.5 text-base text-white placeholder:text-white/25 focus:border-lime outline-none transition-colors duration-300';
const labelClass =
  'font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold block mb-1';

type Status = 'idle' | 'loading' | 'done';

export default function InquirySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: '[data-inq-pitch]', start: 'top 80%', once: true },
          })
          .from('[data-inq-kicker]', { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' }, 0)
          .from('[data-inq-line]', { yPercent: 110, duration: 0.9, stagger: 0.07, ease: 'power4.out' }, 0.1)
          .from('[data-inq-intro]', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' }, 0.5)
          .from('[data-inq-trust]', { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' }, 0.65);

        // Pitch photography: reveal from 1.18 scale inside its mask, then slow drift.
        gsap.fromTo(
          '[data-inq-img]',
          { scale: 1.18 },
          {
            scale: 1,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: { trigger: '[data-inq-media]', start: 'top 85%', once: true },
          }
        );
        gsap.fromTo(
          '[data-inq-img]',
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-inq-media]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );

        // Form fields draw in line by line.
        gsap.from('[data-inq-field]', {
          opacity: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-inq-form]', start: 'top 80%', once: true },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [courtType, setCourtType] = useState<string>('Not sure yet');
  const [location, setLocation] = useState<string>('Dubai');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [dbFailed, setDbFailed] = useState(false);
  const [submittedHref, setSubmittedHref] = useState('');

  const buildWaHref = () => {
    const summary = [
      "Hi Court Hub — I'd like a quote for a padel court build.",
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Court type: ${courtType}`,
      `Location: ${location}`,
      message ? `Details: ${message}` : null,
    ]
      .filter((line): line is string => line !== null)
      .join('\n');
    return waHref(summary);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');

    // Open WhatsApp synchronously, inside the user-gesture call stack — Safari/iOS
    // popup-blocks window.open calls that happen after an await. The fallback
    // 'Open WhatsApp' button on the success screen covers a null return.
    const href = buildWaHref();
    setSubmittedHref(href);
    window.open(href, '_blank', 'noopener,noreferrer');

    // Record the lead in Supabase as backup — WhatsApp is the primary channel.
    let saved = false;
    try {
      const result = await submitInquiry({
        name,
        phone,
        email: email || undefined,
        court_type: courtType,
        location,
        message: message || undefined,
      });
      saved = result.ok;
    } catch {
      saved = false;
    }
    setDbFailed(!saved);
    setStatus('done');
  };

  return (
    <section
      ref={sectionRef}
      id="inquiry"
      aria-label="Court inquiry form"
      className="grain relative scroll-mt-24 overflow-hidden bg-ink px-6 py-24 md:px-16 md:py-36"
    >
      {/* Lime glow behind the form column */}
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[60vh] w-[45vw] rounded-full bg-[radial-gradient(closest-side,rgba(200,255,61,0.1),transparent)]" />

      <div className="relative z-10 mx-auto grid max-w-[1800px] grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-24">
        {/* Left — pitch, pinned alongside the form on desktop */}
        <div data-inq-pitch className="lg:sticky lg:top-28">
          <p data-inq-kicker className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-lime">
            {COPY.kicker}
          </p>
          <h2 className="font-display font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-white text-[11vw] md:text-[5.5vw] lg:text-[4.5vw]">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-inq-line className="block">{COPY.line1}</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-inq-line className="block text-lime">{COPY.line2}</span>
            </span>
          </h2>
          <p data-inq-intro className="mt-6 max-w-md leading-relaxed text-white/55">
            {COPY.intro}
          </p>
          <p data-inq-trust className="mt-6 max-w-md font-mono text-[10px] uppercase leading-loose tracking-[0.2em] text-white/35">
            {COPY.trustLine}
          </p>

          {/* Site photography grounds the pitch */}
          <div data-inq-media className="mt-10 hidden overflow-hidden rounded-[20px] lg:block">
            <div className="relative aspect-[16/9] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-inq-img
                src="/images/dubai_court_night_construction_1779706759259.webp"
                alt="Court Hub site under construction at night"
                loading="lazy"
                className="absolute inset-0 h-[116%] w-full -top-[8%] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
                Live site · Dubai
              </span>
            </div>
          </div>
        </div>

        {/* Right — the working form (submit wiring unchanged) */}
        <div data-inq-form className="border-t border-white/10 pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-2">
          <AnimatePresence mode="wait">
            {status === 'done' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-start gap-5 py-10"
              >
                <CheckCircle2 className="h-14 w-14 text-lime" />
                <p className="max-w-sm font-display text-3xl font-extrabold uppercase leading-tight text-white">
                  {COPY.successTitle}
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-white/45">{COPY.successBody}</p>
                {dbFailed && (
                  <p className="max-w-sm font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-white/30">
                    {COPY.dbFailNote}
                  </p>
                )}
                <a
                  href={submittedHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-lime px-8 py-4 font-bold tracking-wide text-ink transition-all hover:brightness-110"
                >
                  <MessageCircle className="h-4 w-4" />
                  {COPY.successReopen}
                </a>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div data-inq-field>
                    <label htmlFor="inquiry-name" className={labelClass}>
                      {COPY.fields.name.label}
                    </label>
                    <input
                      id="inquiry-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={COPY.fields.name.placeholder}
                      className={inputClass}
                    />
                  </div>
                  <div data-inq-field>
                    <label htmlFor="inquiry-phone" className={labelClass}>
                      {COPY.fields.phone.label}
                    </label>
                    <input
                      id="inquiry-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={COPY.fields.phone.placeholder}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div data-inq-field>
                  <label htmlFor="inquiry-email" className={labelClass}>
                    {COPY.fields.email.label}
                  </label>
                  <input
                    id="inquiry-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={COPY.fields.email.placeholder}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div data-inq-field>
                    <label htmlFor="inquiry-court-type" className={labelClass}>
                      {COPY.fields.courtType.label}
                    </label>
                    <div className="relative">
                      <select
                        id="inquiry-court-type"
                        value={courtType}
                        onChange={(e) => setCourtType(e.target.value)}
                        className={`${inputClass} cursor-pointer appearance-none pr-10`}
                      >
                        {COURT_TYPES.map((t) => (
                          <option key={t} value={t} className="bg-ink text-white">
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    </div>
                  </div>
                  <div data-inq-field>
                    <label htmlFor="inquiry-location" className={labelClass}>
                      {COPY.fields.location.label}
                    </label>
                    <div className="relative">
                      <select
                        id="inquiry-location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={`${inputClass} cursor-pointer appearance-none pr-10`}
                      >
                        {LOCATIONS.map((l) => (
                          <option key={l} value={l} className="bg-ink text-white">
                            {l}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    </div>
                  </div>
                </div>

                <div data-inq-field>
                  <label htmlFor="inquiry-message" className={labelClass}>
                    {COPY.fields.message.label}
                  </label>
                  <textarea
                    id="inquiry-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={COPY.fields.message.placeholder}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div data-inq-field className="pt-2">
                  <Magnetic className="block w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-10 py-5 text-[12px] font-bold uppercase tracking-[0.15em] text-ink transition-colors duration-300 hover:bg-white disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {status === 'loading' ? COPY.submitLoading : COPY.submitIdle}
                    </button>
                  </Magnetic>
                  <p className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                    <ShieldCheck className="h-3.5 w-3.5 text-lime" />
                    {COPY.trustFootnote}
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
