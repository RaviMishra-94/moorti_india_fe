import Image from 'next/image';
import Link from 'next/link';
import styles from './BespokePortraitSection.module.css';

export default function BespokePortraitSection() {
  return (
    <section className={`texture-section ${styles.section}`} id="bespoke">
      <div className="texture-overlay texture-lotus" />
      <div className="texture-vignette" />

      <div className={`container texture-content ${styles.content}`}>
        {/* Header */}
        <div className={styles.header}>
          <span className={`label-sm section-label ${styles.eyebrow}`}>
            BESPOKE MARBLE PORTRAITS
          </span>
          <div className="gold-line gold-line-center" style={{ marginTop: 'var(--space-4)' }} />
          <h2 className={`display-lg ${styles.heading}`}>Legacy Sculpted In Marble</h2>
          <p className={styles.subtitle1}>Timeless Portraits. Eternal Connections.</p>
          <p className={styles.subtitle2}>
            Each sculpture is handcrafted by master artisans in Jaipur using the finest marble,
            capturing expression, emotion, and identity for generations to come.
          </p>
        </div>

        {/* Content Layout */}
        <div className={styles.layout}>
          {/* Left Column: Image */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              <Image
                src="/images/bespoke_portrait_bust.png"
                alt="Bespoke marble portrait bust handcrafted by artisans"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.image}
              />
              <div className={styles.imageOverlay} />
            </div>
          </div>

          {/* Right Column: Text & Features */}
          <div className={styles.textCol}>
            <h3 className={`display-md ${styles.rightHeading}`}>
              Handcrafted Portraits<br />
              <em className={styles.headingEm}>That Preserve Legacy</em>
            </h3>
            <div className="gold-line" style={{ margin: 'var(--space-5) 0', opacity: 0.6 }} />
            
            <p className={styles.rightDesc}>
              We transform cherished memories into timeless marble portraits—sculpted with precision, passion, and reverence. A legacy that lives on, beautifully.
            </p>

            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14.5 12a2.5 2.5 0 0 1-5 0V8a2.5 2.5 0 0 1 5 0v4Z" />
                    <path d="M7.5 15h9l2-2v-3l-2-2m-9 7H6l-2-2v-3l2-2" />
                    <path d="m3 3 18 18" />
                  </svg>
                </div>
                <span className={styles.featureLabel}>HAND SCULPTED<br />IN JAIPUR</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m21 16-9 5-9-5V8l9-5 9 5v8z" />
                    <path d="m3.27 6.96 8.73 4.91 8.73-4.91" />
                    <path d="M12 21.88V11.87" />
                  </svg>
                </div>
                <span className={styles.featureLabel}>PREMIUM<br />MARBLE</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    <path d="M2 12h20" />
                  </svg>
                </div>
                <span className={styles.featureLabel}>WORLDWIDE<br />SHIPPING</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <span className={styles.featureLabel}>SAFE &amp; SECURE<br />DELIVERY</span>
              </div>
            </div>

            <div className={styles.ctaWrap}>
              <Link href="/contact" className={`btn btn-primary ${styles.ctaBtn}`}>
                COMMISSION A SCULPTURE &nbsp; →
              </Link>
              <p className={styles.ctaSubtext}>Bespoke | Personalised | Timeless</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
