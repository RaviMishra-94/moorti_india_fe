'use client';

import { useState } from 'react';
import styles from './ContactCTA.module.css';

export default function ContactCTA() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      country: formData.get('country'),
      statue: formData.get('statue') || null,
      message: formData.get('message'),
    };

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/leads/enquiry`
          : 'http://localhost:8000/api/leads/enquiry',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Submission failed');

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError('Something went wrong. Please try again or contact us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`texture-section ${styles.section}`} id="contact-cta">
      <div className={styles.bg} />
      <div className="texture-overlay texture-greek-fresco" />
      <div className="texture-vignette" />

      <div className={`container texture-content ${styles.content}`}>
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
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="cta-name" className="form-label">Full Name *</label>
                <input name="name" id="cta-name" type="text" className="form-input" placeholder="Your full name" required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="cta-email" className="form-label">Email Address *</label>
                <input name="email" id="cta-email" type="email" className="form-input" placeholder="your@email.com" required />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="cta-phone" className="form-label">Phone / WhatsApp *</label>
                <input
                  name="phone"
                  id="cta-phone"
                  type="tel"
                  className="form-input"
                  placeholder="+91 99584 76169"
                  pattern="[0-9\s\-\+\(\)]*"
                  required
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9\s\-\+\(\)]/g, '');
                  }}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="cta-country" className="form-label">Delivery Country *</label>
                <input name="country" id="cta-country" type="text" className="form-input" placeholder="e.g. Australia, UAE, UK" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cta-statue" className="form-label">Statue / Enquiry Type</label>
              <input name="statue" id="cta-statue" type="text" className="form-input" placeholder="e.g. Ganesh Ji 24 inch, Custom temple, Radha Krishna..." />
            </div>
            <div className="form-group">
              <label htmlFor="cta-message" className="form-label">Message / Requirements *</label>
              <textarea
                name="message"
                id="cta-message"
                className="form-input form-textarea"
                placeholder="Describe what you're looking for — size, finish, material preferences, special requirements, timeline..."
                rows={4}
                required
              />
            </div>

            {error && (
              <div style={{ color: '#d32f2f', fontSize: '0.9rem', marginBottom: '1.25rem', padding: '0.75rem', background: '#ffebee', borderRadius: '4px', border: '1px solid #ffcdd2' }}>
                ✕ {error}
              </div>
            )}
            {success && (
              <div style={{ color: '#2e7d32', fontSize: '0.9rem', marginBottom: '1.25rem', padding: '0.75rem', background: '#e8f5e9', borderRadius: '4px', border: '1px solid #c8e6c9', fontWeight: 500 }}>
                ✓ Thank you for your enquiry. We will get back to you shortly.
              </div>
            )}

            <div className={styles.formFooter}>
              <button type="submit" className="btn btn-primary btn-lg" id="cta-submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Enquiry'}
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
