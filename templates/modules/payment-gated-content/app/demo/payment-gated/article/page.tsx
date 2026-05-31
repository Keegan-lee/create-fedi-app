import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { checkPaymentAccess } from '../../../../lib/payment-gate';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Gated Article',
  description:
    'Proxy-protected article route for the payment-gated content demo. Requires a valid payment cookie set after Lightning verification.',
  openGraph: {
    title: 'Gated Article',
    description:
      'Proxy-protected article route for the payment-gated content demo. Requires a valid payment cookie set after Lightning verification.',
  },
  twitter: {
    card: 'summary',
    title: 'Gated Article',
    description:
      'Proxy-protected article route for the payment-gated content demo. Requires a valid payment cookie set after Lightning verification.',
  },
};

const CONTENT_ID = 'demo-article';

export default async function ProtectedArticlePage() {
  const cookieStore = await cookies();
  const hasAccess = await checkPaymentAccess(cookieStore, CONTENT_ID);

  if (!hasAccess) {
    redirect('/demo/payment-gated?redirect=/demo/payment-gated/article');
  }

  return (
    <div className="min-h-dvh bg-[var(--color-bg)] font-[family-name:var(--font-body)] text-[var(--color-text)]">
      <div
        className="mx-auto w-full max-w-[390px] px-4 pt-6"
        style={{ paddingBottom: 'max(5rem, env(safe-area-inset-bottom, 20px))' }}
      >
        <Link
          href="/demo/payment-gated"
          className="mb-6 inline-block text-xs text-[var(--color-text-muted)] transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80"
        >
          ← back to demo
        </Link>

        <header className="mb-6 space-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight text-[var(--color-text)]">
            Proxy-protected route
          </h1>
          <p className="text-sm leading-[1.65] text-[var(--color-text-muted)]">
            You reached this page because <code className="font-mono text-xs">proxy.ts</code> found a
            valid payment cookie. Without it, you would have been redirected to the paywall.
          </p>
        </header>

        <article className="space-y-3 text-sm leading-[1.65] text-[var(--color-text-muted)]">
          <p>
            This route demonstrates network-boundary enforcement. Even if someone removes the paywall
            component from the client bundle, the proxy still blocks unauthenticated requests to
            protected paths.
          </p>
          <p>
            In production, point protected routes at real premium content: PDF downloads, API
            handlers, or server-rendered pages that must never leak without payment proof.
          </p>
        </article>
      </div>
    </div>
  );
}
