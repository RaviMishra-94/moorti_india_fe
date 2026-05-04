import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import styles from '../../admin.module.css';
import SortableProductTable from './SortableProductTable';
import { IconEdit, IconPlus } from '../../icons';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiProduct {
  id: number;
  slug: string;
  name: string;
  category: string;
  image: string;
  material: string;
  is_featured?: boolean;
  is_trending?: boolean;
  tag?: string;
}

async function getProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>Products ({products.length})</h1>
        <Link href="/admin/products/new" className={styles.btnPrimary} id="products-add-btn" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconPlus /> Add Product
        </Link>
      </div>

      <div className={styles.formCard} style={{ padding: 0, overflow: 'hidden' }}>
        <SortableProductTable
          initialProducts={products}
          apiUrl={API_URL}
          token={token}
        />
      </div>
    </div>
  );
}
