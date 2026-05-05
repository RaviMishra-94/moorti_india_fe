'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../admin.module.css';
import { useToast } from '../../../ToastProvider';
import { saveClientStoryAction } from '../actions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ClientStoryForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
    country: initialData?.country || '',
    statue: initialData?.statue || '',
    rating: initialData?.rating || 5,
    text: initialData?.text || '',
    date: initialData?.date || '',
    is_published: initialData ? initialData.is_published : true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'rating') {
      finalValue = parseInt(value, 10);
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await saveClientStoryAction(formData, isEdit ? initialData.id : undefined);
      showToast(`Story ${isEdit ? 'updated' : 'created'} successfully`, 'success');
      router.push('/admin/client-stories');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formHeader} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={() => router.back()} className={styles.btnIcon} title="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div>
            <h1 className={styles.sectionTitle}>{isEdit ? 'Edit Client Story' : 'Create New Client Story'}</h1>
          </div>
        </div>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formGrid}>
          <div className={styles.formSectionTitle}>Client Details</div>
          
          <div>
            <label className={styles.formLabel}>Client Name *</label>
            <input 
              type="text" 
              name="name" 
              className={styles.formInput} 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className={styles.formLabel}>Date (e.g. March 2025) *</label>
            <input 
              type="text" 
              name="date" 
              className={styles.formInput} 
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <label className={styles.formLabel}>City / Location *</label>
            <input 
              type="text" 
              name="location" 
              className={styles.formInput} 
              value={formData.location} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className={styles.formLabel}>Country *</label>
            <input 
              type="text" 
              name="country" 
              className={styles.formInput} 
              value={formData.country} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.formSectionTitle} style={{ marginTop: 24 }}>Review Content</div>

          <div>
            <label className={styles.formLabel}>Statue Purchased *</label>
            <input 
              type="text" 
              name="statue" 
              className={styles.formInput} 
              value={formData.statue} 
              onChange={handleChange}
              placeholder="e.g. Radha Krishna Statue (24 inch)"
              required 
            />
          </div>
          <div>
            <label className={styles.formLabel}>Rating (1-5)</label>
            <select name="rating" className={styles.formSelect} value={formData.rating} onChange={handleChange}>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className={styles.formLabel}>Review Text *</label>
            <textarea 
              name="text" 
              className={styles.formTextarea} 
              rows={5} 
              value={formData.text} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.formSectionTitle} style={{ marginTop: 24 }}>Visibility</div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                name="is_published" 
                className={styles.checkbox}
                checked={formData.is_published} 
                onChange={handleChange} 
              />
              Publish on frontend
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={() => router.push('/admin/client-stories')} className={styles.btnSecondary}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Saving...' : 'Save Story'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
