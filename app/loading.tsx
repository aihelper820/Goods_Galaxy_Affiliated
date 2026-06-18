import { Spinner } from '@/components/ui';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="panel px-8 py-10 text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-sm text-on-surface-muted">Loading...</p>
      </div>
    </div>
  );
}
