import { supabaseServer } from '@/lib/supabase/server';
import ProductCard from '@/components/shop/ProductCard';
import ShopNav from '@/components/shop/ShopNav';
import Link from 'next/link';
import type { Product, Category } from '@/lib/types';

export const revalidate = 60;

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
      <header className="px-6 md:px-12 pt-16 pb-10">
        <p className="text-lime text-xs tracking-[0.3em] uppercase mb-3">The Shop</p>
        <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white">
          Gear Up. <span className="text-lime">Game On.</span>
        </h1>
      </header>

      <div className="px-6 md:px-12 flex flex-wrap gap-3 pb-10">
        <Link href="/shop" className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-lime text-ink' : 'bg-ink-2 text-white/70 hover:text-white border border-white/10'}`}>All</Link>
        {(categories as Category[] | null)?.map((c) => (
          <Link key={c.id} href={`/shop?category=${c.slug}`} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${category === c.slug ? 'bg-lime text-ink' : 'bg-ink-2 text-white/70 hover:text-white border border-white/10'}`}>{c.name}</Link>
        ))}
      </div>

      <section className="px-6 md:px-12 pb-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {(products as Product[] | null)?.map((p) => <ProductCard key={p.id} product={p} />)}
        {(!products || products.length === 0) && (
          <p className="col-span-full text-white/40 py-20 text-center">No products here yet — check back soon.</p>
        )}
      </section>
    </main>
  );
}
