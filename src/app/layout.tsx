import type { Metadata } from 'next';
import './globals.css';
import Navbar from './_components/Navbar';
import Footer from './_components/Footer';
import NavigationWrapper from './NavigationWrapper';

export const metadata: Metadata = {
  metadataBase: new URL('https://moortiindia.com.au'),
  title: 'Moorti India — Handcrafted Marble Statues from Jaipur | Est. 1985',
  description:
    'Shop handcrafted marble statues of Ganesh, Radha Krishna, Durga, Hanuman, Buddha and more. Premium Handcrafted Marble Sculptures for Home/temples manufactured in Jaipur since 1985. Custom orders. Worldwide shipping.',
  keywords: [
    'marble statues India',
    'marble moorti manufacturer Jaipur',
    'Premium Handcrafted Marble Sculptures for Home/temples',
    'Ganesh marble statue',
    'Radha Krishna marble statue',
    'marble temple mandir',
    'marble God statues buy online',
    'Makrana marble statues',
  ],
  openGraph: {
    title: 'Moorti India — Handcrafted Marble Statues',
    description: 'Premium marble statues handcrafted in Jaipur since 1985. Worldwide shipping.',
    url: 'https://moortiindia.com.au',
    siteName: 'Moorti India',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Moorti India — Handcrafted Marble Statues',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moorti India — Handcrafted Marble Statues',
    description: 'Premium marble statues handcrafted in Jaipur since 1985. Worldwide shipping.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://moortiindia.com.au',
  },
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
        <NavigationWrapper navbar={<Navbar categories={categories} />} footer={<Footer categories={categories} />}>
          {children}
        </NavigationWrapper>
      </body>
    </html>
  );
}
