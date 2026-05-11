export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  image: string;
  images?: string[];
  
  // New "Idol Details" properties
  godName?: string;
  height?: string;
  baseWidthDepth?: string;
  weight?: string;
  material: string;
  painting?: string;

  // Shipping & Tabbing fields
  shippingInfo?: string;
  productCare?: string;
  whyChooseUs?: string;

  description: string;
  shortDesc: string;
  keyFeatures?: string[];
  
  // Review / Testimonial
  useDefaultTestimonial?: boolean;
  testimonialStars?: number;
  testimonialText?: string;
  testimonialAuthor?: string;

  // SEO
  useDefaultSeo?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  imageAltText?: string;

  sizes?: string[]; // Kept for legacy/variation
  finish?: string; // e.g. Smooth / Polished
  color?: string; // e.g. Natural White
  isFeatured?: boolean;
  isTrending?: boolean;
  tag?: string; // legacy
  tags?: string[]; // e.g. Best seller, Premium, New
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  image: string;
  description: string;
  count: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  country: string;
  statue: string;
  rating: number;
  text: string;
  date: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}
