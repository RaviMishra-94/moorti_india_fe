'use client';

import { usePathname } from 'next/navigation';
import Navbar from './_components/Navbar';
import Footer from './_components/Footer';

export default function NavigationWrapper({
  categories,
  children,
}: {
  categories: { slug: string; name: string }[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div style={{ display: 'contents' }}>
      {!isAdmin && <Navbar categories={categories} />}
      <main>{children}</main>
      {!isAdmin && <Footer categories={categories} />}
    </div>
  );
}
