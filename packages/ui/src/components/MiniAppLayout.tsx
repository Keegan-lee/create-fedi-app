import * as React from 'react';
import { cn } from '@/lib/utils';
import { FediSafeArea } from './FediSafeArea';

interface IMiniAppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Mobile-first layout tuned for Fedi's primary device (390px / iPhone 14).
 * Every demo page should use this wrapper.
 */
export function MiniAppLayout({ children, className }: IMiniAppLayoutProps) {
  return (
    <div className="min-h-dvh bg-[var(--color-bg)] font-[family-name:var(--font-body)] text-[var(--color-text)]">
      <FediSafeArea>
        <div
          className={cn(
            'mx-auto w-full max-w-[390px] px-4 pt-6',
            className,
          )}
        >
          {children}
        </div>
      </FediSafeArea>
    </div>
  );
}
