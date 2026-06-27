-- ============================================================
-- Migration 0001 — lock admin authorization to an explicit allow-list
-- ============================================================
-- Closes the Critical finding where ANY authenticated Supabase user could read
-- all customer PII and act as admin. Run this in the Supabase SQL Editor against
-- the existing project. Idempotent (safe to re-run).
--
-- Root cause being fixed: the read policies on orders / inquiries / products were
-- `to authenticated using (true)`, which granted every logged-in user full read
-- of customer email/name/phone/address. Here we introduce an `admins` allow-list
-- table and scope the admin reads to it.

-- 1. Admins allow-list ----------------------------------------------------------
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table admins enable row level security;

-- A user may check ONLY their own admin membership (lets the admin-read policies
-- resolve `auth.uid() in (select user_id from admins)` under RLS); the table
-- itself cannot be enumerated.
drop policy if exists "admin self read" on admins;
create policy "admin self read" on admins for select to authenticated
  using (auth.uid() = user_id);

-- 2. Replace the over-broad admin-read policies --------------------------------
-- orders + inquiries hold customer PII; products' broad policy also leaked drafts.
drop policy if exists "admin read orders" on orders;
create policy "admin read orders" on orders for select to authenticated
  using (auth.uid() in (select user_id from admins));

drop policy if exists "admin read inquiries" on inquiries;
create policy "admin read inquiries" on inquiries for select to authenticated
  using (auth.uid() in (select user_id from admins));

drop policy if exists "admin read all products" on products;
create policy "admin read all products" on products for select to authenticated
  using (auth.uid() in (select user_id from admins));

-- Unchanged on purpose:
--   * "public read active products" (status='active') — the shop must stay public.
--   * "public read categories" / "public create inquiry" — needed by the storefront/contact form.
--   * No insert/update/delete policies on products/orders → writes remain
--     service-role-only (Stripe webhook + admin Server Actions bypass RLS).

-- 3. REQUIRED one-time manual step after running this migration ------------------
-- Create the admin account in Supabase Auth (Authentication → Users), then insert
-- its id here so the admin can read orders/inquiries/drafts. Also add that same
-- email to the ADMIN_EMAILS env var (app-layer gate).
--
--   insert into admins (user_id) values ('00000000-0000-0000-0000-000000000000');
--
-- Until a row exists, the storefront keeps working but the admin panel's
-- order/inquiry/draft reads return empty (fail-closed).
