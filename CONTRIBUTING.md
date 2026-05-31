# Contributing to create-fedi-app

Thanks for helping improve the Fedi mini app scaffolder. This guide covers monorepo setup, module templates, testing, code style, and keeping AI agent context in sync.

## Clone and set up

**Requirements:** Bun 1.2+, Node 22+ (for some tooling), Git.

```bash
git clone https://github.com/keeganfrancis/create-fedi-app.git
cd create-fedi-app
bun install
```

Verify the workspace is healthy before you start:

```bash
bun run typecheck && bun run lint && bun run test && bun run build
```

### What lives where

| Path | Purpose |
|------|---------|
| `apps/cli/` | The `create-fedi-app` npm package — prompts, scaffold logic, tsup build |
| `apps/www/` | Marketing site and Fumadocs documentation |
| `packages/*` | Shared libraries consumed by templates and the docs site |
| `templates/base/` | Base Next.js 16 app copied into every generated project |
| `templates/modules/*` | Optional (and always-on) feature modules merged by the CLI |
| `tests/e2e/` | Playwright tests against generated projects |

Provider logic for WebLN and Nostr lives in `packages/webln` and `packages/nostr`, and is **inlined** into `templates/base/lib/` so generated projects are standalone (no workspace deps). When you change provider behavior, update both locations.

---

## Creating a module template

### 1. Directory structure

Create a folder under `templates/modules/<module-name>/`:

```
templates/modules/my-module/
├── module.json
├── components/my-module/MyComponent.tsx
├── hooks/useMyModule.ts
├── lib/my-module-utils.ts
└── app/demo/my-module/page.tsx
```

Follow existing modules for naming: kebab-case directory names, PascalCase components, camelCase hooks and utilities.

### 2. `module.json` spec

Every module needs a valid `module.json`. The CLI reads this manifest to copy files, merge dependencies, append env vars, and add npm scripts.

```json
{
  "name": "my-module",
  "description": "One-line description shown in docs and the landing page",
  "dependencies": ["some-npm-package"],
  "devDependencies": [],
  "scripts": {},
  "files": [
    {
      "src": "components/my-module/MyComponent.tsx",
      "dest": "components/my-module/MyComponent.tsx",
      "merge": "add"
    }
  ],
  "envVars": [
    {
      "key": "MY_API_KEY",
      "description": "What this variable does",
      "example": "abc123",
      "required": true
    }
  ]
}
```

**Top-level fields**

| Field | Required | Description |
|-------|----------|-------------|
| `name` | yes | Module id (kebab-case). Must match the directory name. |
| `description` | yes | Short summary for docs and README tables. |
| `dependencies` | yes | npm packages merged into the generated `package.json`. |
| `devDependencies` | yes | Dev packages merged into the generated `package.json`. |
| `files` | yes | Files to copy from the module dir into the generated project. |
| `envVars` | yes | Env vars appended to `.env.local` and documented in `.env.example`. |
| `scripts` | no | npm scripts merged into the generated `package.json`. |
| `databaseType` | no | Per-adapter deps and conditional files (see `database` module). |

**File entry fields**

| Field | Required | Description |
|-------|----------|-------------|
| `src` | yes | Path relative to the module directory. |
| `dest` | yes | Path relative to the generated project root. |
| `merge` | yes | How to apply the file (see below). |
| `databaseType` | no | `"turso"` or `"supabase"` — file is only applied when that adapter is selected. |

### 3. Merge strategies

Implemented in `apps/cli/src/modules.ts`:

| Strategy | Behavior | When to use |
|----------|----------|-------------|
| `add` | Copy only if the destination does not exist | New components, routes, hooks (default) |
| `replace` | Overwrite the destination every time | Replacing `proxy.ts`, `env.ts`, or other base files the module fully owns |
| `append` | Append source content to an existing file, or create if missing | Injecting snippets into shared config (rare) |

Use `replace` sparingly. Only one module should own a given destination path. The `payment-gated-content` module replaces `proxy.ts` because it adds server-side payment verification.

### 4. Register the module in the CLI

**Always-on modules** (included in every project): add the module name to the `alwaysOn` array in `apps/cli/src/scaffold.ts`.

**Optional modules:**

1. Add the id to the `Module` union in `apps/cli/src/types.ts`.
2. Add a multiselect option in `apps/cli/src/prompts.ts`.
3. If the module needs an AI provider prompt, extend the `needsAiProvider` check in `prompts.ts`.

**Database-conditional modules:** the `database` module is applied automatically when the user selects Turso or Supabase. Use `databaseType` on file entries and the top-level `databaseType` block for adapter-specific dependencies.

### 5. Demo page conventions

Every feature module should ship a demo route under `app/demo/<module>/page.tsx`:

- Use `'use client'` when calling browser APIs or hooks.
- Wrap content in `MiniAppLayout` and `DemoSection` from the base template.
- Guard `window.webln`, `window.nostr`, and `window.fediInternal` — they are `undefined` outside Fedi.
- Include the dev toolbar mock states so the demo works in a normal browser.

### 6. Placeholder tokens

Template files may contain placeholders replaced at scaffold time:

- `{{PROJECT_NAME}}` — kebab-case project name
- `{{PROJECT_NAME_PASCAL}}` — PascalCase variant
- `{{SELECTED_MODULES}}` — bullet list for AI rules (ai-rules module only)

Do not use workspace path aliases like `@create-fedi-app/webln` in generated templates. The base template inlines providers under `lib/webln` and `lib/nostr`.

---

## Testing a module end-to-end

### 1. Build and run the CLI

```bash
bun run build
node apps/cli/dist/index.js
```

