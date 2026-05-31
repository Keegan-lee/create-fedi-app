import * as React from 'react';
import { cn } from '@/lib/utils';

type TSpinnerSize = 'sm' | 'md' | 'lg';

interface ILoadingSpinnerProps {
  className?: string;
  size?: TSpinnerSize;
  label?: string;
}

const sizeClasses: Record<TSpinnerSize, string> = {
  sm: 'size-4 border',
  md: 'size-6 border-2',
  lg: 'size-8 border-2',
};

/**
 * CSS-only loading indicator. Linear rotation — no spring or bounce.
 */
export function LoadingSpinner({
  className,
  size = 'md',
  label = 'Loading',
}: ILoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        'inline-block animate-fedi-spin rounded-full border-[var(--color-surface-2)] border-t-[var(--color-accent)]',
        sizeClasses[size],
        className,
      )}
    />
  );
}
