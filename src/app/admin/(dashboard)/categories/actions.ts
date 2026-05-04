'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function deleteCategoryAction(slug: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  
  const res = await fetch(`${API_URL}/api/categories/${slug}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Failed to delete category');
  
  revalidatePath('/admin/categories');
}
