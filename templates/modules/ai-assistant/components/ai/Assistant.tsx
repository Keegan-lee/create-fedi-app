'use client';

import ReactMarkdown from 'react-markdown';
import type { UIMessage } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { useAssistant } from './AssistantProvider';

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

interface IAssistantMessageProps {
  message: UIMessage;
}

/**
 * Single chat bubble with Markdown rendering and copy-to-clipboard.
 */
function AssistantMessage({ message }: IAssistantMessageProps) {
  const isUser = message.role === 'user';
  const text = getMessageText(message);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={`group flex ${isUser ? 'justify-end' : 'justify-start'}`}
      data-role={message.role}
    >
      <div
        className="relative max-w-[85%] rounded-xl px-3 py-2.5 text-sm leading-[1.65]"
        style={{
          background: isUser ? 'var(--color-accent-dim)' : 'var(--color-surface-2)',
          color: 'var(--color-text)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {text && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus:opacity-100"
            style={{
              background: 'var(--color-surface-1)',
              color: 'var(--color-text-muted)',
            }}
            aria-label={copied ? 'Copied' : 'Copy message'}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}

        {isUser ? (
          <p className="whitespace-pre-wrap pr-10">{text}</p>
        ) : (
          <div
            className="prose prose-invert prose-sm max-w-none pr-10 prose-p:my-1 prose-pre:my-2 prose-pre:rounded-md prose-pre:bg-[var(--color-surface-1)] prose-code:text-[var(--color-accent)] prose-code:before:content-none prose-code:after:content-none"
            style={{ color: 'var(--color-text)' }}
          >
            <ReactMarkdown>{text || '…'}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

interface IAssistantProps {
  /** Placeholder shown when the conversation is empty. */
  emptyPlaceholder?: string;
}

/**
 * Free AI chat interface with streaming replies, Markdown, and copy-to-clipboard.
 * Must be rendered inside `AssistantProvider`.
 */
export function Assistant({
  emptyPlaceholder = 'Ask anything. Replies stream in real time.',
}: IAssistantProps) {
  const { messages, sendMessage, status, error, setMessages } = useAssistant();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const isStreaming = status === 'streaming' || status === 'submitted';
  const canSend = input.trim().length > 0 && !isStreaming;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isStreaming]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isStreaming) return;

    setInput('');
    await sendMessage({ text });
  }

  function handleClear() {
    setMessages([]);
    setInput('');
  }

  return (
    <div className="flex min-h-[420px] flex-col gap-4">
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto rounded-xl p-3"
        style={{
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          maxHeight: '50dvh',
        }}
        aria-live="polite"
        aria-label="Assistant messages"
      >
        {messages.length === 0 && (
          <p className="text-center text-sm leading-[1.65]" style={{ color: 'var(--color-text-muted)' }}>
            {emptyPlaceholder}
          </p>
        )}

        {messages.map((message) => (
          <AssistantMessage key={message.id} message={message} />
        ))}

        {isStreaming && (
          <p
            className="text-xs font-mono"
            style={{ color: 'var(--color-text-subtle)' }}
            aria-live="polite"
          >
            Assistant is typing…
          </p>
        )}
      </div>

      {error && (
        <p className="text-xs" style={{ color: 'var(--color-error, #ef4444)' }} role="alert">
          {error.message ?? 'Something went wrong'}
        </p>
      )}

      <div className="space-y-3">
        <label htmlFor="assistant-input" className="sr-only">
          Message
        </label>
        <textarea
          id="assistant-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask anything…"
          rows={3}
          disabled={isStreaming}
          className="w-full resize-none rounded-lg px-3 py-2.5 text-sm leading-[1.65] outline-none transition-opacity duration-200 disabled:opacity-50"
          style={{
            background: 'var(--color-surface-2)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              if (canSend) void handleSend();
            }
          }}
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!canSend}
            className="inline-flex flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: 'var(--color-surface-2)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Send
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isStreaming}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: 'var(--color-surface-1)',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
