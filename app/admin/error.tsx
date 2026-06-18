'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';
import Link from 'next/link';

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-black mb-4">Error</h1>
        <p className="text-gray-600 mb-2">Something went wrong in the admin panel</p>
        <p className="text-sm text-gray-500 mb-6 p-4 bg-gray-50 rounded-sm border border-outline font-mono">
          {error.message || 'An unexpected error occurred'}
        </p>

        <div className="flex gap-3">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="w-full justify-center">
              Back to Dashboard
            </Button>
          </Link>
          <Button variant="primary" onClick={() => reset()} className="flex-1">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
