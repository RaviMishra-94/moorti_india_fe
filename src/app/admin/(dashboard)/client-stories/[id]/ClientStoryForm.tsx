'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../admin.module.css';
import { useToast } from '../../../ToastProvider';
import { saveClientStoryAction } from '../actions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ClientStoryForm({ initialData = null, token = '' }: { initialData?: any, token?: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    image: initialData?.image || '',
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

  const uploadFile = async (file: File) => {
    if (!token) {
      showToast('No admin token found', 'error');
      return;
    }
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/api/uploads/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      const data = await res.json();
      // data.url contains the uploaded image path
      setFormData(prev => ({ ...prev, image: data.url }));
      showToast('Image uploaded successfully', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
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
          
          <div style={{ gridColumn: '1 / -1', marginBottom: 20 }}>
            <label className={styles.formLabel}>Idol Image</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              {formData.image && (
                <div style={{ position: 'relative', width: 120, height: 120, borderRadius: 8, overflow: 'hidden', border: '1px solid #333' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${API_URL}${formData.image}`} alt="Idol" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    style={{
                      position: 'absolute', top: 4, right: 4,
                      background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '50%', width: 22, height: 22,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#ff6b6b', fontSize: '11px',
                    }}
                    title="Remove image"
                  >🗑</button>
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) uploadFile(file);
                    e.target.value = '';
                  }}
                  disabled={uploadingImage}
                  style={{ display: 'block', marginBottom: 8, color: '#ccc', fontSize: '0.9rem' }}
                />
                {uploadingImage && <div style={{ fontSize: '0.85rem', color: '#888' }}>Uploading...</div>}
              </div>
            </div>
          </div>

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
