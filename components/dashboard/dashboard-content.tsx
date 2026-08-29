'use client';

import { useState } from 'react';
import { Loader2, ShieldCheck, ShieldX } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/components/providers/auth-provider';
import { api } from '@/lib/api';

type AccessState = 'idle' | 'checking' | 'allowed' | 'denied';

const roleHints: Record<string, string> = {
  student: 'Pick a course, enroll and start completing lessons — your progress is saved automatically.',
  instructor: 'Create courses, add lessons and build quizzes from the Manage section.',
  content_manager: 'Curate every course and publish blog posts from the sidebar.',
  admin: 'Oversee the platform from the Admin panel and assign user roles.',
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

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium tracking-tight">Hello, {user?.username}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Logged in as</span>
          <Badge variant="outline" className="capitalize">
            {user?.userRole.replaceAll('_', ' ')}
          </Badge>
        </div>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {user ? roleHints[user.userRole] : ''}
        </p>
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
