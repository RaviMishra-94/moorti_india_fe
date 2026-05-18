import type { Metadata } from 'next';
import HeroSection from './_components/HeroSection';
import MarqueeBar from './_components/MarqueeBar';
import CategoryGrid from './_components/CategoryGrid';
import FeaturedProducts from './_components/FeaturedProducts';
import ProcessSection from './_components/ProcessSection';
import StatsBar from './_components/StatsBar';
import TributeSection from './_components/TributeSection';
import TestimonialsSection from './_components/TestimonialsSection';
import ContactCTA from './_components/ContactCTA';

export const metadata: Metadata = {
  title: 'Moorti India — Handcrafted Marble Statues from Jaipur | Est. 1985',
  description:
    'Shop handcrafted marble statues of Ganesh, Radha Krishna, Durga, Hanuman, Buddha and more. Premium Handcrafted Marble Sculptures for Home/temples manufactured in Jaipur since 1985. Custom orders. Worldwide shipping.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <CategoryGrid />
      <FeaturedProducts />
      <TributeSection />
      <ProcessSection />
      <StatsBar />
      <TestimonialsSection />
      <ContactCTA />
    </>
  );
}
