'use client';

import { usePathname } from 'next/navigation';
import Navbar from './_components/Navbar';
import Footer from './_components/Footer';

import { SiteSettings } from '@/lib/types';
import { Certificate } from '@/lib/api';

export default function NavigationWrapper({
  categories,
  siteSettings,
  certificates,
  children,
}: {
  categories: { slug: string; name: string }[];
  siteSettings: SiteSettings | null;
  certificates?: Certificate[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div style={{ display: 'contents' }}>
      {!isAdmin && <Navbar categories={categories} />}
      <main className={!isAdmin ? 'main-offset' : ''}>{children}</main>
      {!isAdmin && <Footer categories={categories} siteSettings={siteSettings} certificates={certificates} />}
    </div>
  );
}
