import type { Metadata } from 'next';
import { fetchSiteSettings } from '@/lib/api';
import HeroSection from './_components/HeroSection';
import MarqueeBar from './_components/MarqueeBar';
import CategoryGrid from './_components/CategoryGrid';
import FeaturedProducts from './_components/FeaturedProducts';
import ProcessSection from './_components/ProcessSection';
import StatsBar from './_components/StatsBar';
import TributeSection from './_components/TributeSection';
import BespokePortraitSection from './_components/BespokePortraitSection';
import TestimonialsSection from './_components/TestimonialsSection';
import ContactCTA from './_components/ContactCTA';

export const metadata: Metadata = {
  title: 'Moorti India — Handcrafted Marble Statues from Jaipur | Est. 1985',
  description:
    'Shop handcrafted marble statues of Ganesh, Radha Krishna, Durga, Hanuman, Buddha and more. Premium Handcrafted Marble Sculptures for Home/temples manufactured in Jaipur since 1985. Custom orders. Worldwide shipping.',
};

export default async function HomePage() {
  const settings = await fetchSiteSettings();
  return (
    <>
      <HeroSection
        imageUrl={settings?.heroImageUrl}
        imageMobileUrl={settings?.heroImageMobileUrl}
        titleLine1={settings?.heroTitleLine1}
        titleLine2={settings?.heroTitleLine2}
        tagline={settings?.heroTagline}
        description={settings?.heroDescription}
      />
      <MarqueeBar />
      <CategoryGrid />
      <FeaturedProducts />
      <BespokePortraitSection />
      {/* <TributeSection /> */}
      <ProcessSection />
      <StatsBar />
      <TestimonialsSection />
      <ContactCTA />
    </>
  );
}
