/**
 * src/lib/api.ts
 * 
 * Async data helpers that fetch from the FastAPI backend when
 * NEXT_PUBLIC_API_URL is set, with graceful fallback to the local static
 * data when running without Docker.
 */

import type { Product, Category } from './types';
import {
  featuredProducts,
  categories as staticCategories,
} from './data';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ─── Internal fetch helper ────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const fetchOptions: RequestInit = {
      ...options
    };
    // Default to ISR revalidate 60 unless cache is explicitly disabled
    if (!options.cache && !options.next) {
      fetchOptions.next = { revalidate: 60 };
    }
    const res = await fetch(`${API_URL}${path}`, fetchOptions);
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─── Helper: convert snake_case API response to camelCase Product ─────────────

// The FastAPI response uses snake_case field names (SQLAlchemy convention).
// We normalise here so the frontend continues to use the existing TypeScript types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseProduct(raw: any): Product {
  return {
    id: String(raw.id),
    slug: raw.slug,
    name: raw.name,
    category: raw.category,
    categorySlug: raw.category_slug,
    image: raw.image,
    images: raw.images ?? undefined,
    godName: raw.god_name ?? undefined,
    height: raw.height ?? undefined,
    baseWidthDepth: raw.base_width_depth ?? undefined,
    weight: raw.weight ?? undefined,
    material: raw.material,
    painting: raw.painting ?? undefined,
    shippingInfo: raw.shipping_info ?? undefined,
    productCare: raw.product_care ?? undefined,
    whyChooseUs: raw.why_choose_us ?? undefined,
    description: raw.description,
    shortDesc: raw.short_desc,
    useDefaultTestimonial: raw.use_default_testimonial ?? true,
    testimonialStars: raw.testimonial_stars ?? 5,
    testimonialText: raw.testimonial_text ?? undefined,
    testimonialAuthor: raw.testimonial_author ?? undefined,
    useDefaultSeo: raw.use_default_seo ?? true,
    metaTitle: raw.meta_title ?? undefined,
    metaDescription: raw.meta_description ?? undefined,
    imageAltText: raw.image_alt_text ?? undefined,
    isFeatured: raw.is_featured ?? undefined,
    isTrending: raw.is_trending ?? undefined,
    tag: raw.tag ?? undefined,
    sizes: raw.sizes ?? undefined,
    finish: raw.finish ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseCategory(raw: any): Category {
  return {
    id: String(raw.id),
    slug: raw.slug,
    name: raw.name,
    image: raw.image,
    description: raw.description,
    count: raw.count,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface GetProductsOptions {
  featured?: boolean;
  trending?: boolean;
  categorySlug?: string;
}

export async function getProducts(opts: GetProductsOptions = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (opts.featured !== undefined) params.set('featured', String(opts.featured));
  if (opts.trending !== undefined) params.set('trending', String(opts.trending));
  if (opts.categorySlug) params.set('category_slug', opts.categorySlug);

  const query = params.toString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await apiFetch<any[]>(`/api/products${query ? `?${query}` : ''}`);

  if (data) return data.map(normaliseProduct);

  // ── Fallback to static data ──
  let products = featuredProducts;
  if (opts.featured !== undefined) products = products.filter(p => !!p.isFeatured === opts.featured);
  if (opts.trending !== undefined) products = products.filter(p => !!p.isTrending === opts.trending);
  if (opts.categorySlug) products = products.filter(p => p.categorySlug === opts.categorySlug);
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await apiFetch<any>(`/api/products/${slug}`);
  if (data) return normaliseProduct(data);

  // ── Fallback ──
  return featuredProducts.find(p => p.slug === slug) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await apiFetch<any[]>('/api/categories');
  if (data) return data.map(normaliseCategory);

  return staticCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await apiFetch<any>(`/api/categories/${slug}`);
  if (data) return normaliseCategory(data);

  return staticCategories.find(c => c.slug === slug) ?? null;
}

export async function getClientStories(): Promise<any[]> {
  // Use no-store to ensure new testimonials added in admin are visible immediately
  const data = await apiFetch<any[]>('/api/client-stories', { cache: 'no-store' });
  if (data) return data;
  return [];
}
