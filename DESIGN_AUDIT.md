# Design Audit — Prompt 2.14

**Date:** 2026-05-31  
**Tooling:** `npx impeccable detect` v2.3.2, manual review of `apps/www/app/page.tsx` and landing components  
**Generated project:** `audit-test` (all optional modules, Turso, bun)

---

## Executive summary

| Check | Result |
|-------|--------|
| `impeccable detect` on `audit-test/app` + `audit-test/components` | **0 findings** |
| `impeccable detect` on templates + `apps/www` + `packages/ui/src/components` | **0 findings** |
| AI slop category | **0** |
| Landing page manual review | **Pass** |
| Generated project `bun run build` | **Pass** (after fixes below) |

Report artifact: [`impeccable-report.json`](./impeccable-report.json) (`[]`)

---

## Audit procedure

```bash
# Scaffold full project (all modules, Turso, bun)
bun -e "import { scaffold } from './apps/cli/src/scaffold.ts'; ..."

cd audit-test && bun install && bun run build

# Detect (TSX/app surfaces — see note on CSS below)
npx impeccable detect audit-test/app audit-test/components --json
npx impeccable detect templates/modules apps/www/components packages/ui/src/components --json
```

Manual review covered `apps/www/app/page.tsx` and all files under `apps/www/components/landing/`.

---

## Initial findings

### 1. False positive — `packages/ui/src/globals.css`

`impeccable detect packages/ui/src` reported `[em-dash-overuse] 57 em-dashes` because CSS custom properties use the `--` prefix. This is not body copy.

**Resolution:** Exclude `*.css` from impeccable scans in CI. Scan `app/`, `components/`, and `packages/ui/src/components` instead. No CSS change required.

### 2. LLM cadence — em-dashes in UI copy

User-visible strings across module templates used em-dashes (`—`), an Impeccible copy tell. Not auto-detected on all paths but addressed per prompt priority #3.

**Resolution:** Replaced with periods, colons, commas, or parentheses in 20+ template files. Example:

| Before | After |
|--------|-------|
| `Published — waiting for relays…` | `Published. Waiting for relays…` |
| `Open source — MIT license` | `Open source under the MIT license` |
| `Groups — DAOs, communities, teams — need` | `Groups (DAOs, communities, teams) need` |

### 3. Hard-coded `#fff` on accent buttons

Impeccible design law: never use pure `#fff`. Found on primary buttons across module demos and dev toolbar.

**Resolution:** Replaced `color: '#fff'` with `color: 'var(--color-primary-foreground)'` in 13 component files. Dev toolbar toggle knob uses `var(--color-text)`.

### 4. TypeScript — `InstallMiniAppButton`

Build failed: `installMiniApp` possibly null inside async handler despite early return.

**File:** `templates/modules/ecash-balance/components/fedi/InstallMiniAppButton.tsx`

**Fix:** Assign narrowed reference after guard (`const installMiniApp = installMiniAppFn`) before defining `handleInstall`.

### 5. TypeScript — `useMultispendDemo`

Build failed: `status` inferred as literal `'open'` when assigning `'approved'`.

**File:** `templates/modules/multispend-demo/hooks/useMultispendDemo.ts`

**Fix:** Explicit type `let status: TProposalStatus = proposal.status`.

### 6. TypeScript — nostr-feed imports

Build failed on generated project with wrong `fedi-types` path and missing `Filter` export from `nostr-tools/core`.

**Files:**

- `templates/modules/nostr-feed/lib/nostr-zap.ts` — `'../fedi-types'` → `'./fedi-types'`
- `templates/modules/nostr-feed/lib/nostr/relay.ts` — import `Filter` from `'nostr-tools/filter'`

---

## Landing page manual review (`apps/www/app/page.tsx`)

Highest-visibility marketing surface. Checked against Impeccible absolute bans and anti-slop rules.

| Rule | Status | Notes |
|------|--------|-------|
| No Inter / Geist / Space Grotesk | Pass | Bricolage Grotesque + DM Sans via layout |
| No purple gradients / cyan-on-dark | Pass | Fedi orange accent only |
| No glassmorphism / glow shadows | Pass | Flat borders, no blur cards |
| No side-stripe accent borders | Pass | Uniform `border-[var(--color-border)]` |
| No identical icon-card grids | Pass | Features use definition list; modules use stacked rows |
| No gradient text | Pass | Solid token colors |
| No hero eyebrow pills / 01-02-03 | Pass | Clean H1 + subcopy |
| No cream backgrounds | Pass | Near-black `#0A0A0A` |
| No em-dashes in visible copy | Pass | Fixed footer copy |
| Semantic HTML / heading hierarchy | Pass | Single H1 in hero; section H2s with `aria-labelledby` |
| Motion | Pass | `ease-[cubic-bezier(0.25,1,0.5,1)]` only; no bounce |

**Fix applied:** `SiteFooter.tsx` — em-dash removed from license line.

---

## Files changed (design audit)

### Landing (`apps/www`)

- `components/landing/SiteFooter.tsx` — em-dash copy fix

### Base template

- `components/FediDevToolbar/FediDevToolbar.tsx` — `#fff` → design tokens

### Module templates (em-dash + `#fff` sweep)

- `modules/nostr-feed/components/nostr/PublishNote.tsx`, `NoteFeed.tsx`
- `modules/nostr-feed/lib/nostr-zap.ts`, `lib/nostr/relay.ts`
- `modules/multispend-demo/**` (client, demo, proposal, approval, utils, hook)
- `modules/ai-assistant/**`
- `modules/lnurl/**`
- `modules/payment-gated-content/app/demo/payment-gated/**`
- `modules/ecash-balance/app/demo/ecash/page.tsx`, `components/fedi/InstallMiniAppButton.tsx`
- `modules/nostr-identity/**`
- `modules/webln-payments/**`
- `modules/ai-chat-gated/components/ai/PaymentGate.tsx`
- `base/lib/nostr/mock.ts`, `base/vitest.setup.ts`

---

## Recommended CI command

```bash
npx impeccable detect \
  templates/base/app templates/base/components templates/modules \
  apps/www/app apps/www/components \
  packages/ui/src/components \
  --json
```

Do **not** scan `packages/ui/src/globals.css` alone; the `--` custom-property syntax triggers a false positive.

For end-to-end verification, generate a project and scan its output:

```bash
npx impeccable detect app/ components/ --json   # inside generated project
```

---

## Prior audit reference

Prompt 2.1 visual audit: [`packages/ui/VISUAL_AUDIT.md`](./packages/ui/VISUAL_AUDIT.md). This pass extends that work to all module templates, the docs landing page, and a full generated project build.
