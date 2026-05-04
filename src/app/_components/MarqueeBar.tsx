import styles from './MarqueeBar.module.css';

const items = [
  'Makrana White Marble',
  'Hand-Carved by Master Artisans',
  '40+ Years of Craftsmanship',
  'Worldwide Shipping',
  'Custom Orders Welcome',
  'Temple Grade Quality',
  'Jaipur, Rajasthan',
  'Since 1985',
  'Export Certified Packaging',
  '50+ Countries Served',
];

export default function MarqueeBar() {
  const repeated = [...items, ...items];

  return (
    <div className={styles.marqueeBar}>
      <div className={styles.marqueeTrack}>
        {repeated.map((item, i) => (
          <span key={i} className={styles.marqueeItem}>
            <span className={styles.marqueeDot}>✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
