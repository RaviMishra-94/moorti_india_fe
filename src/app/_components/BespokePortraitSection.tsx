import Image from 'next/image';
import Link from 'next/link';
import styles from './BespokePortraitSection.module.css';

const portraitTiles = [
  {
    title: 'Memorial Portraits',
    desc: 'Lifelike marble busts and full-form statues capturing the essence of your loved one forever.',
    image: '/tribute_memorial_portrait.webp',
    imageAlt: 'Hand-carved white marble memorial portrait bust on a dark pedestal',
  },
  {
    title: 'Family Memorial Altars',
    desc: 'A personalised marble altar adorned with photographs and offerings — a sacred corner to cherish every day.',
    image: '/tribute_family_altar.webp',
    imageAlt: 'White marble family memorial shelf with a framed photo, marigolds and a diya lamp',
  },
  {
    title: 'Personalised Inscriptions',
    desc: 'Hand-carved inscriptions, names, and dates etched with reverence into the purest marble.',
    image: '/tribute_inscription_carving.webp',
    imageAlt: 'Master artisan hand-carving an inscription into white marble',
  },
  {
    title: 'Worldwide Delivery',
    desc: 'Securely shipped in export-grade wooden crating to over 50 countries with full insurance and tracking.',
    image: '/tribute_delivery_care.webp',
    imageAlt: 'Marble sculpture packed into an export-grade fragile shipping crate',
  },
];

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
            Each sculpture is handcrafted by Jaipur artisans using premium marble,
            preserving expression, emotion, and identity for generations.
          </p>
        </div>

        {/* Tiles */}
        <div className={styles.grid}>
          {portraitTiles.map((tile) => (
            <div key={tile.title} className={styles.card}>
              <div className={styles.cardImageWrap}>
                <Image
                  src={tile.image}
                  alt={tile.imageAlt}
                  fill
                  className={styles.cardImage}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className={styles.cardImageOverlay} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardIcon}>✦</span>
                <h3 className={`heading-md ${styles.cardTitle}`}>{tile.title}</h3>
                <p className={styles.cardDesc}>{tile.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.ctaWrap}>
          <Link href="/contact" className={`btn btn-primary btn-lg ${styles.ctaBtn}`}>
            COMMISSION A SCULPTURE &nbsp; →
          </Link>
          <p className={styles.ctaSubtext}>Bespoke | Personalised | Timeless</p>
        </div>
      </div>
    </section>
  );
}
