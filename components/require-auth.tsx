'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/components/providers/auth-provider';
import { UserRole } from '@/lib/api';

export function RequireAuth({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (roles && !roles.includes(user.userRole)) {
    return (
      <div className="flex min-h-[60svh] flex-col items-center justify-center gap-2 text-center">
        <h1 className="text-lg font-medium">Access denied</h1>
        <p className="text-sm text-muted-foreground">
          Your role does not have permission to view this page.
        </p>
      </div>
    );
  }

  return children;
}
