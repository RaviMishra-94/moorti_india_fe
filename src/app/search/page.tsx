import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/api';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Search Results | Moorti India',
  description: 'Search results for premium marble sculptures by Moorti India.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';
  const products = await getProducts({ searchQuery: query });

  return (
    <main className="page-wrapper">
      <section className="section">
        <div className="container">
          <div className={styles.header}>
            <span className="label-sm section-label">Search Results</span>
            <h1 className="display-md" style={{ marginTop: 'var(--space-4)' }}>
              {query ? (
                <>
                  Results for <span className={styles.queryText}>"{query}"</span>
                </>
              ) : (
                'All Sculptures'
              )}
            </h1>
            <div className="gold-line gold-line-center" style={{ marginTop: 'var(--space-3)' }} />
          </div>

          {products.length === 0 ? (
            <div className={styles.emptyState}>
              <h2 className="display-sm">No sculptures found</h2>
              <p>We couldn't find any pieces matching your search. Please try another term or browse our collections.</p>
              <Link href="/collections" className="btn btn-primary">
                Browse Collections
              </Link>
            </div>
          ) : (
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
                      <span className={`btn btn-outline`} style={{ fontSize: '0.68rem', padding: '10px 20px', color: '#fff', borderColor: '#fff' }}>
                        View Details
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
          )}
        </div>
      </section>
    </main>
  );
}
