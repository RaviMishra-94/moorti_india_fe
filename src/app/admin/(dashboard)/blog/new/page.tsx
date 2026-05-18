'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../admin.module.css';
import { useToast } from '../../../ToastProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function generateSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: 'Moorti India',
    excerpt: '',
    content: '',
    is_published: false,
    tags: '',
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: generateSlug(title) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let uploadedImageUrl = '';
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

      const res = await fetch(`${API_URL}/api/blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload),
      });

      if (res.ok) {
        showToast('Blog post created successfully!', 'success');
        router.push('/admin/blog');
        router.refresh();
      } else {
        const err = await res.json();
        showToast(err.detail || 'Failed to create post', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>New Blog Post</h1>
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
            placeholder="e.g. The Art of Makrana Marble"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Slug</label>
          <input
            type="text"
            className={styles.input}
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            placeholder="the-art-of-makrana-marble"
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
          <input
            type="file"
            className={styles.input}
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Excerpt (Short summary for listing)</label>
          <textarea
            className={styles.textarea}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            placeholder="A brief summary of the article..."
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Content (HTML Supported)</label>
          <textarea
            className={styles.textarea}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={15}
            required
            style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
            placeholder="<h2>Heading</h2><p>Paragraph content...</p>"
          />
          <span className={styles.helpText}>You can use standard HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;blockquote&gt; etc.</span>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tags (Comma separated)</label>
          <input
            type="text"
            className={styles.input}
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g. Craftsmanship, Marble, Jaipur"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            />
            Publish immediately
          </label>
        </div>

        <div style={{ marginTop: 'var(--space-8)' }}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            {saving ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
