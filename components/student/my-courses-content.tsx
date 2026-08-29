'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Loader2 } from 'lucide-react';

import { Card, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { fetchMyCourses, type EnrolledCourse } from '@/lib/student';

export function MyCoursesContent() {
  const [courses, setCourses] = useState<EnrolledCourse[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyCourses()
      .then(setCourses)
      .catch((err: Error) => {
        setError(err.message);
        setCourses([]);
      });
  }, []);

  if (courses === null) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">My courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Continue where you left off.
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {courses.length === 0 ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          You are not enrolled in any course yet.{' '}
          <Link href="/courses" className="text-foreground underline">
            Browse courses
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map(({ course, progress }) => (
            <Link key={course.documentId} href={`/my-courses/${course.documentId}`} className="group">
              <Card className="h-full gap-0 overflow-hidden p-0 transition-colors group-hover:border-ring">
                <div className="aspect-[5/2] border-b">
                  {course.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.coverUrl}
                      alt={course.title}
                      className="size-full object-cover transition-transform group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-muted/40">
                      <GraduationCap className="size-6 text-muted-foreground/60" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <CardTitle className="flex items-center justify-between gap-2 text-lg">
                    {course.title}
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  </CardTitle>
                  {course.instructor && (
                    <p className="text-sm text-muted-foreground">
                      {course.instructor.username}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <Progress value={progress.percent} className="flex-1" />
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {progress.percent}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {progress.completed} of {progress.total} lessons completed
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
