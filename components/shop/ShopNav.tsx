'use client';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function ShopNav() {
  const { count } = useCart();
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-ink/85 backdrop-blur-md border-b border-white/10">
      <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Home
      </Link>
      <Link href="/shop" className="font-display font-bold tracking-[0.3em] text-white">
        COURT <span className="text-lime">HUB</span>
      </Link>
      <Link href="/cart" className="relative flex items-center gap-2 text-white hover:text-lime transition-colors">
        <ShoppingBag size={20} />
        {count > 0 && (
          <span className="absolute -top-2 -right-3 bg-lime text-ink text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </Link>
    </nav>
  );
}
