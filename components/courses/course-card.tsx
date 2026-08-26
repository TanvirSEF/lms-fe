import Link from 'next/link';
import { ArrowUpRight, BookOpen, User } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Course } from '@/lib/courses';

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.documentId}`} className="group">
      <Card className="h-full transition-colors group-hover:border-ring">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {course.description || 'No description provided.'}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5" />
              {course.instructor?.username ?? 'Unassigned'}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              {course.lessons.length} lessons
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
