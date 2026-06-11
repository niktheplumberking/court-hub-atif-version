import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatAED } from '@/lib/utils';

const conditionLabel: Record<string, string> = {
  new: 'New', 'like-new': 'Like New', good: 'Good', fair: 'Fair',
};

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];
  const out = product.quantity <= 0;
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block bg-ink-2 rounded-[20px] overflow-hidden border border-white/5 hover:border-lime/40 transition-all duration-300"
    >
      <div className="relative aspect-square bg-ink overflow-hidden">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 font-display text-sm tracking-widest">
            COURT HUB
          </div>
        )}
        {product.condition && product.condition !== 'new' && (
          <span className="absolute top-3 left-3 bg-court-blue text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
            {conditionLabel[product.condition]}
          </span>
        )}
        {out && (
          <span className="absolute inset-0 bg-ink/70 flex items-center justify-center text-white font-display font-bold tracking-widest">
            SOLD OUT
          </span>
        )}
      </div>
      <div className="p-5 space-y-1">
        {product.brand && (
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/40">{product.brand}</p>
        )}
        <h3 className="font-display font-semibold text-white leading-snug group-hover:text-lime transition-colors">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lime font-semibold">{formatAED(product.price_aed)}</span>
          {product.compare_at_price && (
            <span className="text-white/30 line-through text-sm">{formatAED(product.compare_at_price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
