import { OPTIONAL_MODULES } from '../../lib/landing-data';

export function ModulesSection() {
  return (
    <section
      id="modules"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface)]"
      aria-labelledby="modules-heading"
    >
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2
          id="modules-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-text)] md:text-3xl"
        >
          Module showcase
        </h2>
        <p className="mt-3 max-w-[65ch] text-[var(--color-text-muted)]">
          Optional modules you toggle at scaffold time. Dependencies resolve automatically.
        </p>

        <ul className="mt-10 space-y-0 divide-y divide-[var(--color-border)]">
          {OPTIONAL_MODULES.map((mod) => (
            <li key={mod.name} className="py-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="font-mono text-sm text-[var(--color-text)]">{mod.name}</span>
                <span className="shrink-0 font-mono text-xs text-[var(--color-text-subtle)]">
                  requires: {mod.requires}
                </span>
              </div>
              <p className="mt-2 max-w-[65ch] text-sm leading-[1.65] text-[var(--color-text-muted)]">
                {mod.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
