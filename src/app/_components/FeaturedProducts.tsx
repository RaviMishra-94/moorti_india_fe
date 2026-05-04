import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/api';
import styles from './FeaturedProducts.module.css';

export default async function FeaturedProducts() {
  const allFeatured = await getProducts({ featured: true });
  const products = allFeatured.slice(0, 6);

  return (
    <section className={`section ${styles.section}`} id="featured">
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="label-sm section-label">Featured Works</span>
          <div className="gold-line gold-line-center" style={{ marginTop: 'var(--space-3)' }} />
          <h2 className="display-md" style={{ marginTop: 'var(--space-4)' }}>
            Sculptures of <em style={{ fontStyle: 'italic' }}>divine brilliance</em>
          </h2>
          <p className={styles.headerDesc}>
            Each piece is one-of-a-kind — carved to order, finished by hand, and blessed with 
            the traditions of Jaipur&apos;s ancient stone carving heritage.
          </p>
        </div>

        {/* Product Grid */}
        <div className={styles.grid}>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className={styles.card}
              id={`product-${product.slug}`}
            >
              {/* Image */}
              <div className={styles.cardImgWrap}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  className={styles.cardImg}
                />
                {product.tag && (
                  <div className={styles.cardTag}>{product.tag}</div>
                )}
                <div className={styles.cardOverlay} />
                <div className={styles.cardHoverCta}>
                  <span className={`btn btn-outline`} style={{ fontSize: '0.68rem', padding: '10px 20px' }}>
                    View & Enquire
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className={styles.cardInfo}>
                <span className="label-sm" style={{ color: 'var(--gold-dim)' }}>{product.material}</span>
                <h3 className={styles.cardName}>{product.name}</h3>
                <p className={styles.cardDesc}>{product.shortDesc}</p>
                <div className={styles.cardSizes}>
                  {product.sizes && product.sizes.slice(0, 4).map((s) => (
                    <span key={s} className={styles.sizeChip}>{s}</span>
                  ))}
                  {product.sizes && product.sizes.length > 4 && (
                    <span className={styles.sizeChip} style={{ color: 'var(--gold-dim)' }}>+more</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.footer}>
          <Link href="/products" className="btn btn-outline btn-lg" id="featured-view-all">
            View All Sculptures
          </Link>
        </div>
      </div>
    </section>
  );
}
