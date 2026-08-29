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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { uploadFile } from '@/lib/api';
import { createPost, updatePost, type BlogPost } from '@/lib/blog';

export function BlogFormDialog({
  open,
  onOpenChange,
  post,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: BlogPost | null;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(post?.title ?? '');
  const [body, setBody] = useState(post?.body ?? '');
  const [coverUrl, setCoverUrl] = useState(post?.coverUrl ?? '');
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status ?? 'draft');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const editing = Boolean(post);

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

    const input = {
      title,
      body,
      coverUrl,
      status,
    };

    try {
      if (editing && post) {
        await updatePost(post.documentId, input);
      } else {
        await createPost(input);
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit post' : 'New post'}</DialogTitle>
          <DialogDescription>
            Draft posts stay hidden until you publish them.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              required
              minLength={3}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-body">Body</Label>
            <Textarea
              id="post-body"
              rows={8}
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </div>
          <div className="grid grid-cols-[1fr_150px] gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cover-url">Cover image</Label>
              {coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverUrl}
                  alt="Cover preview"
                  className="h-24 w-full rounded-lg border object-cover"
                />
              )}
              <div className="flex items-center gap-2">
                <Input
                  id="cover-file"
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={handleCoverChange}
                  className="flex-1"
                />
                {uploading && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />}
              </div>
              <Input
                id="cover-url"
                placeholder="…or paste an image URL"
                value={coverUrl}
                onChange={(event) => setCoverUrl(event.target.value)}
                className="text-xs text-muted-foreground"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as 'draft' | 'published')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {editing ? 'Save changes' : 'Create post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
