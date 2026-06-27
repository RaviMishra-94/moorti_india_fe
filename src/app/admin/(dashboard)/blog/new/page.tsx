'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAdminToken } from '../../../actions';
import styles from '../../../admin.module.css';
import { useToast } from '../../../ToastProvider';
import { apiUpload } from '@/lib/api';

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
  const [uploadingInline, setUploadingInline] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
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

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingInline(true);
    try {
      const token = await getAdminToken();
      const imgData = new FormData();
      imgData.append('file', file);
      const json = await apiUpload(`${API_URL}/api/uploads/image`, imgData, token);
      const imageUrl = json.url;

      const imgTag = `\n<img src="${imageUrl}" alt="Blog Image" style="max-width: 100%; height: auto; border-radius: 8px;" />\n`;

      const textarea = contentRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = formData.content.substring(0, start) + imgTag + formData.content.substring(end);
        setFormData(prev => ({ ...prev, content: newContent }));
        
        // Reset cursor position after React re-renders
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + imgTag.length, start + imgTag.length);
        }, 10);
      } else {
        setFormData(prev => ({ ...prev, content: prev.content + imgTag }));
      }
      showToast('Image inserted into content', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to insert image', 'error');
    } finally {
      setUploadingInline(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = await getAdminToken();
      let uploadedImageUrl = '';
      if (coverImage) {
        const imgData = new FormData();
        imgData.append('file', coverImage);
        const uploadRes = await fetch(`${API_URL}/api/uploads/image`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
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
        created_at: new Date().toISOString(),
      };

      const res = await fetch(`${API_URL}/api/blog`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
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
        <Link href="/admin/blog" className={styles.btnSecondary}>Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.formGrid}>
          
          <div className={styles.formGridFull}>
            <label className={styles.formLabel}>Title</label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.title}
              onChange={handleTitleChange}
              required
              placeholder="e.g. The Art of Makrana Marble"
            />
          </div>

          <div>
            <label className={styles.formLabel}>Slug</label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="the-art-of-makrana-marble"
            />
          </div>

          <div>
            <label className={styles.formLabel}>Author</label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.formLabel}>Cover Image</label>
            <input
              type="file"
              className={styles.formInput}
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.formLabel}>Excerpt (Short summary for listing)</label>
            <textarea
              className={styles.formTextarea}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              placeholder="A brief summary of the article..."
            />
          </div>

          <div className={styles.formGridFull}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
              <label className={styles.formLabel} style={{ marginBottom: 0 }}>Content (HTML Supported)</label>
              
              <label className={styles.btnSecondary} style={{ fontSize: '0.75rem', padding: '5px 12px', cursor: 'pointer', opacity: uploadingInline ? 0.6 : 1, margin: 0 }}>
                {uploadingInline ? '⏳ Uploading...' : '🖼️ Insert Image'}
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleInlineImageUpload}
                  disabled={uploadingInline}
                />
              </label>
            </div>
            <textarea
              ref={contentRef}
              className={styles.formTextarea}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              required
              style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              placeholder="<h2>Heading</h2><p>Paragraph content...</p>"
            />
            <span style={{ color: '#666', fontSize: '0.78rem', marginTop: '6px', display: 'block' }}>You can use standard HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;blockquote&gt; etc. Use the Insert Image button to add photos.</span>
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.formLabel}>Tags (Comma separated)</label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. Craftsmanship, Marble, Jaipur"
            />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.formLabel} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textTransform: 'none', letterSpacing: 'normal' }}>
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              />
              Publish immediately
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              {saving ? 'Creating...' : 'Create Post'}
            </button>
          </div>
          
        </div>
      </form>
    </div>
  );
}
