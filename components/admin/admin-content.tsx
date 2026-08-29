'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
import { fetchUsers, setUserRole, type AdminUser } from '@/lib/admin';

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  content_manager: 'Content manager',
  instructor: 'Instructor',
  student: 'Student',
};

const roleOptions = Object.entries(roleLabels) as [UserRole, string][];

export function AdminContent() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    const usersData = await fetchUsers();
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

  if (users === null) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">User management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Change any user role — it takes effect on their next request.
        </p>
      </div>

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
