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
  createCourse,
  updateCourse,
  type ManageCourse,
} from '@/lib/manage';

export function CourseFormDialog({
  open,
  onOpenChange,
  course,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: ManageCourse | null;
  onSaved: () => void;
}) {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [coverUrl, setCoverUrl] = useState(course?.coverUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const editing = Boolean(course);

  async function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const uploaded = await uploadFile(file);
      setCoverUrl(uploaded.url);
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
      description: String(form.get('description') || ''),
      coverUrl,
    };

    try {
      if (editing && course) {
        await updateCourse(course.documentId, input);
      } else {
        await createCourse(input);
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
          <DialogTitle>{editing ? 'Edit course' : 'New course'}</DialogTitle>
          <DialogDescription>
            {editing
              ? 'Update the course details below.'
              : 'Courses are visible to every visitor of the platform.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              minLength={3}
              defaultValue={course?.title ?? ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={course?.description ?? ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="coverFile">Cover image</Label>
            {coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt="Cover preview"
                className="h-32 w-full rounded-lg border object-cover"
              />
            )}
            <div className="flex items-center gap-2">
              <Input
                id="coverFile"
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={handleCoverChange}
                className="flex-1"
              />
              {uploading && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />}
            </div>
            <Input
              id="coverUrl"
              value={coverUrl}
              onChange={(event) => setCoverUrl(event.target.value)}
              placeholder="…or paste an image URL"
              className="text-xs text-muted-foreground"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {editing ? 'Save changes' : 'Create course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
