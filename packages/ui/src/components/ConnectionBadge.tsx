import * as React from 'react';
import { cn } from '@/lib/utils';

interface ConnectionBadgeProps {
  type: 'webln' | 'nostr';
  connected: boolean;
}

const labels: Record<ConnectionBadgeProps['type'], string> = {
  webln: 'WebLN',
  nostr: 'Nostr',
};

export function ConnectionBadge({ type, connected }: ConnectionBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span
        className={cn(
          'size-2 rounded-full',
          connected ? 'bg-[var(--color-success)]' : 'bg-[var(--color-text-subtle)]'
        )}
      />
      <span
        className={cn(
          connected ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'
        )}
      >
        {labels[type]} {connected ? 'Connected' : 'Not connected'}
      </span>
    </span>
  );
}
