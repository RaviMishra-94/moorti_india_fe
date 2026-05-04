/**
 * Server Component: fetches product data from the API (or static fallback),
 * then passes it as a prop to the interactive client component below.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found | Moorti India' };
  
  if (product.useDefaultSeo === false) {
    return {
      title: product.metaTitle || `${product.name} | Moorti India`,
      description: product.metaDescription || product.shortDesc,
    };
  }
  
  return {
    title: `${product.name} | Moorti India`,
    description: product.shortDesc,
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

  return <ProductDetailClient product={product} clientStories={clientStories} />;
}
