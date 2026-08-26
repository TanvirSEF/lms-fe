import type { Lesson } from '@/lib/courses';

export function LessonList({ lessons }: { lessons: Lesson[] }) {
  if (lessons.length === 0) {
    return <p className="text-sm text-muted-foreground">No lessons yet.</p>;
  }

  return (
    <ol className="flex flex-col divide-y rounded-lg border">
      {lessons.map((lesson) => (
        <li
          key={lesson.documentId}
          className="flex items-center gap-3 px-4 py-3 text-sm"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs">
            {lesson.order}
          </span>
          {lesson.title}
        </li>
      ))}
    </ol>
  );
}
