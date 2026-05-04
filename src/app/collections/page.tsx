import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/lib/api';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'All Collections — Marble Statues & Sculptures',
  description:
    'Browse our complete collection of handcrafted marble statues — Ganesh, Radha Krishna, Durga, Hanuman, Buddha, Marble Temples, Garden Sculptures and more. All made in Jaipur.',
};

export default async function CollectionsPage() {
  const categories = await getCategories();
  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <div className="container">
          <span className="label-sm section-label">All Collections</span>
          <div className="gold-line" style={{ marginTop: 'var(--space-3)' }} />
          <h1 className="display-lg" style={{ marginTop: 'var(--space-5)' }}>
            Our Marble Sculptures
          </h1>
          <p className={styles.headerDesc}>
            Over 200 handcrafted marble statues across {categories.length} collections — 
            each piece carved to order in Jaipur, Rajasthan.
          </p>
        </div>
      </div>

      {/* Grid */}
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/collections/${cat.slug}`}
                className={styles.card}
                id={`collection-${cat.slug}`}
              >
                <div className={styles.cardImg}>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  />
                  <div className={styles.cardOverlay} />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardCount}>{cat.count} pieces</div>
                  <h2 className={styles.cardTitle}>{cat.name}</h2>
                  <p className={styles.cardDesc}>{cat.description}</p>
                  <span className={styles.cardLink}>Explore Collection →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className="heading-xl">Don&apos;t see what you&apos;re looking for?</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
              We create fully custom marble statues to your exact specifications. Contact us to discuss.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-6)' }} id="collections-custom-cta">
              Request Custom Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
