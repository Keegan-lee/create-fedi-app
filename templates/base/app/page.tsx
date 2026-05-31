'use client';

import Link from 'next/link';
import { useWebLN } from '../lib/webln';
import { useNostr } from '../lib/nostr';
import { cn } from '../lib/utils';

function ConnectionStatus() {
  const { provider: weblnProvider, isLoading: weblnLoading } = useWebLN();
  const { provider: nostrProvider, isLoading: nostrLoading } = useNostr();

  return (
    <div className="flex flex-wrap gap-2">
      <StatusPill label="WebLN" active={!!weblnProvider} loading={weblnLoading} />
      <StatusPill label="Nostr" active={!!nostrProvider} loading={nostrLoading} />
    </div>
  );
}

function StatusPill({
  label,
  active,
  loading,
}: {
  label: string;
  active: boolean;
  loading: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-mono',
        loading
          ? 'bg-[var(--color-surface-2)] text-[var(--color-text-subtle)]'
          : active
            ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
            : 'bg-[var(--color-surface-2)] text-[var(--color-text-subtle)]',
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          loading
            ? 'bg-current opacity-40'
            : active
              ? 'bg-[var(--color-accent)]'
              : 'bg-[var(--color-text-subtle)]',
        )}
      />
      {label}
    </span>
  );
}

export default function HomePage() {
  return (
    <main
      className="mx-auto min-h-dvh w-full max-w-[390px] px-4 pt-6 pb-20"
      style={{ paddingBottom: 'max(5rem, env(safe-area-inset-bottom, 20px))' }}
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight text-[var(--color-text)]">
            {{PROJECT_NAME}}
          </h1>
          <p className="max-w-[75ch] text-sm leading-[1.65] text-[var(--color-text-muted)]">
            Your mini app is running. Explore the demo pages to see WebLN payments and Nostr
            identity in action.
          </p>
        </div>

        <ConnectionStatus />

        <Link
          href="/demo"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-text)] transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-90 active:opacity-80"
        >
          Explore demos →
        </Link>
      </div>
    </main>
  );
}
