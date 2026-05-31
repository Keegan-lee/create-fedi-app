import { BASE_FEATURES } from '../../lib/landing-data';

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface)]"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2
          id="features-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-text)] md:text-3xl"
        >
          What it gives you
        </h2>
        <p className="mt-3 max-w-[65ch] text-[var(--color-text-muted)]">
          Every generated project includes these pieces. No extra prompts required.
        </p>

        <dl className="mt-10 divide-y divide-[var(--color-border)]">
          {BASE_FEATURES.map((feature) => (
            <div
              key={feature.name}
              className="grid gap-2 py-5 sm:grid-cols-[minmax(9rem,14rem)_1fr] sm:gap-8"
            >
              <dt className="font-mono text-sm text-[var(--color-accent)]">{feature.name}</dt>
              <dd className="text-[var(--color-text-muted)] leading-[1.65]">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
