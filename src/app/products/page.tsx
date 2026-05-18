import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/api';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'All Sculptures — Handcrafted Marble Statues | Moorti India',
  description:
    'Browse our complete range of handcrafted marble sculptures — Ganesh, Radha Krishna, Durga, Hanuman, Buddha and more. Custom orders welcome. Made in Jaipur, Rajasthan.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className={`texture-section ${styles.page}`}>
      <div className="texture-overlay texture-temple-mural" />
      <div className="texture-vignette" />

      <div className="texture-content">
        {/* Page Header */}
        <div className={styles.header}>
          <div className="container">
            <span className="label-sm section-label">All Sculptures</span>
            <div className="gold-line gold-line-center" style={{ marginTop: 'var(--space-3)' }} />
            <h1 className="display-lg" style={{ marginTop: 'var(--space-5)' }}>
              Handcrafted Marble Sculptures
            </h1>
            <p className={styles.headerDesc}>
              {products.length}+ pieces — each carved to order by master artisans in Jaipur, Rajasthan.
            </p>
          </div>
        </div>

        {/* Grid */}
        <section className="section">
          <div className="container">
          <div className={styles.grid}>
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className={styles.card}
                id={`product-${product.slug}`}
              >
                <div className={styles.cardImg}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  />
                  {product.tag && (
                    <div className={styles.cardTag}>{product.tag}</div>
                  )}
                  <div className={styles.cardOverlay} />
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardMaterial}>{product.material}</span>
                  <h2 className={styles.cardTitle}>{product.name}</h2>
                  <p className={styles.cardDesc}>{product.shortDesc}</p>
                  <span className={styles.cardLink}>View & Enquire →</span>
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
            <h2 className="heading-xl">Need a custom sculpture?</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
              We create fully custom marble statues to your exact specifications. Contact us to discuss.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-6)' }} id="products-custom-cta">
              Request Custom Order
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
