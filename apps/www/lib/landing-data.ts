export const INSTALL_COMMAND = 'npx create-fedi-app@latest';

export const GITHUB_URL = 'https://github.com/keeganfrancis/create-fedi-app';

/** Base scaffold capabilities (always included). */
export const BASE_FEATURES = [
  {
    name: 'webln-payments',
    description:
      'React hooks and a mock provider for window.webln. Send payments, create invoices, and sign messages with graceful fallbacks outside Fedi.',
  },
  {
    name: 'nostr-identity',
    description:
      'NIP-07 connection layer with getPublicKey, signEvent, and relay access. Works in Fedi and degrades cleanly in a normal browser.',
  },
  {
    name: 'ecash-balance',
    description:
      'Reads ecash balance via window.fediInternal and surfaces the Fedi-specific APIs your mini app runs inside.',
  },
  {
    name: '@create-fedi-app/ui',
    description:
      'Fedi-themed shadcn primitives: SatsAmount, ConnectionBadge, MiniAppLayout, and safe-area helpers sized for mobile WebView.',
  },
  {
    name: 'dev-toolbar',
    description:
      'Toggle mock WebLN and Nostr providers in development so you can build without opening Fedi on every refresh.',
  },
  {
    name: 'next.js 16',
    description:
      'App Router, TypeScript strict mode, Tailwind v4, and env validation via @t3-oss/env-nextjs. Production defaults, not a toy starter.',
  },
] as const;

/** Optional modules selectable at scaffold time. */
export const OPTIONAL_MODULES = [
  {
    name: 'payment-gated-content',
    description: 'Lock pages or assets behind a Lightning invoice. HMAC-signed access cookies after payment.',
    requires: 'webln-payments',
  },
  {
    name: 'lnurl',
    description: 'LNURL-pay, LNURL-auth, and LNURL-withdraw flows with callback routes wired up.',
    requires: 'standalone',
  },
  {
    name: 'ai-chat-gated',
    description: 'Streaming AI chat where each message costs sats. Invoice route plus WebLN payment before streamText runs.',
    requires: 'webln-payments',
  },
  {
    name: 'ai-assistant',
    description: 'Free-form AI assistant using Vercel AI SDK. Provider-agnostic: Anthropic, OpenAI, Groq, or Ollama.',
    requires: 'standalone',
  },
  {
    name: 'multispend-demo',
    description: 'UI walkthrough of Fedi threshold spending: proposals, Nostr-signed approvals, mock execution.',
    requires: 'nostr-identity',
  },
  {
    name: 'nostr-feed',
    description: 'Subscribe to kind:1 notes, publish events, and optional zap receipts over WebLN.',
    requires: 'nostr-identity',
  },
  {
    name: 'database',
    description: 'Drizzle ORM CRUD example. Choose Turso (libSQL) or Supabase at scaffold time.',
    requires: 'standalone',
  },
  {
    name: 'ai-rules',
    description: 'Generates .cursorrules and CLAUDE.md with Fedi API context for AI-assisted development.',
    requires: 'standalone',
  },
] as const;

export const CLI_DEMO = `$ npx create-fedi-app@latest

◆  Project name
│  my-fedi-app
│
◆  Database
│  ● None (no persistence layer)
│  ○ Turso
│  ○ Supabase
│
◆  Optional modules (space to toggle)
│  ◻ payment-gated-content
│  ◻ lnurl
│  ◻ ai-chat-gated
│  ◻ ai-assistant
│  ◻ multispend-demo
│  ◻ nostr-feed
│  ◻ database
│
◆  Include AI rules directory (.cursorrules / CLAUDE.md)?
│  Yes
│
◆  Package manager
│  ● bun
│  ○ pnpm
│  ○ npm
│
└  Created my-fedi-app
   Next: cd my-fedi-app && bun install && bun dev`;
