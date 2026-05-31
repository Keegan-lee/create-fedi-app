# create-fedi-app

CLI scaffolder for [Fedi](https://www.fedi.xyz) Bitcoin mini apps on **Next.js 16**. It copies a production-ready base template, merges optional feature modules (Lightning payments, Nostr identity, AI chat, LNURL, and more), and writes the env vars and dependencies each module needs.

Generated apps run inside Fedi's in-app browser with access to `window.webln`, `window.nostr`, and `window.fediInternal`, and degrade cleanly when opened in a normal browser. Each project includes a `.gitignore` for Next.js, env files, and Vercel artifacts.

## Quick start

```bash
npx create-fedi-app@latest
```

Follow the prompts for project name, database adapter, optional modules, and package manager. Then:

```bash
cd my-fedi-app
cp .env.example .env.local   # optional for base-only projects
bun install                  # or pnpm / npm
bun dev
```

Open `http://localhost:3000`. Use the **Fedi Dev Toolbar** (bottom-right, dev only) to toggle mock WebLN and mock Nostr without the wallet.

**Full documentation:** [create-fedi-app.keeganfrancis.com/docs](https://create-fedi-app.keeganfrancis.com/docs)

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

## Local development (before deploy)

1. **Mock providers** — On `/demo/webln` and `/demo/nostr`, enable mocks in the dev toolbar and exercise pay/sign flows without Lightning.
2. **Unit tests** — `bun test` (Vitest). Optional E2E: `bun run test:e2e` (Playwright).
3. **Production build locally** — `bun run build && bun start` (mocks are off in production).

## Deploy on Vercel

Mini apps are standard Next.js apps served over **HTTPS**. Vercel is the recommended host.

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial Fedi mini app"
git remote add origin https://github.com/you/my-fedi-app.git
git push -u origin main
```

### 2. Import the project

1. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
2. **Framework preset:** Next.js
3. **Root directory:** project root (where `package.json` lives)
4. Leave the default build command (`next build`) and output settings.

### 3. Set environment variables

In Vercel → **Settings** → **Environment Variables**, add every key from `.env.local` that your modules need:

| Variable | When required |
|----------|----------------|
| `PAYMENT_GATE_SECRET` | `payment-gated-content` |
| `AI_PROVIDER`, `AI_API_KEY` | `ai-chat-gated` or `ai-assistant` |
| `DATABASE_URL` | Turso or Supabase database module |
| `LNURL_SERVER_URL` | `lnurl` — use your **production** URL (not `localhost`) |
| `NEXT_PUBLIC_NOSTR_RELAY` | `nostr-feed` (optional override) |

Use long random values for secrets in production. Do not commit `.env.local`.

### 4. Deploy

Vercel deploys on every push to `main` and creates preview URLs for pull requests. Confirm your production URL loads over HTTPS (required by Fedi).

If you use the **lnurl** module, set:

```bash
LNURL_SERVER_URL=https://your-production-domain.vercel.app
```

## Test inside the Fedi mini app ecosystem

Fedi injects `window.webln`, `window.nostr`, and `window.fediInternal` in its mobile WebView. Your deployed app must be reachable over **HTTPS** (or your phone's LAN IP during local testing).

### Before catalog listing (development)

1. Install Fedi: [fedi.xyz/get-the-app](https://fedi.xyz/get-the-app)
2. Join a **Mutinynet** test federation — [Fedi Fedimint intro](https://fedibtc.github.io/fedi-docs/docs/fedimint/intro/)
3. In Fedi → **Settings** → **Developer** (or **Custom Mini Apps**), add your app URL:
   - **Deployed:** `https://your-app.vercel.app`
   - **Local on device:** `http://<your-computer-lan-ip>:3000` (same Wi‑Fi; Fedi cannot reach `localhost` on your laptop)
   - **Remote dev:** a tunnel URL (e.g. ngrok) pointing at port 3000
4. Open the mini app from Fedi's app list.

### In-wallet checklist

- [ ] App loads in the WebView without horizontal scroll
- [ ] `/demo/webln` — real Lightning payment on Mutinynet
- [ ] `/demo/nostr` — connect identity and sign a message
- [ ] `/demo/ecash` — fediInternal version badge; Load installed apps after granting `manageInstalledMiniApps`
- [ ] Safe area / notch padding looks correct

Use **Mutinynet test sats**, not mainnet, while developing.

### Programmatic install (`fediInternal` v2)

The `ecash-balance` module includes `InstallMiniAppButton`, which calls:

```typescript
await window.fediInternal?.installMiniApp({
  id: 'my-app',
  title: 'My App',
  url: 'https://your-app.vercel.app',
  imageUrl: 'https://your-app.vercel.app/icon.png',
  description: 'One-line description',
});
```

This only works inside Fedi when API v2 is available. Requires the user to grant **`manageInstalledMiniApps`** when prompted.

### Publish to the Fedi catalog

For wallet discovery beyond custom URLs, submit to the official catalog:

**[Catalog submission form](https://docs.google.com/forms/d/e/1FAIpQLSfrvsoeaNYiGhoc8QwzLXEi4zMFVyxpa4ufJFTwEHp97AeUmQ/viewform)**

Prepare: app name, production HTTPS URL, short description, square icon (min 256×256), mobile screenshots, and category. Reference: [fedibtc/catalog](https://github.com/fedibtc/catalog).

## Pre-ship checklist

- [ ] All required env vars set on Vercel
- [ ] `PAYMENT_GATE_SECRET` is a strong random string (not a dev default)
- [ ] `LNURL_SERVER_URL` matches your production domain (if using lnurl)
- [ ] App tested on Mutinynet inside Fedi
- [ ] Icon and metadata ready for catalog review

## Links

- [Documentation](https://create-fedi-app.keeganfrancis.com/docs)
- [Quickstart](https://create-fedi-app.keeganfrancis.com/docs/quickstart)
- [Deployment guide](https://create-fedi-app.keeganfrancis.com/docs/deployment)
- [Source repository](https://github.com/keegan-lee/create-fedi-app)
- [Fedi developer docs](https://fedibtc.github.io/fedi-docs/)

## License

MIT
