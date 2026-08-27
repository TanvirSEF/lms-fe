import Link from 'next/link';
import { ArrowUpRight, User } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogPost } from '@/lib/blog';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.documentId}`} className="group">
      <Card className="h-full transition-colors group-hover:border-ring">
        {post.coverUrl && (
          <div className="aspect-[2/1] overflow-hidden rounded-t-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverUrl}
              alt=""
              className="size-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" />
                {post.author.username}
              </span>
            )}
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          {post.body && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.body}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
