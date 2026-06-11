import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import ShopNav from '@/components/shop/ShopNav';
import AddToCart from '@/components/shop/AddToCart';
import Gallery from '@/components/shop/Gallery';
import { formatAED } from '@/lib/utils';
import type { Product } from '@/lib/types';

export const revalidate = 30;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', slug)
    .in('status', ['active', 'sold'])
    .single();
  if (!data) notFound();
  const product = data as Product;
  const sold = product.status === 'sold' || product.quantity <= 0;

  const specEntries = Object.entries(product.specs ?? {}).filter(([, v]) => v);

  return (
    <main className="min-h-screen bg-ink">
      <ShopNav />
      <div className="px-6 md:px-12 py-10 md:py-16 grid md:grid-cols-2 gap-10 md:gap-16 max-w-7xl mx-auto">
        <Gallery images={product.images ?? []} title={product.title} sold={sold} />
        <div className="space-y-6">
          <div>
            {product.brand && <p className="text-lime text-xs tracking-[0.3em] uppercase mb-2">{product.brand}</p>}
            <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white leading-tight">{product.title}</h1>
            <p className="text-white/40 text-sm mt-2">{product.categories?.name}{product.condition ? ` · Condition: ${product.condition.replace('-', ' ')}` : ''}</p>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-display font-bold text-lime">{formatAED(product.price_aed)}</span>
            {product.compare_at_price && <span className="text-white/30 line-through">{formatAED(product.compare_at_price)}</span>}
          </div>
          {product.description && <p className="text-white/60 leading-relaxed whitespace-pre-line">{product.description}</p>}
          {specEntries.length > 0 && (
            <div className="bg-ink-2 rounded-[20px] p-6 grid grid-cols-2 gap-4 border border-white/5">
              {specEntries.map(([k, v]) => (
                <div key={k}>
                  <p className="text-white/30 text-[11px] uppercase tracking-wider">{k.replace(/_/g, ' ')}</p>
                  <p className="text-white font-medium">{v}</p>
                </div>
              ))}
            </div>
          )}
          <AddToCart product={product} />
          {!product.is_unique && product.quantity > 0 && product.quantity <= 5 && (
            <p className="text-fire text-sm">Only {product.quantity} left in stock</p>
          )}
          {product.is_unique && !sold && (
            <p className="text-white/40 text-sm">Unique item — only one available. When it&apos;s gone, it&apos;s gone.</p>
          )}
        </div>
      </div>
    </main>
  );
}
