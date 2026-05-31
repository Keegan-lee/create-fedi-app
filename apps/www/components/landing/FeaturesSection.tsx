import { BASE_FEATURES } from '../../lib/landing-data';

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface)]"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-20">
          <div className="md:sticky md:top-28 md:self-start">
            <h2
              id="features-heading"
              className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-tight"
            >
              What it gives you
            </h2>
            <p className="mt-4 text-[var(--color-text-muted)]">
              Every generated project ships with these. No extra prompts.
            </p>
          </div>

          <dl className="divide-y divide-[var(--color-border)]">
            {BASE_FEATURES.map((feature) => (
              <div
                key={feature.name}
                className="grid gap-3 py-6 first:pt-0 last:pb-0 sm:grid-cols-[1fr_1.4fr] sm:gap-10"
              >
                <dt className="font-display text-base font-medium text-[var(--color-text)]">
                  {feature.name}
                </dt>
                <dd className="text-[var(--color-text-muted)] leading-[1.65]">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
