import { createClient } from '@supabase/supabase-js';

/** Service-role client. SERVER ONLY. Bypasses RLS — never import in client code. */
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } }
  );
}
