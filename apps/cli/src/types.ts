export type Database = 'none' | 'turso' | 'supabase';
export type PackageManager = 'bun' | 'pnpm' | 'npm';
export type AiProvider = 'agnostic' | 'anthropic' | 'openai' | 'groq' | 'ollama';
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
}
