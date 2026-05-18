import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/lib/api';
import styles from './CategoryGrid.module.css';

export default async function CategoryGrid() {
  const categories = await getCategories();
  const featured = categories.slice(0, 6);

  return (
    <section className={`texture-section section ${styles.section}`} id="collections">
      <div className="texture-overlay texture-greek-fresco" />
      <div className="texture-vignette" />

      <div className={`container texture-content`}>
        {/* Header */}
        <div className={styles.header}>
          <span className="label-sm section-label">Our Collections</span>
          <div className="gold-line gold-line-center" style={{ marginTop: 'var(--space-3)' }} />
          <h2 className="display-md" style={{ marginTop: 'var(--space-4)' }}>
            Divine sculptures for every <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>sacred space</em>
          </h2>
        </div>

        {/* Editorial Grid */}
        <div className={styles.grid}>
          {featured.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className={`${styles.card} ${i === 0 ? styles.cardLarge : ''} ${i === 3 ? styles.cardWide : ''}`}
              id={`category-${cat.slug}`}
            >
              <div className={`img-zoom-container ${styles.cardImg}`}>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
              <div className={styles.cardOverlay} />
              <div className={styles.cardContent}>
                <span className="label-sm" style={{ color: 'var(--gold)' }}>{cat.count} Pieces</span>
                <h3 className={styles.cardTitle}>{cat.name}</h3>
                <span className={styles.cardArrow}>→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.footer}>
          <Link href="/collections" className="btn btn-outline btn-lg" id="categories-view-all">
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
