import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-outline/15 bg-surface-container-low px-4 py-12',
        className
      )}
    >
      {icon && <div className="mb-4 text-on-surface-muted">{icon}</div>}

      <h3 className="mb-2 text-lg font-semibold text-on-surface">{title}</h3>

      {description && <p className="mb-4 max-w-sm text-center text-sm text-on-surface-muted">{description}</p>}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
