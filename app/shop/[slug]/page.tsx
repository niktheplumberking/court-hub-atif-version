import { cache } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import SiteHeader from '@/components/shared/SiteHeader';
import Gallery from '@/components/shop/Gallery';
import ProductInfo from '@/components/shop/ProductInfo';
import SmoothScroll from '@/components/shared/SmoothScroll';
import Footer from '@/components/home/Footer';
import type { Product } from '@/lib/types';

export const revalidate = 30;

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  breadcrumb: 'Back to shop',
  metaFallback: (title: string) =>
    `${title} — available now at Court Hub, the UAE's padel gear destination.`,
};
// ─── End placeholder copy ───

// Deduped between generateMetadata and the page render.
const getProduct = cache(async (slug: string) => {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', slug)
    .in('status', ['active', 'sold'])
    .single();
  return (data as Product | null) ?? null;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Shop — Court Hub' };
  return {
    title: `${product.title} — Court Hub`,
    description: product.description?.slice(0, 160) ?? COPY.metaFallback(product.title),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const sold = product.status === 'sold' || product.quantity <= 0;

  // schema.org Product — rendered server-side so crawlers see it without JS.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand } } : {}),
    ...(product.images?.length ? { image: product.images } : {}),
    ...(product.description ? { description: product.description } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'AED',
      price: product.price_aed,
      availability: sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
  };

  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader spacer />
      <script
        type="application/ld+json"
        // '<' escaped so user-authored copy can never close the script tag early
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <SmoothScroll>
        <div className="px-6 md:px-12 pt-8 max-w-7xl mx-auto">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors duration-200"
          >
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:bg-lime after:origin-right after:scale-x-0 group-hover:after:origin-left group-hover:after:scale-x-100 after:[transition:transform_350ms_cubic-bezier(0.65,0,0.35,1)]">
              {COPY.breadcrumb}
            </span>
          </Link>
        </div>
        <div className="px-6 md:px-12 py-10 md:py-16 grid md:grid-cols-2 gap-10 md:gap-16 max-w-7xl mx-auto">
          <Gallery images={product.images ?? []} title={product.title} sold={sold} />
          <ProductInfo product={product} sold={sold} />
        </div>
        <Footer />
      </SmoothScroll>
    </main>
  );
}
