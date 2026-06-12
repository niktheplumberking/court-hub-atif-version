'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/lib/types';

const LABEL_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const out = product.quantity <= 0;

  const addItem = () =>
    add({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price_aed: product.price_aed,
      image: product.images?.[0] ?? null,
      max_qty: product.is_unique ? 1 : product.quantity,
    });

  const addToCart = () => {
    addItem();
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  /** Buy Now: straight to Stripe checkout with just this item.
   *  Falls back to the cart while payments aren't configured yet. */
  const buyNow = async () => {
    setBuying(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: product.id, qty: 1 }] }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      // Payments not live yet (or stock conflict) → put it in the cart instead
      addItem();
      router.push('/cart');
    } catch {
      addItem();
      router.push('/cart');
    } finally {
      setBuying(false);
    }
  };

  if (out)
    return (
      <button disabled className="w-full py-4 rounded-full bg-white/10 text-white/40 font-semibold tracking-wide cursor-not-allowed">
        SOLD OUT
      </button>
    );

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          onClick={addToCart}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-4 rounded-full bg-lime text-ink font-bold tracking-wide hover:brightness-110 transition-all"
        >
          {/* Label-flip success morph — outgoing copy exits up, incoming rises in.
              Visual only: the cart add above already happened. */}
          <span className="relative block overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={added ? 'added' : 'idle'}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                exit={{ y: '-110%' }}
                transition={{ duration: 0.4, ease: LABEL_EASE }}
                className="block"
              >
                {added ? 'ADDED ✓' : 'ADD TO CART'}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.button>
        <motion.button
          onClick={buyNow}
          disabled={buying}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-4 rounded-full bg-court-blue text-white font-bold tracking-wide hover:brightness-110 transition-all disabled:opacity-60"
        >
          {buying ? 'OPENING CHECKOUT…' : 'BUY NOW'}
        </motion.button>
      </div>
    </MotionConfig>
  );
}
