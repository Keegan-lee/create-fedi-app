# create-fedi-app — Launch Plan

<!--
  Project: create-fedi-app
  Owner: Keegan-Lee Francis
  Site: fedi.keeganfrancis.com
  npm: create-fedi-app@0.1.0
  Status: All PROMPT_PLAN steps complete — ready for launch verification
-->

Runbook for manually verifying, deploying, and publishing the first public release.

---

## Overview

| Artifact | Destination | Method |
|----------|-------------|--------|
| CLI package | [npmjs.com/package/create-fedi-app](https://www.npmjs.com/package/create-fedi-app) | Git tag → GitHub Actions |
| Docs + landing site | [fedi.keeganfrancis.com](https://fedi.keeganfrancis.com) | Vercel (monorepo root: `apps/www`) |
| Source | [github.com/keeganfrancis/create-fedi-app](https://github.com/keeganfrancis/create-fedi-app) | GitHub |

**Launch order:** automated checks → manual testing → deploy www → publish npm → post-launch smoke test.

---

## Prerequisites

Before starting, confirm you have:

- [x] Bun 1.2+ and Node 22+ installed locally
- [ ] Access to the `keeganfrancis/create-fedi-app` GitHub repo (push + tag permissions)
- [ ] npm account with publish access to the `create-fedi-app` package
- [ ] `NPM_TOKEN` secret configured on the GitHub repo (Automation token, publish-only scope)
- [ ] Vercel project linked to the repo with access to `apps/www`
- [ ] DNS control for `fedi.keeganfrancis.com` (CNAME → Vercel)
- [ ] Fedi wallet installed on a device (Mutinynet) for in-wallet smoke tests
- [ ] Optional: Doppler configured if you use it for local secrets during AI module testing

---

## Phase 1 — Automated verification

Run from the repo root. All commands must exit zero before proceeding to manual testing.

```bash
cd create-fedi-app
bun install
bun run typecheck && echo "✓ Types"
bun run lint       && echo "✓ Lint"
bun run test       && echo "✓ Tests"
bun run build      && echo "✓ Build"
```

Confirm CI is green on `main`:

- [ ] [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) — typecheck, lint, test, build

### CLI tarball inspection

Verify the npm package contains only `dist/` (CLI entry + templates):

```bash
cd apps/cli
bun run build
npm pack
tar -tzf create-fedi-app-*.tgz | head -30
```

Expected contents:

- [ ] `package/dist/index.js` (shebanged CLI entry)
- [ ] `package/dist/templates/base/` and `package/dist/templates/modules/`
- [ ] No `src/`, `templates/` at repo root, or dev-only files in the tarball

Clean up the tarball after inspection:

```bash
rm create-fedi-app-*.tgz
cd ../..
```

### Full-project generation smoke test

Generate a project with all modules enabled (mirrors PROMPT 2.17):

```bash
node apps/cli/dist/index.js
# Project name: launch-test
# Database: turso
# Optional modules: select all
# AI rules: yes
# AI provider: agnostic
# Package manager: bun

cd launch-test
bun install
bun run typecheck && echo "✓ Generated types"
bun run build       && echo "✓ Generated build"
bun test            && echo "✓ Generated unit tests"
cd ..
```

- [ ] CLI completes without errors
- [ ] `.env.local` contains keys for all selected modules
- [ ] `bun run build` succeeds in the generated project

### www build

```bash
cd apps/www
bun run build && echo "✓ www builds"
cd ../..
```

- [ ] Production build completes with no errors

---

## Phase 2 — Manual testing

### 2.1 CLI interactive flow

Run the CLI locally and walk through every prompt path.

```bash
node apps/cli/dist/index.js
```

| Scenario | Settings | Verify |
|----------|----------|--------|
| Minimal project | Name only, database **None**, no optional modules, AI rules **No**, bun | Base + always-on modules only; `/demo` links to webln, nostr, ecash |
| Full project | All optional modules, database **turso**, AI rules **Yes**, AI provider selected | All `/demo/*` routes present; Drizzle files and Turso deps in `package.json` |
| Supabase variant | Database **supabase**, database module selected | `@supabase/supabase-js` in deps, not `@libsql/client` |
| Package managers | Repeat once with **pnpm**, once with **npm** | Correct lockfile generated; install instructions match |

Additional CLI checks:

- [ ] `node apps/cli/dist/index.js --help` prints usage
- [ ] Cancelled prompt (Ctrl+C) exits cleanly with no partial directory
- [ ] Project name with invalid characters is rejected or sanitized
- [ ] Post-scaffold output shows correct `cd`, install, and `dev` commands

### 2.2 Generated app — browser (mock providers)

From a freshly generated project (`launch-test` or new):

```bash
cd launch-test   # or your test project
bun dev
```

Open `http://localhost:3000`.

**Fedi Dev Toolbar** (bottom-right, dev only):

- [ ] Toggle **Mock WebLN** — WebLN-dependent UI responds
- [ ] Toggle **Mock Nostr** — Nostr login/identity UI responds
- [ ] Toggle **fail: ON** — payment buttons show error state, no crash
- [ ] Toolbar hidden when `NODE_ENV=production` (`bun run build && bun start`)

**Always-included module demos:**

| Route | Test |
|-------|------|
| `/demo/webln` | Enable mock WebLN → pay demo invoice → success state |
| `/demo/nostr` | Enable mock Nostr → connect → sign message → signature displayed |
| `/demo/ecash` | Balance display renders; version badge shows mock API version |

**Optional module demos** (if all modules selected):

| Route | Test |
|-------|------|
| `/demo/payment-gated` | Pay gate → unlock article → refresh keeps access (cookie) |
| `/demo/payment-gated/article` | Direct access blocked without payment |
| `/demo/lnurl` | LNURL-pay/auth/withdraw UI renders; forms submit without JS errors |
| `/demo/ai-chat` | Requires `AI_PROVIDER` + `AI_API_KEY` in `.env.local`; pay-per-message flow works with mock WebLN |
| `/demo/assistant` | Chat streams a response with valid AI keys |
| `/demo/multispend` | Create proposal → cast Nostr-signed vote → status updates |
| `/demo/nostr-feed` | Feed loads from relay; publish note appears; zap button triggers mock payment |
| Database demo | CRUD page loads; Turso/Supabase connection works with real credentials |

**Graceful degradation** (regular browser, mocks off):

- [ ] Home page loads without console errors
- [ ] WebLN/Nostr buttons show "not available" or equivalent fallback copy
- [ ] No unhandled promise rejections in DevTools console

### 2.3 Generated app — Vitest and Playwright

From the generated project:

```bash
bun test                              # Vitest unit tests
bunx playwright install chromium      # first run only
bun run test:e2e                      # Playwright (webln-payments module)
```

- [ ] All Vitest tests pass
- [ ] Playwright webln payment spec passes against dev server

### 2.4 Generated app — Fedi wallet (Mutinynet)

Real-wallet testing requires a reachable HTTPS or LAN URL.

1. Install Fedi: [fedi.xyz/get-the-app](https://fedi.xyz/get-the-app)
2. Join a Mutinynet test federation: [Fedi Fedimint intro](https://fedibtc.github.io/fedi-docs/docs/fedimint/intro/)
3. Expose your dev server:
   - **LAN:** `http://<your-lan-ip>:3000` (same Wi‑Fi as phone)
   - **Remote:** ngrok or Vercel preview URL
4. Fedi → Settings → Developer / Custom Mini Apps → add your URL
5. Open the mini app from Fedi's app list

In-wallet checks:

- [ ] App loads in mobile WebView without horizontal scroll
- [ ] `window.webln` available — real Lightning payment succeeds on Mutinynet
- [ ] `window.nostr` available — identity connect and sign message work
- [ ] `window.fediInternal` available — ecash balance displays
- [ ] Safe area / notch padding looks correct (`FediSafeArea` component)

### 2.5 www site — landing page

Run locally:

```bash
cd apps/www
bun dev
```

Open `http://localhost:3000`.

- [ ] Hero headline reads **Build on Fedi.** (no eyebrow pill, no gradient text)
- [ ] `npx create-fedi-app@latest` code block copies to clipboard
- [ ] "Read the docs" link navigates to `/docs`
- [ ] Module showcase lists all modules with accurate descriptions
- [ ] Footer: MIT license, GitHub link, docs link
- [ ] No horizontal scroll at 375px viewport width
- [ ] Fonts load: Bricolage Grotesque (display), DM Sans (body)
- [ ] Fedi orange accent (`#FF6B35`) on interactive elements

### 2.6 www site — documentation (Fumadocs)

Browse every major docs section at `/docs`:

- [ ] `/docs` — Getting Started overview renders
- [ ] `/docs/quickstart` — scaffold steps accurate
- [ ] `/docs/cli/options` — all CLI prompts documented
- [ ] `/docs/apis/webln`, `/docs/apis/nostr`, `/docs/apis/fedi-internal` — API reference complete
- [ ] `/docs/modules/*` — one page per module, links work
- [ ] `/docs/patterns`, `/docs/testing`, `/docs/deployment` — render without MDX errors
- [ ] Docs search (`/api/search`) returns results for "webln", "nostr", "drizzle"
- [ ] Sidebar navigation highlights active page
- [ ] Code blocks are copyable; internal links resolve

### 2.7 Design quality gate (Impeccible)

Run on a generated full project before launch:

```bash
npm install -g impeccable
cd launch-test
npx impeccable detect app/ components/ --format summary
cd ..
```

- [ ] Zero "AI slop" category findings
- [ ] Zero browser-detectable Quality findings
- [ ] Landing page manually reviewed against [`DESIGN_AUDIT.md`](./DESIGN_AUDIT.md)

---

## Phase 3 — Deployment (www site)

Deploy the marketing and documentation site to Vercel.

### 3.1 Vercel project settings

| Setting | Value |
|---------|-------|
| Root Directory | `apps/www` |
| Framework Preset | Next.js |
| Install Command | `cd ../.. && bun install` (also in [`apps/www/vercel.json`](./apps/www/vercel.json)) |
| Build Command | `bun run build` |
| Include files outside Root Directory | **Enabled** (required for `@create-fedi-app/ui` workspace package) |

**Environment variables:** none required — see [`apps/www/.env.example`](./apps/www/.env.example).

### 3.2 First-time setup

1. Go to [vercel.com/new](https://vercel.com/new) → Import `keeganfrancis/create-fedi-app`
2. Set Root Directory to `apps/www`
3. Enable **Include source files outside of the Root Directory**
4. Deploy — confirm preview URL loads
5. Add custom domain: `fedi.keeganfrancis.com`
6. Configure DNS (at your registrar):
   - CNAME `fedi` → `cname.vercel-dns.com` (or the target Vercel provides)
7. Wait for TLS certificate provisioning

### 3.3 Production deploy

Push to `main` (or promote a preview deployment):

```bash
git push origin main
```

Or trigger manually from the Vercel dashboard → **Redeploy**.

Post-deploy verification:

- [ ] `https://fedi.keeganfrancis.com` loads the landing page
- [ ] `https://fedi.keeganfrancis.com/docs` loads documentation
- [ ] `https://fedi.keeganfrancis.com/docs/quickstart` renders correctly
- [ ] No mixed-content warnings in browser console
- [ ] Lighthouse: no critical accessibility regressions on landing page

---

## Phase 4 — Publishing (npm CLI)

### 4.1 Pre-publish checklist

- [ ] [`apps/cli/package.json`](./apps/cli/package.json) — name `create-fedi-app`, version `0.1.0`
- [ ] [`CHANGELOG.md`](./CHANGELOG.md) — v0.1.0 entry complete
- [ ] [`README.md`](./README.md) — quick start, module table, deploy instructions accurate
- [ ] All changes merged to `main` and CI green
- [ ] www site live at `fedi.keeganfrancis.com`
- [ ] `npm pack` tarball inspected (Phase 1)
- [ ] GitHub repo `NPM_TOKEN` secret set

### 4.2 npm account setup (one-time)

If not already done:

1. Log in to [npmjs.com](https://www.npmjs.com/) → Access Tokens
2. Generate an **Automation** token (publish-only, bypasses 2FA for CI)
3. Add to GitHub repo: Settings → Secrets → Actions → `NPM_TOKEN`

Confirm the package name is available (first publish only):

```bash
npm view create-fedi-app version 2>/dev/null || echo "Package name available"
```

### 4.3 Release via GitHub Actions (recommended)

The release workflow ([`.github/workflows/release.yml`](./.github/workflows/release.yml)) triggers on semver tags:

```bash
# From repo root, on main with all checks passing:
git tag v0.1.0
git push origin v0.1.0
```

The workflow will:

1. Run `bun run test`
2. Build the CLI (`apps/cli`)
3. Publish to npm with `npm publish --access public`
4. Comment on the commit: `Published create-fedi-app@0.1.0 to npm.`

Monitor: GitHub Actions → **Release** workflow.

- [ ] Workflow completes successfully
- [ ] Commit comment confirms published version
- [ ] [npmjs.com/package/create-fedi-app](https://www.npmjs.com/package/create-fedi-app) shows `0.1.0`

### 4.4 Manual npm publish (fallback)

Only if the GitHub Action fails:

```bash
cd apps/cli
bun run build
npm publish --access public
```

Requires `npm login` locally with publish permissions. Prefer the tagged release workflow for reproducibility.

### 4.5 GitHub Release

Create a release on GitHub to match the tag:

1. Go to [github.com/keeganfrancis/create-fedi-app/releases/new](https://github.com/keeganfrancis/create-fedi-app/releases/new)
2. Tag: `v0.1.0`
3. Title: `v0.1.0 — Initial public release`
4. Body: copy the v0.1.0 section from [`CHANGELOG.md`](./CHANGELOG.md)
5. Publish release

- [ ] GitHub Release published with changelog notes

---

## Phase 5 — Post-launch verification

Run these **after** npm publish and Vercel deploy complete.

### 5.1 End-user CLI smoke test

In a **clean temp directory** (outside the monorepo):

```bash
cd /tmp
npx create-fedi-app@latest
# Accept defaults
cd my-fedi-app
bun install
bun dev
```

- [ ] `npx create-fedi-app@latest` downloads and runs without local path hacks
- [ ] Generated project builds and dev server starts
- [ ] `/demo/webln` works with mock providers

### 5.2 Cross-reference links

- [ ] README docs link → `https://fedi.keeganfrancis.com/docs` resolves
- [ ] Landing page GitHub link → `https://github.com/keeganfrancis/create-fedi-app`
- [ ] npm package homepage/repository fields point to correct URLs (if set in `package.json`)

### 5.3 npm package metadata

On [npmjs.com/package/create-fedi-app](https://www.npmjs.com/package/create-fedi-app):

- [ ] Keywords visible: fedi, fedimint, bitcoin, lightning, webln, nostr, mini-app, nextjs
- [ ] README renders correctly
- [ ] Version matches tag

---

## Phase 6 — Announcement (optional)

After post-launch verification passes:

- [ ] Share in Fedi community channels with link to `fedi.keeganfrancis.com`
- [ ] Open a PR or issue on [fedibtc/catalog](https://github.com/fedibtc/catalog) if you want create-fedi-app listed as a developer tool (separate from mini app catalog submission)
- [ ] Replace README terminal recording placeholder with an asciinema or screenshot

---

## Cleanup

Remove local test artifacts:

```bash
rm -rf launch-test
rm -rf audit-test   # if present from design audit
```

Do **not** commit generated test projects.

---

## Rollback procedures

### npm

npm unpublish is destructive and time-limited (72 hours, restrictions apply). Prefer publishing a patch fix:

```bash
# Fix the issue, bump version in apps/cli/package.json to 0.1.1
git tag v0.1.1
git push origin v0.1.1
```

### Vercel

Vercel dashboard → Deployments → select previous working deployment → **Promote to Production**.

### GitHub

If a bad tag was pushed:

```bash
git tag -d v0.1.0
git push origin :refs/tags/v0.1.0
# Fix, re-tag, re-push
```

---

## Quick reference

| Resource | URL |
|----------|-----|
| Website | https://fedi.keeganfrancis.com |
| Docs | https://fedi.keeganfrancis.com/docs |
| npm | https://www.npmjs.com/package/create-fedi-app |
| GitHub | https://github.com/keeganfrancis/create-fedi-app |
| Fedi docs | https://fedibtc.github.io/fedi-docs/ |
| Catalog submission (for generated apps) | https://docs.google.com/forms/d/e/1FAIpQLSfrvsoeaNYiGhoc8QwzLXEi4zMFVyxpa4ufJFTwEHp97AeUmQ/viewform |
| Mutinynet testing | https://fedibtc.github.io/fedi-docs/docs/fedimint/intro/ |

---

## Launch sign-off

Complete before marking v0.1.0 as live:

| Gate | Owner | Date | ✓ |
|------|-------|------|---|
| Automated checks pass (Phase 1) | | | |
| CLI manual testing (Phase 2.1–2.2) | | | |
| Fedi wallet smoke test (Phase 2.4) | | | |
| www site manual testing (Phase 2.5–2.6) | | | |
| Impeccible audit clean (Phase 2.7) | | | |
| Vercel production deploy (Phase 3) | | | |
| npm publish (Phase 4) | | | |
| Post-launch npx smoke test (Phase 5) | | | |

**The project is live when all gates are checked.**
