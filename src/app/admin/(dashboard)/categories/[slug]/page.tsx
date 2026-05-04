import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../admin.module.css';
import CategoryForm from './CategoryForm';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getCategory(slug: string) {
  const res = await fetch(`${API_URL}/api/categories/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const category = await getCategory(slug);

  if (!category) {
    return (
      <div>
        <h1>Category not found</h1>
        <Link href="/admin/categories" className={styles.btnSecondary}>Back to Categories</Link>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/categories" className={styles.btnIcon} title="Back to Categories">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </Link>
          <h1 className={styles.sectionTitle}>Edit Category: {category.name}</h1>
        </div>
      </div>

      <CategoryForm
        initialData={category}
        isNew={false}
        existingSlug={category.slug}
        token={token}
        apiUrl={API_URL}
      />
    </div>
  );
}
