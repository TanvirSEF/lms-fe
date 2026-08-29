import { notFound } from 'next/navigation';
import { User } from 'lucide-react';

import { getPublishedPost } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const post = await getPublishedPost(documentId);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-medium tracking-tight">{post.title}</h1>
      <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
        {post.author && (
          <span className="flex items-center gap-1.5">
            <User className="size-4" />
            {post.author.username}
          </span>
        )}
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {post.coverUrl && (
        <div className="mt-6 aspect-[2/1] overflow-hidden rounded-xl border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverUrl} alt="" className="size-full object-cover" />
        </div>
      )}

      {post.body && (
        <div className="mt-6 whitespace-pre-wrap leading-relaxed">{post.body}</div>
      )}
    </article>
  );
}
