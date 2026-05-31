import { CliTerminal } from './CliTerminal';

export function CliDemoSection() {
  return (
    <section
      id="cli"
      className="border-t border-[var(--color-border)]"
      aria-labelledby="cli-heading"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <h2
              id="cli-heading"
              className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-tight"
            >
              Six prompts to a working app
            </h2>
            <p className="mt-4 max-w-[42ch] text-[var(--color-text-muted)] leading-[1.65]">
              Pick your database, toggle optional modules, choose a package manager.
              Defaults are sensible. Most scaffolds finish in under a minute.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-[var(--color-text-muted)]">
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                WebLN, Nostr, and ecash modules always included
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                Dependencies resolve automatically per module
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                AI rules directory optional for Cursor and Claude Code
              </li>
            </ul>
          </div>

          <CliTerminal />
        </div>
      </div>
    </section>
  );
}
