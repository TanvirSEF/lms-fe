const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export type UserRole = 'admin' | 'content_manager' | 'instructor' | 'student';

export type User = {
  id: number;
  username: string;
  email: string;
  userRole: UserRole;
};

type AuthResponse = {
  jwt: string;
  user: User;
};

type ApiError = {
  error?: { message?: string };
};

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api${path}`, { ...options, headers });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(data?.error?.message || `Request failed with status ${res.status}`);
  }

  return (await res.json()) as T;
}

export function login(identifier: string, password: string) {
  return api<AuthResponse>('/auth/local', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

export function register(username: string, email: string, password: string) {
  return api<AuthResponse>('/auth/local/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

export function me() {
  return api<User>('/users/me');
}
