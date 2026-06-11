# Court Hub — Project Instructions for Claude Code

Read PLAN.md first — it is the master execution plan agreed with the team. Follow its phases.

## What this is
Next.js 15 (App Router) e-commerce site for Court Hub Group (padel, UAE).
Stack: Next.js + Tailwind v4 + Supabase (DB/auth/storage) + Stripe Checkout (AED) + Claude API (IG caption parsing).
Migrated from a Vite SPA — original homepage components live in `components/home/` and keep their GSAP/Lenis scroll behavior.

## Status (after foundation push)
- DONE Phase A: shop, product pages, cart, Stripe checkout + webhook (auto-sold logic for unique items), admin panel (auth, product CRUD, image upload, AI Instagram caption import, orders).
- TODO Phase B: Construct Your Court full page, Contact, About, FAQ (skeletons exist; client copy pending).
- TODO Phase C: homepage polish per contract (remove "Book a Court" → About Us section, asset optimization — public/ has heavy frame sequences, only some are vercelignored).
- TODO Phase D: Arabic RTL (/ar routes, next-intl) — only after EN approval.
- TODO Phase E: domain, admin subdomain rewrite, Hostinger/email/security.

## Conventions
- Brand: Ink #0E0E0C bg, Lime #C8FF3D CTAs, Court Blue #1E5AE8, Sand #EDE8E1. Fonts: Outfit (display), Inter (body). Pill buttons (rounded-full), cards rounded-[20px]. Tokens are in app/globals.css @theme.
- DB writes go through server actions / API routes using `supabaseAdmin()` (service role) after auth check. Never expose SUPABASE_SECRET_KEY client-side.
- Prices are AED; Stripe amounts in fils (×100) via toFils().
- Unique items: is_unique=true, quantity 1; webhook flips status→'sold' on purchase.
- Env vars in .env.example. NEVER commit .env.local.

## Commands
npm run dev (port 3005) · npm run build · npm run lint (tsc)
