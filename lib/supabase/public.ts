import { createClient } from '@supabase/supabase-js';

/**
 * Cookie-less read-only anon client for PUBLIC queries (e.g. active products,
 * which RLS allows anonymous reads of). Unlike supabaseServer(), this never
 * touches next/headers cookies, so routes using it stay static and ISR
 * (`export const revalidate`) actually works instead of going fully dynamic.
 */
export function supabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
