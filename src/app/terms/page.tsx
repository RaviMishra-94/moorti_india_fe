import type { Metadata } from 'next';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Moorti India',
  description: 'The business relationship and terms between Moorti India and its customers.',
};

export default function TermsConditions() {
  return (
    <div className={styles.legalPage}>
      <header className={styles.header}>
        <div className="container">
          <span className={styles.lastUpdated}>Effective Date: May 2026</span>
          <h1 className="display-md">Terms & Conditions</h1>
          <div className="gold-line" style={{ marginTop: 'var(--space-5)' }} />
        </div>
      </header>

      <div className="container">
        <div className={styles.content}>
          <div className={styles.section}>
            <p>
              These terms and conditions detail the business relationship between Moorti India (Marble Home) 
              and our valued customers. By placing an order with us, you agree to these terms.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Order Placement</h2>
            <ul>
              <li>Customers must provide accurate and complete information when placing an order for marble moortis.</li>
              <li>The order details, including design specifications, size, and quantity, must be clearly communicated.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Payment Terms</h2>
            <ul>
              <li>A specified percentage or full payment is required upon placing an order.</li>
              <li>Payment methods, including bank transfers or other accepted forms, will be provided during the order process.</li>
              <li>Any outstanding balances must be settled before the delivery of the marble moortis.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Design Approval</h2>
            <ul>
              <li>Customers must review and approve the final design, dimensions, and other specifications before production begins.</li>
              <li>Once approved, changes may not be possible, and any alterations may incur additional charges.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Production and Delivery</h2>
            <ul>
              <li>The manufacturing timeframe will be communicated to the customer, taking into account the complexity and size of the moorti.</li>
              <li>Delivery charges, shipping methods, and estimated delivery times will be clearly specified.</li>
              <li>The risk of damage during transportation will be outlined, and insurance options may be offered.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Quality Assurance</h2>
            <ul>
              <li>The manufacturer guarantees the quality of materials and workmanship used in the production of marble moortis.</li>
              <li>Customers should inspect the product upon delivery, and any defects or damages must be reported within a specified timeframe.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Intellectual Property</h2>
            <ul>
              <li>The manufacturer retains the intellectual property rights to the design and production processes.</li>
              <li>Customers may not reproduce or use the design for commercial purposes without explicit permission.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Force Majeure</h2>
            <p>
              The manufacturer is not liable for delays or failures in performance due to unforeseen circumstances 
              such as natural disasters, strikes, or other events beyond their control.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Dispute Resolution</h2>
            <p>
              Any disputes arising from the agreement will be resolved through negotiation and, if necessary, 
              legal action in accordance with local laws in Jaipur, Rajasthan, India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
