import { notFound } from 'next/navigation';
import { BookOpen, User } from 'lucide-react';

import { EnrollSection } from '@/components/courses/enroll-section';
import { LessonList } from '@/components/courses/lesson-list';
import { getCourse } from '@/lib/courses';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const course = await getCourse(documentId);

  if (!course) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-medium tracking-tight">{course.title}</h1>
      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <User className="size-4" />
          {course.instructor?.username ?? 'Unassigned'}
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen className="size-4" />
          {course.lessons.length} lessons
        </span>
      </div>
      {course.description && (
        <p className="mt-6 leading-relaxed text-muted-foreground">{course.description}</p>
      )}
      <EnrollSection courseDocumentId={course.documentId} />
      <h2 className="mb-3 mt-10 font-medium">Lessons</h2>
      <LessonList lessons={course.lessons} />
    </div>
  );
}
