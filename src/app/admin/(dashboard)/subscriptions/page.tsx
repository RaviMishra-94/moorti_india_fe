import { cookies } from 'next/headers';
import styles from '../../admin.module.css';
import SubscriptionsTable from './SubscriptionsTable';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getSubscriptions(token: string) {
  try {
    const res = await fetch(`${API_URL}/api/leads/subscribe`, {
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

export default async function SubscriptionsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value || '';
  const subscriptions = await getSubscriptions(token);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Newsletter Subscribers</h1>
      </div>

      <div className={styles.tableCard} style={{ maxWidth: 800, padding: 0 }}>
        <SubscriptionsTable initialData={subscriptions} apiUrl={API_URL} token={token} />
      </div>
    </div>
  );
}
