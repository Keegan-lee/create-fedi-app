import { CLI_DEMO } from '../../lib/landing-data';

export function CliDemoSection() {
  return (
    <section
      id="cli"
      className="border-t border-[var(--color-border)]"
      aria-labelledby="cli-heading"
    >
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2
          id="cli-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-text)] md:text-3xl"
        >
          CLI walkthrough
        </h2>
        <p className="mt-3 max-w-[65ch] text-[var(--color-text-muted)]">
          Six prompts. Defaults are sensible. You can scaffold a working mini app in under a
          minute.
        </p>

        <pre
          className="mt-10 overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 font-mono text-[0.8125rem] leading-[1.7] text-[var(--color-text-muted)] sm:text-sm"
          aria-label="Example create-fedi-app CLI session"
        >
          {CLI_DEMO}
        </pre>
      </div>
    </section>
  );
}
