'use client';
import { useState } from 'react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
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
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/leads/enquiry` : 'http://localhost:8000/api/leads/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submission failed');
      
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Something went wrong. Please try again or contact us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className="form-group">
          <label htmlFor="contact-name" className="form-label">Full Name *</label>
          <input name="name" id="contact-name" type="text" className="form-input" placeholder="Your full name" required />
        </div>
        <div className="form-group">
          <label htmlFor="contact-email" className="form-label">Email Address *</label>
          <input name="email" id="contact-email" type="email" className="form-input" placeholder="your@email.com" required />
        </div>
      </div>
      <div className={styles.row}>
        <div className="form-group">
          <label htmlFor="contact-phone" className="form-label">Phone / WhatsApp *</label>
          <input 
            name="phone" 
            id="contact-phone" 
            type="tel" 
            className="form-input" 
            placeholder="+1 234 567 8900" 
            pattern="[0-9\s\-\+\(\)]*"
            required
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9\s\-\+\(\)]/g, '');
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-country" className="form-label">Delivery Country *</label>
          <input name="country" id="contact-country" type="text" className="form-input" placeholder="e.g. Australia, UK, UAE" required />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="contact-statue" className="form-label">Statue / Enquiry Type</label>
        <input name="statue" id="contact-statue" type="text" className="form-input" placeholder="e.g. Ganesh Ji 24 inch, Custom temple, Radha Krishna..." />
      </div>
      <div className="form-group">
        <label htmlFor="contact-message" className="form-label">Message / Requirements *</label>
        <textarea
          name="message"
          id="contact-message"
          className="form-input form-textarea"
          placeholder="Describe what you're looking for — size, finish, material preferences, special requirements, timeline..."
          rows={5}
          required
        />
      </div>
      
      {error && <div style={{ color: '#d32f2f', fontSize: '0.9rem', marginBottom: '1.25rem', padding: '0.75rem', background: '#ffebee', borderRadius: '4px', border: '1px solid #ffcdd2' }}>✕ {error}</div>}
      {success && <div style={{ color: '#2e7d32', fontSize: '0.9rem', marginBottom: '1.25rem', padding: '0.75rem', background: '#e8f5e9', borderRadius: '4px', border: '1px solid #c8e6c9', fontWeight: 500 }}>✓ Thank you for your enquiry. We will get back to you shortly.</div>}
      
      <button type="submit" className="btn btn-primary btn-lg" id="contact-submit" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
        {loading ? 'Sending...' : 'Send Enquiry'}
      </button>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '1rem' }}>
        ✦ &nbsp;We respond to all enquiries within 24 hours. For urgent requests, WhatsApp us directly.
      </p>
    </form>
  );
}
