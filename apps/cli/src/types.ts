export type Database = 'none' | 'turso' | 'supabase';
export type PackageManager = 'bun' | 'pnpm' | 'npm';
export type AiProvider = 'agnostic' | 'anthropic' | 'openai' | 'groq' | 'ollama';

export const DEFAULT_LNURL_PAY_ADDRESS =
  'lnurl1dp68gurn8ghj7un9vd6hyunfdenkgtnrw3exytnfduhkcmnkxyhhqctevdhkgetn9uenzvmxv33kyefj8yerqefk8p3rvd34x93nvdr9vvukgcfexcergv3jxc6kgcm9x4jxydenxvengwf48q6rxwpsxf3ryctpvvenwefswhw4au';

export type Module =
  | 'payment-gated-content'
  | 'lnurl'
  | 'ai-chat-gated'
  | 'ai-assistant'
  | 'multispend-demo'
  | 'nostr-feed'
  | 'database';

export interface UserSelections {
  projectName: string;
  database: Database;
  modules: Module[];
  includeAiRules: boolean;
  aiProvider: AiProvider | null;
  packageManager: PackageManager;
  lnurlPayAddress: string;
}
