import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts, getCategoryBySlug } from '@/lib/api';
import styles from './page.module.css';

interface Props {
  params: Promise<{ category: string }>;
}

const BASE_URL = 'https://www.moortiindia.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  const title = cat ? `${cat.name} Marble Statues — Handcrafted in Jaipur` : 'Collection — Moorti India';
  const description = cat?.description ?? `Shop our collection of handcrafted ${category} marble statues from Jaipur. Premium Makrana marble, custom sizes, worldwide shipping.`;
  const imageUrl = cat?.image ? (cat.image.startsWith('http') ? cat.image : `${BASE_URL}${cat.image}`) : `${BASE_URL}/images/og-image.jpg`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/collections/${category}` },
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
      url: `${BASE_URL}/collections/${category}`,
    },
  };
}

import { redirect } from 'next/navigation';

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const [cat, products] = await Promise.all([
    getCategoryBySlug(category),
    getProducts({ categorySlug: category }),
  ]);

  // If there are zero products, redirect to the all products (collections) page
  if (products.length === 0) {
    redirect('/products');
  }

  // If there is only a single product in this category, we directly open that product's page.
  // This satisfies the client requirement to skip the collection page when there's only 1 item.
  // The original rendering code below is preserved for categories with >1 products.
  if (products.length === 1) {
    redirect(`/products/${products[0].slug}`);
  }

  return (
    <div className={`texture-section ${styles.page}`}>
      <div className="texture-overlay texture-greek-fresco" />
      <div className="texture-vignette" />

      <div className="texture-content">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <div className="container">
            <span className={styles.breadcrumbInner}>
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/collections">Collections</Link>
              <span>/</span>
              <span>{cat?.name ?? category}</span>
            </span>
          </div>
        </div>

        {/* Category Hero */}
        <div className={styles.catHero}>
          <div className={styles.catHeroBg}>
            <Image
              src={cat?.image ?? '/images/hero_ganesh.webp'}
              alt={cat?.name ?? category}
              fill
              priority
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
            />
            <div className={styles.catHeroOverlay} />
          </div>
          <div className={`container ${styles.catHeroContent}`}>
            <span className="label-sm section-label">{cat?.count ?? '—'} Pieces Available</span>
            <h1 className="display-md" style={{ marginTop: 'var(--space-3)' }}>{cat?.name ?? category}</h1>
            <p className={styles.catDesc}>{cat?.description}</p>
          </div>
        </div>

        {/* Products */}
        <section className="section">
          <div className="container">
            <div className={styles.grid}>
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className={styles.card}
                  id={`cat-product-${product.slug}`}
                >
                  <div className={styles.cardImg}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                      className={styles.productImg}
                    />
                    {product.tag && <div className={styles.tag}>{product.tag}</div>}
                  </div>
                  <div className={styles.cardInfo}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--gold-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{product.material}</span>
                    <h2 className={styles.productName}>{product.name}</h2>
                    <p className={styles.productDesc}>{product.shortDesc}</p>
                    <div className={styles.sizes}>
                      {product.sizes && product.sizes.slice(0, 3).map((s) => (
                        <span key={s} className={styles.sizeChip}>{s}</span>
                      ))}
                      {product.sizes && product.sizes.length > 3 && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>+{product.sizes.length - 3} more</span>}
                    </div>
                    <div className={styles.enquireRow}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>Price on enquiry</span>
                      <span className={styles.enquireBtn}>View Details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
              <Link href="/contact" className="btn btn-outline btn-lg" id="category-custom-order">
                Request Custom Size / Design
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
