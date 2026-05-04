import { getClientStories } from '@/lib/api';
import styles from './TestimonialsSection.module.css';
import DragCarousel from './DragCarousel';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? 'var(--gold)' : 'var(--border-medium)', fontSize: '0.9rem' }}>
          ★
        </span>
      ))}
    </div>
  );
}

export default async function TestimonialsSection() {
  const allStories = await getClientStories();
  const publishedStories = allStories.filter(s => s.is_published !== false); // fallback to true if undefined for legacy

  return (
    <section className={`section ${styles.section}`} id="testimonials">
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className="label-sm section-label">Client Stories</span>
          <div className="gold-line gold-line-center" style={{ marginTop: 'var(--space-3)' }} />
          <h2 className="display-md" style={{ marginTop: 'var(--space-4)' }}>
            Crafted with devotion,
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>received with love</em>
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div className={styles.carouselContainer}>
          <DragCarousel itemGap={32} showArrows={true}>
            {publishedStories.map((t: any) => (
              <div key={t.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <StarRating rating={t.rating} />
                  <div className={styles.quoteIcon}>&ldquo;</div>
                </div>
                <blockquote className={styles.quote}>{t.text}</blockquote>
                <div className={styles.cardFooter}>
                  <div className={styles.avatar}>
                    {t.name.charAt(0)}
                  </div>
                  <div className={styles.info}>
                    <div className={styles.name}>{t.name}</div>
                    <div className={styles.details}>
                      {t.location}, {t.country} &nbsp;·&nbsp; {t.statue}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </DragCarousel>
        </div>

        {/* Trust Badges */}
        <div className={styles.trustBadges}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🌏</span>
            <div>
              <div className={styles.badgeTitle}>50+ Countries</div>
              <div className={styles.badgeSubtitle}>Delivered worldwide</div>
            </div>
          </div>
          <div className={styles.badgeDivider} />
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>📦</span>
            <div>
              <div className={styles.badgeTitle}>Zero Damage</div>
              <div className={styles.badgeSubtitle}>Export-grade packaging</div>
            </div>
          </div>
          <div className={styles.badgeDivider} />
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🕐</span>
            <div>
              <div className={styles.badgeTitle}>24/7 Support</div>
              <div className={styles.badgeSubtitle}>From inquiry to delivery</div>
            </div>
          </div>
          <div className={styles.badgeDivider} />
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>✦</span>
            <div>
              <div className={styles.badgeTitle}>Custom Orders</div>
              <div className={styles.badgeSubtitle}>Any size, pose, or design</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
