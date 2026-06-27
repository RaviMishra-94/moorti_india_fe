'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAdminToken } from '../../../../actions';
import styles from '../../../../admin.module.css';
import { useToast } from '../../../../ToastProvider';
import BlogFormSkeleton from './loading';
import { apiUpload } from '@/lib/api';

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
  const [uploadingInline, setUploadingInline] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
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
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = await getAdminToken();
      let uploadedImageUrl = existingImage;
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
      };

      const res = await fetch(`${API_URL}/api/blog/${params.slug}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
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

  if (loading) return <BlogFormSkeleton />;

  return (
    <div style={{ maxWidth: 900 }}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>Edit Blog Post</h1>
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
            />
          </div>

          <div>
            <label className={styles.formLabel}>Slug (URL)</label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
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
            {existingImage && !coverImage && (
              <div style={{ marginBottom: 12, position: 'relative', width: 200, height: 120, borderRadius: 6, overflow: 'hidden' }}>
                <Image src={existingImage.startsWith('http') ? existingImage : `${API_URL}${existingImage}`} alt="Current cover" fill style={{ objectFit: 'cover' }} />
              </div>
            )}
            <input
              type="file"
              className={styles.formInput}
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
            <span style={{ color: '#666', fontSize: '0.78rem', marginTop: '6px', display: 'block' }}>Upload a new image to replace the current one.</span>
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.formLabel}>Excerpt</label>
            <textarea
              className={styles.formTextarea}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
            />
          </div>

          <div className={styles.formGridFull}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
              <label className={styles.formLabel} style={{ marginBottom: 0 }}>Content (HTML)</label>
              
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
            />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.formLabel}>Tags (Comma separated)</label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.formLabel} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textTransform: 'none', letterSpacing: 'normal' }}>
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              />
              Published
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          
        </div>
      </form>
    </div>
  );
}
