'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../../../admin.module.css';
import { useToast } from '../../../../ToastProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function generateSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function EditBlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: '',
    excerpt: '',
    content: '',
    is_published: false,
    tags: '',
  });

  const [existingImage, setExistingImage] = useState<string>('');
  const [coverImage, setCoverImage] = useState<File | null>(null);

  useEffect(() => {
    fetchPost();
  }, [params.slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`${API_URL}/api/blog/${params.slug}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      const data = await res.json();
      
      setFormData({
        title: data.title,
        slug: data.slug,
        author: data.author,
        excerpt: data.excerpt || '',
        content: data.content,
        is_published: data.is_published,
        tags: data.tags ? data.tags.join(', ') : '',
      });
      setExistingImage(data.cover_image || '');
    } catch (err) {
      console.error(err);
      showToast('Error loading blog post', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Only auto-generate slug if it hasn't been manually edited or saved before
    // Here we let them edit slug independently after creation, so we don't auto-update it on Edit
    setFormData({ ...formData, title });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let uploadedImageUrl = existingImage;
      if (coverImage) {
        const imgData = new FormData();
        imgData.append('file', coverImage);
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: imgData,
        });
        if (!uploadRes.ok) throw new Error('Image upload failed');
        const uploadJson = await uploadRes.json();
        uploadedImageUrl = uploadJson.url;
      }

      const postPayload = {
        ...formData,
        cover_image: uploadedImageUrl,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        published_at: formData.is_published ? new Date().toISOString() : null,
      };

      const res = await fetch(`${API_URL}/api/blog/${params.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload),
      });

      if (res.ok) {
        showToast('Blog post updated successfully!', 'success');
        router.push('/admin/blog');
        router.refresh();
      } else {
        const err = await res.json();
        showToast(err.detail || 'Failed to update post', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.page}>Loading post...</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>Edit Blog Post</h1>
        <Link href="/admin/blog" className={styles.btnOutline}>Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.input}
            value={formData.title}
            onChange={handleTitleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Slug (URL)</label>
          <input
            type="text"
            className={styles.input}
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Author</label>
          <input
            type="text"
            className={styles.input}
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Cover Image</label>
          {existingImage && !coverImage && (
            <div style={{ marginBottom: 12, position: 'relative', width: 200, height: 120, borderRadius: 6, overflow: 'hidden' }}>
              <Image src={existingImage.startsWith('http') ? existingImage : `${API_URL}${existingImage}`} alt="Current cover" fill style={{ objectFit: 'cover' }} />
            </div>
          )}
          <input
            type="file"
            className={styles.input}
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
          />
          <span className={styles.helpText}>Upload a new image to replace the current one.</span>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Excerpt</label>
          <textarea
            className={styles.textarea}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Content (HTML)</label>
          <textarea
            className={styles.textarea}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={15}
            required
            style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tags (Comma separated)</label>
          <input
            type="text"
            className={styles.input}
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            />
            Published
          </label>
        </div>

        <div style={{ marginTop: 'var(--space-8)' }}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
