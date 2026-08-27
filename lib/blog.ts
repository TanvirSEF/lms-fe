import { api } from '@/lib/api';

export type BlogPost = {
  documentId: string;
  title: string;
  body: string | null;
  coverUrl: string | null;
  status: 'draft' | 'published';
  createdAt: string;
  author: { username: string } | null;
};

export type BlogInput = {
  title: string;
  body?: string;
  coverUrl?: string;
  status?: 'draft' | 'published';
};

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${API_URL}/api/blogs`, { cache: 'no-store' });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json.data;
}

export async function getPublishedPost(documentId: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_URL}/api/blogs/${documentId}`, { cache: 'no-store' });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  return json.data;
}

export async function fetchManagePosts(): Promise<BlogPost[]> {
  const res = await api<{ data: BlogPost[] }>('/blogs/manage');
  return res.data;
}

export function createPost(input: BlogInput) {
  return api('/blogs', { method: 'POST', body: JSON.stringify(input) });
}

export function updatePost(documentId: string, input: BlogInput) {
  return api(`/blogs/${documentId}`, { method: 'PUT', body: JSON.stringify(input) });
}

export function deletePost(documentId: string) {
  return api(`/blogs/${documentId}`, { method: 'DELETE' });
}
