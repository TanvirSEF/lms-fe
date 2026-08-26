'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/link-button';
import { useAuth } from '@/components/providers/auth-provider';
import { enroll, fetchMyCourses } from '@/lib/student';

export function EnrollSection({ courseDocumentId }: { courseDocumentId: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enrolledIds, setEnrolledIds] = useState<string[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.userRole === 'student') {
      fetchMyCourses()
        .then((items) => setEnrolledIds(items.map((item) => item.course.documentId)))
        .catch(() => setEnrolledIds([]));
    }
  }, [user]);

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">
          Log in as a student to enroll in this course.
        </p>
        <LinkButton href="/login" size="sm">
          Log in
        </LinkButton>
      </div>
    );
  }

  if (user.userRole !== 'student' || enrolledIds === null) {
    return null;
  }

  if (enrolledIds.includes(courseDocumentId)) {
    return (
      <div className="mt-8">
        <LinkButton href={`/my-courses/${courseDocumentId}`} size="lg">
          <CheckCircle2 className="size-4" />
          Enrolled — continue learning
          <ArrowRight className="size-4" />
        </LinkButton>
      </div>
    );
  }

  async function handleEnroll() {
    setSubmitting(true);
    setError('');

    try {
      await enroll(courseDocumentId);
      router.push(`/my-courses/${courseDocumentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 flex flex-col items-start gap-2">
      <Button size="lg" onClick={handleEnroll} disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Enroll now
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
