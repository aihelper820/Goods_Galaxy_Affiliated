'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error details for debugging
    console.error('Error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="panel w-full max-w-md p-8 text-center">
        <h1 className="mb-4 text-4xl font-semibold tracking-[-0.04em] text-on-surface">Oops!</h1>
        <p className="mb-2 text-on-surface-muted">Something went wrong</p>
        <p className="mb-6 rounded-2xl border border-outline/15 bg-surface-container-low p-4 text-left text-sm text-on-surface-muted font-mono">
          {error.message || 'An unexpected error occurred'}
        </p>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => window.location.href = '/'} className="flex-1">
            Go Home
          </Button>
          <Button variant="primary" onClick={() => reset()} className="flex-1">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
