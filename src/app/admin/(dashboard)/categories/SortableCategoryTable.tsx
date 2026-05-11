'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import styles from '../../admin.module.css';
import { IconEdit } from '../../icons';
import { useToast } from '../../ToastProvider';
import DeleteButtonClient from '../products/DeleteButtonClient';
import UpdateCountClient from './UpdateCountClient';
import { deleteCategoryAction } from './actions';

function IconDrag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ cursor: 'grab', color: '#666' }}>
      <path d="M8 6h8M8 12h8M8 18h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface ApiCategory {
  id: number;
  slug: string;
  name: string;
  image: string;
  description: string;
  count: number;
  display_order?: number;
}

interface Props {
  initialCategories: ApiCategory[];
  apiUrl: string;
  token: string;
}

export default function SortableCategoryTable({ initialCategories, apiUrl, token }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const { showToast } = useToast();

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    // Optimistically update UI
    setCategories(items);

    // Prepare payload
    const payload = items.map((item, index) => ({
      id: item.id,
      display_order: index,
    }));

    try {
      const res = await fetch(`${apiUrl}/api/categories/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save reorder');
      }

      showToast('Category arrangement saved!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to save arrangement', 'error');
      // Revert on error
      setCategories(initialCategories);
    }
  };

  if (categories.length === 0) {
    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Image</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', color: '#444', padding: '40px' }}>
              No categories found.
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 40 }}></th>
            <th>Image</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <Droppable droppableId="categories-list">
          {(provided) => (
            <tbody {...provided.droppableProps} ref={provided.innerRef}>
              {categories.map((cat, index) => (
                <Draggable key={cat.id} draggableId={cat.id.toString()} index={index}>
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
                      <td {...provided.dragHandleProps} style={{ textAlign: 'center' }} title="Drag to reorder categories">
                        <IconDrag />
                      </td>
                      <td>
                        <Image
                          src={cat.image || '/images/placeholder.png'}
                          alt={cat.name}
                          width={44}
                          height={44}
                          className={styles.productThumb}
                        />
                      </td>
                      <td style={{ color: '#ddd', fontWeight: 500 }}>{cat.name}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#888' }}>
                        {cat.slug}
                      </td>
                      <td style={{ color: '#666', fontSize: '0.82rem', maxWidth: 300 }}>
                        {cat.description}
                      </td>
                      <td style={{ color: '#d4a05a', fontWeight: 600 }}>{cat.count}</td>
                      <td>
                        <div className={styles.tableActions}>
                          <UpdateCountClient cat={cat} token={token} apiUrl={apiUrl} />
                          <div style={{ width: 1, height: 24, background: '#333', margin: '0 4px' }} />
                          <Link
                            href={`/admin/categories/${cat.slug}`}
                            className={styles.btnIcon}
                            id={`edit-category-${cat.slug}`}
                            title="Edit category"
                          >
                            <IconEdit />
                          </Link>
                          <DeleteButtonClient
                            name={cat.name}
                            action={deleteCategoryAction.bind(null, cat.slug)}
                            onSuccess={() => {
                              setCategories(prev => prev.filter(item => item.slug !== cat.slug));
                            }}
                            id={`delete-category-${cat.slug}`}
                            entityType="Category"
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </table>
    </DragDropContext>
  );
}
