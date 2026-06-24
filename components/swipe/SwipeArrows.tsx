'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { neighbors } from './pageOrder';
import { swipeIntent } from './swipeIntent';

/**
 * In-hero swipe chevrons (left = previous page, right = next page in PAGE_ORDER).
 * Designed to be dropped INSIDE a `relative` hero container (absolute, not fixed)
 * so it scrolls away with the hero — matching the design. Glass-morphic circles
 * that flip to lime on hover. Renders nothing on non-swipe pages.
 */
export default function SwipeArrows({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const nb = neighbors(pathname);
  if (!nb) return null;

  const base =
    'flex h-11 w-11 md:h-14 md:w-14 items-center justify-center rounded-full ' +
    'border border-white/25 bg-black/50 text-white backdrop-blur-md shadow-lg';

  return (
    <div className={`pointer-events-none absolute inset-x-3 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between md:inset-x-6 ${className}`}>
      <motion.div
        className="pointer-events-auto"
        whileHover={{ scale: 1.15, backgroundColor: '#C8FF3D', color: '#0E0E0C', x: -2 }}
        whileTap={{ scale: 0.94 }}
      >
        <Link href={nb.prev} aria-label="Previous page" className={base} onClick={() => { swipeIntent.current = true; }}>
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </Link>
      </motion.div>
      <motion.div
        className="pointer-events-auto"
        whileHover={{ scale: 1.15, backgroundColor: '#C8FF3D', color: '#0E0E0C', x: 2 }}
        whileTap={{ scale: 0.94 }}
      >
        <Link href={nb.next} aria-label="Next page" className={base} onClick={() => { swipeIntent.current = true; }}>
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </Link>
      </motion.div>
    </div>
  );
}
