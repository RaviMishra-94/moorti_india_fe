'use client';

import { usePathname } from 'next/navigation';

export default function NavigationWrapper({
  navbar,
  footer,
  children,
}: {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div style={{ display: 'contents' }}>
      {!isAdmin && navbar}
      <main>{children}</main>
      {!isAdmin && footer}
    </div>
  );
}
