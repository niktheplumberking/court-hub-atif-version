import SiteHeader from '@/components/shared/SiteHeader';
import Footer from '@/components/home/Footer';
import SmoothScroll from '@/components/shared/SmoothScroll';
import ConstructHero from '@/components/construct/ConstructHero';
import BuildSequence from '@/components/construct/BuildSequence';
import WhatWeBuild from '@/components/construct/WhatWeBuild';
import SpecSheet from '@/components/construct/SpecSheet';
import BuildsGallery from '@/components/construct/BuildsGallery';
import LimeCTA from '@/components/construct/LimeCTA';
import InquirySection from '@/components/construct/InquirySection';

// Cinematic rebuild — background rhythm: Ink (hero + build sequence) → Sand
// (what we build) → Court Blue (spec sheet) → Ink (gallery) → Lime (CTA) → Ink (inquiry).
// All copy is placeholder pending client copy (contract §8).
export const metadata = {
  title: 'Construct Your Court — Court Hub',
  description:
    'FIP-standard padel court construction across the UAE — full builds, resurfacing, lighting, roofing and maintenance, from site survey to first serve.',
};

export default function ConstructYourCourtPage() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <SmoothScroll>
        <ConstructHero />
        <BuildSequence />
        <WhatWeBuild />
        <SpecSheet />
        <BuildsGallery />
        <LimeCTA />
        <InquirySection />
        <Footer />
      </SmoothScroll>
    </main>
  );
}
