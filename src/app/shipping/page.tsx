import type { Metadata } from 'next';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Shipping Policy — Moorti India',
  description: 'Detailed information about domestic and international shipping of our marble statues.',
};

export default function ShippingPolicy() {
  return (
    <div className={styles.legalPage}>
      <header className={styles.header}>
        <div className="container">
          <span className={styles.lastUpdated}>Effective Date: May 2026</span>
          <h1 className="display-md">Shipping Policy</h1>
          <div className="gold-line" style={{ marginTop: 'var(--space-5)' }} />
        </div>
      </header>

      <div className="container">
        <div className={styles.content}>
          <div className={styles.section}>
            <p>
              At Moorti India (Marble Home), we are committed to providing a seamless and reliable shipping 
              experience for our customers worldwide. Each moorti is a sacred work of art, and we ensure 
              it reaches you with the utmost care.
            </p>
          </div>

          <div className={styles.section}>
            <h2>1. Shipping Duration</h2>
            <ul>
              <li><strong>Processing Time:</strong> Orders are typically processed and dispatched within 1-2 business days from the date of order placement (for ready-to-ship items).</li>
              <li><strong>Domestic (India):</strong> Estimated delivery duration is 3-7 business days.</li>
              <li><strong>International:</strong> Estimated delivery duration is 10-20 business days depending on the destination and shipping method (Air/Sea).</li>
              <li>Please note that unforeseen circumstances or external factors (customs, strikes, natural events) may occasionally cause delays.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>2. Shipping Rates</h2>
            <ul>
              <li>Shipping rates are calculated based on the weight, dimensions, and destination of your order.</li>
              <li>For custom orders or large temple moortis, we will provide a specific shipping quote during the enquiry process.</li>
              <li>Transparent shipping rates will be communicated clearly before the finalization of your purchase.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>3. Order Tracking</h2>
            <p>
              Once your order is dispatched, you will receive tracking information via email. 
              For any concerns regarding tracking or delivery, feel free to contact our customer support at <a href="mailto:marblehouse.270@rediffmail.com" style={{ color: 'var(--gold)' }}>marblehouse.270@rediffmail.com</a>.
            </p>
          </div>

          <div className={styles.section}>
            <h2>4. Packaging & Handling</h2>
            <p>
              We use export-grade, heavy-duty wooden crating for all our marble statues. 
              Each piece is cushioned with shock-absorbent materials to prevent movement and damage 
              during the long journey to its destination.
            </p>
          </div>

          <div className={styles.section}>
            <h2>5. International Shipping</h2>
            <ul>
              <li>We ship to over 50 countries including Australia, USA, Canada, UK, Singapore, and Dubai.</li>
              <li><strong>Customs & Duties:</strong> International orders may be subject to import duties and taxes, which are the responsibility of the customer. Please check with your local customs office for details.</li>
              <li>For specific international shipping inquiries, please contact us to discuss the best shipping possibilities and rates for your region.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>6. Damaged or Lost Items</h2>
            <p>
              In the rare event that your order arrives damaged or is lost in transit, please contact us 
              immediately at <a href="mailto:marblehouse.270@rediffmail.com" style={{ color: 'var(--gold)' }}>marblehouse.270@rediffmail.com</a>. 
              We will work swiftly to resolve the issue and ensure your satisfaction, including assisting with insurance claims.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
