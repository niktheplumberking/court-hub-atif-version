'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/lib/types';

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const out = product.quantity <= 0;

  const handle = (buyNow: boolean) => {
    add({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price_aed: product.price_aed,
      image: product.images?.[0] ?? null,
      max_qty: product.is_unique ? 1 : product.quantity,
    });
    if (buyNow) router.push('/cart');
    else {
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    }
  };

  if (out)
    return (
      <button disabled className="w-full py-4 rounded-full bg-white/10 text-white/40 font-semibold tracking-wide cursor-not-allowed">
        SOLD OUT
      </button>
    );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => handle(false)}
        className="flex-1 py-4 rounded-full bg-lime text-ink font-bold tracking-wide hover:brightness-110 transition-all"
      >
        {added ? 'ADDED ✓' : 'ADD TO CART'}
      </button>
      <button
        onClick={() => handle(true)}
        className="flex-1 py-4 rounded-full bg-court-blue text-white font-bold tracking-wide hover:brightness-110 transition-all"
      >
        BUY NOW
      </button>
    </div>
  );
}
