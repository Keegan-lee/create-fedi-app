import type { ReactNode } from 'react';
import { CLI_DEMO } from '../../lib/landing-data';

/** Renders CLI demo output with semantic color spans. */
function colorizeCliLine(line: string): ReactNode {
  if (line.startsWith('◆')) {
    return (
      <>
        <span className="text-[var(--color-accent)]">◆</span>
        {line.slice(1)}
      </>
    );
  }
  if (line.startsWith('●')) {
    return (
      <>
        <span className="text-[var(--color-accent)]">●</span>
        {line.slice(1)}
      </>
    );
  }
  if (line.startsWith('○')) {
    return (
      <>
        <span className="text-[var(--color-text-subtle)]">○</span>
        {line.slice(1)}
      </>
    );
  }
  if (line.startsWith('◻')) {
    return (
      <>
        <span className="text-[var(--color-text-subtle)]">◻</span>
        {line.slice(1)}
      </>
    );
  }
  if (line.startsWith('└')) {
    return <span className="text-[var(--color-success)]">{line}</span>;
  }
  if (line.startsWith('$')) {
    return (
      <>
        <span className="text-[var(--color-accent)]">$</span>
        {line.slice(1)}
      </>
    );
  }
  if (line.startsWith('│')) {
    return <span className="text-[var(--color-text-subtle)]">{line}</span>;
  }
  return line;
}

export function CliTerminal() {
  const lines = CLI_DEMO.split('\n');

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[var(--color-text-subtle)] opacity-40" />
        <span className="size-2.5 rounded-full bg-[var(--color-text-subtle)] opacity-40" />
        <span className="size-2.5 rounded-full bg-[var(--color-text-subtle)] opacity-40" />
        <span className="ml-2 font-mono text-xs text-[var(--color-text-subtle)]">
          create-fedi-app
        </span>
      </div>
      <pre
        className="overflow-x-auto p-5 font-mono text-[0.8125rem] leading-[1.75] text-[var(--color-text-muted)] sm:text-sm"
        aria-label="Example create-fedi-app CLI session"
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {colorizeCliLine(line) || '\u00A0'}
          </span>
        ))}
      </pre>
    </div>
  );
}
