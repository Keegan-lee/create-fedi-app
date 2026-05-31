'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePayment } from '../../lib/webln';
import { formatSats } from '../../lib/payment-history';

interface IInvoiceCardProps {
  sats: number;
  memo?: string;
  onPaid?: (preimage: string) => void;
  onInvoice?: (invoice: string) => void;
}

function mockPreimage(): string {
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += Math.floor(Math.random() * 16).toString(16);
  }
  return result;
}

export function InvoiceCard({ sats, memo, onPaid, onInvoice }: IInvoiceCardProps) {
  const { makeInvoice, isCreatingInvoice, paymentError, lastInvoice } = usePayment();
  const [copied, setCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paidPreimage, setPaidPreimage] = useState<string | null>(null);

  useEffect(() => {
    makeInvoice({ amount: String(sats), defaultMemo: memo ?? '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sats, memo]);

  useEffect(() => {
    if (lastInvoice) {
      onInvoice?.(lastInvoice);
    }
  }, [lastInvoice, onInvoice]);

  useEffect(() => {
    if (!lastInvoice || isPaid || isCreatingInvoice) return;

    if (process.env.NODE_ENV === 'development') {
      const timer = window.setTimeout(() => {
        const preimage = mockPreimage();
        setPaidPreimage(preimage);
        setIsPaid(true);
        onPaid?.(preimage);
      }, 5000);
      return () => window.clearTimeout(timer);
    }
  }, [lastInvoice, isPaid, isCreatingInvoice, onPaid]);

  async function handleCopy() {
    if (!lastInvoice) return;
    await navigator.clipboard.writeText(lastInvoice);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
      aria-label={`Invoice for ${formatSats(sats)}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          {formatSats(sats)}
        </span>
        {memo && (
          <span className="text-xs truncate max-w-[50%]" style={{ color: 'var(--color-text-muted)' }}>
            {memo}
          </span>
        )}
      </div>

      {isCreatingInvoice && (
        <p
          className="text-xs font-mono"
          style={{ color: 'var(--color-text-subtle)' }}
          aria-live="polite"
        >
          Generating invoice…
        </p>
      )}

      {isPaid && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-100"
          style={{
            background: 'var(--color-accent-dim)',
            borderRadius: 'var(--radius-md)',
          }}
          role="status"
          aria-label={`Invoice paid: ${formatSats(sats)}`}
        >
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
            style={{ background: 'var(--color-accent)', color: 'var(--color-primary-foreground)' }}
            aria-hidden
          >
            ✓
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>
            Paid
          </span>
        </div>
      )}

      {lastInvoice && !isCreatingInvoice && !isPaid && (
        <>
          <div
            className="mx-auto flex w-full max-w-[160px] items-center justify-center rounded-lg p-3"
            style={{ background: 'var(--color-surface-2)' }}
            aria-label="Invoice QR code"
          >
            <QRCodeSVG
              value={lastInvoice}
              size={136}
              level="M"
              bgColor="transparent"
              fgColor="var(--color-text)"
            />
          </div>

          <p className="text-center text-xs" style={{ color: 'var(--color-text-subtle)' }}>
            {process.env.NODE_ENV === 'development'
              ? 'Simulated payment in 5 seconds (dev only)'
              : 'Waiting for payment…'}
          </p>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full rounded-lg px-4 py-2 text-sm font-medium transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80 active:opacity-70"
            style={{
              background: 'var(--color-surface-2)',
              color: 'var(--color-text)',
              borderRadius: 'var(--radius-md)',
            }}
            aria-label={copied ? 'Invoice copied to clipboard' : 'Copy invoice to clipboard'}
          >
            {copied ? 'Copied!' : 'Copy invoice'}
          </button>
        </>
      )}

      {isPaid && paidPreimage && (
        <p className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {paidPreimage.slice(0, 12)}…{paidPreimage.slice(-8)}
        </p>
      )}

      {paymentError && (
        <p
          className="text-xs"
          style={{ color: 'var(--color-error, #ef4444)' }}
          role="alert"
        >
          {paymentError.message}
        </p>
      )}
    </div>
  );
}
