import type {
  AiProvider,
  Database,
  Module,
  PackageManager,
  UserSelections,
} from './types.js';
import { DEFAULT_LNURL_PAY_ADDRESS } from './types.js';

const ALL_MODULES: Module[] = [
  'payment-gated-content',
  'lnurl',
  'ai-chat-gated',
  'ai-assistant',
  'multispend-demo',
  'nostr-feed',
  'database',
];

const MODULE_SET = new Set<string>(ALL_MODULES);
const DATABASE_SET = new Set<string>(['none', 'turso', 'supabase']);
const PM_SET = new Set<string>(['bun', 'pnpm', 'npm']);
const AI_PROVIDER_SET = new Set<string>([
  'agnostic',
  'anthropic',
  'openai',
  'groq',
  'ollama',
]);

function getFlagValue(argv: string[], flag: string): string | undefined {
  const idx = argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= argv.length) return undefined;
  return argv[idx + 1];
}

function hasFlag(argv: string[], flag: string): boolean {
  return argv.includes(flag);
}

/**
 * Parses non-interactive CLI flags. Returns selections when `--project-name` is set.
 */
export function parseCliArgs(argv: string[]): UserSelections | null {
  const projectName = getFlagValue(argv, '--project-name');
  if (!projectName) return null;

  if (!/^[a-z0-9-]+$/.test(projectName)) {
    throw new Error('Project name must be kebab-case (lowercase letters, numbers, hyphens)');
  }

  const databaseRaw = getFlagValue(argv, '--database') ?? 'none';
  if (!DATABASE_SET.has(databaseRaw)) {
    throw new Error(`Invalid --database: ${databaseRaw}`);
  }
  const database = databaseRaw as Database;

  const modulesRaw = getFlagValue(argv, '--modules') ?? '';
  let modules: Module[];
  if (modulesRaw === 'all') {
    modules = [...ALL_MODULES];
  } else if (!modulesRaw) {
    modules = [];
  } else {
    modules = modulesRaw.split(',').map((m) => m.trim()) as Module[];
    for (const mod of modules) {
      if (!MODULE_SET.has(mod)) {
        throw new Error(`Invalid module: ${mod}`);
      }
    }
  }

  const includeAiRules = !hasFlag(argv, '--no-ai-rules');

  const needsAiProvider =
    modules.includes('ai-chat-gated') || modules.includes('ai-assistant');
  const aiProviderRaw = getFlagValue(argv, '--ai-provider') ?? 'agnostic';
  let aiProvider: AiProvider | null = null;
  if (needsAiProvider) {
    if (!AI_PROVIDER_SET.has(aiProviderRaw)) {
      throw new Error(`Invalid --ai-provider: ${aiProviderRaw}`);
    }
    aiProvider = aiProviderRaw as AiProvider;
  }

  const packageManagerRaw = getFlagValue(argv, '--package-manager') ?? 'bun';
  if (!PM_SET.has(packageManagerRaw)) {
    throw new Error(`Invalid --package-manager: ${packageManagerRaw}`);
  }

  const lnurlPayAddress =
    getFlagValue(argv, '--lnurl-pay-address') ?? DEFAULT_LNURL_PAY_ADDRESS;

  return {
    projectName,
    database,
    modules,
    includeAiRules,
    aiProvider,
    packageManager: packageManagerRaw as PackageManager,
    lnurlPayAddress,
  };
}
