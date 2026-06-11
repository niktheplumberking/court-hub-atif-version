# COURT HUB — MASTER EXECUTION PLAN
**Bridge Technologies × Court Hub Group · June 2026**
Goal: deliver the contract's end state, starting with the e-commerce core (the Day-10 milestone) in the fastest possible push.

---

## 1. WHERE WE ARE (verified from the actual repo, not the docs)

**Repo:** `niktheplumberking/court-hub-2.0` · Vite 6 + React 19 + Tailwind 4 + GSAP/ScrollTrigger + Lenis · Google AI Studio export.

What exists:
- One single-page app: Header, Hero (frame-sequence scroll), About, Shop *teaser*, Story/Construction scroll section, FAQ, Footer.
- No router. No pages. No backend. No database. No auth. No payments. No admin. English only.
- `public/` is **805MB** of raw PNG frame sequences and videos (e.g. 242MB + 182MB + 145MB folders). This will cause failed/slow deploys and terrible load times if untouched.
- Express + `@google/genai` are in package.json but unused for commerce.

What the contract requires at delivery:
- Home (polished) · Shop (catalog → product → cart → Stripe checkout → order status) · Construct Your Court (lead-gen) · About · FAQ · Contact (WhatsApp) · Admin (product management) · Arabic RTL mirror · domain + SSL + Hostinger + business email + security pass.

**Gap: ~85% of the contract's functionality does not exist yet. Frontend polish is the smallest remaining problem.**

---

## 2. STACK DECISION (the honest verdict)

### Partner's proposal (Medusa v2 + Payload + n8n + Docker/VPS)
Verdict: **architecturally sound, operationally wrong for this project.**
- Assumes a Next.js codebase — we have Vite. Adopting it means a frontend migration *anyway*, plus learning two backend frameworks, plus Docker/Nginx/Redis ops.
- Realistic setup-to-working-checkout time for a solo dev new to Medusa: 1–2 weeks minimum. Kills the deadline.
- Its *requirements* are right though: $0/month, unique-item logic, Instagram pipeline, Claude parsing. We keep all of those.

### Recommended stack (what we build)
| Layer | Tool | Cost | Why |
|---|---|---|---|
| Framework | **Next.js 15 (App Router)** | $0 | Real pages/SEO for shop, API routes for Stripe webhooks + IG import, middleware auth for admin, `/ar` routes for RTL later. Existing React components port over with `'use client'`. |
| Database + Auth + Storage | **Supabase** (hosted, free tier) | $0 | Postgres without running Postgres. Auth solves admin login in an hour. Storage + CDN hosts product images AND the heavy frame sequences. |
| Payments | **Stripe Checkout (hosted page)** | 2.9% + fee/txn | No PCI scope, AED supported, webhook → order + inventory logic. Exactly what the contract names. |
| Caption parsing | **Claude API** | ~$0.001/listing | Same as partner's doc. One API route. |
| Hosting (now) | Vercel | $0 | Already the preview environment; instant deploys while building. |
| Hosting (delivery) | Hostinger VPS (Node) or keep Vercel + domain | per contract | Migration is Phase E; contract says Hostinger, we comply at the end. |

Same outcomes as the Medusa plan — shop, unique-item auto-removal, admin, IG pipeline, $0/month — at roughly **20% of the build complexity**. If Court Hub later outgrows this, the Postgres schema migrates to Medusa cleanly. Tell your partner: his doc isn't wasted; it's the v2 roadmap.

---

## 3. TARGET ARCHITECTURE

```
courthub.ae (Next.js on Vercel → later Hostinger)
│
├── /                    Home (ported existing page, then polish per contract)
├── /shop                Catalog: grid, 4 category filters, sort
├── /shop/[slug]         Product detail: gallery, specs, condition, Add to Cart / Buy
├── /cart                Cart (client state → server-validated)
├── /api/checkout        Creates Stripe Checkout Session (server validates price/stock)
├── /order/[id]          Confirmation + status (paid / fulfilled)
├── /construct-your-court  Lead-gen page → WhatsApp pre-filled inquiry
├── /about · /faq · /contact
├── /admin               Protected (Supabase Auth, middleware) — Shopify-style panel
│     ├── Products: list, search, filter by category/status
│     ├── New/Edit product: images (drag-drop → Supabase Storage), category,
│     │     price AED, condition, specs, quantity, unique-item flag, publish toggle
│     ├── “Import from Instagram”: paste post link or caption → Claude parses →
│     │     form prefilled → review → publish (semi-automated by design)
│     └── Orders: list, status, customer + items
├── /api/webhooks/stripe   checkout.session.completed → create order,
│                          decrement stock, qty==0 & unique → auto-unpublish (SOLD)
├── /api/ig-import         Fetch post (Graph API / oEmbed) → Claude → JSON
└── /ar/...                Arabic RTL mirror (Phase D, after EN approval — per contract)
```

