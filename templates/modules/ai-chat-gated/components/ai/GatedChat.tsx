'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { PaymentGate, type TChatPaymentProof } from './PaymentGate';

const DEFAULT_SATS = 10;

function getClientSatsPerMessage(): number {
  const raw = process.env.NEXT_PUBLIC_SATS_PER_MESSAGE ?? String(DEFAULT_SATS);
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_SATS;
}

/**
 * Full pay-per-message AI chat: message list, input, Lightning payment gate, streaming replies.
 */
export function GatedChat() {
  const satsPerMessage = getClientSatsPerMessage();
  const [input, setInput] = useState('');
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [gateError, setGateError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat' }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  const isStreaming = status === 'streaming' || status === 'submitted';
  const canSend = input.trim().length > 0 && !isStreaming && pendingText === null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isStreaming]);

  async function handlePaymentConfirmed(proof: TChatPaymentProof) {
    const text = pendingText ?? input.trim();
    if (!text) return;

    setGateError(null);
    setInput('');
    setPendingText(null);

    await sendMessage(
      { text },
      {
        body: {
          paymentId: proof.paymentId,
          preimage: proof.preimage,
        },
      },
    );
  }

  function handlePrepareSend() {
    const text = input.trim();
    if (!text || isStreaming) return;
    setGateError(null);
    setPendingText(text);
  }

  function handleCancelPending() {
    setPendingText(null);
    setGateError(null);
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
        aria-label="Chat messages"
      >
        {messages.length === 0 && (
          <p className="text-center text-sm leading-[1.65]" style={{ color: 'var(--color-text-muted)' }}>
            Each message costs {satsPerMessage.toLocaleString()} sats. Pay via Lightning, then the
            assistant streams a reply.
          </p>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
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

      {(error || gateError) && (
        <p className="text-xs" style={{ color: 'var(--color-error, #ef4444)' }} role="alert">
          {gateError ?? error?.message ?? 'Something went wrong'}
        </p>
      )}

      <div className="space-y-3">
        <label htmlFor="gated-chat-input" className="sr-only">
          Message
        </label>
        <textarea
          id="gated-chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask anything…"
          rows={3}
          disabled={isStreaming || pendingText !== null}
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
              if (canSend) handlePrepareSend();
            }
          }}
        />

        {pendingText !== null ? (
          <div className="space-y-2">
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Pay to send: &ldquo;{pendingText.slice(0, 80)}
              {pendingText.length > 80 ? '…' : ''}&rdquo;
            </p>
            <PaymentGate
              amountSats={satsPerMessage}
              memo={`AI chat message`}
              disabled={isStreaming}
              onPaymentConfirmed={handlePaymentConfirmed}
              onError={setGateError}
            />
            <button
              type="button"
              onClick={handleCancelPending}
              className="w-full text-xs font-semibold transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Edit message
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handlePrepareSend}
            disabled={!canSend}
            className="inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: 'var(--color-surface-2)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Continue to payment
          </button>
        )}
      </div>
    </div>
  );
}
