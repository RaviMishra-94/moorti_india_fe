'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function deleteClientStoryAction(id: number) {
  const res = await fetch(`${API_URL}/api/client-stories/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete: ${res.status} ${text}`);
  }
  
  revalidatePath('/admin/client-stories');
}

export async function reorderClientStoriesAction(payload: { id: number, display_order: number }[]) {
  const res = await fetch(`${API_URL}/api/client-stories/reorder`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    throw new Error('Failed to save order');
  }
  
  revalidatePath('/admin/client-stories');
}

export async function saveClientStoryAction(data: any, id?: number) {
  const url = id ? `${API_URL}/api/client-stories/${id}` : `${API_URL}/api/client-stories`;
  const method = id ? 'PATCH' : 'POST';
  
  const res = await fetch(url, {
    method,
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to save');
  }
  
  revalidatePath('/admin/client-stories');
  return res.json();
}
