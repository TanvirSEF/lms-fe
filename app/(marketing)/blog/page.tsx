import { BlogCard } from '@/components/blog/blog-card';
import { getPublishedPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">Blog</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          News and updates from the team.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          No posts have been published yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.documentId} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
