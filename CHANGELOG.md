# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] - 2026-05-31

First public release of `create-fedi-app` — a CLI scaffolder for Fedi Bitcoin mini apps built on Next.js 16.

### Added

#### Monorepo and tooling

- Turborepo + Bun workspaces monorepo with shared TypeScript, ESLint 9 flat config, Prettier, and Vitest
- GitHub Actions CI (typecheck, lint, test, build) and release workflow skeleton
- Playwright E2E config and home-page smoke test for generated projects

#### CLI (`create-fedi-app`)

- Interactive prompts via `@clack/prompts`: project name, database adapter, optional modules, AI rules, package manager
- Template engine: copies `templates/base`, merges selected modules, substitutes `{{PLACEHOLDER}}` tokens
- `module.json` manifest system with `add`, `replace`, and `append` merge strategies
- Conditional file and dependency resolution for Turso vs Supabase database adapters
- Automatic `.env.local` generation from module `envVars`
- Post-scaffold install step and next-steps output

#### Shared packages

- `@create-fedi-app/fedi-types` — TypeScript declarations for `window.webln`, `window.nostr`, and `window.fediInternal`
- `@create-fedi-app/webln` — WebLN provider, hooks, and dev mock
- `@create-fedi-app/nostr` — NIP-07 provider, hooks, and dev mock with deterministic test keypair
- `@create-fedi-app/ui` — Fedi-themed shadcn/ui primitives (`SatsAmount`, `ConnectionBadge`, `MiniAppLayout`, `DemoSection`, `FediSafeArea`, `LoadingSpinner`, and base UI components)

#### Base template

- Next.js 16 App Router scaffold with Tailwind CSS v4, `@t3-oss/env-nextjs`, and `proxy.ts`
- Inlined WebLN and Nostr providers under `lib/webln` and `lib/nostr` for standalone generated projects
- `FediDevToolbar` for toggling mock providers during local development
- Demo hub at `/demo` linking to module demo routes

#### Module templates

Always included:

- **webln-payments** — `PayButton`, `InvoiceCard`, `PaymentHistory`, payment flow hook, QR invoices, Vitest and Playwright tests
- **nostr-identity** — `IdentityBadge`, `SignedMessage`, `NostrLogin`, identity flow hook, deterministic avatar colors
- **ecash-balance** — `BalanceDisplay`, `FediVersionBadge`, `InstallMiniAppButton`, `useFediInternal` integration

Optional (CLI multiselect):

- **payment-gated-content** — server-side payment gate with HMAC cookies, `PayGate` component, gated article demo
- **lnurl** — LNURL-pay, LNURL-auth, LNURL-withdraw API routes and UI components
- **ai-chat-gated** — pay-per-message AI chat via WebLN + Vercel AI SDK streaming
- **ai-assistant** — free AI assistant with provider-agnostic Vercel AI SDK setup
- **multispend-demo** — threshold spending proposal UI with Nostr-signed approvals
- **nostr-feed** — relay subscription, note publishing, and zap button (NIP-57)
- **database** — Drizzle ORM CRUD with Turso (libSQL) and Supabase adapters, migrations, and drizzle-kit scripts
- **ai-rules** — `.ai/rules/` agent context (`CLAUDE.md`, `.cursorrules`, Copilot instructions, and per-topic rule files)

#### Website (`apps/www`)

- Landing page at [fedi.keeganfrancis.com](https://fedi.keeganfrancis.com) with CLI demo, module showcase, and Fedi explainer
- Fumadocs documentation: quickstart, CLI reference, Fedi API guides, per-module docs, patterns, testing, and deployment

#### Design and quality

- Fedi design tokens (near-black surfaces, `#FF6B35` accent, Bricolage Grotesque + DM Sans + JetBrains Mono)
- Impeccible anti-slop compliance across templates, UI package, and generated projects (documented in `DESIGN_AUDIT.md`)
- Em-dash copy cleanup, `#fff` removal on accent buttons, TypeScript fixes in module templates

### Changed

- ESLint migrated from legacy `FlatCompat` to native flat config (`eslint.config.mjs`) for Next.js 16 + ESLint 9 compatibility
- Turbo `globalDependencies` now includes root config files so cache invalidates on lint/tsconfig changes
- Provider packages duplicated into base template (intentional) so generated apps have no workspace dependencies

### Fixed

- Nostr mock test: removed invalid `pubkey` field from `UnsignedNostrEvent` test fixture
- `apps/www` lint script: replaced removed `next lint` with direct `eslint app/` invocation
- `InstallMiniAppButton`: narrowed null check for `installMiniApp` before async handler
- `useMultispendDemo`: explicit status type to allow state transitions beyond literal `'open'`

[0.1.0]: https://github.com/keeganfrancis/create-fedi-app/releases/tag/v0.1.0
