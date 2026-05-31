# CURSOR_HANDOFF.md

**Project:** `create-fedi-app` — a `npx create-fedi-app@latest` monorepo CLI scaffolder for Fedi Bitcoin mini apps.
**Phase 1 (Claude Code, prompts 1.1–1.10): COMPLETE.**
**Next:** Phase 2 (Cursor, prompts 2.1–2.17).
**Generated:** Prompt 1.10 completion gate, 2026-05-31.

Open this file and `PROMPT_PLAN.md` in Cursor before starting. `PROMPT_PLAN.md` is the authoritative spec; this file is the current-state snapshot.

---

## 1. Gate status — all four checks pass with zero errors

Run from the repo root (`bun` must be on `PATH`: `export PATH="$HOME/.bun/bin:$PATH"`):

| Check | Command | Result | Scope |
|-------|---------|--------|-------|
| Types | `bun run typecheck` | ✅ exit 0 | all 6 workspaces (fedi-types, nostr, ui, webln, cli, www) |
| Lint | `bun run lint` | ✅ exit 0, no warnings | `www` (`app/`) + `@create-fedi-app/ui` (`src/`) |
| Test | `bun run test` | ✅ exit 0 | webln (3 tests), nostr (2 tests), ui (vitest, no test files yet) |
| Build | `bun run build` | ✅ exit 0 | `www` (next build) + `create-fedi-app` CLI (tsup → `dist/`) |

The source-only packages (`fedi-types`, `nostr`, `webln`, `ui`) have **no build step** — they are consumed as TypeScript source via path aliases and inlined into generated projects.

### Fixes applied during 1.10 to make the gate pass

These were real failures found and fixed in this prompt — note them, they affect files Phase 2 will touch:

