# create-fedi-app — Build Execution Plan

<!--
  Project: create-fedi-app
  Owner: Keegan-Lee Francis
  Site: fedi.keeganfrancis.com
  Spec version: 1.0
  Tools: Claude Code (Phase 1) → Cursor (Phase 2)
-->

## How to use this file

1. Drop this file into an **empty directory** (your project root)
2. Open **Claude Code** in that directory
3. Paste **Prompt 1.1** verbatim — it bootstraps the full monorepo
4. Work through Claude Code prompts 1.1–1.10 in sequence; do not skip
5. When P1.10 verification passes, switch to **Cursor** for Prompts 2.1–2.17
6. This file also serves as persistent context — Claude Code and Cursor can read it

---

## Phase map

| Phase | Tool | Prompts | Outcome |
|-------|------|---------|---------|
| 1 — Foundation | Claude Code | 1.1–1.10 | Monorepo, CLI, providers, templates, tests wired |
| 2 — Feature build | Cursor | 2.1–2.17 | All module UIs, website, docs, CI/CD complete |

**Handoff gate:** P1.10 must pass `bun run build && bun run test && bun run typecheck` from root with zero errors before switching to Cursor.

---

## Shared specification

All prompts build toward this spec. When a prompt does not cover a decision explicitly, default to this spec.

**Project:** `create-fedi-app` — `npx` one-shot scaffolder for Fedi Bitcoin mini apps  
**Published as:** `npx create-fedi-app@latest`  
**Repo owner:** Keegan-Lee Francis  
**Website:** fedi.keeganfrancis.com

### Stack
- **Monorepo:** Turborepo + Bun workspaces
- **Framework:** Next.js 16.2.x — App Router, Turbopack stable, Cache Components (`use cache`), `proxy.ts` (replaces middleware)
- **Styling:** Tailwind CSS v4 + shadcn/ui (Fedi theme)
- **CLI prompts:** `@clack/prompts`
- **Language:** TypeScript strict mode throughout
- **Testing:** Vitest + @testing-library/react + Playwright (E2E)
- **Env validation:** `@t3-oss/env-nextjs`
- **DB adapters:** Drizzle ORM → Turso (libsql) or Supabase
- **AI:** Vercel AI SDK (provider-agnostic)
- **Fonts:** Bricolage Grotesque (display) + DM Sans (body) + JetBrains Mono (code)

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

### Fedi browser APIs (injected by Fedi's in-app browser)
- `window.webln` — WebLN provider (sendPayment, makeInvoice, getInfo, signMessage, sendKeysend)
- `window.nostr` — NIP-07 signer (getPublicKey, signEvent, getRelays, nip04.encrypt, nip04.decrypt)
- `window.fediInternal` — v0 | v1 | v2 (v2 adds getInstalledMiniApps, installMiniApp)
- All three are `undefined` outside Fedi's WebView. Every usage must include a graceful fallback.

### CLI module selection
**Always included (no prompt):** webln-payments, nostr-identity, ecash-balance  
**Optional (prompted):** payment-gated-content, lnurl, ai-chat-gated, ai-assistant, multispend-demo, nostr-feed, database  
**Separately prompted:** ai-rules directory, database type (Turso/Supabase/None), AI provider

### Monorepo structure
```
create-fedi-app/
├── apps/
│   ├── cli/                    # npx create-fedi-app package
│   └── www/                    # fedi.keeganfrancis.com
├── packages/
│   ├── webln/                  # @create-fedi-app/webln
│   ├── nostr/                  # @create-fedi-app/nostr
│   ├── ui/                     # @create-fedi-app/ui
│   └── fedi-types/             # @create-fedi-app/fedi-types
└── templates/
    ├── base/                   # base Next.js 16 scaffold
    └── modules/
        ├── webln-payments/
        ├── nostr-identity/
        ├── ecash-balance/
        ├── payment-gated-content/
        ├── lnurl/
        ├── ai-chat-gated/
        ├── ai-assistant/
        ├── multispend-demo/
        ├── nostr-feed/
        ├── database/
        └── ai-rules/
```

---

---

# PHASE 1 — CLAUDE CODE

Work through these prompts in Claude Code, in order. Do not proceed to the next until the current verification block passes with zero errors.

---

## PROMPT 1.1 — Bootstrap monorepo

> **Paste this first.** Sets up the full directory skeleton, all config files, and TypeScript types. No component logic yet.

---

You are building `create-fedi-app`, an open-source CLI scaffolder for Fedi Bitcoin mini apps. This file (PROMPT_PLAN.md) is in your working directory and contains the full spec — read it before starting.

**Your task in this prompt:** Scaffold the complete monorepo skeleton. Focus on structure, configuration, and TypeScript type definitions only. Subsequent prompts fill in implementations.

### Step 1 — Initialize root

Create `package.json` (root, private: true):
- workspaces: `["apps/*", "packages/*"]`
- scripts: `build`, `dev`, `lint`, `typecheck`, `test`, `clean`
- devDependencies: `turbo@latest`, `typescript@^5`, `@types/node@^22`, `prettier@^3`, `eslint@^9`

Create `turbo.json`:
- tasks: `build` (dependsOn: `^build`, outputs: `dist/**,.next/**`), `dev` (cache: false, persistent: true), `typecheck` (dependsOn: `^typecheck`), `test` (dependsOn: `^build`), `lint`
- globalEnv: `NODE_ENV`, `DATABASE_URL`, `AI_PROVIDER`, `AI_API_KEY`

Create `tsconfig.base.json`:
- strict: true, target: ESNext, moduleResolution: bundler, allowImportingTsExtensions: true, noEmit: true
- paths: `{ "@create-fedi-app/*": ["./packages/*/src/index.ts"] }`

Create `.gitignore`, `.prettierrc` (singleQuote: true, semi: true, trailingComma: all, tabWidth: 2), `.eslintrc.json` (Next.js + TypeScript preset).

Create `bun.workspace.toml` if needed.

### Step 2 — Create full directory tree

Run bash to create every directory:
```bash
mkdir -p apps/cli/src apps/www packages/webln/src packages/webln/__tests__ \
  packages/nostr/src packages/nostr/__tests__ packages/ui/src/components \
  packages/ui/src/theme packages/fedi-types/src \
  templates/base/app/demo templates/base/components/FediDevToolbar \
  templates/base/hooks templates/base/lib \
  templates/modules/webln-payments/components/webln \
  templates/modules/webln-payments/hooks \
  templates/modules/webln-payments/app/demo/webln \
  templates/modules/nostr-identity/components/nostr \
  templates/modules/nostr-identity/hooks \
  templates/modules/nostr-identity/app/demo/nostr \
  templates/modules/ecash-balance/components/fedi \
  templates/modules/ecash-balance/hooks \
  templates/modules/ecash-balance/app/demo/ecash \
  templates/modules/payment-gated-content \
  templates/modules/lnurl \
  templates/modules/ai-chat-gated \
  templates/modules/ai-assistant \
  templates/modules/multispend-demo \
  templates/modules/nostr-feed \
  templates/modules/database/drizzle \
  templates/modules/ai-rules/rules \
  templates/modules/ai-rules/.github
```

### Step 3 — Package manifests

**packages/fedi-types/package.json:**
```json
{
  "name": "@create-fedi-app/fedi-types",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "scripts": { "typecheck": "tsc --noEmit" }
}
```

**packages/webln/package.json:** name `@create-fedi-app/webln`, peerDeps react@^19, dep `@create-fedi-app/fedi-types`

**packages/nostr/package.json:** name `@create-fedi-app/nostr`, peerDeps react@^19, dep `@create-fedi-app/fedi-types`, dep `@noble/hashes` (for keypair operations in mock), dep `@scure/bech32` (for npub encoding)

