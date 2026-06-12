'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { gsap } from 'gsap';
import ShopNav from '@/components/shop/ShopNav';
import SmoothScroll from '@/components/shared/SmoothScroll';
import Footer from '@/components/home/Footer';
import { useCart } from '@/lib/cart-context';
import { formatAED } from '@/lib/utils';

const RISE_EASE: [number, number, number, number] = [0.25, 1, 0.5, 1];

/** Total ticks to its new value (0.4s) whenever a qty changes or a row leaves. */
function AnimatedTotal({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Tracks the value currently painted, so a change mid-tween continues from
  // what the user sees instead of jumping back.
  const shown = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shown.current === value) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shown.current = value;
      el.textContent = formatAED(value);
      return;
    }
    const counter = { v: shown.current };
    const tween = gsap.to(counter, {
      v: value,
      duration: 0.4,
      ease: 'power3.out',
      snap: { v: 1 },
      onUpdate: () => {
        shown.current = counter.v;
        el.textContent = formatAED(counter.v);
      },
      onComplete: () => {
        shown.current = value;
        el.textContent = formatAED(value);
      },
    });
    return () => {
      tween.kill();
    };
  }, [value]);

  return <span ref={ref}>{formatAED(value)}</span>;
}

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
      <SmoothScroll>
        <MotionConfig reducedMotion="user">
          <div className="max-w-3xl mx-auto px-6 py-12 min-h-[60vh]">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: RISE_EASE }}
              className="font-display font-extrabold text-3xl md:text-5xl text-white mb-10"
            >
              Your Cart
            </motion.h1>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: RISE_EASE, delay: 0.1 }}
                className="text-center py-20 space-y-6 bg-ink-2 rounded-[20px] border border-white/5"
              >
                <p className="text-white/40">Your cart is empty.</p>
                <Link
                  href="/shop"
                  className="inline-block px-8 py-4 rounded-full bg-lime text-ink font-bold hover:brightness-110 active:scale-95 transition-[filter,transform] duration-200"
                >
                  BROWSE THE SHOP
                </Link>
              </motion.div>
            ) : (
              <div>
                <AnimatePresence initial={true}>
                  {items.map((i, idx) => (
                    <motion.div
                      key={i.id}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        transition: { duration: 0.4, ease: RISE_EASE, delay: 0 },
                      }}
                      transition={{
                        duration: 0.55,
                        ease: RISE_EASE,
                        delay: Math.min(idx * 0.07, 0.42),
                        layout: { duration: 0.35, ease: RISE_EASE, delay: 0 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-4 bg-ink-2 rounded-[20px] p-4 border border-white/5 items-center mb-4">
                        <div className="w-20 h-20 rounded-xl bg-ink overflow-hidden shrink-0">
                          {i.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={i.image} alt={i.title} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/shop/${i.slug}`}
                            className="relative inline-block max-w-full truncate align-bottom text-white font-medium hover:text-lime transition-colors duration-200 after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-lime after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:[transition:transform_350ms_cubic-bezier(0.65,0,0.35,1)]"
                          >
                            {i.title}
                          </Link>
                          <p className="text-lime text-sm">{formatAED(i.price_aed)}</p>
                          {i.max_qty > 1 && (
                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() => setQty(i.id, i.qty - 1)}
                                aria-label="Decrease quantity"
                                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-[background-color,transform] duration-150"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-white text-sm w-4 text-center">{i.qty}</span>
                              <button
                                onClick={() => setQty(i.id, i.qty + 1)}
                                aria-label="Increase quantity"
                                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-[background-color,transform] duration-150"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-white font-semibold">{formatAED(i.price_aed * i.qty)}</p>
                          <button
                            onClick={() => remove(i.id)}
                            aria-label={`Remove ${i.title} from cart`}
                            className="text-white/30 hover:text-fire active:scale-90 transition-[color,transform] duration-150"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    ease: RISE_EASE,
                    delay: Math.min(items.length * 0.07, 0.42),
                    layout: { duration: 0.35, ease: RISE_EASE, delay: 0 },
                  }}
                  className="space-y-4"
                >
                  <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                    <span className="text-white/60">Total</span>
                    <span className="font-display font-bold text-2xl text-lime">
                      <AnimatedTotal value={total} />
                    </span>
                  </div>
                  {error && <p className="text-fire text-sm">{error}</p>}
                  <motion.button
                    onClick={checkout}
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-full bg-lime text-ink font-bold tracking-wide hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {loading ? 'REDIRECTING…' : 'CHECKOUT →'}
                  </motion.button>
                  <p className="text-white/30 text-xs text-center">Secure payment via Stripe · AED</p>
                </motion.div>
              </div>
            )}
          </div>
        </MotionConfig>
        <Footer />
      </SmoothScroll>
    </main>
  );
}
