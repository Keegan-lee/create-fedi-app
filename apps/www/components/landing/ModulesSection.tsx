import { OPTIONAL_MODULES } from '../../lib/landing-data';

export function ModulesSection() {
  return (
    <section
      id="modules"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface)]"
      aria-labelledby="modules-heading"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-[42ch]">
          <h2
            id="modules-heading"
            className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-tight"
          >
            Optional modules
          </h2>
          <p className="mt-4 text-[var(--color-text-muted)]">
            Toggle at scaffold time. Each module merges templates, routes, and env vars into your
            project.
          </p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2">
          {OPTIONAL_MODULES.map((mod) => (
            <li
              key={mod.name}
              className="flex flex-col bg-[var(--color-surface)] p-6 transition-colors duration-200 ease-out-quart hover:bg-[var(--color-surface-2)]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-[0.9375rem] font-medium text-[var(--color-text)]">
                  {mod.name}
                </span>
                <span className="rounded-sm bg-[var(--color-bg)] px-2 py-0.5 font-mono text-[0.6875rem] text-[var(--color-text-subtle)]">
                  {mod.requires}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-[1.65] text-[var(--color-text-muted)]">
                {mod.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
