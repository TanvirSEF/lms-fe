import { CourseCard } from '@/components/courses/course-card';
import { getCourses } from '@/lib/courses';

export const metadata = { title: 'Courses' };

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse available courses and enroll to start learning.
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          No courses have been created yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.documentId} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
