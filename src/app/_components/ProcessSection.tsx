import Link from 'next/link';
import { processSteps } from '@/lib/data';
import styles from './ProcessSection.module.css';

export default function ProcessSection() {
  return (
    <section className={`texture-section section-lg ${styles.section}`} id="process">
      <div className="texture-overlay texture-greek-fresco" />
      <div className="texture-vignette" />

      <div className={`container texture-content`}>
        <div className={styles.layout}>

          {/* Left — Image */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              <video
                src="/videos/process_carving.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
              <div className={styles.imageOverlay} />
              <div className={styles.imageBadge}>
                <span className={styles.badgeValue}>40+</span>
                <span className={styles.badgeLabel}>Years of tradition</span>
              </div>
            </div>
            <div className={styles.imageAccent} />
          </div>

          {/* Right — Process Steps */}
          <div className={styles.contentCol}>
            <span className="label-sm section-label">How We Work</span>
            <div className="gold-line" style={{ marginTop: 'var(--space-3)' }} />
            <h2 className="display-md" style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
              From sacred stone <br />
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>to divine sculpture</em>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: 'var(--space-10)' }}>
              Every Moorti India sculpture passes through six stages of mastery — 
              from the selection of the finest Makrana marble to the moment it reaches your home.
            </p>

            <div className={styles.steps}>
              {processSteps.map((step, i) => (
                <div key={step.step} className={styles.step}>
                  <div className={styles.stepNumber}>
                    <span>{String(step.step).padStart(2, '0')}</span>
                    {i < processSteps.length - 1 && <div className={styles.stepLine} />}
                  </div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDesc}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/process" className="btn btn-outline" style={{ marginTop: 'var(--space-8)' }} id="process-learn-more">
              Learn More About Our Process →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
