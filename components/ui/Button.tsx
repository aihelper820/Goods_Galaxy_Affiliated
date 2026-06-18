import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-h-[44px] min-w-[44px]';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm active:shadow-none',
    secondary: 'bg-secondary text-on-secondary hover:bg-secondary/80 border border-outline/30 active:border-outline/50',
    ghost: 'bg-transparent text-on-surface hover:bg-surface-container-low border border-transparent active:bg-surface-container',
    danger: 'bg-error text-on-error hover:bg-error/90 shadow-sm active:shadow-none',
  };

  const variantStyle =
    variant === 'primary'
      ? { backgroundColor: '#e60023', color: '#ffffff' }
      : undefined;

  const sizes = {
    sm: 'px-3 py-1.5 text-[0.75rem]',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-sm',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      style={variantStyle}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
