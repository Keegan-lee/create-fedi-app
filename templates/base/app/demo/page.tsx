import Link from 'next/link';

export default function DemoPage() {
  return (
    <main
      className="mx-auto min-h-dvh w-full max-w-[390px] px-4 pt-6 pb-20"
      style={{ paddingBottom: 'max(5rem, env(safe-area-inset-bottom, 20px))' }}
    >
      <Link
        href="/"
        className="mb-6 inline-block text-xs text-[var(--color-text-muted)] transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80"
      >
        ← back
      </Link>
      <div className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight text-[var(--color-text)]">
          Demos
        </h1>
        <p className="max-w-[75ch] text-sm leading-[1.65] text-[var(--color-text-muted)]">
          Module demos appear here after selection during project creation.
        </p>
      </div>
    </main>
  );
}
