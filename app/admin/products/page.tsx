import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { formatAED } from '@/lib/utils';
import type { Product } from '@/lib/types';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

export const dynamic = 'force-dynamic';

const statusColors: Record<string, string> = {
  active: 'bg-lime/15 text-lime', draft: 'bg-white/10 text-white/50',
  sold: 'bg-court-blue/20 text-court-blue', archived: 'bg-white/5 text-white/30',
};

export default async function AdminProducts() {
  const supabase = await supabaseServer();
  const { data: products } = await supabase
    .from('products').select('*, categories(name)').order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Products <span className="text-white/30 text-base font-sans font-normal">({products?.length ?? 0})</span></h1>
        <Link href="/admin/products/new" className="px-5 py-2.5 rounded-full bg-lime text-ink font-bold text-sm">+ ADD PRODUCT</Link>
      </div>
      <div className="bg-ink-2 rounded-[20px] border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/30 text-xs uppercase tracking-wider border-b border-white/5">
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium hidden md:table-cell">Category</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium hidden md:table-cell">Stock</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4" />
            </tr>
          </thead>
          <tbody>
            {(products as (Product & { categories: { name: string } })[] | null)?.map((p) => (
              <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3">
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-ink overflow-hidden shrink-0">
                      {p.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="text-white group-hover:text-lime line-clamp-1">{p.title}</span>
                  </Link>
                </td>
                <td className="px-5 py-3 text-white/50 hidden md:table-cell">{p.categories?.name}</td>
                <td className="px-5 py-3 text-white/80">{formatAED(p.price_aed)}</td>
                <td className="px-5 py-3 text-white/50 hidden md:table-cell">{p.is_unique ? (p.quantity > 0 ? '1 (unique)' : '—') : p.quantity}</td>
                <td className="px-5 py-3">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase ${statusColors[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-5 py-3 text-right"><DeleteProductButton id={p.id} /></td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr><td colSpan={6} className="px-5 py-16 text-center text-white/30">No products yet. Click &quot;Add Product&quot; or import from Instagram.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
