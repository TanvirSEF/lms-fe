import { BlogManageContent } from '@/components/blog/blog-manage-content';
import { RequireAuth } from '@/components/require-auth';

export default function BlogManagePage() {
  return (
    <RequireAuth roles={['admin', 'content_manager']}>
      <BlogManageContent />
    </RequireAuth>
  );
}
