'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  MapPin,
  ArrowRight,
  ShoppingBag,
  Hammer,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import { waHref } from '@/lib/whatsapp';

gsap.registerPlugin(ScrollTrigger);

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───

const HEADER = {
  kicker: 'Contact',
  headlineBefore: 'One Message',
  headlineHighlight: 'Away.',
  sub: 'Rackets, court builds, orders — skip the forms and talk to a real human.',
};

const WHATSAPP_HERO = {
  microLabel: 'Fastest way to reach us',
  title: 'Skip the inbox. Message us.',
  body: 'From picking your next racket to pricing a full court build, one WhatsApp message gets you a real answer from the team — no tickets, no hold music.',
  responseTime: 'Typically replies within minutes', // placeholder — confirm real response time with client
  buttonLabel: 'Chat on WhatsApp',
  prefillMessage: 'Hi Court Hub — I have a question about ...',
};

type ContactMethod = {
  label: string;
  value: string;
  sub: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

const CONTACT_METHODS: ContactMethod[] = [
  {
    label: 'Phone',
    value: '+971 4 000 0000', // placeholder number — confirm with client
    sub: 'Call us during shop hours',
    href: 'tel:+97140000000',
    icon: Phone,
  },
  {
    label: 'Email',
    value: 'hello@courthub.ae', // placeholder address — confirm with client
    sub: 'Quotes, invoices & documents',
    href: 'mailto:hello@courthub.ae',
    icon: Mail,
  },
  {
    label: 'Instagram',
    value: '@used_rackets',
    sub: 'Drops & behind the scenes',
    href: 'https://www.instagram.com/used_rackets', // confirm handle with client
    icon: Instagram,
    external: true,
  },
  {
    label: 'Visit us',
    value: 'Al Quoz Industrial 3, Dubai', // placeholder address — confirm with client
    sub: 'Showroom visits by appointment',
    href: 'https://www.google.com/maps/search/?api=1&query=Al+Quoz+Industrial+Area+3+Dubai', // placeholder maps query — replace with exact pin when client confirms address
    icon: MapPin,
    external: true,
  },
];

const HOURS = {
  microLabel: 'Opening hours',
  liveLabel: 'Open now', // static placeholder — no real open/closed logic
  rows: [
    { days: 'Mon – Fri', time: '09:00 – 21:00' }, // placeholder hours — confirm with client
    { days: 'Saturday', time: '10:00 – 20:00' }, // placeholder hours — confirm with client
    { days: 'Sunday', time: '12:00 – 18:00' }, // placeholder hours — confirm with client
  ],
};

const AFTER_HOURS = {
  microLabel: 'After hours?',
  title: 'WhatsApp never sleeps.',
  body: 'Send your message any time — we pick up the thread first thing the next morning and keep your place in line.',
  buttonLabel: 'Message anyway',
};

type QuickRoute = {
  label: string;
  sub: string;
  href: string;
  icon: LucideIcon;
};

const QUICK_ROUTES_HEADING = {
  microLabel: 'Quick routes',
  title: 'Already know what you need?',
};

const QUICK_ROUTES: QuickRoute[] = [
  { label: 'Buying a racket?', sub: 'Browse the current drop', href: '/shop', icon: ShoppingBag },
  { label: 'Building a court?', sub: 'Start your court project', href: '/construct-your-court', icon: Hammer },
  { label: 'Common questions', sub: 'Answers further down this page', href: '#faq', icon: HelpCircle },
];

// ─── END PLACEHOLDER COPY ───

const WA_HREF = waHref(WHATSAPP_HERO.prefillMessage);

// Word-split of the banner-marked headline copy above (markup-only — copy itself unchanged).
const HEADLINE_WORDS = [
  ...HEADER.headlineBefore.split(' ').map((text) => ({ text, lime: false })),
  ...HEADER.headlineHighlight.split(' ').map((text) => ({ text, lime: true })),
];

export default function ContactClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<SVGSVGElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── Entrance + scroll reveals (all viewports — light by design; skipped
      // entirely under prefers-reduced-motion so content stays visible) ──
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Load choreography: kicker → headline words rise → sub → lime card settles in.
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro
          .from('[data-hero-kicker]', { y: 14, opacity: 0, duration: 0.5 }, 0)
          .from(
            '[data-hero-word]',
            { yPercent: 115, duration: 0.8, stagger: 0.09, ease: 'power4.out' },
            0.08,
          )
          .from('[data-hero-sub]', { y: 18, opacity: 0, duration: 0.6 }, 0.4)
          .fromTo(
            heroCardRef.current,
            { clipPath: 'inset(8% 5% 8% 5% round 48px)', scale: 0.965, opacity: 0 },
            {
              clipPath: 'inset(0% 0% 0% 0% round 32px)',
              scale: 1,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              clearProps: 'clipPath,scale,opacity',
            },
            0.35,
          );

        // 2. Method cards: single staggered rise.
        gsap.from('[data-method-card]', {
          y: 28,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-methods]', start: 'top 85%', once: true },
        });

        // 3. Hours panel rises, rows slide in staggered, after-hours panel follows.
        gsap
          .timeline({
            defaults: { ease: 'power2.out' },
            scrollTrigger: { trigger: '[data-hours-section]', start: 'top 80%', once: true },
          })
          .from('[data-hours-panel]', { y: 28, opacity: 0, duration: 0.6 }, 0)
          .from('[data-hours-row]', { x: -28, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.15)
          .from('[data-afterhours]', { y: 28, opacity: 0, duration: 0.6 }, 0.1);

        // 4. Quick routes: heading then cards rise staggered.
        gsap.from('[data-routes-heading] > *', {
          y: 22,
          opacity: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-routes-heading]', start: 'top 88%', once: true },
        });
        gsap.from('[data-route-card]', {
          y: 24,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-routes]', start: 'top 88%', once: true },
        });
      });

      // ── Watermark drift: slow parallax scrub across the lime card (desktop only) ──
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          watermarkRef.current,
          { yPercent: 14, rotate: -6 },
          {
            yPercent: -18,
            rotate: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: heroCardRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        );
      });

      // ── Pointer micro-interactions: magnetic CTA pill + method-card tilt ──
      mm.add(
        '(min-width: 768px) and (prefers-reduced-motion: no-preference) and (pointer: fine)',
        () => {
          const cleanups: Array<() => void> = [];

          // Magnetic WhatsApp pill: translates toward the pointer (clamped ~40px),
          // glides back on leave. Center is cached on enter (minus current transform)
          // so the moving pill never feeds back into its own math — no jitter.
          const pill = ctaRef.current;
          if (pill) {
            const xTo = gsap.quickTo(pill, 'x', { duration: 0.45, ease: 'power3' });
            const yTo = gsap.quickTo(pill, 'y', { duration: 0.45, ease: 'power3' });
            let baseX = 0;
            let baseY = 0;
            const onEnter = () => {
              const r = pill.getBoundingClientRect();
              baseX = r.left + r.width / 2 - (Number(gsap.getProperty(pill, 'x')) || 0);
              baseY = r.top + r.height / 2 - (Number(gsap.getProperty(pill, 'y')) || 0);
              gsap.to(pill, { scale: 1.03, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
            };
            const onMove = (e: PointerEvent) => {
              xTo(gsap.utils.clamp(-40, 40, (e.clientX - baseX) * 0.34));
              yTo(gsap.utils.clamp(-16, 16, (e.clientY - baseY) * 0.34));
            };
            const onLeave = () => {
              xTo(0);
              yTo(0);
              gsap.to(pill, { scale: 1, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
            };
            pill.addEventListener('pointerenter', onEnter);
            pill.addEventListener('pointermove', onMove);
            pill.addEventListener('pointerleave', onLeave);
            cleanups.push(() => {
              pill.removeEventListener('pointerenter', onEnter);
              pill.removeEventListener('pointermove', onMove);
              pill.removeEventListener('pointerleave', onLeave);
            });
          }

          // Method cards: subtle pointer tilt (max ±6deg), lift on hover, reset on leave.
          const cards = Array.from(
            rootRef.current?.querySelectorAll<HTMLElement>('[data-method-card]') ?? [],
          );
          cards.forEach((card) => {
            gsap.set(card, { transformPerspective: 800 });
            const rxTo = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
            const ryTo = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
            let rect: DOMRect | null = null;
            const onEnter = () => {
              rect = card.getBoundingClientRect();
              gsap.to(card, { y: -4, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
            };
            const onMove = (e: PointerEvent) => {
              if (!rect) rect = card.getBoundingClientRect();
              const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 … 0.5
              const py = (e.clientY - rect.top) / rect.height - 0.5;
              ryTo(px * 12); // max ±6deg
              rxTo(py * -12);
            };
            const onLeave = () => {
              rect = null;
              rxTo(0);
              ryTo(0);
              gsap.to(card, { y: 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
            };
            card.addEventListener('pointerenter', onEnter);
            card.addEventListener('pointermove', onMove);
            card.addEventListener('pointerleave', onLeave);
            cleanups.push(() => {
              card.removeEventListener('pointerenter', onEnter);
              card.removeEventListener('pointermove', onMove);
              card.removeEventListener('pointerleave', onLeave);
            });
          });

          return () => cleanups.forEach((fn) => fn());
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="px-6 md:px-12 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* ── 1. HEADER ───────────────────────────────────────────── */}
        <header className="pt-16 pb-12">
          <p data-hero-kicker className="text-lime text-xs tracking-[0.3em] uppercase mb-3">
            {HEADER.kicker}
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white leading-[1.05] tracking-tight">
            {HEADLINE_WORDS.map((word, i) => (
              <span key={`${word.text}-${i}`}>
                <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
                  <span data-hero-word className={`inline-block ${word.lime ? 'text-lime' : ''}`}>
                    {word.text}
                  </span>
                </span>
                {i < HEADLINE_WORDS.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p data-hero-sub className="text-white/50 text-base md:text-lg mt-4 max-w-xl">
            {HEADER.sub}
          </p>
        </header>

        {/* ── 2. WHATSAPP HERO CARD ───────────────────────────────── */}
        <section
          ref={heroCardRef}
          className="relative overflow-hidden rounded-[32px] bg-lime text-ink p-8 md:p-14"
        >
          <MessageCircle
            ref={watermarkRef}
            strokeWidth={1}
            className="absolute -bottom-16 -right-10 w-64 h-64 md:w-96 md:h-96 text-ink/[0.06] pointer-events-none"
          />
          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div className="max-w-xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 font-bold mb-5">
                {WHATSAPP_HERO.microLabel}
              </p>
              <h2 className="font-display font-extrabold uppercase text-3xl md:text-5xl leading-[1] tracking-tight">
                {WHATSAPP_HERO.title}
              </h2>
              <p className="text-ink/60 font-medium text-base md:text-lg leading-relaxed mt-5">
                {WHATSAPP_HERO.body}
              </p>
              <div className="flex items-center gap-2.5 mt-6">
                <span className="w-2 h-2 rounded-full bg-green radar-pulse-effect" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                  {WHATSAPP_HERO.responseTime}
                </span>
              </div>
            </div>
            <a
              ref={ctaRef}
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-ink text-white font-bold text-base md:text-lg px-10 py-5 shrink-0 w-full sm:w-auto will-change-transform"
            >
              <MessageCircle className="w-5 h-5 text-lime" />
              {WHATSAPP_HERO.buttonLabel}
            </a>
          </div>
        </section>

        {/* ── 3. CONTACT METHODS GRID ─────────────────────────────── */}
        <section
          data-methods
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {CONTACT_METHODS.map((method) => (
            <a
              key={method.label}
              data-method-card
              href={method.href}
              {...(method.external && { target: '_blank', rel: 'noopener noreferrer' })}
              className="group flex flex-col bg-ink-2 border border-white/10 rounded-[20px] p-6 hover:border-lime/40 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-lime group-hover:text-ink text-lime transition-colors">
                <method.icon className="w-5 h-5" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25 font-bold mb-2">
                {method.label}
              </p>
              <p className="font-display font-bold text-white text-base md:text-lg leading-snug">
                {method.value}
              </p>
              <p className="text-white/40 text-sm mt-1">{method.sub}</p>
            </a>
          ))}
        </section>

        {/* ── 4. HOURS + AFTER-HOURS PANEL ────────────────────────── */}
        <section data-hours-section className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div data-hours-panel className="lg:col-span-7">
            <div className="bg-ink-2 border border-white/10 rounded-[24px] p-8 md:p-10 h-full">
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25 font-bold">
                  {HOURS.microLabel}
                </p>
                {/* Static placeholder badge — no real open/closed logic */}
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green radar-pulse-effect" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-green">
                    {HOURS.liveLabel}
                  </span>
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {HOURS.rows.map((row) => (
                  <div
                    key={row.days}
                    data-hours-row
                    className="flex items-center justify-between py-4"
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                      {row.days}
                    </span>
                    <span className="font-display font-bold text-white text-sm md:text-base">
                      {row.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div data-afterhours className="lg:col-span-5">
            <div className="bg-court-blue rounded-[24px] p-8 md:p-10 h-full flex flex-col justify-between gap-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-4">
                  {AFTER_HOURS.microLabel}
                </p>
                <h3 className="font-display font-extrabold uppercase text-2xl md:text-3xl text-white leading-[1.05] tracking-tight">
                  {AFTER_HOURS.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed mt-3">
                  {AFTER_HOURS.body}
                </p>
              </div>
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-fit rounded-full border border-white/30 text-white text-sm font-bold px-6 py-3 hover:border-lime hover:text-lime transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {AFTER_HOURS.buttonLabel}
              </a>
            </div>
          </div>
        </section>

        {/* ── 5. QUICK ROUTES ─────────────────────────────────────── */}
        <section className="mt-16">
          <div data-routes-heading>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25 font-bold mb-3">
              {QUICK_ROUTES_HEADING.microLabel}
            </p>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-8">
              {QUICK_ROUTES_HEADING.title}
            </h2>
          </div>
          <div data-routes className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {QUICK_ROUTES.map((route) => (
              <Link
                key={route.href}
                data-route-card
                href={route.href}
                className="group flex items-center justify-between bg-ink-2 border border-white/10 rounded-[20px] p-6 hover:border-lime/40 transition-colors"
              >
                <span className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lime shrink-0">
                    <route.icon className="w-4 h-4" />
                  </span>
                  <span>
                    <span className="block font-display font-bold text-white">{route.label}</span>
                    <span className="block text-white/40 text-sm mt-0.5">{route.sub}</span>
                  </span>
                </span>
                <ArrowRight className="w-5 h-5 text-lime shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
