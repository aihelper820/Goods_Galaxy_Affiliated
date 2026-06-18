import { InputHTMLAttributes, ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  icon,
  className,
  disabled,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const nameBasedId = typeof props.name === 'string' && props.name.length > 0 ? `input-${props.name}` : undefined;
  const inputId = id || nameBasedId || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-on-surface mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2.5 border rounded-full bg-surface-elevated text-on-surface placeholder:text-on-surface-muted',
            'focus:outline-none focus:ring-2 focus:ring-focus focus:border-focus',
            'disabled:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50',
            'autofill:shadow-[inset_0_0_0px_1000px_rgba(250,249,245,0.9)] autofill:text-on-surface',
            'autofill:caret-color-on-surface',
            'transition-colors duration-200',
            error ? 'border-error focus:ring-error focus:border-error' : 'border-outline/70 hover:border-outline/100',
            icon && 'pr-10',
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-on-surface-muted pointer-events-none flex items-center" aria-hidden="true">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error mt-1" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-on-surface-muted mt-1" id={`${inputId}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
