'use client';

import { useCallback, useState } from 'react';

interface ICopyCommandProps {
  command: string;
}

/**
 * Install command block with a copy-to-clipboard control.
 */
export function CopyCommand({ command }: ICopyCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [command]);

  return (
    <div className="group overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_0_0_1px_oklch(0.68_0.19_45_/_0.06)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[var(--color-text-subtle)] opacity-30" />
          <span className="size-2 rounded-full bg-[var(--color-text-subtle)] opacity-30" />
          <span className="size-2 rounded-full bg-[var(--color-text-subtle)] opacity-30" />
          <span className="ml-1 font-mono text-xs text-[var(--color-text-subtle)]">terminal</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-sm px-2.5 py-1 font-mono text-xs text-[var(--color-text-muted)] transition-colors duration-200 ease-out-quart hover:bg-[var(--color-surface-2)] hover:text-[var(--color-accent)]"
          aria-label={copied ? 'Copied' : 'Copy command'}
        >
          {copied ? 'copied ✓' : 'copy'}
        </button>
      </div>
      <div className="relative overflow-x-auto px-4 py-4">
        <pre className="font-mono text-[0.9375rem] leading-relaxed sm:text-base">
          <code>
            <span className="text-[var(--color-accent)]">$ </span>
            <span className="text-[var(--color-text)]">{command.replace('npx ', '')}</span>
          </code>
        </pre>
      </div>
    </div>
  );
}
