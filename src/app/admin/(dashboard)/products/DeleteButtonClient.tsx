'use client';

import { useState } from 'react';
import { IconTrash } from '../../icons';
import ConfirmModal from '../../ConfirmModal';
import { useToast } from '../../ToastProvider';
import styles from '../../admin.module.css';

export default function DeleteButtonClient({
  name,
  action,
  id,
  entityType = 'Item',
}: {
  name: string;
  action: () => Promise<void>;
  id: string;
  entityType?: string;
}) {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();

  const handleConfirm = async () => {
    try {
      await action();
      setOpen(false);
      showToast(`"${name}" deleted successfully.`, 'success');
    } catch {
      setOpen(false);
      showToast('Failed to delete. Please try again.', 'error');
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.btnIcon}
        id={id}
        title={`Delete "${name}"`}
        onClick={() => setOpen(true)}
        style={{ color: '#e74c3c', borderColor: 'rgba(231,76,60,0.2)' }}
      >
        <IconTrash />
      </button>

      <ConfirmModal
        isOpen={open}
        title={`Delete ${entityType}`}
        message={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        danger
      />
    </>
  );
}
