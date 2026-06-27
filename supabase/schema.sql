-- ============================================================
-- COURT HUB — Database schema (run once in Supabase SQL Editor)
-- ============================================================

create extension if not exists "pgcrypto";

-- ── Categories ──
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort int not null default 0
);

-- ── Products ──
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  brand text,
  model text,
  description text,
  category_id uuid not null references categories(id),
  price_aed numeric not null default 0,
  compare_at_price numeric,
  condition text check (condition in ('new','like-new','good','fair')),
  specs jsonb default '{}'::jsonb,
  quantity int not null default 1,
  is_unique boolean not null default true,
  status text not null default 'draft' check (status in ('draft','active','sold','archived')),
  images text[] not null default '{}',
  source text not null default 'manual' check (source in ('manual','instagram')),
  ig_post_url text,
  created_at timestamptz not null default now()
);
create index if not exists products_status_idx on products(status);
create index if not exists products_category_idx on products(category_id);

-- ── Orders ──
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  customer_email text,
  customer_name text,
  customer_phone text,
  shipping jsonb,
  items jsonb not null default '[]'::jsonb,
  amount_aed numeric not null default 0,
  status text not null default 'paid' check (status in ('paid','fulfilled','cancelled')),
  created_at timestamptz not null default now()
);

-- ── Construct Your Court inquiries (Phase B) ──
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  court_type text,
  location text,
  message text,
  created_at timestamptz not null default now()
);

-- ── Admins allow-list ──
-- The set of auth users permitted to administer the store. After creating the
-- admin account in Supabase Auth, insert its id MANUALLY (one-time step):
--   insert into admins (user_id) values ('<auth-user-uuid from Authentication → Users>');
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- ── Row Level Security ──
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table inquiries enable row level security;
alter table admins enable row level security;

-- A user may check ONLY their own admin membership. This is required so the
-- admin-read policies below can resolve `auth.uid() in (select user_id from admins)`
-- under RLS; nobody can enumerate the admins table.
create policy "admin self read" on admins for select to authenticated using (auth.uid() = user_id);

-- Public storefront: anyone may read categories + ACTIVE products only.
create policy "public read categories" on categories for select using (true);
create policy "public read active products" on products for select using (status = 'active');

-- Admin reads (via the RLS-respecting server client): ONLY users in the admins
-- table. orders + inquiries hold customer PII (email / name / phone / address) and
-- must never be readable by the anon role or by a non-admin authenticated user.
create policy "admin read all products" on products for select to authenticated
  using (auth.uid() in (select user_id from admins));
create policy "admin read orders" on orders for select to authenticated
  using (auth.uid() in (select user_id from admins));
create policy "admin read inquiries" on inquiries for select to authenticated
  using (auth.uid() in (select user_id from admins));

-- Public contact form may INSERT an inquiry (but cannot read inquiries back).
create policy "public create inquiry" on inquiries for insert with check (true);

-- There are intentionally NO insert/update/delete policies on products or orders.
-- With RLS enabled, that means the anon and authenticated roles CANNOT write to
-- them — every write goes through the service-role client (Stripe webhook + admin
-- Server Actions), which bypasses RLS.

-- ── Storage bucket for product images ──
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "public read product images" on storage.objects
  for select using (bucket_id = 'products');

-- ── Seed the four launch categories ──
insert into categories (name, slug, sort) values
  ('New Rackets', 'new-rackets', 1),
  ('Pre-Owned Rackets', 'pre-owned-rackets', 2),
  ('Racket Handles', 'racket-handles', 3),
  ('Tennis Balls', 'tennis-balls', 4)
on conflict (slug) do nothing;
