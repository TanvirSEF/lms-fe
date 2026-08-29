import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import type { Course } from '@/lib/courses';

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export function CourseCard({ course }: { course: Course }) {
  const instructor = course.instructor?.username;

  return (
    <Link href={`/courses/${course.documentId}`} className="group">
      <Card className="h-full gap-0 overflow-hidden p-0 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
        {course.coverUrl ? (
          <div className="aspect-[5/2] overflow-hidden border-b">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.coverUrl}
              alt=""
              className="size-full object-cover transition-transform group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="flex aspect-[5/2] items-center justify-center border-b bg-muted/40">
            <BookOpen className="size-7 text-muted-foreground/60" />
          </div>
        )}

        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">{course.title}</CardTitle>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
            {course.description || 'No description yet.'}
          </p>

          <div className="mt-1 flex items-center justify-between border-t pt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                {instructor ? initials(instructor) : '—'}
              </span>
              {instructor ?? 'Unassigned'}
            </span>
            <span className="tabular-nums">{course.lessons.length} lessons</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
