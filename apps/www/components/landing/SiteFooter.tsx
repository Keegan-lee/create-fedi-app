import Link from 'next/link';
import { GITHUB_URL } from '../../lib/landing-data';

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">
          Built by Keegan-Lee Francis. Open source under the MIT license.
        </p>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm"
          aria-label="Footer"
        >
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-muted)] transition-colors duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:text-[var(--color-accent)]"
          >
            GitHub
          </a>
          <Link
            href="/docs"
            className="text-[var(--color-text-muted)] transition-colors duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:text-[var(--color-accent)]"
          >
            Docs
          </Link>
        </nav>
      </div>
    </footer>
  );
}
