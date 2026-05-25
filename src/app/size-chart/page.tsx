import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

// SVG Icons for the details grid
const TempleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l4 4h-8l4-4z" />
    <path d="M4 10h16v12H4z" />
    <path d="M12 10v12" />
    <path d="M8 22v-6a2 2 0 0 1 4 0v6" />
    <path d="M2 10h20" />
    <path d="M6 6h12v4H6z" />
  </svg>
);

const ShelfIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="16" width="20" height="4" rx="1" />
    <path d="M5 16v-6a2 2 0 0 1 2-2h3" />
    <path d="M17 16v-4" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const LivingRoomIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 18v2M20 18v2" />
    <path d="M2 11h20v4a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-4z" />
    <path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
    <path d="M12 5v6" />
  </svg>
);

const ArchIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 22V10a8 8 0 0 1 16 0v12" />
    <path d="M7 22v-8a5 5 0 0 1 10 0v8" />
    <path d="M2 22h20" />
  </svg>
);

export default async function SizeChartPage({
  searchParams,
}: {
  searchParams: Promise<{ image?: string; modal?: string }>;
}) {
  const resolvedParams = await searchParams;
  const imageSrc = resolvedParams.image || '/uploads/product_laxmi.png';
  const isModal = resolvedParams.modal === 'true';

  // Base height of the human is 480px.
  // 5'8" = 68 inches.
  // Pixels per inch = 480 / 68 = 7.0588 px/inch.
  
  const sizes = [
    { label: '12 INCH', heightInches: 12, desc: 'Ideal for compact mandirs and personal spaces.', imgWidth: 100 },
    { label: '18 INCH', heightInches: 18, desc: 'Perfect for side consoles and pooja rooms.', imgWidth: 150 },
    { label: '24 INCH', heightInches: 24, desc: 'Ideal for living rooms, entrance areas and feature corners.', imgWidth: 200 },
    { label: '36 INCH+', heightInches: 36, desc: 'Best for grand interiors and spiritual spaces.', imgWidth: 300 },
  ];

  return (
    <>
      {isModal && (
        <style dangerouslySetInnerHTML={{ __html: `
          header, footer, nav, [class*="topBar"], [class*="whatsappButton"] { display: none !important; }
          body { padding-top: 0 !important; }
        `}} />
      )}
      <div className={`texture-section ${styles.container}`}>
        <div className="texture-overlay texture-greek-fresco" style={{ opacity: 0.2 }} />
      <div className="texture-content">
        
        <div className={styles.header}>
          <span className={`label-sm section-label ${styles.eyebrow}`}>
            VISUAL SIZE GUIDE
          </span>
          <div className="gold-line gold-line-center" style={{ marginTop: 'var(--space-4)' }} />
          <h1 className={`display-lg ${styles.heading}`}>
            Find The Perfect Size<br />
            <em className={styles.headingEm}>For Your Space</em>
          </h1>
          <p className={styles.subtitle}>
            Each sculpture is handcrafted in multiple sizes to suit your space, purpose, and presence.
          </p>
        </div>

        {/* Visual Scale Area */}
        <div className={styles.visualizationArea}>
          {sizes.map((size) => {
            const pixelHeight = size.heightInches * 7.0588; // convert inches to relative pixels
            
            return (
              <div key={size.label} className={styles.sizeItem}>
                <div className={styles.sizeLabel}>{size.label}</div>
                <div className={styles.sizeDesc}>{size.desc}</div>
                <div className={styles.imageWrap} style={{ height: `${pixelHeight}px`, width: `${size.imgWidth}px` }}>
                  <Image
                    src={imageSrc}
                    alt={`${size.label} Statue Scale`}
                    fill
                    className={styles.productImage}
                  />
                </div>
              </div>
            );
          })}

          {/* Human Silhouette */}
          <div className={styles.humanScale}>
            <img 
              src="/images/human-silhouette.svg" 
              alt="Human Scale Reference" 
              className={styles.humanSvg}
              style={{ objectFit: 'contain' }}
            />
            <div className={styles.heightLine}>
              <span className={styles.heightText}>5&apos;8&quot;<br/>(68 INCH)<br/>(173 CM)</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className={styles.detailsBox}>
          <div className={styles.detailsHeader}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--gold)'}}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            CHOOSE THE RIGHT SIZE FOR YOUR SPACE
          </div>
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailCard}>
              <div className={styles.detailIcon}><TempleIcon /></div>
              <div>
                <div className={styles.detailTitle}>SMALL (12 INCH)</div>
                <div className={styles.detailText}>Ideal for home mandirs, study tables and compact spaces.</div>
              </div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.detailIcon}><ShelfIcon /></div>
              <div>
                <div className={styles.detailTitle}>MEDIUM (18 INCH)</div>
                <div className={styles.detailText}>Perfect for side consoles, shelves and pooja rooms.</div>
              </div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.detailIcon}><LivingRoomIcon /></div>
              <div>
                <div className={styles.detailTitle}>LARGE (24 INCH)</div>
                <div className={styles.detailText}>Great for living rooms, entrance areas and feature corners.</div>
              </div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.detailIcon}><ArchIcon /></div>
              <div>
                <div className={styles.detailTitle}>STATEMENT (36 INCH+)</div>
                <div className={styles.detailText}>Ideal for large spaces, spiritual centers and grand interiors.</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaText}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Need help choosing the right size? Our experts are here to guide you.
          </div>
          <Link href="/contact" className={styles.ctaBtn}>
            TALK TO AN ARTISAN &nbsp; &rarr;
          </Link>
        </div>

      </div>
      </div>
    </>
  );
}
