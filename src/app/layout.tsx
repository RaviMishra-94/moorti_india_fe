import type { Metadata } from 'next';
import './globals.css';
import NavigationWrapper from './NavigationWrapper';
import WhatsAppWidget from './_components/WhatsAppWidget';
import Script from 'next/script';

const BASE_URL = 'https://moortiindia.com.au';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Moorti India — Handcrafted Marble Statues from Jaipur | Est. 1985',
    template: '%s | Moorti India',
  },
  description:
    'Shop handcrafted marble statues of Ganesh, Radha Krishna, Durga, Hanuman, Buddha and more. Premium Makrana marble sculptures for homes & temples. Manufactured in Jaipur since 1985. Custom orders. Worldwide shipping to 50+ countries.',
  keywords: [
    'marble statues India',
    'marble moorti manufacturer Jaipur',
    'handcrafted marble sculptures',
    'Ganesh marble statue',
    'Radha Krishna marble idol',
    'Durga marble statue',
    'Hanuman marble murti',
    'Buddha marble statue',
    'marble temple mandir',
    'marble God statues buy online',
    'Makrana marble statues',
    'custom marble idol Jaipur',
    'marble moorti online India',
    'buy marble statue worldwide shipping',
    'religious marble sculptures',
  ],
  authors: [{ name: 'Moorti India', url: BASE_URL }],
  creator: 'Moorti India',
  publisher: 'Moorti India',
  category: 'Religious Art & Sculptures',
  openGraph: {
    title: 'Moorti India — Handcrafted Marble Statues from Jaipur',
    description: 'Premium marble statues & murtis handcrafted in Jaipur since 1985. Ganesh, Radha Krishna, Durga, Hanuman & more. Worldwide shipping.',
    url: BASE_URL,
    siteName: 'Moorti India',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Moorti India — Handcrafted Marble Statues from Jaipur',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moorti India — Handcrafted Marble Statues from Jaipur',
    description: 'Premium marble statues & murtis handcrafted in Jaipur since 1985. Worldwide shipping.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // Add your Google Search Console verification code here once you set it up
    // google: 'YOUR_VERIFICATION_CODE',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Moorti India',
  alternateName: 'Marble Home Jaipur',
  url: BASE_URL,
  logo: `${BASE_URL}/icon.png`,
  foundingDate: '1985',
  description: 'Premium handcrafted marble statues and murtis manufacturer in Jaipur, India since 1985.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Chandpole Bazar',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '302001',
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-7073333202',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
  ],
  sameAs: [
    'https://www.instagram.com/moortiindia',
    'https://www.facebook.com/moortiindia',
  ],
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Moorti India — Marble Home Jaipur',
  image: `${BASE_URL}/images/og-image.jpg`,
  '@id': `${BASE_URL}#business`,
  url: BASE_URL,
  telephone: '+91-7073333202',
  email: 'marblehouse.270@rediffmail.com',
  priceRange: '₹₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Chandpole Bazar',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '302001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 26.9235468,
    longitude: 75.8143843,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '19:00',
  },
  hasMap: 'https://maps.app.goo.gl/QRZ3r1Hjg6r45M4x6',
};

import { getCategories } from '@/lib/api';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();
  
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="schema-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <NavigationWrapper categories={categories}>
          {children}
        </NavigationWrapper>
        <WhatsAppWidget />
      </body>
    </html>
  );
}
