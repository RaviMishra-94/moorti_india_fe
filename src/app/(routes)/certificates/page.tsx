import type { Metadata } from 'next';
import Image from 'next/image';
import { getActiveCertificates, Certificate } from '@/lib/api';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Certificates of Authenticity — Moorti India',
  description:
    'View the official certificates of authenticity for Moorti India, a certified manufacturer of premium handcrafted marble statues in Jaipur.',
};

export default async function CertificatesPage() {
  let certificates: Certificate[] = [];
  try {
    certificates = await getActiveCertificates();
  } catch (err) {
    console.error('Failed to fetch certificates', err);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/images/process_carving.webp"
            alt="Jaipur marble artisan at work"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <span className="label-sm section-label">Trust & Quality</span>
          <h1 className="display-lg" style={{ marginTop: 'var(--space-4)' }}>
            Certificates of <br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Authenticity</em>
          </h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="label-sm section-label">Our Certifications</span>
            <div className="gold-line gold-line-center" style={{ marginTop: 'var(--space-3)' }} />
            <p style={{ marginTop: 'var(--space-6)', color: 'var(--text-secondary)', maxWidth: '600px', margin: 'var(--space-6) auto 0' }}>
              Moorti India is a certified and trusted manufacturer of authentic handcrafted marble idols. 
              We are proud to share our official certifications that guarantee the quality and purity of our craft.
            </p>
          </div>

          {certificates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--text-muted)' }}>
              No certificates are currently available for display.
            </div>
          ) : (
            <div className={styles.grid}>
              {certificates.map(cert => {
                const isPdf = cert.file_url.toLowerCase().endsWith('.pdf');
                const fullUrl = cert.file_url.startsWith('http') ? cert.file_url : `${apiUrl}${cert.file_url}`;
                
                return (
                  <div key={cert.id} className={styles.certCard}>
                    <div className={styles.certPreview}>
                      {isPdf ? (
                        <div style={{ fontSize: '4rem' }}>📄</div>
                      ) : (
                        <Image
                          src={fullUrl}
                          alt={cert.name || 'Certificate'}
                          fill
                          style={{ objectFit: 'contain', padding: 'var(--space-4)' }}
                        />
                      )}
                    </div>
                    <div className={styles.certContent}>
                      <h3 className={styles.certTitle}>{cert.name || 'Moorti India Certificate'}</h3>
                      <a 
                        href={fullUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`btn btn-primary ${styles.viewBtn}`}
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        {isPdf ? 'Open PDF' : 'View Full Image'}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
