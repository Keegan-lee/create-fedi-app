'use client';

import ReactMarkdown from 'react-markdown';
import type { UIMessage } from 'ai';

interface IChatMessageProps {
  message: UIMessage;
}

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

/**
 * Renders a single chat message with Markdown support for assistant replies.
 */
export function ChatMessage({ message }: IChatMessageProps) {
  const isUser = message.role === 'user';
  const text = getMessageText(message);

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      data-role={message.role}
    >
      <div
        className="max-w-[85%] rounded-xl px-3 py-2.5 text-sm leading-[1.65]"
        style={{
          background: isUser ? 'var(--color-accent-dim)' : 'var(--color-surface-2)',
          color: isUser ? 'var(--color-text)' : 'var(--color-text)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div
            className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:my-2 prose-pre:rounded-md prose-pre:bg-[var(--color-surface-1)] prose-code:text-[var(--color-accent)] prose-code:before:content-none prose-code:after:content-none"
            style={{ color: 'var(--color-text)' }}
          >
            <ReactMarkdown>{text || '…'}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