`admin.courthub.ae` → host-based rewrite to `/admin` at DNS/middleware level in Phase E. Functionally identical; the subdomain is cosmetic and takes 30 minutes once the domain is connected.

### Database schema (Supabase Postgres)
- **categories** — id, name, slug, sort. Seeded: New Rackets, Pre-Owned Rackets, Racket Handles, Tennis Balls.
- **products** — id, slug, title, brand, model, description, category_id, price_aed, compare_at_price, condition (new/like-new/good/fair), specs jsonb (head size, weight, grip…), quantity, is_unique boolean (default true for pre-owned; false for new rackets), status (draft/active/sold/archived), images text[], source (manual/instagram), ig_post_url, created_at.
- **orders** — id, stripe_session_id, customer email/name/phone, shipping jsonb, items jsonb (snapshot), amount_aed, status (paid/fulfilled/cancelled), created_at.
- **inquiries** — construct-your-court submissions (name, phone, court type, location, message) — backup record even though WhatsApp is the primary channel.
- RLS: public can `select` active products/categories only; all writes via service role (server) or authenticated admin.

### Inventory logic (the rule you asked about)
On Stripe webhook `checkout.session.completed`:
1. Create order row. 2. For each item: `quantity -= qty_bought`. 3. If `quantity <= 0` AND `is_unique` → `status = 'sold'` → disappears from shop instantly (kept in admin history). 4. If not unique (new rackets) → stays live until stock hits 0, then shows “Out of stock”.
Plus checkout-time guard: server re-checks stock before creating the Stripe session, so two people can't buy the same used racket.

---

## 4. INSTAGRAM IMPORT — what's real vs. fantasy

Three tiers, shipped in this order:

**Tier 1 (ships in the core build — always works):** Admin pastes the post **caption text** (and optionally uploads the image/screenshot). One click → Claude API parses brand, model, head size, weight, condition, price → product form prefilled → admin reviews → Publish. Zero Meta approvals, zero API keys beyond Claude. ~15 seconds per listing.

**Tier 2 (paste-a-link, needs one Meta setup step):** A Meta app + the client's IG converted to a **Business/Creator account** linked to a Facebook Page gives us Graph API access to **his own media** (caption + image URLs). Paste link → we resolve the shortcode → fetch caption + image automatically → Claude parses → prefilled with the actual photo already attached. This is the "paste link, product appears" experience. Note: plain anonymous scraping of instagram.com is blocked and unreliable — anyone who tells you otherwise is selling you a future outage. The Business API is the legitimate, stable path.

**Tier 3 (future, post-contract):** Instagram webhook → new post auto-creates a *draft* product, admin gets a one-click publish. This matches your partner's n8n vision but lives inside our Next.js API route instead. Keep semi-automated on purpose — used items are unique; a 10-second human review prevents wrong prices going live.

---

## 5. EXECUTION PHASES

### PHASE A — Foundation + Shop + Checkout (the big push, ~1–2 intense days)
1. Scaffold Next.js 15 + Tailwind in the repo (new branch), port Header/Footer/global styles.
2. Port homepage components as `'use client'`; keep GSAP/Lenis behavior intact.
3. Supabase project: schema, RLS, seed categories, storage buckets (products, media).
4. Shop catalog + product detail pages (brand-guide styling: Ink bg, Lime CTAs, Outfit/Inter, pill buttons).
5. Cart + `/api/checkout` (Stripe session, AED, server-side validation).
6. Stripe webhook → orders + inventory + auto-sold logic. Order confirmation page.
7. Admin: Supabase Auth login, middleware protection, product CRUD with image upload, orders list.
8. Instagram import Tier 1 (Claude caption parser) wired into the New Product form.
9. Seed 10–15 real products from @used_rackets content so the shop launches looking alive.
**Gate: a stranger can buy a racket with a test card; a sold used racket vanishes from the shop; you can add a product from an IG caption in under a minute. = Contract Day-10 milestone functionally done.**

