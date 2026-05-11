'use client';

import Link from 'next/link';
import styles from './ContactCTA.module.css';

export default function ContactCTA() {
  return (
    <section className={styles.section} id="contact-cta">
      <div className={styles.bg} />
      <div className={`container ${styles.content}`}>
        <div className={styles.inner}>
          <span className="label-sm section-label">Commission a Masterpiece</span>
          <div className="gold-line gold-line-center" style={{ marginTop: 'var(--space-3)' }} />
          <h2 className="display-md" style={{ marginTop: 'var(--space-5)' }}>
            Your vision. <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Our craft.</em>
          </h2>
          <p className={styles.subtitle}>
            Whether you need a beloved deity for your home temple, a grand installation for a religious 
            institution, or a custom memorial sculpture — we bring your vision to life in timeless marble.
          </p>

          {/* Form */}
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="cta-name" className="form-label">Your Name</label>
                <input id="cta-name" type="text" className="form-input" placeholder="e.g. Rajesh Patel" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="cta-email" className="form-label">Email Address</label>
                <input id="cta-email" type="email" className="form-input" placeholder="your@email.com" />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="cta-statue" className="form-label">Statue / Sculpture Type</label>
                <input id="cta-statue" type="text" className="form-input" placeholder="e.g. Radha Krishna, 24 inch" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="cta-country" className="form-label">Delivery Country</label>
                <input id="cta-country" type="text" className="form-input" placeholder="e.g. Australia, UAE, UK" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cta-message" className="form-label">Your Requirements</label>
              <textarea
                id="cta-message"
                className="form-input form-textarea"
                placeholder="Tell us about the statue, size, finish, any custom requirements..."
                rows={4}
              />
            </div>
            <div className={styles.formFooter}>
              <button type="submit" className="btn btn-primary btn-lg" id="cta-submit">
                Send Enquiry
              </button>
              <div className={styles.formNote}>
                <span>✦</span>
                <span>We typically respond within 24 hours.<br />WhatsApp: <a href="https://wa.me/919958476169" style={{ color: 'var(--gold)' }}>+91 99584 76169</a></span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
