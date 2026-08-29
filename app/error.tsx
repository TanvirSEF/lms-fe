'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="size-10 text-muted-foreground/60" />
      <h1 className="text-2xl font-medium tracking-tight">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred while loading this page. Try again — if it
        keeps happening, come back later.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground/70">Error ref: {error.digest}</p>
      )}
      <Button onClick={reset} className="mt-2">
        <RotateCcw className="size-4" />
        Try again
      </Button>
    </div>
  );
}
