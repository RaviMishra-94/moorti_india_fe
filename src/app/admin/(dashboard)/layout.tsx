import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from '../admin.module.css';
import {
  IconDashboard, IconBox, IconLayers,
  IconGlobe, IconExternalLink, IconLogout,
  IconMessageSquare
} from '../icons';
import { ToastProvider } from '../ToastProvider';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function verifyToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/admin/verify?token=${token}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token || !(await verifyToken(token))) {
    redirect('/admin/login');
  }

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.sidebarLogoTitle}>Moorti India</div>
          <div className={styles.sidebarLogoSub}>Admin Panel</div>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>Content</div>
          <Link href="/admin" className={styles.navLink} id="admin-nav-dashboard">
            <IconDashboard /> Dashboard
          </Link>
          <Link href="/admin/products" className={styles.navLink} id="admin-nav-products">
            <IconBox /> Products
          </Link>
          <Link href="/admin/categories" className={styles.navLink} id="admin-nav-categories">
            <IconLayers /> Categories (Collections)
          </Link>
          <Link href="/admin/client-stories" className={styles.navLink} id="admin-nav-client-stories">
            <IconMessageSquare /> Client Stories
          </Link>
          <Link href="/admin/blog" className={styles.navLink} id="admin-nav-blog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Blog
          </Link>

          <div className={styles.navSection} style={{ marginTop: 16 }}>Leads</div>
          <Link href="/admin/enquiries" className={styles.navLink} id="admin-nav-enquiries">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Enquiries
          </Link>
          <Link href="/admin/subscriptions" className={styles.navLink} id="admin-nav-subscriptions">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Subscriptions
          </Link>

          <div className={styles.navSection} style={{ marginTop: 16 }}>Site</div>
          <Link href="/" className={styles.navLink} id="admin-nav-view-site" target="_blank">
            <IconGlobe /> View Site <IconExternalLink />
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className={styles.logoutBtn} id="admin-logout-btn">
              <IconLogout /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className={styles.main}>
        <div className={styles.topbar}>
          <span className={styles.topbarTitle}>Moorti India CMS</span>
          <span className={styles.topbarBadge}>Admin</span>
        </div>
        <ToastProvider>
          <div className={styles.content}>{children}</div>
        </ToastProvider>
      </div>
    </div>
  );
}

