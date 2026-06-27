/**
 * Admin authorization — APP layer.
 *
 * A user is treated as an admin ONLY if their email is in the ADMIN_EMAILS env
 * var (comma-separated, case-insensitive). This gate is enforced in three places
 * the route matcher cannot cover on its own: middleware.ts, the product/order
 * Server Actions (lib/actions/products.ts), and the Instagram parse-listing API
 * route (app/api/parse-listing/route.ts).
 *
 * The DATABASE enforces the same restriction independently via the `admins` table
 * in Row Level Security (see supabase/schema.sql). The two layers must be kept in
 * sync for the real admin account:
 *   1. add the admin's email to ADMIN_EMAILS, AND
 *   2. insert the admin's auth user id into the `admins` table.
 *
 * Fail-closed: if ADMIN_EMAILS is empty/unset, NO user is treated as an admin.
 *
 * No server-only imports here (just process.env) so this module is safe to import
 * from the Edge middleware as well as Node server code.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowList = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowList.includes(email.toLowerCase());
}
