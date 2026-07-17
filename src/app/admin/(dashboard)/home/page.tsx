import { cookies } from 'next/headers';
import HomeHeroManager from './HomeHeroManager';
import { fetchSiteSettings } from '@/lib/api';
import type { SiteSettings } from '@/lib/types';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default async function HomeHeroPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';

  let settings: SiteSettings | null = null;
  try {
    settings = await fetchSiteSettings();
  } catch (e) {
    console.error('Failed to load site settings', e);
  }

  return <HomeHeroManager initialSettings={settings} token={token} apiUrl={API_URL} />;
}
