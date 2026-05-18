'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../admin.module.css';
import { IconPlus, IconEdit, IconTrash } from '../../icons';
import { useToast } from '../../ToastProvider';
import ConfirmModal from '../../ConfirmModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function BlogAdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; title: string } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/blog`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API_URL}/api/blog/${deleteTarget.slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast(`"${deleteTarget.title}" deleted successfully.`, 'success');
        setPosts(posts.filter((p) => p.slug !== deleteTarget.slug));
      } else {
        showToast('Failed to delete blog post.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting blog post.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <div className={styles.page}>Loading...</div>;

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.sectionTitle}>Blog & Journal</h1>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '4px' }}>Manage your insights, articles, and stories.</p>
        </div>
        <Link href="/admin/blog/new" className={styles.btnPrimary} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconPlus /> New Post
        </Link>
      </div>

      <div className={styles.formCard} style={{ padding: 0, overflow: 'hidden' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Post</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{post.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: 2 }}>/{post.slug}</div>
                </td>
                <td>
                  <span className={post.is_published ? styles.badgeSuccess : styles.badgeWarning}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ color: '#888', fontSize: '0.9rem' }}>
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                </td>
                <td>
                  <div className={styles.tableActions}>
                    <Link
                      href={`/admin/blog/${post.slug}/edit`}
                      className={styles.btnIcon}
                      title="Edit post"
                    >
                      <IconEdit />
                    </Link>
                    <button
                      type="button"
                      className={styles.actionBtnDanger}
                      title={`Delete "${post.title}"`}
                      onClick={() => setDeleteTarget({ slug: post.slug, title: post.title })}
                    >
                      <IconTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  No blog posts found. Click &ldquo;New Post&rdquo; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </div>
  );
}
