'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Loader2,
  PencilLine,
  ShieldCheck,
  ShieldX,
  Users,
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
import { Progress } from '@/components/ui/progress';
import { LinkButton } from '@/components/link-button';
import { RoleChart } from '@/components/admin/role-chart';
import { useAuth } from '@/components/providers/auth-provider';
import { api } from '@/lib/api';
import { fetchStats, type AdminStats } from '@/lib/admin';
import { fetchManageCourses, type ManageCourse } from '@/lib/manage';
import { fetchMyCourses, type EnrolledCourse } from '@/lib/student';

type AccessState = 'idle' | 'checking' | 'allowed' | 'denied';

const roleHints: Record<string, string> = {
  student: 'Pick a course, enroll and start completing lessons — your progress is saved automatically.',
  instructor: 'Create courses, add lessons and build quizzes from the Manage section.',
  content_manager: 'Curate every course and publish blog posts from the sidebar.',
  admin: 'Platform overview is below. Manage user roles from the Admin panel.',
};

function AdminOverview({ stats }: { stats: AdminStats }) {
  const statCards = [
    {
      label: 'Users',
      value: stats.users.total,
      hint: `${stats.users.byRole.student} students · ${stats.users.byRole.instructor} instructors · ${stats.users.byRole.content_manager} CMs · ${stats.users.byRole.admin} admins`,
      icon: Users,
    },
    {
      label: 'Courses',
      value: stats.courses,
      hint: `${stats.lessons} lessons`,
      icon: BookOpen,
    },
    {
      label: 'Enrollments',
      value: stats.enrollments,
      hint: `${stats.quizzes} quizzes`,
      icon: GraduationCap,
    },
    {
      label: 'Blog posts',
      value: stats.posts.total,
      hint: `${stats.posts.published} published · ${stats.posts.draft} draft`,
      icon: ClipboardCheck,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
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

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Users by role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RoleChart byRole={stats.users.byRole} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">User management</CardTitle>
            <CardDescription>
              Change any user role from the Admin panel. Your own role is
              protected so an admin cannot lock themselves out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LinkButton href="/admin" variant="outline">
              Open Admin panel
            </LinkButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CourseCover({
  src,
  title,
  className,
}: {
  src: string | null | undefined;
  title: string;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={title} className={`size-full object-cover ${className ?? ''}`} />
    );
  }

  return (
    <div className={`flex size-full items-center justify-center bg-muted/40 ${className ?? ''}`}>
      <BookOpen className="size-5 text-muted-foreground/60" />
    </div>
  );
}

function StudentOverview() {
  const [courses, setCourses] = useState<EnrolledCourse[] | null>(null);

  useEffect(() => {
    fetchMyCourses()
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  if (!courses) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">No enrollments yet</CardTitle>
          <CardDescription>
            Browse the catalog and enroll in a course to start learning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LinkButton href="/courses">
            <BookOpen className="size-4" />
            Browse courses
          </LinkButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Continue learning</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map(({ course, progress }) => (
          <Link key={course.documentId} href={`/my-courses/${course.documentId}`} className="group">
            <Card className="h-full gap-0 overflow-hidden p-0 transition-colors group-hover:border-ring/50">
              <div className="aspect-[5/2] border-b">
                <CourseCover src={course.coverUrl} title={course.title} />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <p className="text-sm font-medium leading-snug">{course.title}</p>
                <Progress value={progress.percent} />
                <p className="text-xs tabular-nums text-muted-foreground">
                  {progress.completed}/{progress.total} lessons · {progress.percent}%
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ManageOverview() {
  const [courses, setCourses] = useState<ManageCourse[] | null>(null);

  useEffect(() => {
    fetchManageCourses()
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  if (!courses) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-medium">Courses</h2>
        <LinkButton href="/manage" variant="outline" size="sm">
          <PencilLine className="size-4" />
          Manage
        </LinkButton>
      </div>
      {courses.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No courses yet</CardTitle>
            <CardDescription>
              Create your first course, add lessons and build a quiz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LinkButton href="/manage">Go to manage</LinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.documentId} href="/manage" className="group">
              <Card className="h-full gap-0 overflow-hidden p-0 transition-colors group-hover:border-ring/50">
                <div className="aspect-[5/2] border-b">
                  <CourseCover src={course.coverUrl} title={course.title} />
                </div>
                <div className="flex flex-col gap-1 p-4">
                  <p className="text-sm font-medium leading-snug">{course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.lessons.length} lessons · {course.quizzes.length} quizzes
                    {course.instructor ? ` · by ${course.instructor.username}` : ''}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardContent() {
  const { user } = useAuth();
  const [access, setAccess] = useState<AccessState>('idle');
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (user?.userRole === 'admin') {
      fetchStats()
        .then(setStats)
        .catch(() => setStats(null));
    }
  }, [user]);

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
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12">
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

      {user?.userRole === 'admin' && (
        stats ? <AdminOverview stats={stats} /> : (
          <div className="flex justify-center py-10">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )
      )}

      {user?.userRole === 'student' && <StudentOverview />}

      {(user?.userRole === 'instructor' || user?.userRole === 'content_manager') && (
        <ManageOverview />
      )}

      {user?.userRole === 'student' && (
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
      )}
    </div>
  );
}
