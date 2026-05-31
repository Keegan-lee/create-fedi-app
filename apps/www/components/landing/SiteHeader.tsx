import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-[var(--color-text)]"
        >
          create-fedi-app
        </Link>
        <nav aria-label="Primary">
          <Link
            href="/docs"
            className="font-mono text-sm text-[var(--color-text-muted)] transition-colors duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:text-[var(--color-accent)]"
          >
            docs →
          </Link>
        </nav>
      </div>
    </header>
  );
}
