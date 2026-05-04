'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function deleteProductAction(slug: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  
  await fetch(`${API_URL}/api/products/${slug}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  
  revalidatePath('/admin/products');
}

export async function revalidateProduct(slug: string) {
  revalidatePath('/admin/products');
  revalidatePath('/');
  revalidatePath(`/products/${slug}`);
  revalidatePath('/products');
}
