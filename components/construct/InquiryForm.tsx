'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronDown, MessageCircle, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { submitInquiry } from '@/lib/actions/inquiries';
import { waHref } from '@/lib/whatsapp';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  kicker: 'Start Your Build',
  headlinePre: 'Tell Us About ',
  headlineLime: 'Your Site.',
  intro:
    'Fill this in and we continue the conversation on WhatsApp — your details come pre-loaded so you never type them twice. A build consultant replies within one working day.', // placeholder claim — confirm with client
  formTitle: 'Court Inquiry',
  formChip: 'Avg. response < 24h', // placeholder figure — confirm with client
  submitIdle: 'Send & Continue on WhatsApp',
  submitLoading: 'Sending…',
  successTitle: 'We got it — continuing in WhatsApp.',
  successBody:
    'Your inquiry is in. WhatsApp should have opened with your details pre-filled — if it didn’t, use the button below.',
  successReopen: 'Open WhatsApp',
  dbFailNote:
    'Heads up: our backup system couldn’t log this one, but your WhatsApp message carries everything we need.',
  reassurance: [
    { icon: Clock, text: 'Replies within one working day' }, // placeholder claim — confirm with client
    { icon: MapPin, text: 'Site surveys across all seven emirates' },
    { icon: ShieldCheck, text: 'Fixed line-item quotes — no allowances' },
  ],
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
  trustFootnote: 'Sent via WhatsApp — we keep a backup copy',
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

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:border-lime/50 outline-none transition-all';
const labelClass =
  'font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold block mb-2';

type Status = 'idle' | 'loading' | 'done';

export default function InquiryForm() {
  const sectionRef = useRef<HTMLElement>(null);

  // Restrained by design: header line reveal + a one-time card rise. The form's
  // inputs, focus order and the submitInquiry/window.open flow are never animated.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const header = gsap.timeline({
          scrollTrigger: { trigger: '[data-inquiry-pitch]', start: 'top 85%', once: true },
        });
        header
          .from('[data-inquiry-kicker]', { opacity: 0, x: -18, duration: 0.7, ease: 'power3.out' })
          .from('[data-inquiry-line]', { yPercent: 110, duration: 1, ease: 'power4.out' }, 0.1)
          .from('[data-inquiry-intro]', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, 0.35)
          .from(
            '[data-inquiry-reassure]',
            { opacity: 0, y: 16, duration: 0.6, ease: 'power3.out', stagger: 0.1 },
            0.5
          );

        gsap.from('[data-inquiry-card]', {
          opacity: 0,
          y: 44,
          duration: 1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: '[data-inquiry-card]', start: 'top 85%', once: true },
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
    <section ref={sectionRef} id="inquiry" className="px-6 md:px-12 py-20 md:py-32 scroll-mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* Left — pitch */}
        <div data-inquiry-pitch className="lg:sticky lg:top-32">
          <p data-inquiry-kicker className="text-lime text-xs tracking-[0.3em] uppercase mb-3">
            {COPY.kicker}
          </p>
          <h2 className="font-display font-extrabold uppercase text-white text-4xl md:text-6xl leading-[0.95] tracking-tight">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-inquiry-line className="block">
                {COPY.headlinePre}
                <span className="text-lime">{COPY.headlineLime}</span>
              </span>
            </span>
          </h2>
          <p data-inquiry-intro className="text-white/50 leading-relaxed mt-5 max-w-md">
            {COPY.intro}
          </p>

          <div className="mt-10 space-y-4">
            {COPY.reassurance.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  data-inquiry-reassure
                  className="flex items-center gap-3 text-white/50 text-sm"
                >
                  <Icon className="w-4 h-4 text-lime shrink-0" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — form card */}
        <div
          data-inquiry-card
          className="rounded-[24px] bg-ink-2 border border-white/10 p-6 md:p-10"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-7">
            <h3 className="font-display font-bold text-white text-xl uppercase">{COPY.formTitle}</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              {COPY.formChip}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {status === 'done' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="py-10 flex flex-col items-center text-center gap-5"
              >
                <CheckCircle2 className="w-14 h-14 text-lime" />
                <p className="font-display font-bold text-white text-2xl leading-tight max-w-sm">
                  {COPY.successTitle}
                </p>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm">{COPY.successBody}</p>
                {dbFailed && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 max-w-sm leading-relaxed">
                    {COPY.dbFailNote}
                  </p>
                )}
                <a
                  href={submittedHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-lime text-ink font-bold tracking-wide hover:brightness-110 transition-all mt-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {COPY.successReopen}
                </a>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
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
                  <div>
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

                <div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="inquiry-court-type" className={labelClass}>
                      {COPY.fields.courtType.label}
                    </label>
                    <div className="relative">
                      <select
                        id="inquiry-court-type"
                        value={courtType}
                        onChange={(e) => setCourtType(e.target.value)}
                        className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                      >
                        {COURT_TYPES.map((t) => (
                          <option key={t} value={t} className="bg-ink text-white">
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="inquiry-location" className={labelClass}>
                      {COPY.fields.location.label}
                    </label>
                    <div className="relative">
                      <select
                        id="inquiry-location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                      >
                        {LOCATIONS.map((l) => (
                          <option key={l} value={l} className="bg-ink text-white">
                            {l}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiry-message" className={labelClass}>
                    {COPY.fields.message.label}
                  </label>
                  <textarea
                    id="inquiry-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={COPY.fields.message.placeholder}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-lime text-ink font-bold tracking-wide hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-wait cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  {status === 'loading' ? COPY.submitLoading : COPY.submitIdle}
                </button>

                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 text-center flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-lime" />
                  {COPY.trustFootnote}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
