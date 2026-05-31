import Link from 'next/link';
import { CopyCommand } from './CopyCommand';
import { GITHUB_URL, INSTALL_COMMAND } from '../../lib/landing-data';

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-end">
          <div>
            <h2 className="font-display text-2xl font-semibold">Ready to scaffold?</h2>
            <p className="mt-3 max-w-[42ch] text-[var(--color-text-muted)]">
              Run the command, pick your modules, and start building inside Fedi&apos;s WebView.
            </p>
            <div className="mt-6 max-w-sm">
              <CopyCommand command={INSTALL_COMMAND} />
            </div>
          </div>

          <div className="flex flex-col gap-6 md:items-end md:text-right">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-muted)] transition-colors duration-200 ease-out-quart hover:text-[var(--color-accent)]"
              >
                GitHub
              </a>
              <Link
                href="/docs"
                className="text-[var(--color-text-muted)] transition-colors duration-200 ease-out-quart hover:text-[var(--color-accent)]"
              >
                Documentation
              </Link>
              <Link
                href="/docs/quickstart"
                className="text-[var(--color-text-muted)] transition-colors duration-200 ease-out-quart hover:text-[var(--color-accent)]"
              >
                Getting started
              </Link>
            </nav>
            <p className="text-sm text-[var(--color-text-subtle)]">
              Built by Keegan-Lee Francis · MIT license
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
