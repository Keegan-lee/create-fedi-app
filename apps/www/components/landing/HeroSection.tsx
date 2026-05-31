import Link from 'next/link';
import { CopyCommand } from './CopyCommand';
import { INSTALL_COMMAND } from '../../lib/landing-data';

export function HeroSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20 pt-16 md:pt-24">
      <div className="max-w-[42rem]">
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-tight text-[var(--color-text)]">
          Build on Fedi.
        </h1>
        <p className="mt-6 max-w-[65ch] text-lg leading-[1.65] text-[var(--color-text-muted)]">
          A Next.js scaffolder that wires WebLN, Nostr, and Fedi browser APIs into a
          production-ready mini app with optional Lightning, AI, and database modules.
        </p>
      </div>

      <div className="mt-10 max-w-xl">
        <CopyCommand command={INSTALL_COMMAND} />
      </div>

      <div className="mt-8">
        <Link
          href="/docs"
          className="inline-flex h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-transparent px-5 text-sm font-medium text-[var(--color-text)] transition-colors duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-[var(--color-surface-2)]"
        >
          Read the docs
        </Link>
      </div>
    </section>
  );
}
