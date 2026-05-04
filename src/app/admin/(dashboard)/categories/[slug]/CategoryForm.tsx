'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../../../admin.module.css';
import { useToast } from '../../../ToastProvider';

interface CategoryFormData {
  slug: string;
  name: string;
  image: string;
  description: string;
  count: number | '';
}

interface Props {
  initialData?: Partial<CategoryFormData>;
  isNew: boolean;
  token: string;
  apiUrl: string;
  existingSlug?: string;
}

export default function CategoryForm({ initialData, isNew, token, apiUrl, existingSlug }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [enhancedMappings, setEnhancedMappings] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CategoryFormData>({
    slug: '', name: '', image: '', description: '', count: '',
    ...initialData,
  });

  // Auto-generate slug from name (only for new categories)
  useEffect(() => {
    if (isNew) {
      const slug = form.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setForm(prev => ({ ...prev, slug }));
    }
  }, [form.name, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'count' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  // ── Image upload ─────────────────────────────────────────────
  const uploadFile = async (file: File) => {
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${apiUrl}/api/uploads/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      const data = await res.json();

      let imageUrlToAdd = data.url;
      if (data.enhanced_url) {
        imageUrlToAdd = data.enhanced_url;
        setEnhancedMappings(prev => ({ 
          ...prev, 
          [data.enhanced_url]: data.url, 
          [data.url]: data.enhanced_url 
        }));
      }

      setForm(prev => ({ ...prev, image: imageUrlToAdd }));
      showToast('Image uploaded successfully.', 'success');
    } catch (err) {
      showToast(`Image upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) uploadFile(file);
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const url = isNew
          ? `${apiUrl}/api/categories`
          : `${apiUrl}/api/categories/${existingSlug}`;
        const method = isNew ? 'POST' : 'PATCH';

        const payload: Record<string, any> = {};
        for (const [k, v] of Object.entries(form)) {
          if (k === 'count' && v === '') payload[k] = 0;
          else if (v !== '' && v !== null) payload[k] = v;
          else if (isNew && v === '') payload[k] = null;
        }

        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const msg = await res.json();
          throw new Error(msg.detail || JSON.stringify(msg));
        }

        showToast(isNew ? 'Category created successfully!' : 'Category updated successfully!', 'success');
        setTimeout(() => router.push('/admin/categories'), 1200);
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'An unexpected error occurred.', 'error');
      }
    });
  };

  const imagePreviewSrc = form.image || null;

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formCard}>
        <div className={styles.formGrid}>
          {/* ── Core Info ──────────────────────────────────────── */}
          <div className={styles.formSectionTitle}>Category Information</div>

          <div>
            <label className={styles.formLabel} htmlFor="cat-name">Category Name *</label>
            <input id="cat-name" name="name" value={form.name} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. Marble Ganesh Statues" required />
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="cat-slug">URL Slug *</label>
            <input id="cat-slug" name="slug" value={form.slug} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. ganesh" required
              readOnly={!isNew} style={!isNew ? { opacity: 0.5, cursor: 'not-allowed' } : {}} />
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="cat-count">Display Count</label>
            <input id="cat-count" name="count" type="number" min="0" value={form.count} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. 24" required />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.formLabel} htmlFor="cat-description">Description *</label>
            <textarea id="cat-description" name="description" value={form.description}
              onChange={handleChange} className={styles.formTextarea}
              placeholder="Short description shown on the collections page" required
              style={{ minHeight: 80 }} />
          </div>

          {/* ── Image Upload ──────────────────────────────────── */}
          <div className={`${styles.formGridFull}`}>
            <div className={styles.formSectionTitle} style={{ margin: '0 0 12px' }}>Category Image</div>
            <div
              className={`${styles.uploadZone} ${isDragging ? styles.uploadZoneDragging : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadingImage ? (
                <div className={styles.uploadZoneText} style={{ color: '#d4a05a', fontWeight: 'bold' }}>Uploading & Enhancing Background (takes a few seconds)...</div>
              ) : imagePreviewSrc ? (
                <>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Image src={imagePreviewSrc} alt="Preview" width={200} height={200}
                      className={styles.uploadPreview} style={{ objectFit: 'contain' }} />
                    {enhancedMappings[imagePreviewSrc] && (
                      <button type="button" onClick={(e) => {
                        e.stopPropagation();
                        const pairedUrl = enhancedMappings[imagePreviewSrc];
                        setForm(prev => ({ ...prev, image: pairedUrl }));
                      }}
                        style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', color: '#fff', border: '1px solid #d4a05a', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                        ✨ Toggle BG
                      </button>
                    )}
                  </div>
                  <div className={styles.uploadZoneText} style={{ marginTop: 8 }}>Click or drag to replace</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>📸</div>
                  <div className={styles.uploadZoneText}>
                    Drag & drop an image here, or <span style={{ color: '#d4a05a' }}>click to browse</span>
                  </div>
                  <div className={styles.uploadZoneText} style={{ marginTop: 4, fontSize: '0.72rem' }}>
                    JPEG, PNG, WebP, HEIC — max 10 MB
                  </div>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif" style={{ display: 'none' }}
              onChange={handleFilePick} id="cat-image-file" />

            <div style={{ marginTop: 10 }}>
              <label className={styles.formLabel} htmlFor="cat-image-url">Or paste an image URL</label>
              <input id="cat-image-url" name="image" value={form.image} onChange={handleChange}
                className={styles.formInput} placeholder="/uploads/hero_ganesh.png" required />
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────────── */}
          <div className={styles.formActions}>
            <button type="button" className={styles.btnSecondary}
              onClick={() => router.push('/admin/categories')}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary} id="cat-save-btn" disabled={isPending}>
              {isPending ? 'Saving…' : isNew ? '✓ Create Category' : '✓ Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
