import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { processSteps } from '@/lib/data';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Our Craftsmanship — The Art of Marble Sculpting',
  description:
    'Discover the 6-step process behind every Moorti India marble sculpture — from quarry to carving, polishing to worldwide delivery.',
};

export default function ProcessPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/images/process_carving.png"
            alt="Marble artisan at work"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <span className="label-sm section-label">Our Craftsmanship</span>
          <h1 className="display-lg" style={{ marginTop: 'var(--space-4)' }}>
            The art of <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>eternal marble</em>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-5)', maxWidth: '560px', lineHeight: '1.7' }}>
            Every Moorti India sculpture passes through six stages of mastery — from the quarry to your home.
          </p>
        </div>
      </div>

      {/* Process Steps */}
      <section className="section-lg">
        <div className="container">
          <div className={styles.stepsGrid}>
            {processSteps.map((step, i) => (
              <div key={step.step} className={`${styles.stepCard} ${i % 2 === 0 ? styles.stepCardEven : ''}`}>
                {/* Step image */}
                {step.image && (
                  <div className={styles.stepCard__imgWrap}>
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className={styles.stepCard__img}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className={styles.stepCard__imgOverlay} />
                  </div>
                )}
                <div className={styles.stepCard__body}>
                  <div className={styles.stepCard__number}>
                    <span>{String(step.step).padStart(2, '0')}</span>
                  </div>
                  <div className={styles.stepCard__icon}>{step.icon}</div>
                  <h2 className={styles.stepCard__title}>{step.title}</h2>
                  <p className={styles.stepCard__desc}>{step.description}</p>
                </div>
                {i < processSteps.length - 1 && <div className={styles.stepCard__connector} />}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Artisan Section */}
      <section className={`section ${styles.artisanSection}`}>
        <div className="container">
          <div className={styles.artisanLayout}>
            <div className={styles.artisanImg}>
              <Image
                src="/images/process_carving.png"
                alt="Jaipur marble artisan"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <div className={styles.artisanContent}>
              <span className="label-sm section-label">Our Artisans</span>
              <div className="gold-line" style={{ marginTop: 'var(--space-3)' }} />
              <h2 className="heading-xl" style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
                Masters of an ancient tradition
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8', marginBottom: 'var(--space-5)' }}>
                Our artisans are third and fourth-generation stone carvers, trained from childhood in the 
                same workshops where their fathers and grandfathers worked. Located in Chandpole Bazar — 
                Jaipur&apos;s ancient stone carving district — they carry centuries of accumulated knowledge.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.8', marginBottom: 'var(--space-8)' }}>
                The same techniques used to create the marble inlay work of the Taj Mahal, the pillars of 
                Rajput palaces, and the idols of India&apos;s greatest temples are employed in our workshop today.
              </p>
              <Link href="/contact" className="btn btn-outline" id="process-enquire-btn">
                Commission a Custom Sculpture →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className={`section-sm ${styles.materialsSection}`}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <h2 className="heading-xl">The Marble We Use</h2>
          </div>
          <div className={styles.materialsGrid}>
            <div className={styles.materialCard}>
              <div className={styles.materialImgWrap}>
                <Image
                  src="/images/marble_makrana_white.png"
                  alt="Makrana white marble block from Rajasthan"
                  fill
                  className={styles.materialImg}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
                <div className={styles.materialImgOverlay} />
              </div>
              <div className={styles.materialBody}>
                <div className={styles.materialIcon}>◆</div>
                <h3 className={styles.materialName}>Makrana White Marble</h3>
                <p className={styles.materialDesc}>
                  Quarried from Makrana, Rajasthan — the same source as the Taj Mahal. Known for its 
                  extraordinary purity, consistent white colour, and signature luminosity. The pinnacle 
                  of Indian marble.
                </p>
              </div>
            </div>
            <div className={styles.materialCard}>
              <div className={styles.materialImgWrap}>
                <Image
                  src="/images/marble_vietnam_white.png"
                  alt="Polished Vietnam white marble slab with mirror finish"
                  fill
                  className={styles.materialImg}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
                <div className={styles.materialImgOverlay} />
              </div>
              <div className={styles.materialBody}>
                <div className={styles.materialIcon}>✦</div>
                <h3 className={styles.materialName}>Vietnam White Marble</h3>
                <p className={styles.materialDesc}>
                  Premium Vietnam marble offers an ultra-fine grain and brilliant white finish. 
                  Excellent for smaller statues and pieces that require extremely fine detailing. 
                  Known for durability and smooth polishing qualities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
