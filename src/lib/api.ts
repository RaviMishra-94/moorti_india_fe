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

// ─── Shared Upload Helper ───────────────────────────────────────────────────

export async function apiUpload(url: string, body: FormData, token: string) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  if (!res.ok) {
    if (res.status === 413) {
      throw new Error('File is too large. Please upload a file smaller than 10MB.');
    }
    const msg = await res.text();
    throw new Error(msg);
  }
  return res.json();
}

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
    keyFeatures: raw.key_features ?? undefined,
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
  searchQuery?: string;
}

export async function getProducts(opts: GetProductsOptions = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (opts.featured !== undefined) params.set('featured', String(opts.featured));
  if (opts.trending !== undefined) params.set('trending', String(opts.trending));
  if (opts.categorySlug) params.set('category_slug', opts.categorySlug);
  if (opts.searchQuery) params.set('search', opts.searchQuery);

  const query = params.toString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await apiFetch<any[]>(`/api/products${query ? `?${query}` : ''}`);

  if (data) return data.map(normaliseProduct);

  // ── Fallback to static data ──
  let products = featuredProducts;
  if (opts.featured !== undefined) products = products.filter(p => !!p.isFeatured === opts.featured);
  if (opts.trending !== undefined) products = products.filter(p => !!p.isTrending === opts.trending);
  if (opts.categorySlug) products = products.filter(p => p.categorySlug === opts.categorySlug);
  if (opts.searchQuery) {
    const q = opts.searchQuery.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      (p.godName && p.godName.toLowerCase().includes(q)) || 
      p.shortDesc.toLowerCase().includes(q)
    );
  }
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

// ─── Site Settings APIs ─────────────────────────────────────────────────────

import { SiteSettings } from './types';

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    const res = await fetch(`${API_URL}/api/settings/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return mapSiteSettings(data);
  } catch {
    return null;
  }
}

export interface SiteSettingsUpdate {
  certificate_url?: string;
  hero_image_url?: string;
  hero_image_mobile_url?: string;
  hero_title_line1?: string;
  hero_title_line2?: string;
  hero_tagline?: string;
  hero_description?: string;
}

export async function updateSiteSettings(data: SiteSettingsUpdate, token: string): Promise<SiteSettings> {
  const res = await fetch(`${API_URL}/api/settings/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update site settings');
  const responseData = await res.json();
  return mapSiteSettings(responseData);
}

// Normalise the snake_case API payload into the camelCase SiteSettings type.
function mapSiteSettings(data: Record<string, unknown>): SiteSettings {
  return {
    id: data.id as number,
    certificateUrl: (data.certificate_url as string) ?? undefined,
    heroImageUrl: (data.hero_image_url as string) ?? undefined,
    heroImageMobileUrl: (data.hero_image_mobile_url as string) ?? undefined,
    heroTitleLine1: (data.hero_title_line1 as string) ?? undefined,
    heroTitleLine2: (data.hero_title_line2 as string) ?? undefined,
    heroTagline: (data.hero_tagline as string) ?? undefined,
    heroDescription: (data.hero_description as string) ?? undefined,
  };
}

// ─── Certificates ────────────────────────────────────────────────────────────

export interface Certificate {
  id: number;
  name: string | null;
  file_url: string;
  is_active: boolean;
  display_order: number;
}

export async function getCertificates(token: string): Promise<Certificate[]> {
  const res = await fetch(`${API_URL}/api/certificates/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch certificates');
  return res.json();
}

export async function getActiveCertificates(): Promise<Certificate[]> {
  try {
    const res = await fetch(`${API_URL}/api/certificates/active`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function createCertificate(data: { name: string, file_url: string, is_active: boolean }, token: string): Promise<Certificate> {
  const res = await fetch(`${API_URL}/api/certificates/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create certificate');
  return res.json();
}

export async function updateCertificate(id: number, data: any, token: string): Promise<Certificate> {
  const res = await fetch(`${API_URL}/api/certificates/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update certificate');
  return res.json();
}

export async function deleteCertificate(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/certificates/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete certificate');
}
