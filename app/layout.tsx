import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import Cursor from '@/components/shared/Cursor';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005';

// PLACEHOLDER COPY — replace with client-provided copy (contract §8)
const META_DESCRIPTION =
  'Court Hub Group: premium padel equipment shop, court construction, and the home of padel in the UAE.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Title strategy: subpages (about, contact, construct-your-court) already
  // declare their own COMPLETE titles, e.g. 'Contact — Court Hub'. A template
  // of '%s — Court Hub' would double-suffix those to 'Contact — Court Hub —
  // Court Hub'. Using the identity template '%s' renders child titles verbatim
  // without editing any other file, while routes that declare no title (e.g.
  // /shop) still fall back to `default` below.
  title: {
    default: 'Court Hub — Premium Padel Shop & Court Construction, UAE',
    template: '%s',
  },
  description: META_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'Court Hub',
    locale: 'en_AE',
    images: ['/images/hero_padel_night_view_1779713624496.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink text-white antialiased">
        <CartProvider>{children}</CartProvider>
        {/* Cursor lives in the layout (NOT template.tsx) so it persists across
            route changes instead of remounting and briefly leaving the user
            with no visible cursor. */}
        <Cursor />
      </body>
    </html>
  );
}
