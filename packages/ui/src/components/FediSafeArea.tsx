import * as React from 'react';
import { cn } from '@/lib/utils';

interface IFediSafeAreaProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Adds bottom padding for Fedi's in-app WebView navigation bar.
 * Uses safe-area-inset with an explicit 80px (pb-20) minimum fallback.
 */
export function FediSafeArea({ children, className }: IFediSafeAreaProps) {
  return (
    <div
      className={cn('pb-20', className)}
      style={{ paddingBottom: 'max(5rem, env(safe-area-inset-bottom, 20px))' }}
    >
      {children}
    </div>
  );
}
