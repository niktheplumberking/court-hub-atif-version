import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';

export const metadata: Metadata = {
  title: 'Court Hub — Premium Padel, UAE',
  description:
    'Court Hub Group: premium padel equipment shop, court construction, and the home of padel in the UAE.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink text-white antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
