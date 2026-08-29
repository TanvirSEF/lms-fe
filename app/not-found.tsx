import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

import { LinkButton } from '@/components/link-button';

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <FileQuestion className="size-10 text-muted-foreground/60" />
      <h1 className="text-2xl font-medium tracking-tight">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <LinkButton href="/" className="mt-2">
        Back to home
      </LinkButton>
      <Link href="/courses" className="text-sm text-muted-foreground underline">
        Browse courses instead
      </Link>
    </div>
  );
}
