'use client';

import { useState } from 'react';
import styles from './admin.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div
        className={styles.modalCard}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Icon */}
        <div className={`${styles.modalIcon} ${danger ? styles.modalIconDanger : styles.modalIconInfo}`}>
          {danger ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>

        <h2 id="modal-title" className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalMessage}>{message}</p>

        <div className={styles.modalActions}>
          {/* Left: Cancel (secondary) */}
          <button
            className={styles.btnSecondary}
            onClick={onCancel}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {cancelLabel}
          </button>

          {/* Right: Confirm (primary) with loader */}
          <button
            className={danger ? styles.btnDangerSolid : styles.btnPrimary}
            onClick={handleConfirm}
            disabled={loading}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
