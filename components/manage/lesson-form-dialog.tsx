'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

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
import { Textarea } from '@/components/ui/textarea';
import {
  createLesson,
  updateLesson,
  type ManageLesson,
} from '@/lib/manage';

export function LessonFormDialog({
  open,
  onOpenChange,
  courseDocumentId,
  lesson,
  nextOrder,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseDocumentId: string;
  lesson?: ManageLesson | null;
  nextOrder: number;
  onSaved: () => void;
}) {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const editing = Boolean(lesson);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const input = {
      title: String(form.get('title')),
      content: String(form.get('content') || ''),
      videoUrl: String(form.get('videoUrl') || ''),
      order: Number(form.get('order') || nextOrder),
    };

    try {
      if (editing && lesson) {
        await updateLesson(lesson.documentId, input);
      } else {
        await createLesson({ ...input, course: courseDocumentId });
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit lesson' : 'New lesson'}</DialogTitle>
          <DialogDescription>
            A lesson can have text content, a video URL, or both.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="lesson-title">Title</Label>
            <Input
              id="lesson-title"
              name="title"
              required
              minLength={3}
              defaultValue={lesson?.title ?? ''}
            />
          </div>
          <div className="grid grid-cols-[1fr_100px] gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                name="videoUrl"
                placeholder="https://youtube.com/watch?v=..."
                defaultValue={lesson?.videoUrl ?? ''}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                min={1}
                defaultValue={lesson?.order ?? nextOrder}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              rows={5}
              defaultValue={lesson?.content ?? ''}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {editing ? 'Save changes' : 'Add lesson'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
