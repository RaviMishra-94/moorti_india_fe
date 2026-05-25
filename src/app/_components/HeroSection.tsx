'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.classList.add(styles.visible);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={styles.hero} id="hero">
      {/* Temple Background — full bleed */}
      <div className={styles.heroBg}>
        <Image
          src="/images/hero_temple.png"
          alt="Ancient Indian temple background"
          fill
          priority
          quality={90}
          style={{ objectFit: 'cover', objectPosition: 'center center' }}
        />
      </div>

      {/* Gradient overlays for text readability */}
      <div className={styles.overlayGradient} />
      <div className={styles.overlayPattern} />

      {/* Divine glow behind statue */}
      <div className={styles.divineGlow} />
      <div className={styles.divineShimmer} />

      {/* Ganesha PNG — transparent bg, positioned on left */}
      <div className={styles.ganeshaWrap}>
        <Image
          src="/images/ganesha_nobg.png"
          alt="Handcrafted marble Ganesha statue — Moorti India"
          width={600}
          height={600}
          priority
          quality={95}
          className={styles.ganeshaImg}
        />
      </div>

      {/* Content — right side */}
      <div className={`container ${styles.heroContent}`} ref={textRef}>
        <div className={styles.heroInner}>
          <div className={styles.heroTop}>
            <div className={styles.heroLabel}>
              <span className="label-sm">✦ &nbsp;Est. 1985 · Jaipur, Rajasthan&nbsp; ✦</span>
            </div>

            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLine1}>Bring Home Timeless</span>
              <span className={styles.heroTitleLine2}>Divine Craftsmanship</span>
            </h1>
          </div>

          <div className={styles.heroCenter}>
            <p className={`${styles.heroSubtitle} ${styles.heroSubtitle1}`}>
              Marble Idols That Elevate Your Space &amp; Spirit
            </p>
            <p className={`${styles.heroSubtitle} ${styles.heroSubtitle2}`}>
              Handcrafted from premium marble by skilled artisans. Designed for homes and sacred spaces.
            </p>
          </div>

          <div className={styles.heroBottom}>
            <div className={styles.heroCtas}>
              <Link href="/collections" className={`btn btn-primary btn-lg ${styles.heroBtn}`} id="hero-explore-btn">
                Explore Our Collections
              </Link>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>40+</span>
                <span className={styles.heroStatLabel}>Years of Craft</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>50+</span>
                <span className={styles.heroStatLabel}>Countries</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>100%</span>
                <span className={styles.heroStatLabel}>Handcrafted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint}>
        <div className={styles.scrollLine} />
        <span className="label-sm" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>Scroll</span>
      </div>
    </section>
  );
}
