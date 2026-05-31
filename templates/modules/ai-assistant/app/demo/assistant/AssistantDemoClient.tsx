'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Assistant } from '../../../components/ai/Assistant';
import { AssistantProvider } from '../../../components/ai/AssistantProvider';

const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful assistant inside a Fedi Mini App. Keep answers concise and practical.';

export function AssistantDemoClient() {
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);

  return (
    <div className="min-h-dvh bg-[var(--color-bg)] font-[family-name:var(--font-body)] text-[var(--color-text)]">
      <div
        className="mx-auto w-full max-w-[390px] px-4 pt-6"
        style={{ paddingBottom: 'max(5rem, env(safe-area-inset-bottom, 20px))' }}
      >
        <Link
          href="/demo"
          className="mb-6 inline-block text-xs text-[var(--color-text-muted)] transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80"
        >
          ← back
        </Link>

        <header className="mb-8 space-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight text-[var(--color-text)]">
            AI assistant
          </h1>
          <p className="max-w-[75ch] text-sm leading-[1.65] text-[var(--color-text-muted)]">
            Free chat powered by the Vercel AI SDK. Configure the system prompt below. It is sent
            with every request to <code className="font-mono text-xs">/api/assistant</code> via{' '}
            <code className="font-mono text-xs">streamText()</code>.
          </p>
        </header>

        <div className="mb-6 space-y-2">
          <label
            htmlFor="system-prompt"
            className="block text-xs font-semibold text-[var(--color-text-muted)]"
          >
            System prompt
          </label>
          <textarea
            id="system-prompt"
            value={systemPrompt}
            onChange={(event) => setSystemPrompt(event.target.value)}
            rows={4}
            className="w-full resize-y rounded-lg px-3 py-2.5 font-mono text-xs leading-[1.65] outline-none"
            style={{
              background: 'var(--color-surface-2)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          />
          <p className="text-xs leading-[1.65] text-[var(--color-text-subtle)]">
            Changing the prompt starts a fresh context on the next message. Clear the chat if you
            want a clean thread.
          </p>
        </div>

        <AssistantProvider systemPrompt={systemPrompt}>
          <Assistant />
        </AssistantProvider>
      </div>
    </div>
  );
}
