# Court Hub — Project Instructions for Claude Code

Read PLAN.md first — it is the master execution plan agreed with the team. Follow its phases.

## What this is
Next.js 15 (App Router) e-commerce site for Court Hub Group (padel, UAE).
Stack: Next.js + Tailwind v4 + Supabase (DB/auth/storage) + Stripe Checkout (AED) + Claude API (IG caption parsing).
Migrated from a Vite SPA — original homepage components live in `components/home/` and keep their GSAP/Lenis scroll behavior.

## Status (after foundation push)
- DONE Phase A: shop, product pages, cart, Stripe checkout + webhook (auto-sold logic for unique items), admin panel (auth, product CRUD, image upload, AI Instagram caption import, orders).
- DONE Phase B: Construct Your Court full page (hero/services/process/spec/gallery/authority/inquiry form → Supabase `inquiries` + WhatsApp handoff), Contact (WhatsApp-first), About. NO /faq page — it was a contract mistake; the Q&A content lives on /contact (components/contact/FaqSection.tsx, id="faq") and next.config.ts redirects /faq → /contact. All copy is placeholder under `PLACEHOLDER COPY — replace with client-provided copy (contract §8)` banners; swap when client copy arrives. WhatsApp number + waHref() live in lib/whatsapp.ts; shared company figures in lib/constants.ts.
- Experience pass (client mandate): every page must feel scroll-driven and cinematic like the home Hero/Construction sections — gsap + ScrollTrigger + Lenis (components/shared/SmoothScroll.tsx wraps subpage content). Template-feeling static pages are not acceptable.
- DONE Phase C (core): Book-a-Court removed site-wide (CTAs → /construct-your-court, About section → /about link), shop teaser pulls real products (ISR via lib/supabase/public.ts), frame-404 bug fixed (unified /construction-frames 150-webp). Site-wide experience pass done: GSAP/Lenis on every page, page transitions (app/template.tsx), custom cursor, full nav connectivity (ShopNav = site nav), /terms + /privacy draft stubs (noindex), sitemap/robots/OG metadata. REMAINING Phase C: deployed frame sequences total ~43MB (under the 60MB target) but raw PNG folders still bloat the repo (vercelignored, deploy-safe); hero bg images contain a faint watermark — replace with client-approved 4K assets when available.
- TODO Phase D: Arabic RTL (/ar routes, next-intl) — only after EN approval.
- TODO Phase E: domain, admin subdomain rewrite, Hostinger/email/security.

## NON-NEGOTIABLE WORKFLOW RULE
After EVERY completed change set: `git add -A && git commit -m "..." && git push origin nextjs-commerce`. Work that is not pushed DOES NOT EXIST — Vercel previews only build pushed commits. A previous session lost hours of work by never committing.

## Cinematic system (use these, don't reinvent)
- components/construct/BuildSequence.tsx — scroll-scrubbed 150-frame canvas scene (homepage DNA). REUSABLE: copy the pattern for other pages/sequences (frames live in /public).
- components/shared/Magnetic.tsx — magnetic CTA wrapper for primary buttons.
- The premium feel = cinematic MEDIA (frame sequences, parallax imagery), not more text animation. Pages without a media moment read as static.

## Conventions
- Brand: Ink #0E0E0C bg, Lime #C8FF3D CTAs, Court Blue #1E5AE8, Sand #EDE8E1. Fonts: Outfit (display), Inter (body). Pill buttons (rounded-full), cards rounded-[20px]. Tokens are in app/globals.css @theme.
- DB writes go through server actions / API routes using `supabaseAdmin()` (service role) after auth check. Never expose SUPABASE_SECRET_KEY client-side.
- Prices are AED; Stripe amounts in fils (×100) via toFils().
- Unique items: is_unique=true, quantity 1; webhook flips status→'sold' on purchase.
- Env vars in .env.example. NEVER commit .env.local.

## Commands
npm run dev (port 3005) · npm run build · npm run lint (tsc)
