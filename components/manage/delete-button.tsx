'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function DeleteButton({
  onConfirm,
  disabled,
}: {
  onConfirm: () => Promise<void> | void;
  disabled?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  async function handleClick() {
    if (!confirming) {
      setConfirming(true);
      timer.current = setTimeout(() => setConfirming(false), 3000);
      return;
    }

    if (timer.current) {
      clearTimeout(timer.current);
    }
    setConfirming(false);
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Button
      type="button"
      variant={confirming ? 'destructive' : 'ghost'}
      size="sm"
      disabled={disabled || deleting}
      onClick={handleClick}
    >
      {deleting ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
      {confirming ? 'Confirm' : 'Delete'}
    </Button>
  );
}
