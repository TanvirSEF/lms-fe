import { RequireAuth } from '@/components/require-auth';
import { QuizContent } from '@/components/student/quiz-content';

export default async function QuizPage({
  params,
}: {
  params: Promise<{ documentId: string; quizDocumentId: string }>;
}) {
  const { documentId, quizDocumentId } = await params;

  return (
    <RequireAuth roles={['student']}>
      <QuizContent courseDocumentId={documentId} quizDocumentId={quizDocumentId} />
    </RequireAuth>
  );
}
