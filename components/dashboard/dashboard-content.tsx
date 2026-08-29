'use client';

import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  PenLine,
  ShieldCheck,
  ShieldX,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LinkButton } from '@/components/link-button';
import { useAuth } from '@/components/providers/auth-provider';
import { api, UserRole } from '@/lib/api';

type AccessState = 'idle' | 'checking' | 'allowed' | 'denied';

const quickLinks: Record<UserRole, { href: string; label: string; icon: typeof BookOpen }[]> = {
  student: [
    { href: '/my-courses', label: 'My courses', icon: GraduationCap },
    { href: '/courses', label: 'Browse courses', icon: BookOpen },
  ],
  instructor: [
    { href: '/manage', label: 'Manage my courses', icon: PenLine },
    { href: '/courses', label: 'Browse courses', icon: BookOpen },
  ],
  content_manager: [
    { href: '/manage', label: 'Manage courses', icon: PenLine },
    { href: '/blog/manage', label: 'Blog admin', icon: BookOpen },
  ],
  admin: [
    { href: '/admin', label: 'Admin panel', icon: LayoutDashboard },
    { href: '/manage', label: 'Manage courses', icon: PenLine },
    { href: '/blog/manage', label: 'Blog admin', icon: BookOpen },
  ],
};

export function DashboardContent() {
  const { user } = useAuth();
  const [access, setAccess] = useState<AccessState>('idle');

  async function checkAccess() {
    setAccess('checking');
    try {
      await api('/rbac-check');
      setAccess('allowed');
    } catch {
      setAccess('denied');
    }
  }

  const links = user ? quickLinks[user.userRole] : [];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium tracking-tight">
          Hello, {user?.username}
        </h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>You are logged in as</span>
          <Badge variant="outline" className="capitalize">
            {user?.userRole.replaceAll('_', ' ')}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <LinkButton
            key={link.href}
            href={link.href}
            variant="outline"
            className="h-auto w-full justify-start gap-3 px-5 py-4 text-left"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <link.icon className="size-4" />
            </span>
            <span className="flex flex-1 flex-col items-start">
              <span className="text-sm font-medium">{link.label}</span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground" />
          </LinkButton>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Access check</CardTitle>
          <CardDescription>
            Calls GET /api/rbac-check on the backend. Only instructor, content
            manager and admin roles pass — students are rejected with 403 by
            the server, not by hiding the button.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={checkAccess} disabled={access === 'checking'} className="w-fit">
            {access === 'checking' ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShieldCheck className="size-4" />
            )}
            Check my access
          </Button>
          {access === 'allowed' && (
            <p className="flex items-center gap-2 text-sm text-green-600">
              <ShieldCheck className="size-4" />
              Allowed. The backend accepted your role.
            </p>
          )}
          {access === 'denied' && (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <ShieldX className="size-4" />
              Denied. The backend returned 403 for your role.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
