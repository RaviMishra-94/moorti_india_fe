'use client';

import { useState } from 'react';
import styles from '../../admin.module.css';

export default function EnquiriesTable({ initialData, apiUrl, token }: { initialData: any[], apiUrl: string, token: string }) {
  const [enquiries, setEnquiries] = useState(initialData);

  const toggleResolve = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${apiUrl}/api/leads/enquiry/${id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_resolved: !currentStatus })
      });
      if (res.ok) {
        setEnquiries(enquiries.map(enq => enq.id === id ? { ...enq, is_resolved: !currentStatus } : enq));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEnquiry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/leads/enquiry/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setEnquiries(enquiries.filter(enq => enq.id !== id));
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
            <th>Date</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Country</th>
            <th>Statue / Type</th>
            <th>Message</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enq: any) => (
            <tr key={enq.id} style={{ opacity: enq.is_resolved ? 0.5 : 1, transition: 'opacity 0.2s' }}>
              <td style={{ whiteSpace: 'nowrap' }}>
                {new Date(enq.created_at).toLocaleDateString()}
              </td>
              <td style={{ fontWeight: 500 }}>{enq.name}</td>
              <td>
                <a href={`mailto:${enq.email}`} style={{ color: enq.is_resolved ? 'inherit' : 'var(--brand-gold)' }}>{enq.email}</a>
                {enq.phone && <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 4 }}>{enq.phone}</div>}
              </td>
              <td>{enq.country}</td>
              <td>{enq.statue || '-'}</td>
              <td style={{ maxWidth: 300 }}>
                <div style={{ maxHeight: '100px', overflowY: 'auto', fontSize: '0.85rem' }}>
                  {enq.message}
                </div>
              </td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button
                  onClick={() => toggleResolve(enq.id, enq.is_resolved)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: enq.is_resolved ? '#4caf50' : '#888', marginRight: 12
                  }}
                  title={enq.is_resolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() => deleteEnquiry(enq.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                  title="Delete Enquiry"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
          {enquiries.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                No enquiries received yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
