import * as p from '@clack/prompts';
import type { AiProvider, Database, Module, PackageManager, UserSelections } from './types.js';

function cancelCheck<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel('Cancelled.');
    process.exit(0);
  }
  return value as T;
}

export async function promptUser(): Promise<UserSelections> {
  const projectName = cancelCheck(
    await p.text({
      message: 'Project name',
      defaultValue: 'my-fedi-app',
      placeholder: 'my-fedi-app',
      validate: (v) => {
        const name = v || 'my-fedi-app';
        if (!/^[a-z0-9-]+$/.test(name)) {
          return 'Use kebab-case only (lowercase letters, numbers, hyphens)';
        }
      },
    }),
  );

  const database = cancelCheck(
    await p.select<Database>({
      message: 'Database',
      initialValue: 'none' as Database,
      options: [
        { value: 'none' as Database, label: 'None', hint: 'no persistence layer' },
        { value: 'turso' as Database, label: 'Turso', hint: 'libSQL edge database' },
        { value: 'supabase' as Database, label: 'Supabase', hint: 'Postgres + auth' },
      ],
    }),
  );

  const modules = cancelCheck(
    await p.multiselect<Module>({
      message: 'Optional modules (space to toggle, enter to confirm)',
      required: false,
      options: [
        { value: 'payment-gated-content' as Module, label: 'Payment-gated content', hint: 'lock content behind a lightning payment' },
        { value: 'lnurl' as Module, label: 'LNURL', hint: 'LNURL-pay and LNURL-withdraw' },
        { value: 'ai-chat-gated' as Module, label: 'AI chat (gated)', hint: 'AI chat locked behind ecash payment' },
        { value: 'ai-assistant' as Module, label: 'AI assistant', hint: 'free AI chat with Vercel AI SDK' },
        { value: 'multispend-demo' as Module, label: 'Multispend demo', hint: 'Fedi multispend wallet UI' },
        { value: 'nostr-feed' as Module, label: 'Nostr feed', hint: 'read/post to a Nostr relay' },
        { value: 'database' as Module, label: 'Database demo', hint: 'Drizzle ORM CRUD example' },
      ],
    }),
  );

  const includeAiRules = cancelCheck(
    await p.confirm({
      message: 'Include AI rules directory (.cursorrules / CLAUDE.md)?',
      initialValue: true,
    }),
  );

  const needsAiProvider =
    (modules as Module[]).includes('ai-chat-gated') ||
    (modules as Module[]).includes('ai-assistant');

  let aiProvider: AiProvider | null = null;
  if (needsAiProvider) {
    aiProvider = cancelCheck(
      await p.select<AiProvider>({
        message: 'AI provider',
        initialValue: 'agnostic' as AiProvider,
        options: [
          { value: 'agnostic' as AiProvider, label: 'Agnostic', hint: 'Vercel AI SDK default, swap any provider' },
          { value: 'anthropic' as AiProvider, label: 'Anthropic', hint: 'Claude via @ai-sdk/anthropic' },
          { value: 'openai' as AiProvider, label: 'OpenAI', hint: 'GPT via @ai-sdk/openai' },
          { value: 'groq' as AiProvider, label: 'Groq', hint: 'fast inference via @ai-sdk/groq' },
          { value: 'ollama' as AiProvider, label: 'Ollama', hint: 'local models via ollama-ai-provider' },
        ],
      }),
    );
  }

  const packageManager = cancelCheck(
    await p.select<PackageManager>({
      message: 'Package manager',
      initialValue: 'bun' as PackageManager,
      options: [
        { value: 'bun' as PackageManager, label: 'bun', hint: 'recommended — fastest' },
        { value: 'pnpm' as PackageManager, label: 'pnpm', hint: 'efficient disk usage' },
        { value: 'npm' as PackageManager, label: 'npm', hint: 'broadest compatibility' },
      ],
    }),
  );

  return {
    projectName: (projectName as string) || 'my-fedi-app',
    database: database as Database,
    modules: (modules as Module[]) ?? [],
    includeAiRules: includeAiRules as boolean,
    aiProvider,
    packageManager: packageManager as PackageManager,
  };
}
