export function FediExplainerSection() {
  return (
    <section
      id="fedi"
      className="border-t border-[var(--color-border)]"
      aria-labelledby="fedi-heading"
    >
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2
          id="fedi-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-text)] md:text-3xl"
        >
          How Fedi works
        </h2>

        <div className="mt-10 max-w-[65ch] space-y-6 text-[var(--color-text-muted)] leading-[1.65]">
          <p>
            Fedi is a Bitcoin wallet built on Fedimint, a federated e-cash system. Mini apps run
            inside Fedi&apos;s in-app browser, where the host injects{' '}
            <code className="rounded-sm bg-[var(--color-surface-2)] px-1.5 py-0.5 text-sm text-[var(--color-text)]">
              window.webln
            </code>
            : a WebLN provider that can send Lightning payments, create invoices, and sign
            messages without leaving your app. Outside Fedi, that object is undefined. Your code
            must detect its presence and offer a fallback or prompt the user to open the app in
            Fedi.
          </p>
          <p>
            The same browser exposes{' '}
            <code className="rounded-sm bg-[var(--color-surface-2)] px-1.5 py-0.5 text-sm text-[var(--color-text)]">
              window.nostr
            </code>
            , a NIP-07 signer for Nostr identity. Users authenticate with their existing Nostr
            key, sign events, and encrypt direct messages without pasting private keys into your
            site. Combined with WebLN, this is how zaps, gated content, and social features work
            in mini apps: pay with Lightning, prove identity with Nostr, settle in ecash through
            the federation.
          </p>
        </div>
      </div>
    </section>
  );
}
