import { AdminContent } from '@/components/admin/admin-content';
import { RequireAuth } from '@/components/require-auth';

export default function AdminPage() {
  return (
    <RequireAuth roles={['admin']}>
      <AdminContent />
    </RequireAuth>
  );
}
