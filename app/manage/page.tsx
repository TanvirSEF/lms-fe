import { ManageContent } from '@/components/manage/manage-content';
import { RequireAuth } from '@/components/require-auth';

export default function ManagePage() {
  return (
    <RequireAuth roles={['admin', 'content_manager', 'instructor']}>
      <ManageContent />
    </RequireAuth>
  );
}
