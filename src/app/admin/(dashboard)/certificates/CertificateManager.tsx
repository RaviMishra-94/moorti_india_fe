'use client';

import { useState, useRef } from 'react';
import { Certificate, createCertificate, updateCertificate, deleteCertificate } from '@/lib/api';
import { useToast } from '../../ToastProvider';
import ConfirmModal from '../../ConfirmModal';
import styles from '../../admin.module.css';

export default function CertificateManager({ 
  initialCertificates, 
  token,
  apiUrl
}: { 
  initialCertificates: Certificate[], 
  token: string,
  apiUrl: string
}) {
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [isDraggingCert, setIsDraggingCert] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const certFileInputRef = useRef<HTMLInputElement>(null);
  const [deletingCertId, setDeletingCertId] = useState<number | null>(null);
  
  const { showToast } = useToast();

  const handleUploadFile = async (file: File) => {
    setUploadingCert(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`${apiUrl}/api/uploads/certificate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      // Create new certificate record
      const newCert = await createCertificate({
        name: file.name,
        file_url: data.url,
        is_active: false // newly uploaded are not active by default
      }, token);
      
      setCertificates(prev => [newCert, ...prev]);
      showToast('Certificate uploaded and added successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to upload certificate', 'error');
    } finally {
      setUploadingCert(false);
    }
  };

  const handleToggleActive = async (cert: Certificate) => {
    try {
      const updated = await updateCertificate(cert.id, { is_active: !cert.is_active }, token);
      setCertificates(prev => prev.map(c => c.id === cert.id ? updated : c));
      showToast(`Certificate ${updated.is_active ? 'activated' : 'deactivated'}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to toggle status', 'error');
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingCertId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deletingCertId === null) return;
    try {
      await deleteCertificate(deletingCertId, token);
      setCertificates(prev => prev.filter(c => c.id !== deletingCertId));
      showToast('Certificate deleted', 'info');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete certificate', 'error');
    } finally {
      setDeletingCertId(null);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Site Certificates</h1>
          <p className={styles.pageSubtitle}>Manage global certificates for Moorti India</p>
        </div>
      </div>

      <div className={styles.formContainer} style={{ maxWidth: 900 }}>
        <div className={styles.formSectionTitle}>Upload New Certificate</div>
        
        {/* Upload zone */}
        <div
          style={{
            border: `2px dashed ${isDraggingCert ? '#d4a05a' : '#444'}`,
            borderRadius: 10, padding: '24px 20px', textAlign: 'center',
            background: isDraggingCert ? 'rgba(212,160,90,0.07)' : 'rgba(255,255,255,0.02)',
            cursor: uploadingCert ? 'not-allowed' : 'pointer',
            opacity: uploadingCert ? 0.6 : 1,
            transition: 'all 0.2s',
            marginBottom: 32
          }}
          onDragOver={(e) => { e.preventDefault(); setIsDraggingCert(true); }}
          onDragLeave={() => setIsDraggingCert(false)}
          onDrop={(e) => {
            e.preventDefault(); setIsDraggingCert(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleUploadFile(file);
          }}
          onClick={() => !uploadingCert && certFileInputRef.current?.click()}
        >
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>{uploadingCert ? '⏳' : '📜'}</div>
          <div style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: 4 }}>
            {uploadingCert
              ? 'Uploading certificate…'
              : <>Drag & drop certificate here, or <span style={{ color: '#d4a05a', fontWeight: 'bold' }}>click to browse</span></>
            }
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>JPEG, PNG, WebP or PDF — max 20 MB</div>
        </div>

        <input
          ref={certFileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) { handleUploadFile(file); e.target.value = ''; }
          }}
        />

        <div className={styles.formSectionTitle}>Uploaded Certificates</div>
        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 16 }}>
          Checked certificates will be shown in the footer and on the About Us page.
        </p>

        {certificates.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666', background: '#111', borderRadius: 8, border: '1px solid #222' }}>
            No certificates uploaded yet.
          </div>
        ) : (
          <div style={{ border: '1px solid #222', borderRadius: 8, overflow: 'hidden' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Preview</th>
                  <th>Name / URL</th>
                  <th style={{ width: 100, textAlign: 'center' }}>Active (Show)</th>
                  <th style={{ width: 80, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map(cert => (
                  <tr key={cert.id}>
                    <td>
                      {cert.file_url.toLowerCase().endsWith('.pdf') ? (
                         <div style={{ width: 44, height: 44, background: 'rgba(212,160,90,0.15)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📄</div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`${apiUrl}${cert.file_url}`} alt="Preview" className={styles.productThumb} style={{ objectFit: 'cover' }} />
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: '#ccc', marginBottom: 4 }}>{cert.name || cert.file_url.split('/').pop()}</div>
                      <div style={{ fontSize: '0.7rem', color: '#666' }}>
                        <a href={`${apiUrl}${cert.file_url}`} target="_blank" rel="noopener noreferrer" style={{ color: '#d4a05a' }}>
                          {cert.file_url}
                        </a>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={cert.is_active}
                        onChange={() => handleToggleActive(cert)}
                        style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#d4a05a' }}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDeleteClick(cert.id)} className={styles.actionBtnDanger} title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deletingCertId !== null}
        title="Delete Certificate"
        message="Are you sure you want to delete this certificate? This cannot be undone."
        confirmLabel="Delete"
        danger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingCertId(null)}
      />
    </div>
  );
}
