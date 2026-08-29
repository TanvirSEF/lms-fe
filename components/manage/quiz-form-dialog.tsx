'use client';

import { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createQuiz, updateQuiz, type ManageQuiz } from '@/lib/manage';

type QuestionDraft = {
  text: string;
  options: string[];
  correctIndex: number;
};

function emptyQuestion(): QuestionDraft {
  return { text: '', options: ['', '', '', ''], correctIndex: 0 };
}

export function QuizFormDialog({
  open,
  onOpenChange,
  courseDocumentId,
  quiz,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseDocumentId: string;
  quiz?: ManageQuiz | null;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(quiz?.title ?? '');
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    quiz
      ? quiz.questions.map((question) => ({
          text: question.text,
          options: [...question.options, '', '', '', ''].slice(0, 4),
          correctIndex: question.correctIndex,
        }))
      : [emptyQuestion()]
  );
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const editing = Boolean(quiz);

  function updateQuestion(index: number, patch: Partial<QuestionDraft>) {
    setQuestions((prev) =>
      prev.map((question, i) => (i === index ? { ...question, ...patch } : question))
    );
  }

  function updateOption(questionIndex: number, optionIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.map((option, j) =>
                j === optionIndex ? value : option
              ),
            }
          : question
      )
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const input = {
      title,
      questions: questions.map((question) => ({
        text: question.text,
        options: question.options,
        correctIndex: question.correctIndex,
      })),
    };

    try {
      if (editing && quiz) {
        await updateQuiz(quiz.documentId, input);
      } else {
        await createQuiz({ ...input, course: courseDocumentId });
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit quiz' : 'New quiz'}</DialogTitle>
          <DialogDescription>
            Pick the correct answer for each question with the radio button.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="quiz-title">Quiz title</Label>
            <Input
              id="quiz-title"
              required
              minLength={3}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="flex flex-col gap-3 rounded-lg border p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Question {questionIndex + 1}</span>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Remove question"
                    onClick={() =>
                      setQuestions((prev) => prev.filter((_, i) => i !== questionIndex))
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>

              <Input
                required
                minLength={3}
                placeholder="Question text"
                value={question.text}
                onChange={(event) =>
                  updateQuestion(questionIndex, { text: event.target.value })
                }
              />

              <RadioGroup
                value={String(question.correctIndex)}
                onValueChange={(value) =>
                  updateQuestion(questionIndex, { correctIndex: Number(value) })
                }
              >
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2.5">
                    <RadioGroupItem value={String(optionIndex)} id={`q-${questionIndex}-${optionIndex}`} />
                    <Input
                      required
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(event) =>
                        updateOption(questionIndex, optionIndex, event.target.value)
                      }
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
          >
            <Plus className="size-4" />
            Add question
          </Button>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {editing ? 'Save changes' : 'Create quiz'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
