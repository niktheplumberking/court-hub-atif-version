import ShopNav from '@/components/shop/ShopNav';
import Footer from '@/components/home/Footer';
import SmoothScroll from '@/components/shared/SmoothScroll';
import ConstructHero from '@/components/construct/ConstructHero';
import Services from '@/components/construct/Services';
import Process from '@/components/construct/Process';
import Gallery from '@/components/construct/Gallery';
import Authority from '@/components/construct/Authority';
import InquiryForm from '@/components/construct/InquiryForm';
import FinalCTA from '@/components/construct/FinalCTA';

// Phase B flagship — premium lead-gen page per master plan §Phase B.
// All copy is placeholder pending client copy (contract §8); see banner constants in each section component.
export const metadata = {
  title: 'Construct Your Court — Court Hub',
  description:
    'FIP-standard padel court construction across the UAE — full builds, resurfacing, lighting, roofing and maintenance, from site survey to first serve.',
};

export default function ConstructYourCourtPage() {
  return (
    <main className="min-h-screen bg-ink">
      <ShopNav />
      <SmoothScroll>
        <ConstructHero />
        <Services />
        <Process />
        <Gallery />
        <Authority />
        <InquiryForm />
        <FinalCTA />
        <Footer />
      </SmoothScroll>
    </main>
  );
}
