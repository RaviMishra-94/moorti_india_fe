/**
 * Server Component: fetches product data from the API (or static fallback),
 * then passes it as a prop to the interactive client component below.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';
import Script from 'next/script';

const BASE_URL = 'https://moortiindia.com.au';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  
  const title = product.metaTitle || `${product.name} — Handcrafted Marble Statue`;
  const description = product.metaDescription || product.shortDesc || `Buy ${product.name} handcrafted from premium Makrana marble in Jaipur. Custom sizes available. Worldwide shipping.`;
  const imageUrl = product.image?.startsWith('http') ? product.image : `${BASE_URL}${product.image}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/products/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/products/${slug}`,
      type: 'website',
      images: product.image ? [{ url: imageUrl, width: 800, height: 800, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }
  
  const { getClientStories } = await import('@/lib/api');
  const clientStories = await getClientStories();

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDesc,
    image: product.images?.length ? product.images : (product.image ? [product.image] : []),
    brand: {
      '@type': 'Brand',
      name: 'Moorti India',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Moorti India',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jaipur',
        addressRegion: 'Rajasthan',
        addressCountry: 'IN',
      },
    },
    material: product.material || 'Makrana Marble',
    category: product.category,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'INR',
      seller: {
        '@type': 'Organization',
        name: 'Moorti India',
      },
    },
  };

  return (
    <>
      <Script
        id={`schema-product-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} clientStories={clientStories} />
    </>
  );
}
