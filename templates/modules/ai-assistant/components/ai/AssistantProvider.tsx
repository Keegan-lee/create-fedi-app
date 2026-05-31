'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';

const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful assistant inside a Fedi Mini App. Keep answers concise and practical.';

type TAssistantContext = ReturnType<typeof useChat>;

const AssistantContext = createContext<TAssistantContext | null>(null);

interface IAssistantProviderProps {
  children: ReactNode;
  /** Custom system prompt sent with each request. */
  systemPrompt?: string;
  /** API route path. Defaults to `/api/assistant`. */
  api?: string;
}

/**
 * Provides Vercel AI SDK `useChat()` state to descendant assistant UI components.
 */
export function AssistantProvider({
  children,
  systemPrompt = DEFAULT_SYSTEM_PROMPT,
  api = '/api/assistant',
}: IAssistantProviderProps) {
  const systemPromptRef = useRef(systemPrompt);

  useEffect(() => {
    systemPromptRef.current = systemPrompt;
  }, [systemPrompt]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api,
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            messages,
            systemPrompt: systemPromptRef.current,
          },
        }),
      }),
    [api],
  );

  const chat = useChat({ transport });

  return (
    <AssistantContext.Provider value={chat}>{children}</AssistantContext.Provider>
  );
}

/** Access assistant chat state from an `AssistantProvider` subtree. */
export function useAssistant(): TAssistantContext {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
}