**packages/ui/package.json:** name `@create-fedi-app/ui`, peerDeps react@^19 + next@^16, deps `@create-fedi-app/webln`, `@create-fedi-app/nostr`, `@create-fedi-app/fedi-types`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`

**apps/cli/package.json:** name `create-fedi-app`, bin `{ "create-fedi-app": "./dist/index.js" }`, deps `@clack/prompts`, `fs-extra`, `execa`, `picocolors`, `semver`, devDeps `tsup`, `@types/fs-extra`, `@types/semver`

**apps/www/package.json:** name `www` (private), deps `next@^16.2.6`, `react@^19`, `@create-fedi-app/ui`, `fumadocs-core`, `fumadocs-ui`, `fumadocs-mdx`

### Step 4 — TypeScript types in packages/fedi-types/src/

**webln.d.ts** — Write complete, accurate WebLN types:
- `RequestInvoiceArgs`: `{ amount?: string | number; defaultAmount?: string | number; minimumAmount?: string | number; maximumAmount?: string | number; defaultMemo?: string; }`
- `RequestInvoiceResponse`: `{ paymentRequest: string; }`
- `SendPaymentResponse`: `{ preimage: string; }`
- `KeysendArgs`: `{ destination: string; amount: string | number; customRecords?: Record<string, string>; }`
- `SignMessageResponse`: `{ message: string; signature: string; }`
- `GetInfoResponse`: `{ node: { alias: string; pubkey: string; color: string; }; methods: string[]; }`
- `WebLNProvider` interface with all methods typed correctly
- `declare global { interface Window { webln?: WebLNProvider; } }`

**nostr.d.ts** — Write complete NIP-07 types:
- `NostrEvent`: `{ id: string; pubkey: string; created_at: number; kind: number; tags: string[][]; content: string; sig: string; }`
- `UnsignedNostrEvent`: `Omit<NostrEvent, 'id' | 'sig'>`
- `Nip04`: `{ encrypt(pubkey: string, plaintext: string): Promise<string>; decrypt(pubkey: string, ciphertext: string): Promise<string>; }`
- `NostrProvider` interface with getPublicKey, signEvent, getRelays, nip04
- `declare global { interface Window { nostr?: NostrProvider; } }`

**fedi-internal.d.ts** — Exact types from fedibtc/catalog:
```typescript
type FediInternalV0 = { version: 0 };
type FediInternalV1 = { version: 1 };
type FediInternalV2 = {
  version: 2;
  getInstalledMiniApps(): Promise<Array<{ url: string }>>;
  installMiniApp(miniApp: {
    id: string; title: string; url: string;
    imageUrl?: string | null; description?: string;
  }): Promise<void>;
};
declare global {
  interface Window {
    fediInternal?: FediInternalV0 | FediInternalV1 | FediInternalV2;
  }
}
```

**index.ts** — re-export all types

### Verification
```bash
bun install
bun run typecheck
find . -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.turbo/*" | sort
```
All three must succeed with zero errors. Show full output.

---

## PROMPT 1.2 — CLI package

> Implements the complete `apps/cli` package — prompt flow, scaffold engine, module merge logic, file generation.

---

This is Prompt 1.2. The monorepo is scaffolded. Implement `apps/cli/src/` — the full `npx create-fedi-app` CLI.

### apps/cli/src/index.ts
Entry point. Use `@clack/prompts` for all UI:
1. `intro()` — display `create-fedi-app` banner with version from package.json
2. Call `promptUser()` from prompts.ts — get all selections
3. Validate project name doesn't already exist as a directory
4. Call `scaffold(selections, targetDir)` from scaffold.ts inside a `spinner`
5. Call `installDeps(selections.packageManager, targetDir)` inside a spinner
6. Call `printNextSteps(selections)` from next-steps.ts
7. `outro()` — "Happy building. Docs: https://create-fedi-app.keeganfrancis.com/docs"
8. Handle `isCancel()` on every prompt — exit cleanly with `process.exit(0)`

### apps/cli/src/types.ts
```typescript
export type Database = 'none' | 'turso' | 'supabase';
export type PackageManager = 'bun' | 'pnpm' | 'npm';
export type AiProvider = 'agnostic' | 'anthropic' | 'openai' | 'groq' | 'ollama';
export type Module =
  | 'payment-gated-content' | 'lnurl' | 'ai-chat-gated'
  | 'ai-assistant' | 'multispend-demo' | 'nostr-feed' | 'database';

export interface UserSelections {
  projectName: string;
  database: Database;
  modules: Module[];
  includeAiRules: boolean;
  aiProvider: AiProvider | null;
  packageManager: PackageManager;
}
```

### apps/cli/src/prompts.ts
Implement `promptUser(): Promise<UserSelections>` using `@clack/prompts` in this exact order:
1. `text` — project name, default "my-fedi-app", validate: `/^[a-z0-9-]+$/` (kebab-case only, no spaces)
2. `select` — database (None | Turso | Supabase), default None
3. `multiselect` — optional modules (7 options), required: false (empty selection OK)
4. `confirm` — include AI rules directory, default true
5. `select` — AI provider (only if ai-chat-gated OR ai-assistant in selections), default agnostic
6. `select` — package manager (bun | pnpm | npm), default bun

### apps/cli/src/scaffold.ts
Implement `scaffold(selections: UserSelections, targetDir: string): Promise<void>`:
1. Use `fs-extra.copy()` to copy entire `templates/base/` into targetDir
2. Replace all `{{PROJECT_NAME}}` occurrences in all copied files with `selections.projectName`
3. Replace all `{{PACKAGE_MANAGER}}` with selections.packageManager
4. Call `applyModules()` for each selected module plus always-on modules
5. Generate `.env.local` by reading `.env.example` and injecting selected module vars

Implement `applyModules(modules: string[], targetDir: string): Promise<void>`:
1. Always apply: `webln-payments`, `nostr-identity`, `ecash-balance`
2. Apply each selected optional module
3. If includeAiRules: apply `ai-rules` module
4. If database !== 'none': apply `database` module with database type context
5. For each module: read `templates/modules/[module]/module.json`, copy files per manifest

### apps/cli/src/modules.ts
Module manifest type:
```typescript
interface ModuleFile {
  src: string;       // path within templates/modules/[module]/
  dest: string;      // destination path within generated project
  merge: 'add' | 'replace' | 'append';
}
interface ModuleManifest {
  name: string;
  description: string;
  dependencies: string[];
  devDependencies: string[];
  files: ModuleFile[];
  envVars: Array<{ key: string; description: string; example: string; required: boolean }>;
}
```
Implement merge strategies:
- `add`: copy file only if dest doesn't exist yet
- `replace`: always overwrite dest with src
- `append`: append src contents to end of existing dest file

### apps/cli/src/install.ts
`installDeps(pm: PackageManager, cwd: string): Promise<void>` using `execa`. Handle errors gracefully — if install fails, print warning but don't abort (user can install manually).

### apps/cli/src/next-steps.ts
`printNextSteps(selections: UserSelections): void` — use `@clack/prompts` note() blocks to print:
```
  cd {{projectName}}
  cp .env.example .env.local    (fill in any required variables)
  {{pm}} run dev                 (starts on localhost:3000)

  Test with Fedi:
  ▸ Install Fedi: https://fedi.xyz/get-the-app
  ▸ Join Mutinynet test federation (see docs for invite link)
  ▸ Add http://localhost:3000 as a custom Mini App in Fedi
  ▸ window.webln and window.nostr are now injected

  Docs: https://create-fedi-app.keeganfrancis.com/docs
```

### apps/cli/tsup.config.ts
```typescript
import { defineConfig } from 'tsup';
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  clean: true,
  shims: true,
  noExternal: [/@clack/, /fs-extra/, /execa/, /picocolors/, /semver/],
});
```

### Verification
```bash
cd apps/cli && bun run build
node dist/index.js --version
# Then do a dry run, create a test project, verify directory is created:
node dist/index.js
# Walk through: name=fedi-test, database=none, modules=[payment-gated-content], aiRules=yes, pm=bun
ls -la fedi-test/
```

---

## PROMPT 1.3 — Provider packages

> Implements packages/webln and packages/nostr — React context providers, hooks, and mock providers for dev.

---

This is Prompt 1.3. Implement both provider packages with complete logic.

### packages/webln/src/provider.tsx
```typescript
// WebLNContext, WebLNProviderComponent
// Props: { children: React.ReactNode; mockProvider?: WebLNProvider; }
// On mount: if window.webln exists, call enable() and set provider in state
// If window.webln is undefined AND mockProvider is provided AND NODE_ENV === 'development':
//   use mockProvider as the active provider
// Handle enable() rejection: catch and set error state, provider remains null
// Export: WebLNContext, WebLNProvider (the component)
```

### packages/webln/src/mock.tsx
Full MockWebLNProvider implementing every WebLN method:
- **Props:** `{ children, paymentDelay?: number, shouldFail?: boolean, failureMessage?: string, autoEnable?: boolean }`
- `enable()`: resolves immediately (or rejects if shouldFail)
- `getInfo()`: returns `{ node: { alias: 'Fedi Dev Node', pubkey: '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', color: '#FF6B35' }, methods: ['sendPayment', 'makeInvoice', 'getInfo', 'signMessage'] }`
- `makeInvoice(args)`: generates realistic-looking fake BOLT11 (`lnbc${amount}n1p...` + random 100-char alphanumeric), resolves after `paymentDelay` ms (default 600)
- `sendPayment(paymentRequest)`: validates starts with 'lnbc', if shouldFail throws `new Error(failureMessage ?? 'Payment failed')`, else resolves after delay with `{ preimage: randomHex(32) }`
- `signMessage(message)`: returns `{ message, signature: randomHex(64) }`
- `verifyMessage()`: resolves void
- `sendKeysend(args)`: returns `{ preimage: randomHex(32) }`
- Helper: `randomHex(bytes: number): string` using `Math.random()` (not crypto — this is mock data)

### packages/webln/src/hooks.ts
- `useWebLN()`: reads context, returns `{ provider, isLoading, error, isConnected: boolean }`
- `usePayment()`: returns `{ sendPayment, makeInvoice, isPaying, isCreatingInvoice, paymentError, lastPreimage, lastInvoice }`
- Both throw descriptive error if used outside WebLNProvider

### packages/nostr/src/provider.tsx
Same pattern as WebLN provider. On mount: if window.nostr exists, call getPublicKey() to pre-fetch pubkey and cache in state.

### packages/nostr/src/mock.tsx
Full MockNostrProvider:
- **Deterministic test keypair** (hardcoded private key — ONLY for testing, clearly commented as NOT for production):
  - Use `@noble/hashes/sha256` and `@noble/curves/secp256k1` for keypair operations
  - Private key: `'0000000000000000000000000000000000000000000000000000000000000001'` (lowest valid secp256k1 key, famous test vector)
  - Derive pubkey deterministically
- `getPublicKey()`: returns the test pubkey hex
- `signEvent(event)`: computes event ID (sha256 of canonical JSON), signs with test privkey, returns complete `NostrEvent`
- `getRelays()`: returns `{ 'wss://relay.damus.io': { read: true, write: true }, 'wss://nos.lol': { read: true, write: false } }`
- `nip04.encrypt(pubkey, plaintext)`: returns `Buffer.from(plaintext).toString('base64') + '?iv=fakefakefakefake'` (clearly fake, for mock only)
- `nip04.decrypt(pubkey, ciphertext)`: reverses the above

### packages/nostr/src/hooks.ts
- `useNostr()`: returns `{ provider, pubkey: string|null, npub: string|null, isLoading, error, isConnected }`
- `useIdentity()`: returns `{ pubkey, npub, displayNpub, getPublicKey, signEvent, isConnecting }`
- `displayNpub`: first 8 chars + '...' + last 4 chars of npub
- `npub`: implement `pubkeyToNpub(hex: string): string` using `@scure/bech32` — bech32 encode with 'npub' prefix

### packages/webln/__tests__/mock.test.ts and packages/nostr/__tests__/mock.test.ts
Write Vitest tests:
- WebLN: makeInvoice returns string starting with 'lnbc', sendPayment returns object with preimage, shouldFail causes sendPayment to throw
- Nostr: getPublicKey returns 64-char hex string, signEvent returns object with id and sig fields both 64-char hex

### Verification
```bash
bun run typecheck
bun run test --filter packages/webln --filter packages/nostr
```
Zero errors, all tests pass.

---

## PROMPT 1.4 — Base template

> Creates templates/base/ — the Next.js 16 scaffold that every generated project receives.

---

This is Prompt 1.4. Create the complete `templates/base/` directory. These are template files that get COPIED into the user's project by the CLI. They must work as a standalone Next.js 16 project after copying.

Use `{{PROJECT_NAME}}` as a placeholder wherever the project name appears — the CLI replaces it.

### templates/base/package.json
```json
{
  "name": "{{PROJECT_NAME}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^16.2.6",
    "react": "^19",
    "react-dom": "^19",
    "@create-fedi-app/webln": "workspace:*",
    "@create-fedi-app/nostr": "workspace:*",
    "@create-fedi-app/ui": "workspace:*",
    "@create-fedi-app/fedi-types": "workspace:*",
    "@t3-oss/env-nextjs": "^0.12",
    "zod": "^3",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/react": "^19",
    "@types/node": "^22",
    "tailwindcss": "^4",
    "@tailwindcss/typography": "^0.5",
    "vitest": "^2",
    "@testing-library/react": "^16",
    "@testing-library/user-event": "^14",
    "@vitejs/plugin-react": "^4",
    "@playwright/test": "^1.45"
  }
}
```

### templates/base/app/globals.css
```css
@import "tailwindcss";
@import "@tailwindcss/typography";

@theme {
  --color-bg: #0A0A0A;
  --color-surface: #141414;
  --color-surface-2: #1C1C1C;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-accent: #FF6B35;
  --color-accent-dim: rgba(255, 107, 53, 0.15);
  --color-text: #F0EEE9;
  --color-text-muted: #8A8880;
  --color-text-subtle: #4A4845;

  --font-display: 'Bricolage Grotesque', system-ui, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

html {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

* { box-sizing: border-box; }
```

### templates/base/app/layout.tsx
- Import Bricolage Grotesque, DM Sans, JetBrains Mono from `next/font/google`
- Apply as CSS variables: `--font-display`, `--font-body`, `--font-mono`
- Wrap children in `<Providers>`
- Render `<FediDevToolbar />` only when `process.env.NODE_ENV === 'development'`
- Metadata: title `{{PROJECT_NAME}}`, description "A Fedi Mini App"

### templates/base/app/page.tsx
Mobile-first home page:
- `max-w-sm mx-auto px-4 py-8` (optimized for Fedi's WebView)
- Show app name `{{PROJECT_NAME}}`
- `<ConnectionStatus />` component: shows whether window.webln and window.nostr are available
- Link to `/demo` — "Explore demos"
- Clean typography, Fedi orange accent for the CTA button
- NO glassmorphism, NO hero metric numbers, NO gradient text

### templates/base/components/providers.tsx
Wraps children with `WebLNProvider` and `NostrProvider` from their respective packages. In development, passes `MockWebLNProvider` and `MockNostrProvider` instances when real providers aren't detected.

### templates/base/components/FediDevToolbar/FediDevToolbar.tsx
A floating bottom-right overlay, only rendered in `NODE_ENV === 'development'`:
- Collapsed by default (small icon button)
- When expanded: shows toggle for mock WebLN (on/off), toggle for mock Nostr, button to simulate payment failure, input to set mock npub
- Uses CSS position: fixed, z-index: 9999 — IMPORTANT: since this is in a WebView, test that fixed positioning doesn't cause issues
- Styled with design tokens (dark surface, orange accent for active states)
- Label: "Fedi Dev" in small monospace text

### templates/base/lib/fedi.ts
```typescript
export function isInFedi(): boolean {
  return typeof window !== 'undefined' && typeof window.webln !== 'undefined';
}

export function getFediInternalVersion(): 0 | 1 | 2 | null {
  if (typeof window === 'undefined' || !window.fediInternal) return null;
  return window.fediInternal.version as 0 | 1 | 2;
}

export function formatSats(sats: number): string {
  if (sats >= 100_000) return `${(sats / 100_000_000).toFixed(6)} BTC`;
  return `${sats.toLocaleString()} sats`;
}

export function shortenNpub(npub: string): string {
  if (npub.length < 16) return npub;
  return `${npub.slice(0, 8)}...${npub.slice(-4)}`;
}
```

### templates/base/lib/utils.ts
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

### templates/base/hooks/useFediInternal.ts
Hook that reads window.fediInternal, returns `{ version, getInstalledMiniApps, installMiniApp, isAvailable }`. Always returns null-safe values.

### templates/base/proxy.ts (Next.js 16 — replaces middleware)
```typescript
import { NextRequest, NextResponse } from 'next/server';
export default function proxy(request: NextRequest) {
  // Base: pass-through. payment-gated-content module extends this.
  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### templates/base/env.ts
```typescript
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';
export const env = createEnv({
  server: { NODE_ENV: z.enum(['development', 'production', 'test']) },
  client: { NEXT_PUBLIC_APP_NAME: z.string().default('My Fedi App') },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
});
```

### templates/base/next.config.ts
```typescript
import type { NextConfig } from 'next';
const config: NextConfig = {
  transpilePackages: [
    '@create-fedi-app/webln',
    '@create-fedi-app/nostr',
    '@create-fedi-app/ui',
  ],
};
export default config;
```

### templates/base/.env.example
```
# App
NEXT_PUBLIC_APP_NAME="{{PROJECT_NAME}}"

# Add module-specific variables below
# (populated by CLI based on selected modules)
```

### templates/base/vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./vitest.setup.ts'] },
});
```

Create `vitest.setup.ts` that imports `@testing-library/jest-dom`.

### templates/base/tsconfig.json
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "compilerOptions": { "plugins": [{ "name": "next" }] }
}
```

### Verification
Copy templates/base to a temp directory, replace {{PROJECT_NAME}} with "fedi-test", run `bun install && bun run dev` (Next.js 16 dev server must start) and `bun run typecheck` (zero errors). Show the output.

---

## PROMPT 1.5 — Default module templates

> Creates template files for the three always-included modules: webln-payments, nostr-identity, ecash-balance.

---

This is Prompt 1.5. Create the template files for the three default modules. These files get merged into every generated project by the CLI.

Also create `module.json` for every module (including optional ones — the manifests need to exist even if implementations come later).

### For each of the three default modules, create these files:

**templates/modules/webln-payments/**

`module.json`:
```json
{
  "name": "webln-payments",
  "description": "WebLN Lightning payment send and receive demos",
  "dependencies": [],
  "devDependencies": [],
  "files": [
    { "src": "components/webln/PayButton.tsx", "dest": "components/webln/PayButton.tsx", "merge": "add" },
    { "src": "components/webln/InvoiceCard.tsx", "dest": "components/webln/InvoiceCard.tsx", "merge": "add" },
    { "src": "hooks/usePaymentFlow.ts", "dest": "hooks/usePaymentFlow.ts", "merge": "add" },
    { "src": "app/demo/webln/page.tsx", "dest": "app/demo/webln/page.tsx", "merge": "add" }
  ],
  "envVars": []
}
```

`components/webln/PayButton.tsx`: A button component that:
- Accepts `invoice: string` and `onSuccess: (preimage: string) => void` props
- Uses `usePayment()` hook from `@create-fedi-app/webln`
- Shows loading spinner while paying
- Shows success state with preimage (truncated) on success
- Shows error message on failure
- Follows design tokens (orange accent, no gradients)

`components/webln/InvoiceCard.tsx`: A card that:
- Accepts `sats: number`, `memo?: string`, `onPaid?: () => void` props
- Calls `makeInvoice()` on mount, shows QR code of the bolt11 string (use a QR library or render as text for now — Cursor will polish)
- Shows amount in sats using `formatSats()`
- "Copy invoice" button

`app/demo/webln/page.tsx`: Demo page showing both PayButton and InvoiceCard with instructive comments.

**templates/modules/nostr-identity/**

`module.json`: similar structure, files: IdentityBadge.tsx, useIdentityFlow.ts, app/demo/nostr/page.tsx

`components/nostr/IdentityBadge.tsx`: Displays the connected Nostr identity — shows `displayNpub`, a colored avatar circle derived from pubkey (first char determines hue), "Connect" button if not connected.

`app/demo/nostr/page.tsx`: Shows identity connection flow and signed message demo.

**templates/modules/ecash-balance/**

`module.json`: files: BalanceDisplay.tsx, useFediBalance.ts, app/demo/ecash/page.tsx

`components/fedi/BalanceDisplay.tsx`: Reads `window.fediInternal` (via `useFediInternal()`), shows version number and installed apps count. If v2: shows getInstalledMiniApps list. Shows "Not in Fedi" state when fediInternal is undefined.

### Create stub module.json files for all optional modules

Create `templates/modules/[module]/module.json` for: payment-gated-content, lnurl, ai-chat-gated, ai-assistant, multispend-demo, nostr-feed, database, ai-rules. Each should have the correct name, description, and empty/placeholder files array (Cursor will fill in implementations).

For `database` module.json, include envVars:
- `DATABASE_URL` (required) — Turso or Supabase connection string
- `DATABASE_AUTH_TOKEN` (required for Turso, optional for Supabase)

For `ai-chat-gated` and `ai-assistant` module.json, include envVars:
- `AI_PROVIDER` (required) — anthropic | openai | groq | ollama
- `AI_API_KEY` (required unless ollama) — provider API key
- `AI_MODEL` (optional) — specific model name
- `AI_BASE_URL` (optional) — for Ollama or custom endpoints

### Verification
```bash
# Verify all module.json files exist and are valid JSON
for dir in templates/modules/*/; do
  echo "Checking $dir"
  cat "${dir}module.json" | python3 -m json.tool > /dev/null && echo "  ✓ valid JSON" || echo "  ✗ INVALID"
