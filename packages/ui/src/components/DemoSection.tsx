import * as React from 'react';
import { cn } from '@/lib/utils';

interface IDemoSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Section wrapper for demo pages — title, optional description, content.
 * Typography tuned for 390px viewport: 20px heading, 14px body, 1.65 line-height.
 */
export function DemoSection({
  title,
  description,
  children,
  className,
}: IDemoSectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="max-w-[75ch] space-y-1.5">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold leading-tight tracking-tight text-[var(--color-text)]">
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-[1.65] text-[var(--color-text-muted)]">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
