import { cookies } from 'next/headers';
import styles from '../../admin.module.css';
import EnquiriesTable from './EnquiriesTable';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getEnquiries(token: string) {
  try {
    const res = await fetch(`${API_URL}/api/leads/enquiry`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export default async function EnquiriesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value || '';
  const enquiries = await getEnquiries(token);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Customer Enquiries</h1>
      </div>

      <div className={styles.tableCard} style={{ padding: 0 }}>
        <EnquiriesTable initialData={enquiries} apiUrl={API_URL} token={token} />
      </div>
    </div>
  );
}
