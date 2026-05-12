import ClientStoryForm from './ClientStoryForm';
import styles from '../../../admin.module.css';
import { cookies } from 'next/headers';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default async function EditClientStoryPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value || '';
  
  if (id === 'new') {
    return (
      <div className={styles.page}>
        <ClientStoryForm token={token} />
      </div>
    );
  }

  try {
    const res = await fetch(`${API_URL}/api/client-stories/${id}`, { cache: 'no-store' });
    if (!res.ok) {
      return (
        <div className={styles.page}>
          <h1>Story not found</h1>
        </div>
      );
    }
    const story = await res.json();
    
    return (
      <div className={styles.page}>
        <ClientStoryForm initialData={story} token={token} />
      </div>
    );
  } catch (err) {
    return (
      <div className={styles.page}>
        <h1>Error loading story</h1>
      </div>
    );
  }
}
