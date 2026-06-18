import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'gray';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-primary text-on-primary',
    success: 'bg-[#e8f4ec] text-[#103c25] border border-[#c4dccb]',
    warning: 'bg-[#fff4df] text-[#7a4d00] border border-[#f2d59a]',
    gray: 'bg-surface-muted text-on-surface-muted border border-outline/25',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
