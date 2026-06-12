import ShopNav from '@/components/shop/ShopNav';
import Footer from '@/components/home/Footer';
import SmoothScroll from '@/components/shared/SmoothScroll';
import AboutHero from '@/components/about/AboutHero';
import FloatingRacket from '@/components/about/FloatingRacket';
import MissionValues from '@/components/about/MissionValues';
import WhatWeDo from '@/components/about/WhatWeDo';
import StatsAndCta from '@/components/about/StatsAndCta';

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  metaTitle: 'About — Court Hub',
  metaDescription:
    'The Court Hub story: from re-homing pre-owned padel rackets on Instagram to building championship-grade courts across the UAE. Built by players, for players.',
};
// ─── End placeholder copy ───

export const metadata = {
  title: COPY.metaTitle,
  description: COPY.metaDescription,
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-ink">
      <ShopNav />
      <SmoothScroll>
        {/* Relative corridor the scroll-scrubbed racket drifts down, behind
            the hero and values content (which paints above in the second div). */}
        <div className="relative">
          <FloatingRacket />
          <div className="relative">
            <AboutHero />
            <MissionValues />
          </div>
        </div>
        <WhatWeDo />
        <StatsAndCta />
        <Footer />
      </SmoothScroll>
    </main>
  );
}