### PHASE B — Construct Your Court + Contact + remaining pages (~1 day)
Construct Your Court premium page (hero, service breakdown, process steps, gallery, authority, WhatsApp pre-filled inquiry + inquiry record), Contact page (WhatsApp-first routing, details, hours), About page, FAQ page. Copy comes from the client (contract §8) — placeholder structure goes in now, real copy swapped on arrival.

### PHASE C — Homepage perfection per contract (~0.5–1 day)
Remove "Book a Court" → premium About Us section; shop teaser pulls real featured products from DB; scroll indicator + interaction feedback; **asset optimization: frame sequences → compressed WebP/AVIF, moved to Supabase Storage CDN, lazy-loaded** (805MB → target <60MB transferred); watermark-free optimized video; mobile pass.

### PHASE D — Arabic RTL (~1 day, only after EN sign-off, per contract)
next-intl locale routing (`/ar`), `dir="rtl"`, mirrored layouts, Arabic-capable font pairing for headings, translated content (client supplies/approves translations), RTL QA on mobile.

### PHASE E — Infrastructure (~0.5–1 day)
courthub.ae DNS + SSL (Cloudflare free in front), `admin.` subdomain rewrite, Hostinger deployment (Node app or VPS per their plan) — or present the case to keep Vercel free tier and use Hostinger budget elsewhere; business email setup; security pass (headers, rate-limit on API routes, webhook signature verification, RLS audit, admin 2FA optional).

### PHASE F — QA + launch (~0.5 day)
Full purchase-flow test (cards incl. declined), webhook replay, WhatsApp links on real phones, cross-device pass, Lighthouse performance check, final revision pass, launch.

**Honest total: e-commerce core live in 1–2 days of focused work; full contract delivery in roughly 4–6 working days — comfortably inside the 3-week contract window and ahead of the 10-day milestone.**

---

## 6. WHAT I NEED FROM YOU (blockers — answer before we start)

1. **Stack approval** — green-light the Next.js + Supabase + Stripe plan above (and tell your partner the Medusa doc becomes the scale-up roadmap, not the build plan).
2. **Supabase** — create a free project at supabase.com → send me Project URL, anon key, service role key.
3. **Stripe** — does the client (or you) have a Stripe account that can charge AED? Send **test-mode** keys to build with; live keys only at launch. (UAE Stripe accounts exist; if the client doesn't have one, he should start registration today — activation can take a couple of days.)
4. **Claude API key** — for the caption parser (Anthropic console, pay-as-you-go).
5. **GitHub** — a personal access token with repo write, or you commit the code I produce; either works.
6. **Instagram** — is @used_rackets a Business/Creator account linked to a Facebook Page? (Determines when Tier 2 link-import can ship. Tier 1 ships regardless.)
7. **Client copy** — chase the client for page copy now (contract §8 makes this their responsibility); we build with structured placeholders so copy never blocks us.
8. **Domain** — current status of courthub.ae (registered? where? DNS access?).

Items 2–4 take ~20 minutes total. The moment I have them, Phase A starts.

---

## 7. RISKS I'M FLAGGING NOW

- **805MB assets**: must be optimized in Phase C or the "premium" site loads like a dial-up site and deploys may fail. Non-negotiable.
- **Stripe account activation** in UAE can take days — start it first, in parallel.
- **Client copy** is the historic killer of agency timelines; placeholders protect us, but Arabic translation (Phase D) genuinely cannot finish without client-approved text.
- **Instagram Tier 2** depends on Meta account setup outside our control; that's why Tier 1 exists and fully satisfies the contract's "internal product upload system."
- **Hostinger vs Vercel**: a Next.js app with webhooks runs best on Vercel or a VPS with Node/PM2 — Hostinger *shared* hosting won't run it; their VPS will. We'll confirm which Hostinger product is in play before Phase E.
