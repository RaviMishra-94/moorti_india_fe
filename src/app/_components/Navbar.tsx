'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar({ categories }: { categories: { slug: string; name: string }[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <span className="label-sm" style={{ color: 'var(--gold)', letterSpacing: '0.15em' }}>
          ✦ &nbsp;Handcrafted in Jaipur since 1985 &nbsp;·&nbsp; Worldwide Shipping &nbsp;·&nbsp; Custom Orders Welcome &nbsp;✦
        </span>
      </div>

      {/* Main Navbar */}
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navInner}>

          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
            <Image
              src="/images/logo.png"
              alt="Moorti India Logo"
              width={160}
              height={44}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Home</Link>

            {/* Collections Dropdown */}
            <div
              className={styles.dropdown}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className={`${styles.navLink} ${styles.dropdownTrigger}`}>
                Collections
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.dropdownMenuOpen : ''}`}>
                <div className={styles.dropdownGrid}>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/collections/${cat.slug}`}
                      className={styles.dropdownItem}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div className={styles.dropdownFooter}>
                  <Link href="/collections" className="btn btn-outline" style={{ fontSize: '0.7rem' }}>
                    View All Collections →
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/about" className={styles.navLink}>Our Story</Link>
            <Link href="/process" className={styles.navLink}>Craftsmanship</Link>
          </div>

          {/* Right CTAs */}
          <div className={styles.navRight}>
            <Link href="/contact" className={`btn btn-outline ${styles.enquireBtn}`}>
              Enquire Now
            </Link>
            <a href="tel:+919958476169" className={styles.phoneLink}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              +91 99584 76169
            </a>

            {/* Mobile Hamburger */}
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              id="nav-hamburger"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`${styles.mobileDrawer} ${menuOpen ? styles.mobileDrawerOpen : ''}`}>
        <div className={styles.mobileHeader}>
          <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
            <Image
              src="/images/logo.png"
              alt="Moorti India Logo"
              width={140}
              height={36}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>
          <button className={styles.closeBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
        </div>

        <nav className={styles.mobileNav}>
          <Link href="/" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <div className={styles.mobileSection}>
            <button 
              className={styles.mobileNavLink} 
              onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                width: '100%', 
                textAlign: 'left', 
                borderBottom: 'none', 
                padding: 0 
              }}
            >
              Collections
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 12 12" 
                fill="none" 
                style={{ 
                  transform: mobileCollectionsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                  color: 'var(--gold)'
                }}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {mobileCollectionsOpen && (
              <div style={{ paddingTop: '0.8rem', paddingBottom: '0.2rem' }}>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/collections/${cat.slug}`}
                    className={styles.mobileCatLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/about" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Our Story</Link>
          <Link href="/process" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Craftsmanship</Link>
          <Link href="/contact" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>

        <div className={styles.mobileFooter}>
          <Link href="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Request Custom Order
          </Link>
          <a href="tel:+919958476169" className={styles.mobilePhone}>
            📞 +91 99584 76169
          </a>
        </div>
      </div>
    </>
  );
}
