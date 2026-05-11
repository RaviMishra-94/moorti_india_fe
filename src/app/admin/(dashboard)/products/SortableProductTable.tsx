'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import styles from '../../admin.module.css';
import { IconEdit } from '../../icons';
import { useToast } from '../../ToastProvider';
import DeleteButtonClient from './DeleteButtonClient';
import { deleteProductAction } from './actions';

// An icon for drag handle
function IconDrag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ cursor: 'grab', color: '#666' }}>
      <path d="M8 6h8M8 12h8M8 18h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface ProductItem {
  id: number;
  slug: string;
  name: string;
  category: string;
  image: string;
  material: string;
  is_featured?: boolean;
  is_trending?: boolean;
  tag?: string;
  display_order?: number;
}

interface Props {
  initialProducts: ProductItem[];
  apiUrl: string;
  token: string;
}

export default function SortableProductTable({ initialProducts, apiUrl, token }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const { showToast } = useToast();

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    // Optimistically update UI
    setProducts(items);

    // Prepare payload
    const payload = items.map((item, index) => ({
      id: item.id,
      display_order: index,
    }));

    try {
      const res = await fetch(`${apiUrl}/api/products/reorder`, {
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

      showToast('Product arrangement saved!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to save arrangement', 'error');
      // Revert on error
      setProducts(initialProducts);
    }
  };

  if (products.length === 0) {
    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Material</th>
            <th>Badges</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', color: '#444', padding: '40px' }}>
              No products yet.{' '}
              <Link href="/admin/products/new" style={{ color: '#d4a05a' }}>
                Add the first one →
              </Link>
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
            <th>Category</th>
            <th>Material</th>
            <th>Badges</th>
            <th>Actions</th>
          </tr>
        </thead>
        <Droppable droppableId="products-list">
          {(provided) => (
            <tbody {...provided.droppableProps} ref={provided.innerRef}>
              {products.map((p, index) => (
                <Draggable key={p.id} draggableId={p.id.toString()} index={index}>
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
                      <td {...provided.dragHandleProps} style={{ textAlign: 'center' }} title="Drag to reorder products">
                        <IconDrag />
                      </td>
                      <td>
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={44}
                          height={44}
                          className={styles.productThumb}
                        />
                      </td>
                      <td style={{ color: '#ddd', fontWeight: 500 }}>{p.name}</td>
                      <td>{p.category}</td>
                      <td style={{ color: '#666', fontSize: '0.8rem' }}>{p.material}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {p.is_featured && (
                            <span className={`${styles.badge} ${styles.badgeGold}`}>Featured</span>
                          )}
                          {p.tag && (
                            <span className={`${styles.badge} ${styles.badgeGreen}`}>{p.tag}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.tableActions}>
                          <Link
                            href={`/admin/products/${p.slug}`}
                            className={styles.btnIcon}
                            id={`edit-product-${p.slug}`}
                            title="Edit product"
                          >
                            <IconEdit />
                          </Link>
                          <DeleteButtonClient
                            name={p.name}
                            action={deleteProductAction.bind(null, p.slug)}
                            onSuccess={() => {
                              setProducts(prev => prev.filter(item => item.slug !== p.slug));
                            }}
                            id={`delete-product-${p.slug}`}
                            entityType="Product"
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
