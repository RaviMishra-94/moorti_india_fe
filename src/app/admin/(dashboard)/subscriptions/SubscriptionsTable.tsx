'use client';

import { useState } from 'react';
import styles from '../../admin.module.css';

export default function SubscriptionsTable({ initialData, apiUrl, token }: { initialData: any[], apiUrl: string, token: string }) {
  const [subscriptions, setSubscriptions] = useState(initialData);

  const toggleResolve = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${apiUrl}/api/leads/subscribe/${id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_resolved: !currentStatus })
      });
      if (res.ok) {
        setSubscriptions(subscriptions.map(sub => sub.id === id ? { ...sub, is_resolved: !currentStatus } : sub));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSubscription = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/leads/subscribe/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxHeight: '600px', overflowX: 'auto', overflowY: 'auto' }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date Subscribed</th>
            <th>Email Address</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub: any) => (
            <tr key={sub.id} style={{ opacity: sub.is_resolved ? 0.5 : 1, transition: 'opacity 0.2s' }}>
              <td>{new Date(sub.created_at).toLocaleDateString()}</td>
              <td style={{ fontWeight: 500 }}>
                <a href={`mailto:${sub.email}`} style={{ color: sub.is_resolved ? 'inherit' : 'var(--brand-gold)' }}>
                  {sub.email}
                </a>
              </td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button
                  onClick={() => toggleResolve(sub.id, sub.is_resolved)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: sub.is_resolved ? '#4caf50' : '#888', marginRight: 12
                  }}
                  title={sub.is_resolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() => deleteSubscription(sub.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                  title="Delete Subscription"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
          {subscriptions.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                No subscribers yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
