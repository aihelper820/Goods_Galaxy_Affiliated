import { Button } from '@/components/ui';
import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | Goods Galaxy Affiliated',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="panel w-full max-w-md p-8 text-center">
        <h1 className="text-6xl font-semibold tracking-[-0.04em] text-on-surface mb-4">404</h1>
        <p className="mb-2 text-2xl font-semibold text-on-surface">Page Not Found</p>
        <p className="mb-8 text-sm text-on-surface-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex gap-3">
          <Link href="/" className="flex-1">
            <Button variant="ghost" className="w-full">
              Go Home
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button variant="primary" className="w-full">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
