'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from './HeroSection.module.css';

// Fallbacks used when a field has not been set by the admin (or the API is
// unreachable). These mirror the values seeded by migrate_hero_settings.py.
const DEFAULTS = {
  imageUrl: '/images/hero_streched.webp',
  imageMobileUrl: '/images/hero_mobile.webp',
  titleLine1: 'Bring Home Timeless',
  titleLine2: 'Divine Craftsmanship',
  tagline: 'Marble Idols That Elevate Your Space & Spirit',
  description: 'Handcrafted from premium marble by skilled artisans. Designed for homes and sacred spaces.',
};

export interface HeroSectionProps {
  imageUrl?: string;
  imageMobileUrl?: string;
  titleLine1?: string;
  titleLine2?: string;
  tagline?: string;
  description?: string;
}

export default function HeroSection({
  imageUrl,
  imageMobileUrl,
  titleLine1,
  titleLine2,
  tagline,
  description,
}: HeroSectionProps) {
  const desktopSrc = imageUrl || DEFAULTS.imageUrl;
  const mobileSrc = imageMobileUrl || imageUrl || DEFAULTS.imageMobileUrl;
  const line1 = titleLine1 || DEFAULTS.titleLine1;
  const line2 = titleLine2 || DEFAULTS.titleLine2;
  const heroTagline = tagline || DEFAULTS.tagline;
  const heroDescription = description || DEFAULTS.description;

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
        <div className={styles.desktopBg}>
          <Image
            src={desktopSrc}
            alt="Handcrafted marble statue background"
            fill
            priority
            quality={100}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
        <div className={styles.mobileBg}>
          <Image
            src={mobileSrc}
            alt="Handcrafted marble statue background"
            fill
            priority
            quality={100}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      </div>

      {/* Gradient overlays for text readability */}
      <div className={styles.overlayGradient} />
      <div className={styles.overlayPattern} />

      {/* Divine glow behind statue */}
      <div className={styles.divineGlow} />
      <div className={styles.divineShimmer} />


      {/* Content — right side */}
      <div className={`container ${styles.heroContent}`} ref={textRef}>
        <div className={styles.heroInner}>
          <div className={styles.heroTop}>
            <div className={styles.heroLabel}>
              <span className="label-sm">✦ &nbsp;Est. 1985 · Jaipur, Rajasthan&nbsp; ✦</span>
            </div>

            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLine1}>{line1}</span>
              <span className={styles.heroTitleLine2}>{line2}</span>
            </h1>
          </div>

          <div className={styles.heroCenter}>
            <p className={`${styles.heroSubtitle} ${styles.heroSubtitle1}`}>
              {heroTagline}
            </p>
            <p className={`${styles.heroSubtitle} ${styles.heroSubtitle2}`}>
              {heroDescription}
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
