import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';
import { createOllama } from 'ollama-ai-provider';
import type { LanguageModel } from 'ai';

export type TAiProvider = 'anthropic' | 'openai' | 'groq' | 'ollama';

const DEFAULT_MODELS: Record<TAiProvider, string> = {
  anthropic: 'claude-sonnet-4-0',
  openai: 'gpt-4o',
  groq: 'llama-3.3-70b-versatile',
  ollama: 'llama3.2',
};

function resolveProvider(): TAiProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  if (provider === 'anthropic' || provider === 'openai' || provider === 'groq' || provider === 'ollama') {
    return provider;
  }
  return 'anthropic';
}

function resolveModel(provider: TAiProvider): string {
  return process.env.AI_MODEL?.trim() || DEFAULT_MODELS[provider];
}

/**
 * Returns a Vercel AI SDK language model based on `AI_PROVIDER` and related env vars.
 */
export function getLanguageModel(): LanguageModel {
  const provider = resolveProvider();
  const modelId = resolveModel(provider);
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;

  switch (provider) {
    case 'anthropic':
      return createAnthropic(apiKey ? { apiKey } : undefined)(modelId);
    case 'openai':
      return createOpenAI(apiKey ? { apiKey } : undefined)(modelId);
    case 'groq':
      return createGroq(apiKey ? { apiKey } : undefined)(modelId);
    case 'ollama':
      return createOllama(baseURL ? { baseURL } : undefined)(modelId) as unknown as LanguageModel;
    default:
      return createAnthropic(apiKey ? { apiKey } : undefined)(modelId);
  }
}
