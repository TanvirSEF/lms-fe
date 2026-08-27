import { api, UserRole } from '@/lib/api';

export type AdminStats = {
  users: {
    total: number;
    byRole: Record<UserRole, number>;
  };
  courses: number;
  lessons: number;
  quizzes: number;
  enrollments: number;
  posts: { total: number; published: number; draft: number };
};

export type AdminUser = {
  documentId: string;
  id: number;
  username: string;
  email: string;
  userRole: UserRole;
  createdAt: string;
};

export async function fetchStats(): Promise<AdminStats> {
  const res = await api<{ data: AdminStats }>('/admin/stats');
  return res.data;
}

export async function fetchUsers(): Promise<AdminUser[]> {
  const res = await api<{ data: AdminUser[] }>('/admin/users');
  return res.data;
}

export function setUserRole(documentId: string, userRole: UserRole) {
  return api(`/admin/users/${documentId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ userRole }),
  });
}
