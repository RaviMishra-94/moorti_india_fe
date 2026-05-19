import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Our Story — Marble Home, Est. 1985',
  description:
    'Learn the story of Moorti India — a family-led marble statue manufacturer in Jaipur since 1985, crafting divine sculptures for devotees worldwide.',
};

export default function AboutPage() {
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
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <span className="label-sm section-label">Our Story</span>
          <h1 className="display-lg" style={{ marginTop: 'var(--space-4)' }}>
            Four decades of <br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>divine devotion</em>
          </h1>
        </div>
      </div>

      {/* Story Section */}
      <section className="section">
        <div className="container">
          <div className={styles.storyLayout}>
            <div className={styles.storyContent}>
              <span className="label-sm section-label">Founded 1985</span>
              <div className="gold-line" style={{ marginTop: 'var(--space-3)' }} />
              <h2 className="heading-xl" style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
                Marble Home — Born in the Pink City
              </h2>
              <div className={styles.storyText}>
                <p>
                  Moorti India, known as Marble Home, was founded in 1985 in the ancient city of Jaipur — 
                  the cradle of Indian marble craftsmanship. For over four decades, we have been creating 
                  sacred marble sculptures that find their way into homes, temples, and sacred spaces across 
                  the globe.
                </p>
                <p>
                  Located in Chandpole Bazar, Jaipur — the heart of Rajasthan&apos;s legendary stone carving 
                  district — our workshop employs master artisans who have inherited their craft from generations 
                  past. The same techniques used to carve the marble of the Taj Mahal are used to bring 
                  your divine visions to life.
                </p>
                <p>
                  We work exclusively with Makrana white marble and premium Vietnam marble — the finest 
                  natural stones available, chosen for their purity, durability, and the luminous quality 
                  they bring to every finished sculpture.
                </p>
                <p>
                  Today, Moorti India ships to over 50 countries. Our statues grace home temples in 
                  Australia, Dubai, the UK, Canada, Singapore, and across India. Each piece we send out 
                  carries with it not just marble, but the devotion, skill, and spiritual intention of 
                  every artisan who worked on it.
                </p>
              </div>
            </div>

            <div className={styles.storyImage}>
              <div className={styles.storyImgWrap}>
                <Image
                  src="/images/product_radha_krishna.webp"
                  alt="Exquisite marble Radha Krishna statue"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`section ${styles.valuesSection}`}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="label-sm section-label">What Drives Us</span>
            <div className="gold-line gold-line-center" style={{ marginTop: 'var(--space-3)' }} />
            <h2 className="display-md" style={{ marginTop: 'var(--space-5)' }}>Our Core Values</h2>
          </div>

          <div className={styles.valuesGrid}>
            {[
              { icon: '◆', title: 'Authentic Craftsmanship', desc: 'Every sculpture is hand-carved by master artisans trained in the 500-year-old tradition of Jaipur stone carving. No machines. No shortcuts.' },
              { icon: '✦', title: 'Spiritual Integrity', desc: 'We approach every sculpture with reverence. Our artisans carve with devotion, ensuring each statue is not just beautiful, but spiritually authentic.' },
              { icon: '◈', title: 'Finest Materials', desc: 'We use only Makrana and premium Vietnam white marble — the same stone used in the Taj Mahal — for purity, longevity, and luminous beauty.' },
              { icon: '◉', title: 'Global Trust', desc: 'From inquiry to delivery, we provide full support. Every international shipment is tracked, insured, and packaged in export-grade crating.' },
            ].map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className="heading-xl">Ready to commission your sculpture?</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-3)', fontSize: '0.95rem' }}>
              Reach out to us — we&apos;ll work with you from first enquiry to final delivery.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary btn-lg" id="about-contact-btn">Contact Us</Link>
              <Link href="/collections" className="btn btn-outline btn-lg" id="about-collectons-btn">Browse Collections</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
