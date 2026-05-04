import Link from 'next/link';
import styles from '../admin.module.css';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getDashboardStats() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/api/products`, { cache: 'no-store' }),
      fetch(`${API_URL}/api/categories`, { cache: 'no-store' }),
    ]);
    const products = productsRes.ok ? await productsRes.json() : [];
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];
    const featured = products.filter((p: { is_featured?: boolean }) => p.is_featured).length;
    return { total: products.length, featured, categories: categories.length };
  } catch {
    return { total: 0, featured: 0, categories: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className={styles.sectionHeader} style={{ marginBottom: 28 }}>
        <h1 className={styles.sectionTitle}>Dashboard</h1>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total Products</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.featured}</div>
          <div className={styles.statLabel}>Featured</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.categories}</div>
          <div className={styles.statLabel}>Categories</div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className={styles.sectionTitle} style={{ marginBottom: 16 }}>Quick Actions</h2>
      <div className={styles.quickGrid}>
        <Link href="/admin/products/new" className={styles.quickCard} id="dash-add-product">
          <div className={styles.quickCardIcon}>➕</div>
          <div className={styles.quickCardTitle}>Add New Product</div>
          <div className={styles.quickCardDesc}>Create a new Premium Handcrafted Marble Sculpture listing</div>
        </Link>
        <Link href="/admin/products" className={styles.quickCard} id="dash-manage-products">
          <div className={styles.quickCardIcon}>🪨</div>
          <div className={styles.quickCardTitle}>Manage Products</div>
          <div className={styles.quickCardDesc}>Edit, delete or reorder products</div>
        </Link>
        <Link href="/admin/categories" className={styles.quickCard} id="dash-manage-categories">
          <div className={styles.quickCardIcon}>🗂️</div>
          <div className={styles.quickCardTitle}>Manage Categories</div>
          <div className={styles.quickCardDesc}>Update category info and images</div>
        </Link>
        <Link href="/" target="_blank" className={styles.quickCard} id="dash-view-site">
          <div className={styles.quickCardIcon}>🌐</div>
          <div className={styles.quickCardTitle}>View Live Site</div>
          <div className={styles.quickCardDesc}>Open the public storefront</div>
        </Link>
      </div>
    </div>
  );
}
