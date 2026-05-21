import type { Metadata } from 'next';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Refund Policy — Moorti India',
  description: 'Our return and refund policy for marble statues and handicrafts.',
};

export default function RefundPolicy() {
  return (
    <div className={styles.legalPage}>
      <header className={styles.header}>
        <div className="container">
          <span className={styles.lastUpdated}>Effective Date: May 2026</span>
          <h1 className="display-md">Return & Refund Policy</h1>
          <div className="gold-line" style={{ marginTop: 'var(--space-5)' }} />
        </div>
      </header>

      <div className="container">
        <div className={styles.content}>
          <div className={styles.section}>
            <p>
              At Moorti India, we take immense pride in the craftsmanship of our marble moortis. 
              As our products are often custom-made or involve significant artisan labor, 
              we have established the following policy regarding returns and refunds.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Return Eligibility</h2>
            <ul>
              <li>Returns are accepted only for items that arrive damaged or significantly different from the approved design.</li>
              <li>Requests for returns must be initiated within 48 hours of delivery.</li>
              <li>The moorti must be in its original packaging for the return to be processed.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Non-Returnable Items</h2>
            <ul>
              <li>Custom-designed moortis or those made to specific measurements provided by the customer cannot be returned once production has commenced.</li>
              <li>Minor variations in natural marble color, veining, or hand-carved details are part of the artistic nature of the product and do not qualify for returns.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Damage in Transit</h2>
            <p>
              While we take extreme care in packaging using export-grade crating, damages can occur during international transit. 
              If your item arrives damaged:
            </p>
            <ul>
              <li>Take clear photographs of the damaged packaging and the moorti itself immediately upon unboxing.</li>
              <li>Email the photos and your order details to <a href="mailto:sales@moortiindia.com" style={{ color: 'var(--gold)' }}>sales@moortiindia.com</a> within 48 hours.</li>
              <li>We will work with the shipping insurance provider and our artisans to arrange for a replacement or repair.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Refund Process</h2>
            <ul>
              <li>Refunds are only issued if a replacement cannot be provided for a damaged item.</li>
              <li>Once a refund is approved, it will be processed through the original payment method within 7-10 business days.</li>
              <li>Shipping costs and custom duties paid are non-refundable.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Cancellation</h2>
            <ul>
              <li>Orders cancelled before production begins may be eligible for a full refund minus a processing fee.</li>
              <li>Orders cancelled after production has started will incur a cancellation fee based on the stage of work completed.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
