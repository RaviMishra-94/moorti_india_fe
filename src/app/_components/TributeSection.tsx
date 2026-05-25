'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './TributeSection.module.css';

const tributeFeatures = [
  {
    icon: '✦',
    title: 'Memorial Portraits',
    desc: 'Lifelike marble busts and full-form statues capturing the essence of your loved one forever.',
    image: '/tribute_memorial_portrait.webp',
    imageAlt: 'Hand-carved white marble memorial portrait bust on dark pedestal',
  },
  {
    icon: '✦',
    title: 'Family Memorial Altars',
    desc: 'A personalised marble altar adorned with photographs and offerings — a sacred corner to cherish every day.',
    image: '/tribute_family_altar.webp',
    imageAlt: 'Serene white marble family memorial shelf with photo of elderly woman, marigold flowers and diya lamp',
  },
  {
    icon: '✦',
    title: 'Personalised Inscriptions',
    desc: 'Hand-carved inscriptions, names, and dates etched with reverence into the purest marble.',
    image: '/tribute_inscription_carving.webp',
    imageAlt: 'Master artisan hand-carving Sanskrit inscriptions into white marble',
  },
  {
    icon: '✦',
    title: 'Worldwide Delivery',
    desc: 'Securely shipped in export-grade wooden crating to over 50 countries with full insurance and tracking.',
    image: '/tribute_delivery_care.webp',
    imageAlt: 'Export-grade wooden crate with foam padding and fragile labels for safe international marble shipping',
  },
];

export default function TributeSection() {
  return (
    <section
      className={`texture-section ${styles.section}`}
      id="tribute"
    >

      <div className="texture-overlay texture-lotus" />
      <div className="texture-vignette" />

      <div className={`container texture-content ${styles.content}`}>

        {/* Header */}
        <div className={styles.header}>
          <span className={`label-sm section-label ${styles.eyebrow}`}>
            ✦ &nbsp; Legacy Sculpted In Marble &nbsp; ✦
          </span>
          <div className="gold-line gold-line-center" style={{ marginTop: 'var(--space-4)' }} />
          <h2 className={`display-lg ${styles.heading}`}>
            Create a Lasting Tribute<br />
            <em className={styles.headingEm}>To Your Loved Ones</em>
          </h2>
          <p className={styles.subtitle}>
            Each sculpture is handcrafted by Jaipur artisans using premium marble, preserving expression, emotion, and identity for generations.
          </p>
        </div>

        {/* Feature Cards */}
        <div className={styles.grid}>
          {tributeFeatures.map((f, i) => (
            <div key={i} className={styles.card}>
              {/* Image */}
              <div className={styles.cardImageWrap}>
                <Image
                  src={f.image}
                  alt={f.imageAlt}
                  fill
                  className={styles.cardImage}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className={styles.cardImageOverlay} />
              </div>
              {/* Content */}
              <div className={styles.cardContent}>
                <div className={styles.cardIcon}>{f.icon}</div>
                <h3 className={`heading-md ${styles.cardTitle}`}>{f.title}</h3>
                <p className={styles.cardDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <Link
            href="/contact"
            className={`btn btn-primary btn-lg ${styles.ctaBtn}`}
            id="tribute-customize-now"
          >
            Customize Now
          </Link>
          <Link
            href="/contact"
            className={`btn btn-ghost ${styles.ctaSecondary}`}
            id="tribute-enquire"
          >
            Speak with an Artisan →
          </Link>
        </div>

        {/* Bottom quote */}
        <div className={styles.quote}>
          <div className={styles.quoteLine} />
          <p className={styles.quoteText}>
            "Every sculpture carries the love of the hands that carved it, and the memory of those who inspired it."
          </p>
          <div className={styles.quoteLine} />
        </div>

      </div>
    </section>
  );
}
