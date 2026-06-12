import { supabaseServer } from '@/lib/supabase/server';
import ShopNav from '@/components/shop/ShopNav';
import ShopCatalog from '@/components/shop/ShopCatalog';
import SmoothScroll from '@/components/shared/SmoothScroll';
import Footer from '@/components/home/Footer';
import type { Product, Category } from '@/lib/types';

export const revalidate = 60;

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  metaTitle: 'Shop — Court Hub',
  metaDescription:
    'Premium and certified pre-owned padel rackets, gear and accessories — curated by Court Hub in the UAE. Secure checkout in AED.',
};
// ─── End placeholder copy ───

export const metadata = {
  title: COPY.metaTitle,
  description: COPY.metaDescription,
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await supabaseServer();

  const { data: categories } = await supabase.from('categories').select('*').order('sort');

  let query = supabase
    .from('products')
    .select('*, categories!inner(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (category) query = query.eq('categories.slug', category);
  const { data: products } = await query;

  return (
    <main className="min-h-screen bg-ink">
      <ShopNav />
      <SmoothScroll>
        {/* Keyed by category so a filter change remounts the catalog and the
            reveal choreography replays instead of leaving stale triggers. */}
        <ShopCatalog
          key={category ?? 'all'}
          categories={(categories as Category[] | null) ?? []}
          products={(products as Product[] | null) ?? []}
          activeCategory={category}
        />
        <Footer />
      </SmoothScroll>
    </main>
  );
}
