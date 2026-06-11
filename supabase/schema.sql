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

-- ── Row Level Security ──
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table inquiries enable row level security;

-- Public storefront: read categories + active products only
create policy "public read categories" on categories for select using (true);
create policy "public read active products" on products for select using (status = 'active');

-- Logged-in admin: read everything
create policy "admin read all products" on products for select to authenticated using (true);
create policy "admin read orders" on orders for select to authenticated using (true);
create policy "admin read inquiries" on inquiries for select to authenticated using (true);

-- Public can submit court inquiries
create policy "public create inquiry" on inquiries for insert with check (true);

-- All writes to products/orders happen server-side via the service key (bypasses RLS).

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
