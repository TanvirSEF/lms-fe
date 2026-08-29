import { RequireAuth } from '@/components/require-auth';
import { PlayerContent } from '@/components/student/player-content';

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;

  return (
    <RequireAuth roles={['student']}>
      <PlayerContent courseDocumentId={documentId} />
    </RequireAuth>
  );
}
