'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowLeft, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Build a Court', href: '/construct-your-court' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Bible #1 underline reveal: scaleX 0→1 from the left on enter, collapses toward the right on exit.
const UNDERLINE_REVEAL =
  'relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-lime after:origin-right after:scale-x-0 after:transition-transform after:duration-[350ms] after:ease-[cubic-bezier(0.65,0,0.35,1)] hover:after:origin-left hover:after:scale-x-100';

export default function ShopNav() {
  const { count } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Body scroll lock while the mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === '/shop' ? pathname === '/shop' || pathname.startsWith('/shop/') : pathname === href;

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center px-6 md:px-12 py-5 bg-ink/85 backdrop-blur-md border-b border-white/10">
        {/* Left */}
        <div className="flex-1 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors duration-300"
          >
            <ArrowLeft size={16} /> Home
          </Link>
        </div>

        {/* Center logo — brand goes home */}
        <Link href="/" className="shrink-0 font-display font-bold tracking-[0.3em] text-white">
          COURT <span className="text-lime">HUB</span>
        </Link>

        {/* Right: primary links (md+) · cart · hamburger (<md) */}
        <div className="flex-1 flex items-center justify-end gap-5 md:gap-6">
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                  isActive(link.href) ? 'text-lime' : `text-white/70 hover:text-white ${UNDERLINE_REVEAL}`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link href="/cart" className="relative flex items-center gap-2 text-white hover:text-lime transition-colors">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-lime text-ink text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden text-white hover:text-lime transition-colors p-1 cursor-pointer"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-ink pt-28 pb-10 px-8 flex flex-col md:hidden"
          >
            <div className="flex flex-col gap-5">
              {NAV_LINKS.map((link, i) => (
                <div key={link.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.05 + i * 0.09 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block text-3xl font-display font-bold tracking-tight transition-colors ${
                        isActive(link.href) ? 'text-lime' : 'text-white hover:text-lime'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 overflow-hidden">
              <motion.div
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                exit={{ y: '110%' }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.05 + NAV_LINKS.length * 0.09 }}
              >
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-white/80 hover:text-lime transition-colors"
                >
                  <ShoppingBag size={20} />
                  <span className="text-base font-semibold">
                    Your Cart{count > 0 ? ` (${count} ${count === 1 ? 'item' : 'items'})` : ''}
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
