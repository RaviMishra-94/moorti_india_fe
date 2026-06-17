import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="texture-section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="texture-overlay texture-sandstone"></div>
      <div className="texture-vignette"></div>
      
      <div className="container texture-content" style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
        <span className="label-sm section-label">Error 404</span>
        <div className="gold-line gold-line-center"></div>
        <h1 className="display-md" style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
          This path remains uncarved
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', marginBottom: 'var(--space-8)' }}>
          The divine sculpture or page you are looking for has been moved, removed, or never existed in our gallery.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            Return to Gallery
          </Link>
          <Link href="/collections" className="btn btn-outline">
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