1. **Typecheck** — `packages/nostr/__tests__/mock.test.ts` passed a `pubkey` field to `signEvent()`, but `UnsignedNostrEvent = Omit<NostrEvent, 'id' | 'pubkey' | 'sig'>` (the 1.9 fix). Removed the now-invalid `pubkey` property and the unused local. The mock injects `pubkey` internally from its test keypair.
2. **Lint (dependencies)** — the root ESLint config referenced `@eslint/eslintrc` + `eslint-config-next` but **neither was installed**. Added `eslint-config-next@^16.2.6` to root `devDependencies` (matches Next 16.2.6; peer `eslint >=9` satisfied).
3. **Lint (`next lint` removed)** — `apps/www` ran `next lint`, which **Next.js 16 removed**; it misread `lint` as a directory. Changed `apps/www` lint script to `eslint app/`.
4. **Lint (FlatCompat crash)** — the old `eslint.config.js` used `FlatCompat`, which crashes ESLint 9 + `eslint-config-next` 16 (`TypeError: Converting circular structure to JSON` from `eslint-plugin-react`'s self-referential `configs`). **Rewrote as `eslint.config.mjs`** importing the native flat configs `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` directly (the correct Next 16 + ESLint 9 setup). `@eslint/eslintrc` was removed again since `FlatCompat` is gone. The `.mjs` extension also silences the `MODULE_TYPELESS_PACKAGE_JSON` warning without forcing `"type":"module"` on the whole monorepo. `@next/next/no-html-link-for-pages` is disabled (App Router only — no `pages/` dir exists).
5. **Turbo cache correctness** — `turbo.json` did not hash root config files, so a lint-config change served a stale cache hit (a false pass during this very gate). Added `"globalDependencies": ["tsconfig.base.json", "eslint.config.mjs", ".prettierrc"]` so config edits now bust the cache.

---

## 2. What Phase 1 built — every file created

### Root / tooling
- `package.json` — monorepo root; workspaces `apps/*`, `packages/*`; scripts delegate to Turbo. `packageManager: bun@1.2.0`.
- `turbo.json` — task pipeline (`build`/`dev`/`lint`/`typecheck`/`test`/`clean`), `globalEnv`, `globalDependencies` (added 1.10).
- `tsconfig.json`, `tsconfig.base.json` — shared strict TS config; `bundler` resolution; `@create-fedi-app/*` → `packages/*/src/index.ts` path aliases.
- `eslint.config.mjs` — flat config (rewritten 1.10): `next/core-web-vitals` + `next/typescript`, `no-unused-vars`/`no-explicit-any` as warnings.
- `.prettierrc` (singleQuote, semi, trailingComma: all, tabWidth: 2), `.gitignore`.
- `vitest.config.ts` (root), `playwright.config.ts` (E2E).
- `bun.lock`, `PROMPT_PLAN.md` (the spec).
- `.github/workflows/ci.yml`, `.github/workflows/release.yml` (Prompt 1.8).

### `apps/cli/` — the `create-fedi-app` CLI (Prompt 1.2; smoke-tested 1.9)
- `src/index.ts` — entry / orchestration.
- `src/types.ts` — config + module types.
- `src/prompts.ts` — interactive prompt flow (name, database, modules, ai-rules, package manager).
- `src/scaffold.ts` — copies `templates/base`, applies selected modules, substitutes `{{PLACEHOLDER}}` tokens.
- `src/modules.ts` — module resolution + `module.json` `merge` strategies.
- `src/install.ts` — runs the chosen package manager's install.
- `src/next-steps.ts` — prints post-generation instructions.
- `tsup.config.ts`, `package.json`, `tsconfig.json`.
- ⚠️ `my-fedi-app/` — **leftover smoke-test artifact** (see Known Issues).

### `apps/www/` — marketing + docs site skeleton (Prompt 1.1; built out in 2.12 / 2.13)
- `app/layout.tsx`, `app/page.tsx` — **placeholder only** (`<main>create-fedi-app</main>`).
- `next-env.d.ts`, `package.json` (fumadocs deps present but unused yet), `tsconfig.json`.

### `packages/fedi-types/` — shared types, no runtime (Prompt 1.1)
- `src/index.ts`, `src/webln.d.ts`, `src/nostr.d.ts`, `src/fedi-internal.d.ts`, `package.json`, `tsconfig.json`.
- Key types: `NostrEvent`, `UnsignedNostrEvent` (omits `id|pubkey|sig`), `Nip04`, `NostrProvider`; WebLN provider types; `window.fediInternal` v0/v1/v2.

### `packages/webln/` — WebLN provider package (Prompt 1.3)
- `src/provider.tsx`, `src/mock.ts`, `src/hooks.ts`, `src/index.ts`.
- `__tests__/mock.test.ts` (3 tests), `package.json`, `tsconfig.json`, `vitest.config.ts`.

### `packages/nostr/` — Nostr provider package (Prompt 1.3)
- `src/provider.tsx`, `src/mock.ts`, `src/hooks.ts`, `src/index.ts`.
- `__tests__/mock.test.ts` (2 tests; **fixed in 1.10**), `package.json`, `tsconfig.json`, `vitest.config.ts`.
- Mock uses a known secp256k1 test keypair (`@noble/curves` schnorr); never for production.

### `packages/ui/` — shadcn/ui with Fedi theme (Prompt 1.7)
- `src/index.ts`, `src/globals.css`, `src/lib/utils.ts`, `src/theme/tokens.ts`.
- `src/components/`: `ConnectionBadge.tsx`, `DemoSection.tsx`, `MiniAppLayout.tsx`, `SatsAmount.tsx`.
- `src/components/ui/`: `badge`, `button`, `card`, `input`, `label`, `separator`.
- `components.json`, `package.json`, `tsconfig.json`, `vitest.config.ts`.

### `templates/base/` — base Next.js 16 scaffold (the generated app; Prompt 1.4)
- `app/layout.tsx`, `app/page.tsx`, `app/demo/page.tsx`, `app/globals.css`.
- `components/providers.tsx` (WebLN + Nostr providers + dev-mock state context), `components/FediDevToolbar/FediDevToolbar.tsx`.
- `lib/fedi.ts` (`isInFedi`, `getFediInternalVersion`, `formatSats`, `shortenNpub`), `lib/utils.ts`, `lib/fedi-types.ts`.
- `lib/webln/` (`index`, `provider`, `mock`, `hooks`) and `lib/nostr/` (`index`, `provider`, `mock`, `hooks`) — **inlined copies** of the provider packages (1.9 fix; see Known Issues #5).
- `hooks/useFediInternal.ts`.
- `env.ts`, `proxy.ts` (Next 16 replacement for middleware), `next.config.ts`.
- `package.json`, `tsconfig.json` (**standalone**, no `extends ../../` — 1.9 fix), `vitest.config.ts`, `vitest.setup.ts`, `.env.example`.

### `templates/modules/` — 11 module templates (Prompts 1.5, 1.6)
See the state table in §3.

### `tests/`
- `tests/e2e/home.spec.ts` — Playwright E2E for the generated home page.

---

## 3. Module template state — stubbed vs implemented

The CLI always includes `webln-payments`, `nostr-identity`, `ecash-balance`; the rest are optional (prompted). `ai-rules` is separately prompted.

| Module | State | Files present | Phase 2 prompt |
|--------|-------|---------------|----------------|
| **ai-rules** | ✅ **Complete** | `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, `rules/{OVERVIEW,webln,nostr,fedi-api,design-system,patterns,architecture,testing}.md`, `module.json` | — (done) |
| **webln-payments** | 🟡 Functional scaffold | `components/webln/PayButton.tsx`, `InvoiceCard.tsx`; `hooks/usePaymentFlow.ts`; `app/demo/webln/page.tsx`; `module.json` | 2.2 |
| **nostr-identity** | 🟡 Functional scaffold | `components/nostr/IdentityBadge.tsx`; `hooks/useIdentityFlow.ts`; `app/demo/nostr/page.tsx`; `module.json` | 2.3 |
| **ecash-balance** | 🟡 Functional scaffold | `components/fedi/BalanceDisplay.tsx`; `hooks/useFediBalance.ts`; `app/demo/ecash/page.tsx`; `module.json` | 2.4 |
| **payment-gated-content** | 🔴 Stub | `module.json` only | 2.5 |
| **lnurl** | 🔴 Stub | `module.json` only | 2.6 |
| **ai-chat-gated** | 🔴 Stub | `module.json` only (env vars defined) | 2.7 |
| **ai-assistant** | 🔴 Stub | `module.json` only (env vars defined) | 2.8 |
| **multispend-demo** | 🔴 Stub | `module.json` only | 2.9 |
| **nostr-feed** | 🔴 Stub | `module.json` only (relay env var) | 2.10 |
| **database** | 🔴 Stub | `module.json` only (Turso/Supabase env vars) | 2.11 |

**"Functional scaffold"** = components are real, typed, wired to the inlined provider hooks (`lib/webln`, `lib/nostr`), token-styled, and render in dev with mock providers — but they are **not** the full feature set the Phase 2 prompt specifies. Specifically still missing:
- **webln-payments (2.2):** `PaymentHistory.tsx`; real QR rendering via `qrcode.react` in `InvoiceCard`; success-animation polish; Vitest hook tests + a Playwright E2E flow.
- **nostr-identity (2.3):** `SignedMessage.tsx`, `NostrLogin.tsx`; deterministic avatar color from pubkey; npub display polish.
- **ecash-balance (2.4):** `FediVersionBadge.tsx`; `installMiniApp` button; clickable installed-apps list.

**"Stub"** = only `module.json` exists (metadata: name, description, dependencies, env vars, empty `files: []`). No components/routes yet — Phase 2 builds them from scratch.

---

## 4. Known issues / TODOs

1. **Leftover smoke-test project: `apps/cli/my-fedi-app/`** — a generated project from an early 1.9 run (dated before the inlining fix). It is not a workspace and does not affect the checks, but it is clutter that may confuse Cursor. **Recommend removing it:** `rm -rf apps/cli/my-fedi-app`. (The 1.9 "Clean up" step did not fully run.)
2. **`bun` version pin mismatch** — `package.json` pins `packageManager: bun@1.2.0`; the dev environment has bun `1.3.14`. Everything works; consider bumping the pin for consistency.
3. **`apps/www` is a placeholder** — `app/page.tsx` is one line. Full landing page = Prompt 2.12; Fumadocs docs = Prompt 2.13. The `fumadocs-*` deps are already in `apps/www/package.json` but not yet wired (no `content/`, no `source.config.ts`).
4. **`packages/ui` has no test files** — its `test` script runs Vitest with zero specs (passes as a no-op). Component tests are still to be written.
5. **Provider source is intentionally duplicated** — canonical in `packages/webln` + `packages/nostr`; an **inlined copy** lives in `templates/base/lib/{webln,nostr}`. This is the deliberate 1.9 architectural fix: standalone generated projects cannot resolve `workspace:*` deps, so the template ships its own copy. **When editing provider logic, update both places.**
6. **Lint coverage is narrow** — only `ui` (`src/`) and `www` (`app/`) are linted. `apps/cli/src` is not linted, and `templates/` is excluded by design (files contain `{{PLACEHOLDER}}` tokens and are not valid standalone TS until generated). Consider adding CLI linting in Phase 2.
7. **No `.eslintrc.json`** — the spec (1.1) said `.eslintrc.json`, but the implementation uses a flat `eslint.config.mjs` (the modern ESLint 9 standard). This is intentional and correct for ESLint 9 + Next 16.

---

## 5. Phase 2 task list (Cursor — prompts 2.1 → 2.17, in order)

Each is a separate Cursor session. Full detail is in `PROMPT_PLAN.md` (§ "PHASE 2 — CURSOR"). Summary:

| # | Title | Core deliverable |
|---|-------|------------------|
| **2.1** | Design system polish | Make `packages/ui` + `templates/base/app/globals.css` fully Impeccible-compliant. Run `npx impeccable detect`. Add `<FediSafeArea>`, `<LoadingSpinner>` (CSS-only). Pixel-perfect at 390px. Verify font loading. |
| **2.2** | webln-payments (complete) | `PayButton` (full), `InvoiceCard` (QR via `qrcode.react`), **`PaymentHistory`** (localStorage), polished demo page. Vitest + one Playwright E2E. |
| **2.3** | nostr-identity (complete) | `IdentityBadge` (deterministic HSL avatar), **`SignedMessage`**, **`NostrLogin`** (drop-in auth), demo page. |
| **2.4** | ecash-balance (complete) | `BalanceDisplay` (+ installed apps, `installMiniApp`), **`FediVersionBadge`**, demo page. |
| **2.5** | payment-gated-content (complete) | Most complex. `proxy.ts` (merge: `replace`), `lib/payment-gate.ts`, `lib/payment-store.ts`, `PayGate.tsx`, demo. Server-side payment-token verification. |
| **2.6** | lnurl (complete) | API routes: `lnurlp/[username]`, `lnurlauth`, `lnurlw`. `LnurlQR`, `LnurlPay`, demo. bech32 via `@scure/base`. |
| **2.7** | ai-chat-gated (complete) | Flagship. `api/chat` (`streamText`), `api/chat/invoice`, `GatedChat`, `ChatMessage` (`react-markdown`), `PaymentGate`, `lib/ai/providers.ts`. Pay-per-message via WebLN. |
| **2.8** | ai-assistant (complete) | `api/assistant` (streaming), `Assistant`, `AssistantProvider` (`useChat`), shared `lib/ai/providers.ts` (de-dupe with 2.7), demo. |
| **2.9** | multispend-demo (complete) | Mock workflow UI: `MultispendProposal`, `ApprovalVote` (`signEvent`), `ProposalList`, `MultispendDemo`, demo. |
| **2.10** | nostr-feed (complete) | `lib/nostr/relay.ts` (`nostr-tools`), `NoteFeed`, `NoteCard`, `PublishNote`, `ZapButton` (NIP-57), demo. |
| **2.11** | database (complete) | Turso **and** Supabase via Drizzle. `lib/db/index.ts`, `lib/db/schema.ts` (`payments` table), `drizzle.config.ts`, migrations, `env.ts` additions. Conditional imports by `DATABASE_URL` prefix. |
| **2.12** | www landing page | Build `apps/www/app/page.tsx`: hero `Build on Fedi.`, feature list (man-page style), static CLI demo, module showcase, Fedi explainer, footer. **No** SaaS-hero tropes. |
| **2.13** | Fumadocs docs | `bunx fumadocs-cli init` in `apps/www`. Write every `.mdx` under `content/docs/` (getting-started, APIs, per-module, patterns, testing, deployment). |
| **2.14** | Impeccible full audit | `npx impeccable detect app/ components/` on a fully generated project. Fix every finding (AI-slop must be zero). Document in `DESIGN_AUDIT.md`. |
| **2.15** | README + contributing | `README.md`, `CONTRIBUTING.md` (how to add a module), `CHANGELOG.md` (v0.1.0). |
| **2.16** | npm publish + deploy | CLI `prepublishOnly`, `npm pack` check, `vercel.json` for `apps/www` → `fedi.keeganfrancis.com`, release workflow. |
| **2.17** | Final integration test | Full E2E: root checks → CLI generates `final-test` (all modules, Turso) → install/typecheck/build the generated project → www builds → impeccable check → `--help`. |

---

## 6. Design reference (copied verbatim from `PROMPT_PLAN.md`)

### Design tokens
```
bg:           #0A0A0A   (near-black, not pure)
surface:      #141414
surface-2:    #1C1C1C
border:       rgba(255,255,255,0.08)
accent:       #FF6B35   (Fedi orange)
accent-dim:   rgba(255,107,53,0.15)
text:         #F0EEE9
text-muted:   #8A8880
text-subtle:  #4A4845
```

### Design constraints — Impeccible.style anti-slop (non-negotiable)
- NO Inter, Geist, or Space Grotesk fonts anywhere
- NO purple/violet gradients or cyan-on-dark palettes
- NO glassmorphism, box-shadow glows, or neon accents
- NO side-tab accent borders on rounded cards
- NO icon-tile-stacked-above-heading pattern
- NO nested cards (cards inside cards)
- NO gradient text on headings or metrics
- NO hero eyebrow pills or 01/02/03 section markers
- NO cream or beige page backgrounds
- NO marketing buzzwords: supercharge, empower, streamline, world-class, next-generation
- Border radius: 4px tags, 8px inputs/buttons (default), 12px cards (max)
- Typography: minimum 1.25× ratio between heading steps; body line-height 1.6–1.7; max 75ch line length
- Motion: ease-out-quart/quint only; no bounce, no elastic, no hover image zoom

### Fonts
DM Sans (body) · Bricolage Grotesque (display) · JetBrains Mono (code) — loaded via `next/font/google`.

### Fedi browser APIs (injected by Fedi's in-app browser; all `undefined` outside the WebView — every usage needs a graceful fallback)
- `window.webln` — WebLN provider (`sendPayment`, `makeInvoice`, `getInfo`, `signMessage`, `sendKeysend`)
- `window.nostr` — NIP-07 signer (`getPublicKey`, `signEvent`, `getRelays`, `nip04.encrypt`, `nip04.decrypt`)
- `window.fediInternal` — `v0 | v1 | v2` (v2 adds `getInstalledMiniApps`, `installMiniApp`)

---

## 7. Quick start for Cursor

```bash
export PATH="$HOME/.bun/bin:$PATH"   # ensure bun is found by turbo
bun install
bun run typecheck && bun run lint && bun run test && bun run build   # all green

# generate a project to test against:
node apps/cli/dist/index.js          # follow prompts (build the CLI first if dist/ is stale: bun run build)
```

Verified package versions (some differ from the spec's aspirational numbers): `next@16.2.6`, `eslint-config-next@16.2.6`, `@noble/curves@^2.2.0`, `@scure/base@^2.2.0` (bech32 lives here — `@scure/bech32` does not exist), `lucide-react@^0.499.0`, `fumadocs-core/ui@^16.9.3`, `fumadocs-mdx@^15.0.10`.