Select your new module (and any dependencies) when prompted. Generate into a temp directory outside the monorepo, e.g. `/tmp/my-module-test`.

### 2. Verify the generated project

```bash
cd /tmp/my-module-test
bun install
bun run typecheck   # if the generated package.json defines it
bun run build
bun dev
```

Open the demo route (`/demo/<module>`) and confirm:

- Components render with mock providers (dev toolbar toggles).
- No TypeScript or build errors.
- Env vars from `module.json` appear in `.env.local`.

### 3. Run Impeccible on the generated UI

Scan TSX surfaces only (CSS `--` tokens trigger false positives):

```bash
npx impeccable detect app/ components/ --json
```

Expect zero findings. See [DESIGN_AUDIT.md](./DESIGN_AUDIT.md) for the full audit procedure.

### 4. Add automated tests (when appropriate)

- **Vitest + RTL:** hook and component tests under `hooks/__tests__/` or `components/**/__tests__/`.
- **Playwright:** E2E flows under `tests/e2e/` in the module template (copied into generated projects).
- **Monorepo packages:** tests in `packages/*/\_\_tests\_\_/`.

Run from the repo root after changes:

```bash
bun run test
```

---

## Code style

### TypeScript

- Strict mode everywhere. No `any` unless unavoidable — prefer typed guards and generics.
- Interfaces prefixed with `I`, types with `T` (e.g. `IUser`, `TBooking`).
- Public functions and API routes: TSDoc/JSDoc comments for non-obvious behavior.
- App Router: `'use client'` on any file using hooks or browser globals.
- Generated and template code must compile standalone — no monorepo-only imports.

### Tailwind CSS v4

- Design tokens live in `app/globals.css` inside `@theme {}`.
- Prefer theme classes (`bg-surface`, `text-text-muted`) over hard-coded hex values.
- Border radius: 4px tags, 8px inputs/buttons, 12px cards max.
- Fonts: Bricolage Grotesque (display), DM Sans (body), JetBrains Mono (code). Never Inter, Geist, or Space Grotesk.

### Impeccible design rules

All UI must pass [Impeccible](https://impeccable.style/slop) anti-slop checks. Non-negotiable constraints:

- No purple/violet gradients, cyan-on-dark palettes, glassmorphism, glow shadows, or neon accents
- No nested cards, gradient text, hero eyebrow pills, or 01/02/03 section markers
- No cream/beige page backgrounds or pure `#fff` text on buttons (use `var(--color-primary-foreground)`)
- No marketing buzzwords in UI copy
- Motion: ease-out-quart/quint only — no bounce, elastic, or hover image zoom
- Body line-height 1.6–1.7, max ~75ch line length

Full token reference: `templates/modules/ai-rules/rules/design-system.md`.

Run before opening a PR:

```bash
npx impeccable detect templates/modules/<your-module> apps/www/components packages/ui/src/components --json
```

---

## Pull request checklist

Before requesting review, confirm all of the following pass locally:

- [ ] `bun run typecheck` — zero errors across all workspaces
- [ ] `bun run lint` — zero errors and warnings
- [ ] `bun run test` — all Vitest suites green
- [ ] `bun run build` — CLI (`dist/`) and `apps/www` build successfully
- [ ] `npx impeccable detect` — zero findings on affected TSX surfaces
- [ ] New module tested end-to-end: CLI → generate → install → build → demo route
- [ ] Provider changes mirrored in both `packages/*` and `templates/base/lib/*` (if applicable)
- [ ] `.ai/rules/` updated for new Fedi APIs (if applicable)
- [ ] Docs updated under `apps/www/content/docs/` for user-facing module changes

CI runs the same checks on every push and pull request to `main` (see `.github/workflows/ci.yml`).

---

## Updating `.ai/rules/` for new APIs

When your module introduces or wraps a Fedi-specific API, update the agent context so AI tools do not hallucinate wallet libraries or wrong patterns.

**Source templates:** `templates/modules/ai-rules/`

| File | Update when |
|------|-------------|
| `rules/webln.md` | New WebLN methods, payment flows, or error handling patterns |
| `rules/nostr.md` | New NIP usage, event kinds, or signing patterns |
| `rules/fedi-api.md` | Changes to `window.fediInternal` (versions, new methods) |
| `rules/patterns.md` | Reusable UI or data-flow patterns other modules should copy |
| `rules/architecture.md` | Routing, server/client boundaries, or folder conventions |
| `rules/design-system.md` | New tokens, components, or layout primitives |
| `rules/testing.md` | New test utilities, mock patterns, or E2E conventions |
| `rules/OVERVIEW.md` | Stack changes or high-level project constraints |

**Steps:**

1. Edit the relevant file under `templates/modules/ai-rules/rules/`.
2. Add a `files` entry in `templates/modules/ai-rules/module.json` if you create a new rule file (use `"merge": "add"`).
3. Regenerate a project with the ai-rules module enabled and confirm files land in `.ai/rules/` in the output.
4. Add or update the matching doc page in `apps/www/content/docs/apis/` or `apps/www/content/docs/modules/`.

**Rules agents must follow** (repeat in new API docs):

- Never install external wallet or NIP-07 adapter libraries — Fedi injects the providers.
- Always guard `window.webln`, `window.nostr`, and `window.fediInternal` before use.
- Do not call `window.webln.enable()` — the inlined provider handles it.
- Browser APIs and hooks require `'use client'`.

---

## Questions

Open an issue or discussion on GitHub if you are unsure whether a module belongs in the base template or as an optional add-on. For design decisions, read `PROMPT_PLAN.md` and [DESIGN_AUDIT.md](./DESIGN_AUDIT.md) first.
