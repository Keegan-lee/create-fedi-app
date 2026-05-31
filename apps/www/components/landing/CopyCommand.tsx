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
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">terminal</span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-sm px-2 py-1 font-mono text-xs text-[var(--color-text-muted)] transition-colors duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
          aria-label={copied ? 'Copied' : 'Copy command'}
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed text-[var(--color-text)]">
        <code>{command}</code>
      </pre>
    </div>
  );
}
