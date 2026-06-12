import SiteHeader from '@/components/shared/SiteHeader';
import Footer from '@/components/home/Footer';
import ContactClient from '@/components/contact/ContactClient';
import FaqSection from '@/components/contact/FaqSection';
import SmoothScroll from '@/components/shared/SmoothScroll';

// ─── PLACEHOLDER COPY — replace with client-provided copy (contract §8) ───
const COPY = {
  metaTitle: 'Contact — Court Hub',
  metaDescription:
    'Reach Court Hub on WhatsApp for rackets, court construction and orders — plus phone, email, showroom details in Al Quoz, Dubai, and answers to common questions.', // placeholder location — confirm with client
};
// ─── End placeholder copy ───

export const metadata = {
  title: COPY.metaTitle,
  description: COPY.metaDescription,
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <SmoothScroll>
        <ContactClient />
        <FaqSection />
        <Footer />
      </SmoothScroll>
    </main>
  );
}
