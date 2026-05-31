import { ApiFlowDiagram } from './ApiFlowDiagram';

export function FediExplainerSection() {
  return (
    <section
      id="fedi"
      className="border-t border-[var(--color-border)]"
      aria-labelledby="fedi-heading"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <h2
              id="fedi-heading"
              className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-tight"
            >
              How Fedi works
            </h2>

            <div className="mt-8 space-y-6 text-[var(--color-text-muted)] leading-[1.65]">
              <p>
                Fedi is a Bitcoin wallet built on Fedimint, a federated e-cash system. Mini apps
                run inside Fedi&apos;s in-app browser, where the host injects{' '}
                <code className="rounded-sm bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[0.8125rem] text-[var(--color-accent)]">
                  window.webln
                </code>
                : a WebLN provider for Lightning payments, invoices, and message signing without
                leaving your app.
              </p>
              <p>
                The same browser exposes{' '}
                <code className="rounded-sm bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[0.8125rem] text-[var(--color-accent)]">
                  window.nostr
                </code>{' '}
                for NIP-07 identity and{' '}
                <code className="rounded-sm bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[0.8125rem] text-[var(--color-accent)]">
                  window.fediInternal
                </code>{' '}
                for ecash balance and federation APIs. Outside Fedi, these objects are undefined.
                Your code must detect them and degrade gracefully.
              </p>
            </div>
          </div>

          <div className="md:hidden lg:block">
            <ApiFlowDiagram className="mx-auto h-auto w-full max-w-[380px] opacity-80" />
          </div>
        </div>
      </div>
    </section>
  );
}
