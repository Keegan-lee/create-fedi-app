import Link from 'next/link';
import { FediLogoMark } from './FediLogoMark';
import { GITHUB_URL } from '../../lib/landing-data';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-display text-sm font-semibold tracking-tight text-[var(--color-text)]"
        >
          <FediLogoMark className="size-5 text-[var(--color-accent)] transition-colors duration-200 ease-out-quart group-hover:text-[var(--color-text)]" />
          create-fedi-app
        </Link>
        <nav className="flex items-center gap-6" aria-label="Primary">
          <Link
            href="/docs"
            className="text-sm text-[var(--color-text-muted)] transition-colors duration-200 ease-out-quart hover:text-[var(--color-text)]"
          >
            Docs
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-[var(--color-text-muted)] transition-colors duration-200 ease-out-quart hover:text-[var(--color-text)] sm:block"
          >
            GitHub
          </a>
          <Link
            href="/docs/quickstart"
            className="inline-flex h-8 items-center rounded-md bg-[var(--color-accent)] px-3.5 text-sm font-medium text-[var(--color-bg)] transition-opacity duration-200 ease-out-quart hover:opacity-90"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
