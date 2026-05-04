import { cookies } from 'next/headers';
import Link from 'next/link';
import styles from '../../admin.module.css';
import SortableCategoryTable from './SortableCategoryTable';
import { IconPlus } from '../../icons';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiCategory {
  id: number;
  slug: string;
  name: string;
  image: string;
  description: string;
  count: number;
}

async function getCategories(): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>Categories ({categories.length})</h1>
        <Link href="/admin/categories/new" className={styles.btnPrimary} id="categories-add-btn" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconPlus /> Add Category
        </Link>
      </div>

      <div className={styles.formCard} style={{ padding: 0, overflow: 'hidden' }}>
        <SortableCategoryTable
          initialCategories={categories}
          apiUrl={API_URL}
          token={token}
        />
      </div>

      <p style={{ marginTop: 20, fontSize: '0.78rem', color: '#444' }}>
        💡 The &quot;Count&quot; field here reflects the number of products shown on the public collection page.
      </p>
    </div>
  );
}


