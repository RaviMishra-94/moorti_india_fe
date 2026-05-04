'use client';

import { useState } from 'react';
import { useToast } from '../../ToastProvider';
import { IconSave } from '../../icons';
import styles from '../../admin.module.css';

interface Cat {
  slug: string;
  count: number;
}

interface Props {
  cat: Cat;
  token: string;
  apiUrl: string;
}

export default function UpdateCountClient({ cat, token, apiUrl }: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<number | ''>(cat.count);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/categories/${cat.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ count: value === '' ? 0 : value }),
      });
      if (!res.ok) throw new Error('Failed to update');
      showToast('Count updated successfully.', 'success');
    } catch {
      showToast('Failed to update count. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        name="count"
        type="number"
        value={value}
        onChange={e => setValue(e.target.value === '' ? '' : Number(e.target.value))}
        min={0}
        className={styles.formInput}
        style={{ width: 72, padding: '6px 10px', fontSize: '0.82rem' }}
        id={`cat-count-${cat.slug}`}
      />
      <button
        type="submit"
        className={styles.btnIcon}
        title="Save count"
        style={{ padding: '6px 10px' }}
        disabled={loading}
      >
        {loading ? <span className={styles.spinner} style={{ width: 12, height: 12, borderWidth: 1.5 }} /> : <IconSave />}
      </button>
    </form>
  );
}
