import type { Metadata } from 'next';
import Link from 'next/link';
import { GatedChat } from '../../../components/ai/GatedChat';

export const metadata: Metadata = {
  title: 'AI Chat (Gated)',
  description:
    'Pay-per-message AI chat demo: each prompt costs sats via Lightning. Invoice, WebLN payment, then streaming assistant replies powered by the Vercel AI SDK.',
  openGraph: {
    title: 'AI Chat (Gated)',
    description:
      'Pay-per-message AI chat demo: each prompt costs sats via Lightning. Invoice, WebLN payment, then streaming assistant replies powered by the Vercel AI SDK.',
  },
  twitter: {
    card: 'summary',
    title: 'AI Chat (Gated)',
    description:
      'Pay-per-message AI chat demo: each prompt costs sats via Lightning. Invoice, WebLN payment, then streaming assistant replies powered by the Vercel AI SDK.',
  },
};

export default function AiChatDemoPage() {
  const satsPerMessage =
    process.env.NEXT_PUBLIC_SATS_PER_MESSAGE ??
    process.env.AI_SATS_PER_MESSAGE ??
    '10';

  return (
    <div className="min-h-dvh bg-[var(--color-bg)] font-[family-name:var(--font-body)] text-[var(--color-text)]">
      <div
        className="mx-auto w-full max-w-[390px] px-4 pt-6"
        style={{ paddingBottom: 'max(5rem, env(safe-area-inset-bottom, 20px))' }}
      >
        <Link
          href="/demo"
          className="mb-6 inline-block text-xs text-[var(--color-text-muted)] transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80"
        >
          ← back
        </Link>

        <header className="mb-8 space-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight text-[var(--color-text)]">
            Gated AI chat
          </h1>
          <p className="max-w-[75ch] text-sm leading-[1.65] text-[var(--color-text-muted)]">
            The flagship pay-per-prompt module. Each message costs{' '}
            {Number.parseInt(satsPerMessage, 10).toLocaleString()} sats. Your app generates a
            BOLT11 via <code className="font-mono text-xs">/api/chat/invoice</code>, the user pays
            with WebLN, and the server verifies the preimage before calling{' '}
            <code className="font-mono text-xs">streamText()</code>.
          </p>
        </header>

        <GatedChat />
      </div>
    </div>
  );
}
