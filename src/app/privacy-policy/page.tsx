import type { Metadata } from 'next';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy — Moorti India',
  description: 'How we collect, use, and protect your personal information at Moorti India.',
};

export default function PrivacyPolicy() {
  return (
    <div className={styles.legalPage}>
      <header className={styles.header}>
        <div className="container">
          <span className={styles.lastUpdated}>Effective Date: May 2026</span>
          <h1 className="display-md">Privacy Policy</h1>
          <div className="gold-line" style={{ marginTop: 'var(--space-5)' }} />
        </div>
      </header>

      <div className="container">
        <div className={styles.content}>
          <div className={styles.section}>
            <p>
              This Privacy Policy outlines how we, as a marble moorti manufacturing company, collect, use, disclose, and protect your personal information. We are committed to ensuring the privacy and security of your data.
            </p>
          </div>

          <div className={styles.section}>
            <h2>1. Information Collected</h2>
            
            <h3>Personal Information</h3>
            <p>We may collect personal information such as your name, contact details, and address for order processing, delivery, and communication purposes.</p>

            <h3>Transaction Information</h3>
            <p>When you make a purchase, we may collect payment and transaction details. Note that we do not store sensitive financial information.</p>

            <h3>Communication Preferences</h3>
            <p>Information related to your communication preferences, such as subscribing to newsletters or updates, may be collected.</p>
          </div>

          <div className={styles.section}>
            <h2>2. Use of Information</h2>
            
            <h3>Order Processing</h3>
            <p>We use your personal information to process orders, arrange deliveries, and provide customer support.</p>

            <h3>Communication</h3>
            <p>We may use your contact information to communicate with you about your orders, promotions, and relevant updates. You can opt-out of promotional communications at any time.</p>

            <h3>Improving Services</h3>
            <p>Information may be used to enhance our products and services, including analyzing customer preferences and feedback.</p>
          </div>

          <div className={styles.section}>
            <h2>3. Data Security</h2>
            
            <h3>Securing Information</h3>
            <p>We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.</p>

            <h3>Third-Party Services</h3>
            <p>In cases where third-party services are used (e.g., payment processors), we ensure they adhere to high privacy and security standards.</p>
          </div>

          <div className={styles.section}>
            <h2>4. Sharing Information</h2>
            
            <h3>Authorized Third Parties</h3>
            <p>We may share your information with trusted third parties solely for the purpose of providing services, and we ensure they uphold privacy standards.</p>

            <h3>Legal Compliance</h3>
            <p>We may disclose information if required by law or in response to legal processes.</p>
          </div>

          <div className={styles.section}>
            <h2>5. Your Choices</h2>
            
            <h3>Access and Correction</h3>
            <p>You may request access to your personal information, and if inaccuracies are identified, corrections can be made.</p>

            <h3>Communication Preferences</h3>
            <p>You can choose to opt-out of promotional communications while continuing to receive essential transactional messages.</p>
          </div>

          <div className={styles.section}>
            <h2>6. Cookies</h2>
            <p>We may use cookies to enhance user experience and collect data on website usage. You can modify your browser settings to control cookie preferences.</p>
          </div>

          <div className={styles.section}>
            <h2>7. Contact Us</h2>
            <p>For any questions or concerns regarding this Privacy Policy, please contact us at:</p>
            <p>
              <strong>Email:</strong> <a href="mailto:marblehouse.270@rediffmail.com" style={{ color: 'var(--gold)' }}>marblehouse.270@rediffmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
