'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, RotateCcw, Trophy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/link-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  fetchMyAttempts,
  fetchQuizForTake,
  submitQuiz,
  type QuizAttempt,
  type QuizResult,
  type TakeQuiz,
} from '@/lib/student';

export function QuizContent({
  courseDocumentId,
  quizDocumentId,
}: {
  courseDocumentId: string;
  quizDocumentId: string;
}) {
  const [quiz, setQuiz] = useState<TakeQuiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  const loadAttempts = useCallback(() => {
    fetchMyAttempts()
      .then((all) =>
        setAttempts(all.filter((attempt) => attempt.quiz.documentId === quizDocumentId))
      )
      .catch(() => setAttempts([]));
  }, [quizDocumentId]);

  useEffect(() => {
    fetchQuizForTake(quizDocumentId)
      .then((data) => {
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(-1));
      })
      .catch((err: Error) => setError(err.message));
    loadAttempts();
  }, [quizDocumentId, loadAttempts]);

  async function handleSubmit() {
    if (answers.some((answer) => answer === -1)) {
      setError('Please answer every question first');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = await submitQuiz(quizDocumentId, answers);
      setResult(data);
      loadAttempts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetake() {
    setResult(null);
    setAnswers(new Array(quiz?.questions.length ?? 0).fill(-1));
  }

  if (error && !quiz) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-4 py-20 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <LinkButton href={`/my-courses/${courseDocumentId}`} variant="outline">
          Back to course
        </LinkButton>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const percent = result ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <Link
          href={`/my-courses/${courseDocumentId}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to course
        </Link>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">{quiz.title}</h1>
      </div>

      {result ? (
        <Card className="mb-8">
          <CardHeader className="items-center text-center">
            <Trophy className="size-8 text-primary" />
            <CardTitle className="text-2xl">
              {result.score} / {result.total} ({percent}%)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul className="flex flex-col gap-2">
              {quiz.questions.map((question, index) => {
                const correct = answers[index] === result.correctAnswers[index];

                return (
                  <li
                    key={question.documentId}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      correct ? 'border-primary/40' : 'border-destructive/40'
                    }`}
                  >
                    <span className="mr-2">{correct ? '✓' : '✗'}</span>
                    {question.text}
                    {!correct && (
                      <span className="block pl-5 text-xs text-muted-foreground">
                        Correct answer: {question.options[result.correctAnswers[index]]}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleRetake}>
                <RotateCcw className="size-4" />
                Retake quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {quiz.questions.map((question, questionIndex) => (
            <Card key={question.documentId}>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  {questionIndex + 1}. {question.text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={String(answers[questionIndex])}
                  onValueChange={(value) =>
                    setAnswers((prev) => {
                      const next = [...prev];
                      next[questionIndex] = Number(value);
                      return next;
                    })
                  }
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2.5">
                      <RadioGroupItem
                        value={String(optionIndex)}
                        id={`${question.documentId}-${optionIndex}`}
                      />
                      <Label
                        htmlFor={`${question.documentId}-${optionIndex}`}
                        className="font-normal"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button size="lg" onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Submit answers
          </Button>
        </div>
      )}

      {attempts.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 font-medium">Your attempts</h2>
          <ul className="flex flex-col divide-y rounded-lg border text-sm">
            {attempts.map((attempt, index) => (
              <li
                key={attempt.documentId}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <span className="text-muted-foreground">
                  Attempt {attempts.length - index} ·{' '}
                  {new Date(attempt.createdAt).toLocaleString()}
                </span>
                <span className="tabular-nums">
                  {attempt.score}/{attempt.total}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
