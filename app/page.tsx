import HomeClient from '@/components/home/HomeClient';
import { supabasePublic } from '@/lib/supabase/public';
import type { Product } from '@/lib/types';

export const revalidate = 60;

/**
 * Fetches the six newest active products for the homepage shop teaser.
 * Uses the cookie-less supabasePublic() client so the route stays static
 * and `revalidate = 60` (ISR) actually applies — supabaseServer()'s
 * `await cookies()` would force the page fully dynamic. Wrapped in
 * try/catch so a missing DB (local dev without Supabase env) degrades to
 * the ShopSection's built-in display-only fallback cards instead of
 * crashing the homepage.
 */
async function getTeaserProducts(): Promise<Product[]> {
  try {
    const supabase = supabasePublic();
    const { data } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6);
    return (data as Product[] | null) ?? [];
  } catch (e) {
    console.error('[home] teaser products fetch failed', e);
    return [];
  }
}

export default async function HomePage() {
  const products = await getTeaserProducts();
  return <HomeClient products={products} />;
}
