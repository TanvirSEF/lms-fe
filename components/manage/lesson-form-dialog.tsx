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
import { uploadFile } from '@/lib/api';
import {
  createLesson,
  updateLesson,
  type ManageLesson,
} from '@/lib/manage';

const MAX_VIDEO_MB = 100;

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
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const editing = Boolean(lesson);

  async function handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`Video must be under ${MAX_VIDEO_MB}MB — use a YouTube link instead.`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploaded = await uploadFile(file);
      setVideoUrl(uploaded.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const input = {
      title: String(form.get('title')),
      content: String(form.get('content') || ''),
      videoUrl,
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
              <Label htmlFor="videoFile">Video</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  disabled={uploading}
                  onChange={handleVideoChange}
                  className="flex-1"
                />
                {uploading && (
                  <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
                )}
              </div>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="…or paste a YouTube / video URL"
                className="text-xs text-muted-foreground"
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
