# NEXT STEPS — do these in order (≈15 min)

## 1. Create the database (5 min)
Supabase dashboard → SQL Editor → New query → paste ALL of `supabase/schema.sql` → Run.
You should see "Success". This creates tables, security rules, the image storage bucket, and your 4 categories.

## 2. Create your admin login (2 min)
Supabase → Authentication → Users → "Add user" → email + password → ✅ tick "Auto Confirm User" → Create.
This is what you'll use at /admin/login.

## 3. Local run (optional but recommended)
Create `.env.local` in the project root (values were shared in our chat):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   (the sb_publishable_ key)
SUPABASE_SECRET_KEY=...             (the sb_secret_ key)
STRIPE_SECRET_KEY=sk_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
ANTHROPIC_API_KEY=sk-ant-placeholder
NEXT_PUBLIC_SITE_URL=http://localhost:3005
```
Then: `npm install` → `npm run dev` → open http://localhost:3005

## 4. Vercel (5 min)
Vercel project → Settings → Environment Variables → add the same 7 variables (use real values).
Then Deployments → the `nextjs-commerce` branch preview → open it.
If the build uses Vite settings, set Settings → Build & Development → Framework Preset = Next.js (vercel.json already requests it).

## 5. When Stripe test keys arrive
- Replace STRIPE_SECRET_KEY with sk_test_...
- Stripe dashboard → Developers → Webhooks → Add endpoint: `https://YOUR-PREVIEW-URL/api/webhooks/stripe`, event: `checkout.session.completed` → copy signing secret → STRIPE_WEBHOOK_SECRET.
- Test card: 4242 4242 4242 4242, any future date, any CVC.

## 6. When the real Claude key arrives
Swap ANTHROPIC_API_KEY → the ✨ Parse with AI button in /admin/products/new comes alive.
