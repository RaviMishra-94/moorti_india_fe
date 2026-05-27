import { cookies } from 'next/headers';
import CertificateManager from './CertificateManager';
import { getCertificates } from '@/lib/api';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default async function CertificatesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  
  let certificates = [];
  try {
    certificates = await getCertificates(token);
  } catch (e) {
    console.error("Failed to load certificates", e);
  }

  return (
    <CertificateManager 
      initialCertificates={certificates} 
      token={token} 
      apiUrl={API_URL} 
    />
  );
}
