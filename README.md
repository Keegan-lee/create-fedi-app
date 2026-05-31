# create-fedi-app

`create-fedi-app` is a command-line scaffolder that generates a Next.js 16 mini app wired for [Fedi](https://www.fedi.xyz). It copies a production-ready base template, merges optional feature modules (Lightning payments, Nostr identity, AI chat, LNURL, and more), and writes the env vars and dependencies each module needs. Generated apps run inside Fedi's in-app browser with access to `window.webln`, `window.nostr`, and `window.fediInternal`, and degrade cleanly when opened in a normal browser.

## Quick start

```bash
npx create-fedi-app@latest
```

Follow the prompts to pick a project name, database adapter, optional modules, and package manager. Then:

```bash
cd my-fedi-app
bun install   # or pnpm / npm
bun dev
```

<!-- TODO: replace with screenshot or asciinema recording -->

```
$ npx create-fedi-app@latest

◆  Project name
│  my-fedi-app
│
◆  Database
│  ● None (no persistence layer)
│
◆  Optional modules (space to toggle)
│  ◻ payment-gated-content
│  ◻ lnurl
│  …
│
◆  Include AI rules directory (.cursorrules / CLAUDE.md)?
│  Yes
│
└  Created my-fedi-app
   Next: cd my-fedi-app && bun install && bun dev
```

Docs: [create-fedi-app.keeganfrancis.com/docs](https://create-fedi-app.keeganfrancis.com/docs)

### Deploy and test in Fedi

After scaffolding, deploy your app to Vercel and open it inside the Fedi wallet (custom mini app URL, then catalog submission). Step-by-step instructions live in the npm package README: [`apps/cli/README.md`](./apps/cli/README.md) (published to [npmjs.com/package/create-fedi-app](https://www.npmjs.com/package/create-fedi-app)).

## Modules

Three modules are always included. The rest are optional at scaffold time.

| Name | Description | Requires |
|------|-------------|----------|
| `webln-payments` | Send and receive Lightning payments via `window.webln` | Always included |
| `nostr-identity` | NIP-07 identity connection and signed messages | Always included |
| `ecash-balance` | Fedi ecash balance and `fediInternal` API demos | Always included |
| `payment-gated-content` | Lock content behind a Lightning invoice with signed access cookies | `webln-payments` |
| `lnurl` | LNURL-pay, LNURL-auth, and LNURL-withdraw flows | — |
| `ai-chat-gated` | AI chat where each message costs sats via WebLN | `webln-payments`, `AI_PROVIDER`, `AI_API_KEY` |
| `ai-assistant` | Free AI assistant using the Vercel AI SDK | `AI_PROVIDER`, `AI_API_KEY` |
| `multispend-demo` | Threshold spending UI with Nostr-signed approvals | `nostr-identity` |
| `nostr-feed` | Read, publish, and zap Nostr notes | `nostr-identity` |
| `database` | Drizzle ORM CRUD example (Turso or Supabase) | Turso or Supabase selected at scaffold time |
| `ai-rules` | Agent-readable `.ai/rules/` context for Cursor, Claude Code, and Copilot | — |

## Local development

Clone the monorepo and install dependencies with [Bun](https://bun.sh):

```bash
git clone https://github.com/keegan-lee/create-fedi-app.git
cd create-fedi-app
bun install
```

Run all workspaces in dev mode:

```bash
bun run dev
```

Common checks from the repo root:

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```

To test the CLI locally before publishing:

```bash
bun run build
node apps/cli/dist/index.js
```

The CLI reads templates from `templates/` at the repo root. Changes to module templates take effect on the next generation — no publish step required during development.

To verify the npm tarball before publishing:

```bash
cd apps/cli
bun run build
npm pack
tar -tzf create-fedi-app-*.tgz | head   # dist/index.js + dist/templates/
```

## Publishing the CLI

Tag a semver release and push — GitHub Actions publishes to npm:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Requires an `NPM_TOKEN` secret on the repository (Automation token with publish access to `create-fedi-app`).

## Deploying the docs site (Vercel)

The marketing and documentation site in `apps/www` deploys to [create-fedi-app.keeganfrancis.com](https://create-fedi-app.keeganfrancis.com).

| Setting | Value |
|---------|-------|
| Root Directory | `apps/www` |
| Framework Preset | Next.js |
| Install Command | `cd ../.. && bun install` (also in `apps/www/vercel.json`) |
| Build Command | `bun run build` |
| Include files outside Root Directory | **Enabled** (required for `@create-fedi-app/ui` workspace package) |

**Environment variables:** none required — see [apps/www/.env.example](./apps/www/.env.example).

Connect the GitHub repo in the Vercel dashboard, set the root directory to `apps/www`, enable monorepo file inclusion, and add the custom domain `create-fedi-app.keeganfrancis.com`.

### Repository layout

```
create-fedi-app/
├── apps/
│   ├── cli/          # create-fedi-app npm package
│   └── www/          # create-fedi-app.keeganfrancis.com (landing + docs)
├── packages/
│   ├── fedi-types/   # TypeScript types for injected Fedi APIs
│   ├── webln/        # WebLN provider + mock (canonical source)
│   ├── nostr/        # Nostr provider + mock (canonical source)
│   └── ui/           # Fedi-themed shadcn/ui components
└── templates/
    ├── base/         # Next.js 16 scaffold copied into every project
    └── modules/      # Feature modules merged by the CLI
```

## Adding a module

See [CONTRIBUTING.md](./CONTRIBUTING.md#creating-a-module-template) for the full `module.json` spec, merge strategies, end-to-end testing flow, and how to update `.ai/rules/` when you add new APIs.

## License

MIT — see [apps/cli/package.json](./apps/cli/package.json).
