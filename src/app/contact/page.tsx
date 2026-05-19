import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '../_components/ContactForm';
import styles from './page.module.css';
import { socialLinks } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contact Us — Moorti India',
  description:
    'Get in touch with Moorti India for custom marble statue enquiries, pricing, and worldwide shipping. WhatsApp, email, or fill our enquiry form.',
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/images/hero_contact.webp"
            alt="Timeless artisan wooden correspondence desk in Jaipur marble workshop"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 80%' }}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <span className="label-sm section-label">Get In Touch</span>
          <div className="gold-line" style={{ marginTop: 'var(--space-3)' }} />
          <h1 className="display-md" style={{ marginTop: 'var(--space-5)' }}>
            Let&apos;s create something <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>beautiful</em>
          </h1>
          <p className={styles.headerDesc} style={{ color: 'var(--text-secondary)' }}>
            Whether you have a specific vision or need guidance — our team is here to help you 
            find or create the perfect marble sculpture.
          </p>
        </div>
      </div>

      <section className="texture-section section">
        <div className="texture-overlay texture-correspondence" />
        <div className="texture-vignette" />

        <div className="container texture-content">
          <div className={styles.layout}>

            {/* Form */}
            <div className={styles.formCol}>
              <h2 className="heading-lg" style={{ marginBottom: 'var(--space-6)' }}>Send us an Enquiry</h2>
              <ContactForm />
            </div>

            {/* Info */}
            <div className={styles.infoCol}>
              <div className={styles.infoCard}>
                <h3 className="heading-md" style={{ marginBottom: 'var(--space-6)', color: 'var(--text-primary)' }}>
                  Contact Information
                </h3>

                <div className={styles.contactBlock}>
                  <div className={styles.contactIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <div className={styles.contactLabel}>Workshop Address</div>
                    <div className={styles.contactValue}>
                      2169, Khejdo Ka Rasta, 2nd Cross,<br />
                      Chandpole Bazar, Jaipur – 302001,<br />
                      Rajasthan, India
                    </div>
                  </div>
                </div>

                <div className={styles.contactBlock}>
                  <div className={styles.contactIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 8.63a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 2 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14z"></path></svg>
                  </div>
                  <div>
                    <div className={styles.contactLabel}>Phone / WhatsApp</div>
                    <a href="tel:+919958476169" className={styles.contactValue} style={{ display: 'block' }}>+91 99584 76169</a>
                    <a href="tel:+917568811727" className={styles.contactValue} style={{ display: 'block' }}>+91 75688 11727</a>
                    <a href="tel:+919314896245" className={styles.contactValue} style={{ display: 'block' }}>+91 93148 96245</a>
                  </div>
                </div>

                <div className={styles.contactBlock}>
                  <div className={styles.contactIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <div className={styles.contactLabel}>Email</div>
                    <a href="mailto:marblehouse.270@rediffmail.com" className={styles.contactValue}>
                      marblehouse.270@rediffmail.com
                    </a>
                  </div>
                </div>

                <div className={styles.contactBlock}>
                  <div className={styles.contactIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div>
                    <div className={styles.contactLabel}>Response Time</div>
                    <div className={styles.contactValue}>Within 24 hours (Mon – Sat)</div>
                  </div>
                </div>

                <a
                  href={`${socialLinks.whatsapp}?text=Hi, I'd like to enquire about a marble statue.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-primary ${styles.whatsappBtn}`}
                  id="contact-whatsapp"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.49z"/></svg>
                  Chat on WhatsApp
                </a>
              </div>

              <div className={styles.shippingCard}>
                <h4 style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'var(--space-4)' }}>
                  Shipping Destinations
                </h4>
                <div className={styles.countries}>
                  {['🇦🇺 Australia', '🇬🇧 United Kingdom', '🇺🇸 United States', '🇨🇦 Canada', '🇦🇪 UAE', '🇸🇬 Singapore', '🇲🇺 Mauritius', '🇮🇳 India', '+40 more countries'].map((c) => (
                    <span key={c} className={styles.countryChip}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
