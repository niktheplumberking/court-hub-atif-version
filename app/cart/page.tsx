'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus } from 'lucide-react';
import ShopNav from '@/components/shop/ShopNav';
import { useCart } from '@/lib/cart-context';
import { formatAED } from '@/lib/utils';

export default function CartPage() {
  const { items, remove, setQty, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((i) => ({ id: i.id, qty: i.qty })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink">
      <ShopNav />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-10">Your Cart</h1>
        {items.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <p className="text-white/40">Your cart is empty.</p>
            <Link href="/shop" className="inline-block px-8 py-4 rounded-full bg-lime text-ink font-bold">BROWSE THE SHOP</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((i) => (
              <div key={i.id} className="flex gap-4 bg-ink-2 rounded-[20px] p-4 border border-white/5 items-center">
                <div className="w-20 h-20 rounded-xl bg-ink overflow-hidden shrink-0">
                  {i.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.image} alt={i.title} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${i.slug}`} className="text-white font-medium hover:text-lime line-clamp-1">{i.title}</Link>
                  <p className="text-lime text-sm">{formatAED(i.price_aed)}</p>
                  {i.max_qty > 1 && (
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => setQty(i.id, i.qty - 1)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white"><Minus size={12} /></button>
                      <span className="text-white text-sm w-4 text-center">{i.qty}</span>
                      <button onClick={() => setQty(i.id, i.qty + 1)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white"><Plus size={12} /></button>
                    </div>
                  )}
                </div>
                <div className="text-right space-y-2">
                  <p className="text-white font-semibold">{formatAED(i.price_aed * i.qty)}</p>
                  <button onClick={() => remove(i.id)} className="text-white/30 hover:text-fire"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            <div className="border-t border-white/10 pt-6 flex items-center justify-between">
              <span className="text-white/60">Total</span>
              <span className="font-display font-bold text-2xl text-lime">{formatAED(total)}</span>
            </div>
            {error && <p className="text-fire text-sm">{error}</p>}
            <button onClick={checkout} disabled={loading}
              className="w-full py-4 rounded-full bg-lime text-ink font-bold tracking-wide hover:brightness-110 transition-all disabled:opacity-50">
              {loading ? 'REDIRECTING…' : 'CHECKOUT →'}
            </button>
            <p className="text-white/30 text-xs text-center">Secure payment via Stripe · AED</p>
          </div>
        )}
      </div>
    </main>
  );
}
