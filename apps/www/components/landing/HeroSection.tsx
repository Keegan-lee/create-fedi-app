import Link from 'next/link';
import { ApiFlowDiagram } from './ApiFlowDiagram';
import { CopyCommand } from './CopyCommand';
import { INSTALL_COMMAND } from '../../lib/landing-data';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden landing-glow">
      <div className="landing-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-14 md:grid-cols-[1fr_minmax(280px,420px)] md:items-center md:gap-16 md:pb-32 md:pt-20">
        <div>
          <p className="animate-fade-up font-mono text-xs tracking-wide text-[var(--color-accent)]">
            npx create-fedi-app@latest
          </p>

          <h1 className="animate-fade-up-delay-1 mt-4 font-display text-[clamp(2.75rem,7vw,4.5rem)] font-bold leading-[1.05] tracking-tight">
            Build on{' '}
            <span className="text-[var(--color-accent)]">Fedi</span>
            <span className="text-[var(--color-text-muted)]">.</span>
          </h1>

          <p className="animate-fade-up-delay-2 mt-6 max-w-[52ch] text-lg leading-[1.65] text-[var(--color-text-muted)]">
            Scaffold a Next.js mini app with WebLN, Nostr, and Fedi browser APIs wired in.
            Optional Lightning, AI, and database modules included.
          </p>

          <div className="animate-fade-up-delay-3 mt-10 max-w-md">
            <CopyCommand command={INSTALL_COMMAND} />
          </div>

          <div className="animate-fade-up-delay-3 mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/docs"
              className="inline-flex h-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-transparent px-5 text-sm font-medium text-[var(--color-text)] transition-colors duration-200 ease-out-quart hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Read the docs
            </Link>
            <span className="text-sm text-[var(--color-text-subtle)]">
              MIT licensed · open source
            </span>
          </div>
        </div>

        <div className="animate-fade-up-delay-2 hidden md:block">
          <ApiFlowDiagram className="h-auto w-full max-w-[420px] justify-self-end opacity-90" />
        </div>
      </div>
    </section>
  );
}
