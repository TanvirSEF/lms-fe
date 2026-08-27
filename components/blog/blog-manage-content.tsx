'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Pencil, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogFormDialog } from '@/components/blog/blog-form-dialog';
import { DeleteButton } from '@/components/manage/delete-button';
import { deletePost, fetchManagePosts, type BlogPost } from '@/lib/blog';

export function BlogManageContent() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const reload = useCallback(async () => {
    const data = await fetchManagePosts();
    setPosts(data);
  }, []);

  useEffect(() => {
    reload().catch(() => setPosts([]));
  }, [reload]);

  async function handleDelete(documentId: string) {
    await deletePost(documentId);
    await reload();
  }

  if (posts === null) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Blog posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drafts are only visible here until published.{' '}
            <Link href="/blog" className="text-foreground underline">
              View public blog
            </Link>
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          New post
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          No posts yet. Write your first one.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Card key={post.documentId}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {post.title}
                    <Badge
                      variant={post.status === 'published' ? 'default' : 'secondary'}
                      className="font-normal capitalize"
                    >
                      {post.status}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditing(post);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <DeleteButton onConfirm={() => handleDelete(post.documentId)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {post.author?.username} · {new Date(post.createdAt).toLocaleDateString()}
                </p>
                {post.body && (
                  <p className="mt-2 line-clamp-2 text-sm">{post.body}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <BlogFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        post={editing}
        onSaved={reload}
      />
    </div>
  );
}
