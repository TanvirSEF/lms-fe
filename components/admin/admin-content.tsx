'use client';

import { useCallback, useEffect, useState } from 'react';
import { BookOpen, ClipboardCheck, GraduationCap, Loader2, Users } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/components/providers/auth-provider';
import { UserRole } from '@/lib/api';
import { fetchStats, fetchUsers, setUserRole, type AdminStats, type AdminUser } from '@/lib/admin';

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  content_manager: 'Content manager',
  instructor: 'Instructor',
  student: 'Student',
};

const roleOptions = Object.entries(roleLabels) as [UserRole, string][];

export function AdminContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    const [statsData, usersData] = await Promise.all([fetchStats(), fetchUsers()]);
    setStats(statsData);
    setUsers(usersData);
  }, []);

  useEffect(() => {
    reload().catch((err: Error) => setError(err.message));
  }, [reload]);

  async function handleRoleChange(target: AdminUser, userRole: UserRole) {
    setError('');

    try {
      await setUserRole(target.documentId, userRole);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (stats === null || users === null) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statCards = [
    { label: 'Users', value: stats.users.total, hint: `${stats.users.byRole.student} students · ${stats.users.byRole.instructor} instructors · ${stats.users.byRole.content_manager} CMs · ${stats.users.byRole.admin} admins`, icon: Users },
    { label: 'Courses', value: stats.courses, hint: `${stats.lessons} lessons`, icon: BookOpen },
    { label: 'Enrollments', value: stats.enrollments, hint: `${stats.quizzes} quizzes`, icon: GraduationCap },
    { label: 'Blog posts', value: stats.posts.total, hint: `${stats.posts.published} published · ${stats.posts.draft} draft`, icon: ClipboardCheck },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">Admin panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform overview and user role management.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <card.icon className="size-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-medium tabular-nums">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 mt-10 font-medium">Users</h2>
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[180px]">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((row) => {
              const isSelf = user?.id === row.id;

              return (
                <TableRow key={row.documentId}>
                  <TableCell className="font-medium">
                    {row.username}
                    {isSelf && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {isSelf ? (
                      <span className="text-sm text-muted-foreground">
                        {roleLabels[row.userRole]}
                      </span>
                    ) : (
                      <Select
                        value={row.userRole}
                        onValueChange={(value) => handleRoleChange(row, value as UserRole)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
