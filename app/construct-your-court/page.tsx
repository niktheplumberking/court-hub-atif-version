import Link from 'next/link';
import ShopNav from '@/components/shop/ShopNav';

// Phase B: full premium build per master plan §Phase B. Skeleton with WhatsApp lead-gen wired.
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971000000000';

export default function ConstructYourCourt() {
  const msg = encodeURIComponent("Hi Court Hub — I'd like a quote for building a padel court.");
  return (
    <main className="min-h-screen bg-ink">
      <ShopNav />
      <section className="px-6 md:px-12 py-24 max-w-4xl mx-auto text-center space-y-8">
        <p className="text-lime text-xs tracking-[0.3em] uppercase">Construct Your Court</p>
        <h1 className="font-display font-extrabold text-4xl md:text-7xl text-white leading-tight">
          Your Court.<br /><span className="text-lime">Built To Win.</span>
        </h1>
        <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
          Premium padel court construction across the UAE — from site survey to first serve.
          Full service breakdown, process and showcase gallery coming with client copy (Phase B).
        </p>
        <a href={`https://wa.me/${WHATSAPP}?text=${msg}`} target="_blank" rel="noopener noreferrer"
          className="inline-block px-10 py-5 rounded-full bg-lime text-ink font-bold tracking-wide hover:brightness-110 transition-all">
          GET A QUOTE ON WHATSAPP ↗
        </a>
        <div><Link href="/" className="text-white/30 text-sm hover:text-white">← Back home</Link></div>
      </section>
    </main>
  );
}
