import { RequireAuth } from '@/components/require-auth';
import { MyCoursesContent } from '@/components/student/my-courses-content';

export default function MyCoursesPage() {
  return (
    <RequireAuth roles={['student']}>
      <MyCoursesContent />
    </RequireAuth>
  );
}
