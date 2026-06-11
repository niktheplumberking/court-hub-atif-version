import ShopNav from '@/components/shop/ShopNav';

// Phase B page — structure in place, client copy drops in here.
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-ink">
      <ShopNav />
      <section className="px-6 md:px-12 py-24 max-w-3xl mx-auto space-y-6">
        <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white capitalize">about</h1>
        <p className="text-white/40">Content coming with client copy — structure per the master plan, Phase B.</p>
      </section>
    </main>
  );
}