done
bun run typecheck
```

---

## PROMPT 1.6 — AI rules directory templates

> Creates the .ai/rules/ template files — agent-readable context that ships with generated projects.

---

This is Prompt 1.6. Create `templates/modules/ai-rules/` — the agent-readable context directory.

When users select "Include AI rules directory" in the CLI, these files get copied into `.ai/` in their project. They give AI coding agents (Claude Code, Cursor, GitHub Copilot) full context about the project so they never hallucinate Fedi-specific APIs.

### File list

**templates/modules/ai-rules/CLAUDE.md** (Claude Code entry point):
```markdown
# {{PROJECT_NAME}} — Claude Code Context

This is a Fedi Mini App built with create-fedi-app.
Full context is in `.ai/rules/`. Read OVERVIEW.md first.

Key constraint: this app runs inside Fedi's in-app browser (WebView).
window.webln and window.nostr are injected by Fedi — do not install
external wallet libraries. Always check for undefined before calling them.
```

**templates/modules/ai-rules/.cursorrules** (Cursor entry point):
Same content as CLAUDE.md, adapted for Cursor's format.

**templates/modules/ai-rules/.github/copilot-instructions.md**:
Same content, adapted for GitHub Copilot.

**templates/modules/ai-rules/rules/OVERVIEW.md**:
Write a comprehensive overview covering: what Fedi is, what mini apps are, this project's stack (filled in by CLI with actual selected modules), the WebLN/Nostr model, and links. Include a placeholder `{{SELECTED_MODULES}}` that the CLI replaces with the actual module list.

**templates/modules/ai-rules/rules/webln.md**:
Complete WebLN reference:
- How Fedi injects window.webln
- Full API (enable, getInfo, sendPayment, makeInvoice, signMessage, sendKeysend)
- The detection pattern: `if (typeof window.webln !== 'undefined')`
- The graceful fallback pattern
- Common errors and how to handle them
- MockWebLNProvider usage in tests
- Code examples for each method

**templates/modules/ai-rules/rules/nostr.md**:
Complete NIP-07 reference:
- How Fedi injects window.nostr
- Full API (getPublicKey, signEvent, getRelays, nip04)
- npub format and bech32 encoding
- How to use Nostr identity as a login (no username/password)
- MockNostrProvider usage
- Code examples

**templates/modules/ai-rules/rules/fedi-api.md**:
window.fediInternal reference:
- Version detection pattern
- v2 API: getInstalledMiniApps, installMiniApp
- useFediInternal() hook usage

**templates/modules/ai-rules/rules/design-system.md**:
Full design token reference + anti-slop rules for agents:
- All CSS variables (copy from the design tokens in the shared spec)
- Every component from @create-fedi-app/ui with props
- The 10 anti-slop rules from Impeccible.style, phrased as directives
- shadcn/ui component naming conventions used in this project

**templates/modules/ai-rules/rules/patterns.md**:
Canonical Fedi mini-app patterns as annotated code:
- Pattern 1: Check if in Fedi, handle gracefully if not
- Pattern 2: Request a Lightning payment
- Pattern 3: Create an invoice (receive payment)
- Pattern 4: Get user's Nostr identity
- Pattern 5: Pay-to-unlock content (combining WebLN + server verification)
- Pattern 6: Nostr-authenticated API call (sign a message to prove identity)

**templates/modules/ai-rules/rules/architecture.md**:
File structure explanation, routing conventions (Next.js 16 App Router), where each type of code lives, how modules are structured.

**templates/modules/ai-rules/rules/testing.md**:
Testing patterns: how to test WebLN flows with MockWebLNProvider, how to test Nostr flows with MockNostrProvider, Vitest setup, Playwright E2E patterns.

### module.json for ai-rules
```json
{
  "name": "ai-rules",
  "description": "Agent-readable context files for AI coding tools",
  "dependencies": [],
  "devDependencies": [],
  "files": [
    { "src": "CLAUDE.md", "dest": ".ai/CLAUDE.md", "merge": "add" },
    { "src": ".cursorrules", "dest": ".ai/.cursorrules", "merge": "add" },
    { "src": ".github/copilot-instructions.md", "dest": ".ai/.github/copilot-instructions.md", "merge": "add" },
    { "src": "rules/OVERVIEW.md", "dest": ".ai/rules/OVERVIEW.md", "merge": "replace" },
    { "src": "rules/webln.md", "dest": ".ai/rules/webln.md", "merge": "add" },
    { "src": "rules/nostr.md", "dest": ".ai/rules/nostr.md", "merge": "add" },
    { "src": "rules/fedi-api.md", "dest": ".ai/rules/fedi-api.md", "merge": "add" },
    { "src": "rules/design-system.md", "dest": ".ai/rules/design-system.md", "merge": "add" },
    { "src": "rules/patterns.md", "dest": ".ai/rules/patterns.md", "merge": "add" },
    { "src": "rules/architecture.md", "dest": ".ai/rules/architecture.md", "merge": "add" },
    { "src": "rules/testing.md", "dest": ".ai/rules/testing.md", "merge": "add" }
  ],
  "envVars": []
}
```

Note: OVERVIEW.md uses `replace` merge because it contains `{{SELECTED_MODULES}}` that must be rewritten per project. All others use `add` — they're static reference files.

### Verification
```bash
find templates/modules/ai-rules -type f | sort
wc -l templates/modules/ai-rules/rules/*.md  # each should be >30 lines
```

---

## PROMPT 1.7 — packages/ui foundation

> Sets up the shared UI package — shadcn/ui configured with Fedi theme, base components.

---

This is Prompt 1.7. Build `packages/ui/` — the shared component library used by both the base template and the www site.

### Initialize shadcn/ui

Run the shadcn/ui CLI to initialize with Tailwind v4:
```bash
cd packages/ui && npx shadcn@latest init
```
Configure: style=default, no CSS variables (we use our own), Tailwind, TypeScript.

Then add base components:
```bash
npx shadcn@latest add button card badge input label separator
```

### packages/ui/src/theme/tokens.ts
Export all design tokens as a TypeScript object for use in JS (e.g., for mocking or Storybook).

### packages/ui/src/components/

Create Fedi-specific components that wrap or extend shadcn primitives:

**SatsAmount.tsx**: Displays a sats amount using `formatSats()`. Props: `{ sats: number; className?: string }`. Renders in monospace font. No decoration.

**ConnectionBadge.tsx**: Shows WebLN or Nostr connection status. Props: `{ type: 'webln' | 'nostr'; connected: boolean }`. Green dot + "Connected" or muted dot + "Not connected". NO side-tab border.

**MiniAppLayout.tsx**: A wrapper providing mobile-first layout (max-w-sm, proper padding for Fedi WebView). Every demo page uses this. Ensures content doesn't touch viewport edges.

**DemoSection.tsx**: A section wrapper for demo pages. Title + description + children. Clean typography, no icon tiles above headings.

### Apply Fedi theme to shadcn components

Override shadcn's default CSS variables in `packages/ui/src/globals.css` (or the base template's globals.css) to match the Fedi design tokens. Ensure:
- Button primary variant uses `--color-accent` (#FF6B35) not blue
- Card uses `--color-surface` background and `--color-border` border
- Badge uses appropriate stops from the design token scale
- Input border matches `--color-border`

### Verification
```bash
bun run typecheck  # from root
# Verify all shadcn components imported correctly
```

---

## PROMPT 1.8 — Test setup + GitHub Actions

> Sets up testing infrastructure across all packages and CI/CD pipeline.

---

This is Prompt 1.8. Set up testing infrastructure and GitHub Actions.

### Root vitest.config.ts (workspace mode)
```typescript
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.ts'],
  },
});
```

Add `vitest.config.ts` to each package (webln, nostr, ui) with appropriate jsdom environment.

### Playwright config (root playwright.config.ts)
```typescript
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
```

Create `tests/e2e/` directory with a placeholder `home.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';
test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Fedi/);
});
```

### GitHub Actions — .github/workflows/ci.yml
```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with: { bun-version: latest }
      - run: bun install
      - run: bun run typecheck
      - run: bun run lint
      - run: bun run test
      - run: bun run build
```

### GitHub Actions — .github/workflows/release.yml
On push to main with version tag (v*.*.*):
- Build the CLI: `bun run build` in apps/cli
- Publish to npm: `npm publish` with NPM_TOKEN secret

### Verification
```bash
bun run test        # all package tests pass
bun run typecheck   # zero errors
bun run build       # all packages build
```

---

## PROMPT 1.9 — End-to-end CLI smoke test

> Runs the full CLI flow, generates a project, verifies it works, fixes any integration issues.

---

This is Prompt 1.9 — the integration verification prompt. Run the following sequence and fix any issues you encounter:

```bash
# Build the CLI
cd apps/cli && bun run build && cd ../..

# Test run 1: minimal project (no optional modules, no DB)
node apps/cli/dist/index.js
# Selections: name=fedi-minimal, database=none, modules=[], aiRules=yes, pm=bun

# Verify fedi-minimal/
ls -la fedi-minimal/
cat fedi-minimal/package.json
cat fedi-minimal/.ai/rules/OVERVIEW.md

# Test run 2: full featured project
node apps/cli/dist/index.js
# Selections: name=fedi-full, database=turso, modules=[all], aiRules=yes, pm=bun

# Verify fedi-full/ contains module files
ls fedi-full/components/webln/
ls fedi-full/components/nostr/
ls fedi-full/.ai/rules/

# Test run 3: install and typecheck generated project
cd fedi-minimal && bun install && bun run typecheck && bun run dev &
sleep 8 && curl -s http://localhost:3000 | grep -q "fedi-minimal" && echo "✓ Dev server works" || echo "✗ Dev server failed"
kill %1 && cd ..

# Clean up
rm -rf fedi-minimal fedi-full
```

Fix any errors encountered. The smoke test must fully pass before Prompt 1.10.

---

## PROMPT 1.10 — Final Phase 1 check

> Runs all checks in parallel, generates the handoff summary for Cursor.

---

This is Prompt 1.10 — the Phase 1 completion gate.

Run all checks:
```bash
bun run typecheck && echo "✓ Types"
bun run lint && echo "✓ Lint"
bun run test && echo "✓ Tests"
bun run build && echo "✓ Build"
```

If all pass, generate a file `CURSOR_HANDOFF.md` in the project root:
- Summary of what Phase 1 built (every file created)
- Current state of each module template (what's stubbed vs implemented)
- Exact list of tasks remaining for Phase 2
- Any known issues or TODOs
- The design token reference (copy from spec)

Print the full contents of CURSOR_HANDOFF.md after creating it.

**Do not proceed to Phase 2 until all four checks pass with zero errors.**

---

---

# PHASE 2 — CURSOR

Switch to Cursor after P1.10 passes. Each prompt below is a Cursor session. Open the project in Cursor, read CURSOR_HANDOFF.md and PROMPT_PLAN.md, then work through these in order.

> **Cursor usage:** Paste the prompt text into Cursor's chat/composer. Reference specific files by path. Cursor has the full codebase as context — you don't need to re-explain the full spec in each prompt, but do include the key constraints.

---

## PROMPT 2.1 — Design system polish

Polish `packages/ui` and `templates/base/app/globals.css` to be production-quality and fully Impeccible-compliant.

Reference: PROMPT_PLAN.md design constraints section and design tokens.

Tasks:
1. Run `npx impeccable detect` on the generated UI components. Fix every flagged issue.
2. Ensure all shadcn components use Fedi tokens (not shadcn's default blue/purple scheme).
3. Verify font loading: Bricolage Grotesque + DM Sans + JetBrains Mono load correctly via next/font/google. Test on a generated project.
4. Add a `<FediSafeArea>` component that adds appropriate padding for Fedi's WebView bottom bar (Fedi has a navigation bar that overlaps content — add `padding-bottom: env(safe-area-inset-bottom, 20px)` + explicit `pb-20` as fallback).
5. Ensure `MiniAppLayout` and `DemoSection` components are pixel-perfect for a 390px viewport (iPhone 14 size — the primary Fedi device).
6. Add a `<LoadingSpinner>` component using CSS animation only (no framer-motion, no spring physics, no bounce — use `ease-linear` for a clean rotation).
7. Write a visual audit: open a generated project in browser, check every component against the 10 anti-slop rules listed in PROMPT_PLAN.md. Document findings and fix everything.

---

## PROMPT 2.2 — webln-payments module (complete)

Build out the complete webln-payments module UI and logic. Files are in `templates/modules/webln-payments/`.

Reference: `.ai/rules/webln.md` and `.ai/rules/patterns.md`

Components to build:
1. **PayButton.tsx** — Full implementation with loading state, success animation (opacity transition only, no bounce), failure display. Shows amount in sats. Accessible (aria-labels on all states).
2. **InvoiceCard.tsx** — Generates invoice via `makeInvoice()`, renders QR code using `qrcode.react` package, "Copy invoice" copies bolt11 to clipboard, "Paid" state with checkmark on success. Polling or WebSocket detection of payment (mock: simulate after 5s in dev).
3. **PaymentHistory.tsx** — Simple list of recent payments from localStorage (not a DB requirement — just client-side). Shows amount, memo, timestamp, preimage (truncated). Empty state with clear copy.
4. **app/demo/webln/page.tsx** — Polished demo page showing all three components with explanatory text. Includes a "How this works" expandable section explaining WebLN. Follows `MiniAppLayout`.

Write Vitest tests for the hook logic. Write one Playwright E2E test that simulates the full payment flow using MockWebLNProvider.

---

## PROMPT 2.3 — nostr-identity module (complete)

Build out the complete nostr-identity module. Files in `templates/modules/nostr-identity/`.

1. **IdentityBadge.tsx** — Shows connected identity: colored avatar (deterministic color from pubkey using a simple hash → HSL color), truncated npub, "Verified" label. "Connect" button if not connected. "Copy npub" button.
2. **SignedMessage.tsx** — Demo: text input, "Sign" button, displays the resulting Nostr event JSON. Explains what signing proves (possession of private key without revealing it).
3. **NostrLogin.tsx** — A full login flow: "Login with Fedi" button → calls getPublicKey() → shows success state with identity. Usable as a drop-in component for any page that needs auth.
4. **app/demo/nostr/page.tsx** — Full demo page showing all components and explaining the identity model.

---

## PROMPT 2.4 — ecash-balance module (complete)

Build out ecash-balance module. Files in `templates/modules/ecash-balance/`.

1. **BalanceDisplay.tsx** — Complete: shows fediInternal version, installed apps list (clickable), installMiniApp button (with id/title/url props), graceful "Open in Fedi" prompt when fediInternal is undefined.
2. **FediVersionBadge.tsx** — Small badge showing fediInternal API version (v0/v1/v2) or "Not in Fedi". Used for debugging.
3. **app/demo/ecash/page.tsx** — Demo page.

---

## PROMPT 2.5 — payment-gated-content module (complete)

Build the complete payment-gated-content module. This is the most architecturally complex module — requires both frontend components and server-side logic.

Architecture:
- User visits a gated page
- Server checks if user has a valid payment token (cookie or header)
- If not: show `<PayGate>` component, generate invoice, user pays
- After payment: server verifies, sets auth cookie, serves content
- Uses Next.js 16 `proxy.ts` to check payment at the network boundary

Files to create:
1. `proxy.ts` — Checks for payment cookie on protected routes, redirects to payment page if missing
2. `lib/payment-gate.ts` — Server-side: generateInvoice(), verifyPayment(), setPaymentCookie(), checkPaymentCookie()
3. `lib/payment-store.ts` — Simple in-memory or database (if DB module selected) payment record store
4. `components/payment-gated/PayGate.tsx` — The gate UI: shows content preview (blurred), payment amount, InvoiceCard, "Already paid? Refresh" link
5. `app/demo/payment-gated/page.tsx` — Demo showing a gated article, paywall, and the content that unlocks

The module.json `merge` strategy for `proxy.ts` must be `replace` since this module significantly extends it.

Env vars required: none beyond base (uses in-memory store by default, or DATABASE_URL if database module also selected).

---

## PROMPT 2.6 — lnurl module (complete)

Build the LNURL module. Files in `templates/modules/lnurl/`.

1. **LNURL-pay endpoint** — `app/api/lnurlp/[username]/route.ts` — Returns LNURL-pay metadata JSON (callback URL, min/max sendable, metadata)
2. **LNURL-auth flow** — `app/api/lnurlauth/route.ts` — LNURL-AUTH challenge/response pattern
3. **LNURL-withdraw endpoint** — `app/api/lnurlw/route.ts`
4. **LnurlQR.tsx** — Renders a bech32-encoded LNURL as a QR code
5. **LnurlPay.tsx** — Component that generates and displays an LNURL-pay QR for receiving payments
6. **app/demo/lnurl/page.tsx** — Demo page showing all LNURL flows

---

## PROMPT 2.7 — ai-chat-gated module (complete)

Build the eCash-per-prompt AI chat module. This is the flagship "AI-first" module.

Architecture:
- User pays X sats per message (configurable via `AI_SATS_PER_MESSAGE` env var, default: 10)
- Payment is requested via `makeInvoice()` before each AI call
- On payment confirmation, the AI request is sent
- Uses Vercel AI SDK (`ai` package) for streaming responses
- Provider selected via `AI_PROVIDER` env var

Files:
1. `app/api/chat/route.ts` — Streaming AI endpoint using Vercel AI SDK `streamText()`. Verifies payment token before processing.
2. `app/api/chat/invoice/route.ts` — Generates invoice for N sats. Returns BOLT11 + payment ID.
3. `components/ai/GatedChat.tsx` — Full chat UI: message list, input, per-message payment flow, streaming response display
4. `components/ai/ChatMessage.tsx` — Individual message component (user/assistant roles, Markdown rendering via `react-markdown`)
5. `components/ai/PaymentGate.tsx` — The "pay to send" button that wraps WebLN payment around message submission
6. `lib/ai/providers.ts` — Provider-agnostic AI client factory: reads `AI_PROVIDER` and returns appropriate Vercel AI SDK provider
7. `app/demo/ai-chat/page.tsx` — Demo page

Env vars: `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`, `AI_BASE_URL`, `AI_SATS_PER_MESSAGE`, `NEXT_PUBLIC_SATS_PER_MESSAGE`

---

## PROMPT 2.8 — ai-assistant module (complete)

Build the general AI assistant module (no payment gating — available to all users).

1. `app/api/assistant/route.ts` — Vercel AI SDK streaming endpoint
2. `components/ai/Assistant.tsx` — Chat interface with streaming, Markdown support, copy-to-clipboard on messages
3. `components/ai/AssistantProvider.tsx` — Context provider managing conversation history with `useChat()` from Vercel AI SDK
4. `lib/ai/providers.ts` — Same provider factory as ai-chat-gated (de-duplicate if both modules selected)
5. `app/demo/assistant/page.tsx` — Demo with system prompt configuration

---

## PROMPT 2.9 — multispend-demo module (complete)

Build the Multispend demonstration module.

Multispend is Fedi's threshold multi-signature spending mechanism. This is a UI demo — it illustrates the concept with a mock workflow since the real Fedi Multispend API isn't fully exposed via mini apps yet.

1. **MultispendProposal.tsx** — Shows a spending proposal: amount, description, list of required signers, current approvals count
2. **ApprovalVote.tsx** — Vote button (approve/reject) that calls `signEvent()` via Nostr to cast a signed vote
3. **ProposalList.tsx** — List of open proposals
4. **MultispendDemo.tsx** — Full mock workflow: create proposal, collect approvals, simulate execution
5. **app/demo/multispend/page.tsx** — Demo with detailed explanatory copy explaining what Multispend is and why it matters

---

## PROMPT 2.10 — nostr-feed module (complete)

Build the Nostr social feed module.

1. `lib/nostr/relay.ts` — WebSocket relay connection manager using `nostr-tools`. Handles connect, subscribe, publish, reconnect.
2. `components/nostr/NoteFeed.tsx` — Subscribes to kind:1 events from configured relays, renders scrollable feed
3. `components/nostr/NoteCard.tsx` — Individual note: truncated pubkey (npub), content (Markdown-safe rendering), timestamp, Zap button (WebLN + Nostr)
4. `components/nostr/PublishNote.tsx` — Text input + "Publish" button that calls `signEvent()` and sends to relay
5. `components/nostr/ZapButton.tsx` — Combines WebLN payment with Nostr zap (NIP-57). Makes invoice via WebLN, publishes zap receipt to relay.
6. `app/demo/nostr-feed/page.tsx` — Live demo connected to public relays

---

## PROMPT 2.11 — database module (complete)

Build the database module. Must support both Turso and Supabase, selected at generation time.

1. `lib/db/index.ts` — Exports `db` client. Reads `DATABASE_URL` and selects Turso (via `@libsql/client` + Drizzle) or Supabase (via `@supabase/supabase-js` + Drizzle) based on URL prefix.
2. `lib/db/schema.ts` — Base schema: `payments` table (id, invoice, preimage, paidAt, metadata). Used by payment-gated module.
3. `drizzle.config.ts` — Drizzle Kit config (supports both adapters)
4. `drizzle/` — Initial migration files
5. `env.ts` additions — Add `DATABASE_URL` and `DATABASE_AUTH_TOKEN` validation

The CLI already sets the database type during generation — include conditional imports in the generated files so Turso projects import `@libsql/client` and Supabase projects import `@supabase/supabase-js`. The module.json handles different dependencies per DB type via a `databaseType` condition.

---

## PROMPT 2.12 — www landing page (apps/www)

Build the marketing and documentation site at `apps/www` that will deploy to `fedi.keeganfrancis.com`.

This site is built by Keegan-Lee Francis presenting the create-fedi-app template to the Fedi ecosystem. It is NOT a demo app — it is the advertisement and documentation host.

### Strict design rules (Impeccible anti-slop)
Every one of the 46 Impeccible rules applies. Run `npx impeccable detect` before considering anything done.

**What the site is:** Think of it as a technical product page for a developer tool — honest, specific, confident. Not a SaaS hero page. Not startup landing page template #4379.

### Page structure: apps/www/app/

**app/layout.tsx** — Same font loading (Bricolage Grotesque + DM Sans), Fedi color tokens, global styles.

**app/page.tsx** — Landing page. Sections (in order):
1. **Hero:** Headline is `Build on Fedi.` — three words, display size, Bricolage Grotesque, no eyebrow pill above it, no gradient text. Below: one-sentence description of what the template is, concretely. Then: `npx create-fedi-app@latest` in a code block with a copy button. CTA: "Read the docs" (not "Get started for free"). NO hero metric numbers. NO animated counters.
2. **What it gives you:** Feature list — NOT identical icon-above-heading cards. Use a two-column layout with module names in monospace on the left, descriptions on the right. Minimal, functional, like a man page.
3. **CLI demo:** An ASCII art / terminal-style walkthrough of the CLI prompt flow (static, not animated — no motion-as-decoration). Shows exactly what `npx create-fedi-app` looks like.
4. **Module showcase:** Scannable list of all optional modules. Brief, specific descriptions. No buzzwords.
5. **How Fedi works (brief):** Two paragraphs explaining WebLN + Nostr for developers who don't know Fedi yet.
6. **Footer:** "Built by Keegan-Lee Francis. Open source — MIT license." GitHub link. Link to docs. No social proof numbers. No testimonial carousels.

**Do not include:**
- "Trusted by X companies" sections
- Animated gradient orbs or glowing backgrounds
- Testimonials (no real ones exist yet)
- Pricing section
- Newsletter signup

---

## PROMPT 2.13 — Fumadocs documentation site

Build the documentation section at `apps/www/app/docs/` using Fumadocs.

### Install and configure Fumadocs
```bash
cd apps/www
bunx fumadocs-cli init
```
Follow the Fumadocs setup for Next.js App Router. Configure theme to match Fedi design tokens.

### Content structure: apps/www/content/docs/

```
docs/
├── index.mdx               # Getting Started overview
├── why-fedi.mdx            # What Fedi is, why mini apps matter
├── quickstart.mdx          # 5-minute quickstart (CLI + first run)
├── cli/
│   ├── index.mdx           # CLI reference overview
│   ├── options.mdx         # All prompts and flags documented
│   └── modules.mdx         # Module selection guide
├── apis/
│   ├── webln.mdx           # WebLN narrative guide + full API reference
│   ├── nostr.mdx           # Nostr guide + NIP-07 reference
│   └── fedi-internal.mdx   # window.fediInternal reference
├── modules/
│   ├── webln-payments.mdx
│   ├── nostr-identity.mdx
│   ├── ecash-balance.mdx
│   ├── payment-gated.mdx
│   ├── ai-chat-gated.mdx
│   ├── ai-assistant.mdx
│   ├── lnurl.mdx
│   ├── multispend.mdx
│   ├── nostr-feed.mdx
│   └── database.mdx
├── patterns.mdx            # Common patterns (pay-gate, identity login, zaps)
├── testing.mdx             # Testing guide with mock providers
└── deployment.mdx          # Deploy to Vercel, submit to Fedi catalog
```

Write the content for every .mdx file. Each guide should be:
- **API reference files:** Complete API surface, TypeScript signatures, parameter descriptions, return types, error cases, code examples for each method
- **Narrative guides:** Explain the WHY before the HOW. Use concrete examples from real Fedi use cases.
- **No filler:** Every sentence must add information. No "In this section, we will..." intros. No "Congratulations, you've learned..." outros.

---

## PROMPT 2.14 — Impeccible full audit pass

Run a comprehensive design audit across the entire project. This is the final quality gate before release.

```bash
# Install impeccable CLI
npm install -g impeccable

# Run on the template output
node apps/cli/dist/index.js  # generate a full project: name=audit-test, all modules, bun
cd audit-test && bun install && bun run build
npx impeccable detect app/ components/ --format json > ../impeccable-report.json
cd ..
```

Fix every finding. Prioritize:
1. Any "AI slop" category finding (must be zero)
2. Any "Quality" finding at Browser-detectable level
3. LLM-only findings — address the patterns even if not auto-detected

Also run manually on `apps/www/app/page.tsx` — the landing page is the highest-visibility surface.

Document every fix made in a file `DESIGN_AUDIT.md`.

---

## PROMPT 2.15 — README + contributing guide

Write the top-level README.md and CONTRIBUTING.md for the `create-fedi-app` repository.

**README.md must include:**
- What it is (one paragraph, no buzzwords)
- Quick start: `npx create-fedi-app@latest` + screenshot/terminal recording placeholder
- Module list table (name | description | requires)
- Local development guide (clone repo, `bun install`, `bun run dev`)
- How to add a new module (link to CONTRIBUTING.md)
- License: MIT

**CONTRIBUTING.md:**
- How to clone and set up the monorepo
- How to create a new module template (module.json spec, file structure, merge strategies)
- How to test a new module end-to-end (CLI → generate → verify)
- Code style guide (TypeScript, Tailwind, Impeccible rules)
- PR checklist: typecheck + lint + test + impeccable detect all passing
- How to update the .ai/rules/ files when adding new APIs

**CHANGELOG.md:** Initialize with v0.1.0 entry covering everything built.

---

## PROMPT 2.16 — npm publish + deployment setup

Configure everything needed to publish and deploy.

### npm publish (apps/cli)
1. Verify `apps/cli/package.json` has correct name (`create-fedi-app`), version (`0.1.0`), files array (only `dist/`), and keywords array (fedi, fedimint, bitcoin, lightning, webln, nostr, mini-app, nextjs)
2. Add `prepublishOnly` script: `bun run build && bun run typecheck`
3. Test publish flow: `npm pack` and inspect the tarball contents

### Vercel deployment (apps/www → fedi.keeganfrancis.com)
1. Create `vercel.json` in apps/www: configure root as apps/www, build command `bun run build`
2. Add deployment instructions to README: which Vercel settings to configure, which env vars to set
3. Add `.env.example` to apps/www with all required variables

### GitHub Actions — release workflow
Update `.github/workflows/release.yml` to:
- Trigger on: push of tag matching `v*.*.*`
- Build CLI, run full test suite, publish to npm with `NPM_TOKEN` secret
- Comment on the triggering commit with the published version number

---

## PROMPT 2.17 — Final integration test

This is the last prompt. Run the complete end-to-end verification of everything built.

```bash
# 1. Root checks
bun run typecheck && echo "✓ Types"
bun run lint && echo "✓ Lint"
bun run test && echo "✓ Tests"
bun run build && echo "✓ Build"

# 2. CLI generates a working project
node apps/cli/dist/index.js
# name=final-test, database=turso, modules=[all], aiRules=yes, pm=bun
cd final-test && bun install
bun run typecheck && echo "✓ Generated project types"
bun run build && echo "✓ Generated project builds"
cd ..

# 3. www site builds
cd apps/www && bun run build && echo "✓ www builds"
cd ..

# 4. Impeccible check on generated project
cd final-test && npx impeccable detect --format summary && cd ..

# 5. Check CLI dry run output
node apps/cli/dist/index.js --help

rm -rf final-test
```

All six checks must pass with zero errors. If anything fails, fix it and re-run.

After passing, print a final summary:
- Total files created
- Total packages published
- All module names and their status
- Link to fedi.keeganfrancis.com
- Link to npm: npmjs.com/package/create-fedi-app

**The project is complete when this prompt passes.**

---

---

# Appendix — Reference

## CLI prompt flow (quick reference)
```
npx create-fedi-app@latest
  1. Project name         [text]     default: my-fedi-app
  2. Database             [select]   none* | turso | supabase
  3. Optional modules     [multi]    payment-gated | lnurl | ai-chat-gated |
                                     ai-assistant | multispend | nostr-feed
  4. AI rules directory   [confirm]  yes*
  5. AI provider*         [select]   agnostic* | anthropic | openai | groq | ollama
  6. Package manager      [select]   bun* | pnpm | npm
  (* = default | AI provider prompt only appears if ai module selected)
```

## Module dependency graph
```
webln-payments      ← always included
nostr-identity      ← always included
ecash-balance       ← always included
payment-gated       → requires: webln-payments, database (optional: enhances with DB)
lnurl               → standalone
ai-chat-gated       → requires: webln-payments
ai-assistant        → standalone
multispend-demo     → requires: nostr-identity
nostr-feed          → requires: nostr-identity; optional: webln-payments (for zaps)
database            → standalone; enhances: payment-gated
ai-rules            → standalone (meta-module, no dependencies)
```

## Key URLs
- Fedi docs: https://fedibtc.github.io/fedi-docs/
- ModBoilerplate: https://github.com/fedibtc/ModBoilerplate
- Catalog: https://github.com/fedibtc/catalog
- Catalog submission form: https://docs.google.com/forms/d/e/1FAIpQLSfrvsoeaNYiGhoc8QwzLXEi4zMFVyxpa4ufJFTwEHp97AeUmQ/viewform
- Mutinynet test federation: https://fedibtc.github.io/fedi-docs/docs/fedimint/intro/
- WebLN spec: https://webln.dev/
- Impeccible: https://impeccable.style/slop
- Vercel AI SDK: https://sdk.vercel.ai/
- Fumadocs: https://fumadocs.vercel.app/
