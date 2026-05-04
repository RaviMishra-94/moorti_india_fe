'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import styles from '../../admin.module.css';
import { IconPlus, IconEdit, IconTrash } from '../../icons';
import { useToast } from '../../ToastProvider';
import ConfirmModal from '../../ConfirmModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function IconDrag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ cursor: 'grab', color: '#666' }}>
      <path d="M8 6h8M8 12h8M8 18h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ClientStoriesAdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/client-stories`);
      if (res.ok) {
        const data = await res.json();
        setStories(data);
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
      const res = await fetch(`${API_URL}/api/client-stories/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast(`"${deleteTarget.name}" deleted successfully.`, 'success');
        setStories(stories.filter((s) => s.id !== deleteTarget.id));
      } else {
        showToast('Failed to delete story.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting story.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;

    const items = Array.from(stories);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    setStories(items);

    const payload = items.map((item, index) => ({
      id: item.id,
      display_order: index,
    }));

    try {
      await fetch(`${API_URL}/api/client-stories/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      showToast('Story order saved!', 'success');
    } catch (err) {
      console.error('Failed to save order', err);
      showToast('Failed to save order.', 'error');
    }
  };

  if (loading) return <div className={styles.page}>Loading...</div>;

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div>
          <h1 className={styles.sectionTitle}>Client Stories</h1>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '4px' }}>Manage testimonials and reviews shown on the frontend.</p>
        </div>
        <Link href="/admin/client-stories/new" className={styles.btnPrimary} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconPlus /> Add Story
        </Link>
      </div>

      <div className={styles.formCard} style={{ padding: 0, overflow: 'hidden' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Client</th>
                <th>Statue</th>
                <th>Rating</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <Droppable droppableId="stories-list">
              {(provided) => (
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {stories.map((story, index) => (
                    <Draggable key={story.id} draggableId={story.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            backgroundColor: snapshot.isDragging ? '#1a1a1a' : 'transparent',
                            display: snapshot.isDragging ? 'table' : '',
                          }}
                        >
                          <td {...provided.dragHandleProps} style={{ textAlign: 'center' }}>
                            <IconDrag />
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{story.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{story.location}, {story.country}</div>
                          </td>
                          <td>{story.statue}</td>
                          <td>{story.rating} Stars</td>
                          <td>{story.is_published ? 'Yes' : 'No'}</td>
                          <td>
                            <div className={styles.tableActions}>
                              <Link
                                href={`/admin/client-stories/${story.id}`}
                                className={styles.btnIcon}
                                title="Edit story"
                              >
                                <IconEdit />
                              </Link>
                              <button
                                type="button"
                                className={styles.actionBtnDanger}
                                title={`Delete "${story.name}"`}
                                onClick={() => setDeleteTarget({ id: story.id, name: story.name })}
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {stories.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        No client stories found. Click &ldquo;Add Story&rdquo; to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Story"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </div>
  );
}
