import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductForm from './ProductForm';
import styles from '../../../admin.module.css';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductEditorPage({ params }: Props) {
  const { slug } = await params;
  const isNew = slug === 'new';

  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let initialData: Record<string, any> | undefined;

  if (!isNew) {
    try {
      const res = await fetch(`${API_URL}/api/products/${slug}`, { cache: 'no-store' });
      if (!res.ok) notFound();
      initialData = await res.json();
    } catch {
      notFound();
    }
  }

  let categories = [];
  try {
    const catRes = await fetch(`${API_URL}/api/categories`, { cache: 'no-store' });
    if (catRes.ok) {
      categories = await catRes.json();
    }
  } catch (err) {
    console.error("Failed to fetch categories", err);
  }

  let clientStories = [];
  try {
    const storyRes = await fetch(`${API_URL}/api/client-stories`, { cache: 'no-store' });
    if (storyRes.ok) {
      clientStories = await storyRes.json();
    }
  } catch (err) {
    console.error("Failed to fetch client stories", err);
  }

  const pageTitle = isNew ? 'Add New Product' : `Edit: ${initialData?.name ?? slug}`;

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/products" className={styles.btnIcon} title="Back to Products">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </Link>
          <h1 className={styles.sectionTitle}>{pageTitle}</h1>
        </div>
      </div>

      <ProductForm
        initialData={initialData}
        isNew={isNew}
        token={token}
        apiUrl={API_URL}
        existingSlug={isNew ? undefined : slug}
        categories={categories}
        clientStories={clientStories}
      />
    </div>
  );
}
