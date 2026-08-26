'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Circle, ClipboardCheck, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  completeLesson,
  fetchLearnCourse,
  type CourseProgress,
  type LearnCourse,
  type LearnLesson,
} from '@/lib/student';

function toEmbedUrl(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{6,})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function LessonView({
  lesson,
  completed,
  onComplete,
  completing,
}: {
  lesson: LearnLesson;
  completed: boolean;
  onComplete: () => void;
  completing: boolean;
}) {
  const embedUrl = lesson.videoUrl ? toEmbedUrl(lesson.videoUrl) : null;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-medium">{lesson.title}</h2>

      {lesson.content && (
        <div className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
          {lesson.content}
        </div>
      )}

      {embedUrl && (
        <div className="aspect-video overflow-hidden rounded-lg border">
          <iframe
            src={embedUrl}
            title={lesson.title}
            allowFullScreen
            className="size-full"
          />
        </div>
      )}

      {!embedUrl && lesson.videoUrl && (
        <a
          href={lesson.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline"
        >
          Watch the video for this lesson
        </a>
      )}

      {!lesson.content && !lesson.videoUrl && (
        <p className="text-sm text-muted-foreground">
          This lesson has no content yet.
        </p>
      )}

      <div>
        {completed ? (
          <Button variant="outline" disabled>
            <CheckCircle2 className="size-4" />
            Completed
          </Button>
        ) : (
          <Button onClick={onComplete} disabled={completing}>
            {completing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Circle className="size-4" />
            )}
            Mark as complete
          </Button>
        )}
      </div>
    </div>
  );
}

export function PlayerContent({ courseDocumentId }: { courseDocumentId: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<LearnCourse | null>(null);
  const [error, setError] = useState('');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchLearnCourse(courseDocumentId)
      .then((data) => {
        setCourse(data);
        setCompletedIds(data.completedLessonIds ?? []);
        setProgress(data.progress);
        const firstPending =
          data.lessons.find(
            (lesson) => !(data.completedLessonIds ?? []).includes(lesson.documentId)
          ) ?? data.lessons[0];
        setActiveLessonId(firstPending?.documentId ?? null);
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  }, [courseDocumentId]);

  const activeLesson = useMemo(
    () => course?.lessons.find((lesson) => lesson.documentId === activeLessonId) ?? null,
    [course, activeLessonId]
  );

  async function handleComplete() {
    if (!activeLesson) {
      return;
    }

    setCompleting(true);
    try {
      const res = await completeLesson(activeLesson.documentId);
      setProgress(res.data);
      setCompletedIds((prev) => [...prev, activeLesson.documentId]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setCompleting(false);
    }
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-4 py-20 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" onClick={() => router.push('/my-courses')}>
          Back to my courses
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-medium tracking-tight">{course.title}</h1>
          {progress && (
            <span className="text-sm tabular-nums text-muted-foreground">
              {progress.completed}/{progress.total} lessons · {progress.percent}%
            </span>
          )}
        </div>
        {progress && <Progress value={progress.percent} />}
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lessons
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {course.lessons.map((lesson) => {
                const done = completedIds.includes(lesson.documentId);
                const active = lesson.documentId === activeLessonId;

                return (
                  <button
                    key={lesson.documentId}
                    type="button"
                    onClick={() => setActiveLessonId(lesson.documentId)}
                    className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted ${
                      active ? 'bg-muted font-medium' : ''
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    ) : (
                      <Circle className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 truncate">{lesson.title}</span>
                  </button>
                );
              })}
              {course.lessons.length === 0 && (
                <p className="text-sm text-muted-foreground">No lessons yet.</p>
              )}
            </CardContent>
          </Card>

          {course.quizzes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Quizzes
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                {course.quizzes.map((quiz) => (
                  <Link
                    key={quiz.documentId}
                    href={`/my-courses/${course.documentId}/quiz/${quiz.documentId}`}
                    className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <ClipboardCheck className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 truncate">{quiz.title}</span>
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                      {quiz.questionCount}q
                    </span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>

        <main className="min-w-0">
          {activeLesson ? (
            <LessonView
              lesson={activeLesson}
              completed={completedIds.includes(activeLesson.documentId)}
              onComplete={handleComplete}
              completing={completing}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              This course has no lessons yet.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
