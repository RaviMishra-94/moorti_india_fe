'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { socialLinks } from '@/lib/data';

import { useState } from 'react';

export default function Footer({ categories = [] }: { categories?: { slug: string; name: string }[] }) {
  const year = new Date().getFullYear();
  const [subLoading, setSubLoading] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [subError, setSubError] = useState('');

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubLoading(true);
    setSubError('');
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/leads/subscribe` : 'http://localhost:8000/api/leads/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.get('email') }),
      });
      if (!res.ok) throw new Error();
      setSubSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSubSuccess(false), 3000);
    } catch {
      setSubError('Failed to subscribe.');
    } finally {
      setSubLoading(false);
    }
  };

  // Limit to max 8 categories
  const footerCategories = categories.slice(0, 8);

  return (
    <footer className={styles.footer}>
      {/* Newsletter */}
      <div className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterInner}>
            <div className={styles.newsletterText}>
              <span className="label-sm section-label">Stay Connected</span>
              <h3 className="heading-lg" style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>
                Receive stories of divine craftsmanship
              </h3>
            </div>
            <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                className={`form-input ${styles.newsletterInput}`}
                id="newsletter-email"
                required
                disabled={subLoading}
              />
              <button type="submit" className="btn btn-primary" disabled={subLoading}>
                {subLoading ? '...' : subSuccess ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
            {subError && <div style={{ color: '#ffcdd2', fontSize: '0.8rem', marginTop: 8 }}>✕ {subError}</div>}
            {subSuccess && <div style={{ color: '#c8e6c9', fontSize: '0.8rem', marginTop: 8 }}>✓ You have been subscribed successfully!</div>}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.footerMain}>
        <div className="container">
          <div className={styles.footerGrid}>

            {/* Brand Column */}
            <div className={styles.footerBrand}>
              <Link href="/" className={styles.footerLogo}>
                <Image 
                  src="/images/logo.png" 
                  alt="Moorti India Logo" 
                  width={220} 
                  height={66} 
                  style={{ objectFit: 'contain' }} 
                />
              </Link>
              <p className={styles.footerDesc}>
                One of India&apos;s leading marble statue manufacturers and exporters. 
                Handcrafted divine sculptures shipped worldwide with care and reverence.
              </p>
              <div className={styles.certifications}>
                <span className={styles.cert}>✦ 40+ Years</span>
                <span className={styles.cert}>✦ Worldwide Shipping</span>
                <span className={styles.cert}>✦ 100% Handcrafted</span>
              </div>
              <div className={styles.socialLinks}>
                <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.49z"/></svg>
                </a>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            {/* Collections */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>Collections</h4>
              <ul className={`${styles.footerLinks} ${styles.footerLinksGrid}`}>
                {footerCategories.length > 0 ? (
                  footerCategories.map((cat) => (
                    <li key={cat.slug}>
                      <Link href={`/collections/${cat.slug}`} className={styles.footerLink}>
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  ['Ganesh Statues', 'Radha Krishna', 'Durga Maa', 'Hanuman Ji', 'Laxmi Maa', 'Buddha Statues', 'Marble Temples', 'Garden Sculptures'].map((item) => (
                    <li key={item}>
                      <Link href={`/collections/${item.toLowerCase().replace(/ /g, '-')}`} className={styles.footerLink}>
                        {item}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Company */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>Company</h4>
              <ul className={`${styles.footerLinks} ${styles.footerLinksGrid}`}>
                <li><Link href="/about" className={styles.footerLink}>Our Story</Link></li>
                <li><Link href="/process" className={styles.footerLink}>Craftsmanship</Link></li>
                <li><Link href="/contact" className={styles.footerLink}>Contact Us</Link></li>
                <li><a href="https://www.moortiindia.com.au/blogs" className={styles.footerLink}>Blog</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>Contact</h4>
              <ul className={styles.footerLinks}>
                <li className={styles.footerContactItem}>
                  <span className={styles.contactIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </span>
                  <span>2169, Khejdo Ka Rasta, Chandpole Bazar, Jaipur – 302001, Rajasthan, India</span>
                </li>
                <li className={styles.footerContactItem}>
                  <span className={styles.contactIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 8.63a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 2 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14z"></path></svg>
                  </span>
                  <div>
                    <a href="tel:+919958476169" className={styles.footerLink}>+91 99584 76169</a>
                    <br/>
                    <a href="tel:+917568811727" className={styles.footerLink}>+91 75688 11727</a>
                    <br/>
                    <a href="tel:+919314896245" className={styles.footerLink}>+91 93148 96245</a>
                  </div>
                </li>
                <li className={styles.footerContactItem}>
                  <span className={styles.contactIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </span>
                  <a href="mailto:marblehouse.270@rediffmail.com" className={styles.footerLink}>
                    marblehouse.270@rediffmail.com
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.footerBottomInner}>
            <p className={styles.copyright}>
              © {year} Moorti India. All rights reserved. Marble Home Jaipur.
            </p>
            <div className={styles.legalLinks}>
              <Link href="/privacy-policy" className={styles.legalLink}>Privacy Policy</Link>
              <Link href="/terms" className={styles.legalLink}>Terms & Conditions</Link>
              <Link href="/shipping" className={styles.legalLink}>Shipping Policy</Link>
              <Link href="/refund" className={styles.legalLink}>Returns & Refunds</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
