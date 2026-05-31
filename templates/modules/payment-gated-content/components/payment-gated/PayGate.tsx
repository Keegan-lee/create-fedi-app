'use client';

import { useCallback, useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PayButton } from '../webln/PayButton';
import { formatSats } from '../../lib/payment-history';

type TInvoiceResponse = {
  paymentId: string;
  invoice: string;
  amountSats: number;
  memo: string;
  devPreimage?: string;
};

interface IPayGateProps {
  contentId: string;
  priceSats: number;
  memo?: string;
  preview: React.ReactNode;
  onUnlocked?: () => void;
}

type TGateStep = 'loading' | 'ready' | 'verifying' | 'error';

/**
 * Paywall UI: blurred preview, server invoice QR, WebLN pay button, and refresh link.
 */
export function PayGate({
  contentId,
  priceSats,
  memo,
  preview,
  onUnlocked,
}: IPayGateProps) {
  const [step, setStep] = useState<TGateStep>('loading');
  const [invoiceData, setInvoiceData] = useState<TInvoiceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const verifyPayment = useCallback(
    async (paymentId: string, preimage: string) => {
      setStep('verifying');
      setError(null);

      const res = await fetch('/api/payment-gate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, preimage, contentId }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Verification failed');
        setStep('error');
        return false;
      }

      onUnlocked?.();
      window.location.reload();
      return true;
    },
    [contentId, onUnlocked],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadInvoice() {
      setStep('loading');
      setError(null);

      const res = await fetch('/api/payment-gate/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          amountSats: priceSats,
          memo: memo ?? `Unlock content (${contentId})`,
        }),
      });

      if (cancelled) return;

      if (!res.ok) {
        setError('Could not create invoice');
        setStep('error');
        return;
      }

      const data = (await res.json()) as TInvoiceResponse;
      setInvoiceData(data);
      setStep('ready');
    }

    void loadInvoice();
    return () => {
      cancelled = true;
    };
  }, [contentId, priceSats, memo]);

  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'development' ||
      !invoiceData?.devPreimage ||
      step !== 'ready'
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      void verifyPayment(invoiceData.paymentId, invoiceData.devPreimage!);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [invoiceData, step, verifyPayment]);

  async function handleCopy() {
    if (!invoiceData?.invoice) return;
    await navigator.clipboard.writeText(invoiceData.invoice);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleRefresh() {
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl" style={{ borderRadius: 'var(--radius-lg)' }}>
        <div
          className="pointer-events-none select-none blur-sm opacity-60"
          aria-hidden
        >
          {preview}
        </div>
        <div
          className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent px-4 pb-4 pt-16"
          aria-hidden
        />
      </div>

      <div
        className="rounded-xl p-4 space-y-4"
        style={{
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div className="space-y-1">
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Unlock full article
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Pay {formatSats(priceSats)} once to read the complete content. Your browser stores
            proof of payment in a secure cookie.
          </p>
        </div>

        {step === 'loading' && (
          <p
            className="text-xs font-mono"
            style={{ color: 'var(--color-text-subtle)' }}
            aria-live="polite"
          >
            Generating invoice…
          </p>
        )}

        {step === 'verifying' && (
          <p
            className="text-xs font-mono"
            style={{ color: 'var(--color-text-subtle)' }}
            aria-live="polite"
          >
            Verifying payment…
          </p>
        )}

        {invoiceData && step !== 'loading' && (
          <div
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{
              background: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-lg)',
            }}
            aria-label={`Invoice for ${formatSats(priceSats)}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                {formatSats(invoiceData.amountSats)}
              </span>
              {invoiceData.memo && (
                <span
                  className="text-xs truncate max-w-[50%]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {invoiceData.memo}
                </span>
              )}
            </div>

            <div
              className="mx-auto flex w-full max-w-[160px] items-center justify-center rounded-lg p-3"
              style={{ background: 'var(--color-surface-1)' }}
              aria-label="Invoice QR code"
            >
              <QRCodeSVG
                value={invoiceData.invoice}
                size={136}
                level="M"
                bgColor="transparent"
                fgColor="var(--color-text)"
              />
            </div>

            <p className="text-center text-xs" style={{ color: 'var(--color-text-subtle)' }}>
              {process.env.NODE_ENV === 'development'
                ? 'Simulated payment in 5 seconds (dev only)'
                : 'Scan with a Lightning wallet or pay below'}
            </p>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full rounded-lg px-4 py-2 text-sm font-medium transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80 active:opacity-70"
              style={{
                background: 'var(--color-surface-1)',
                color: 'var(--color-text)',
                borderRadius: 'var(--radius-md)',
              }}
              aria-label={copied ? 'Invoice copied to clipboard' : 'Copy invoice to clipboard'}
            >
              {copied ? 'Copied!' : 'Copy invoice'}
            </button>

            <PayButton
              invoice={invoiceData.invoice}
              amountSats={invoiceData.amountSats}
              memo={invoiceData.memo}
              onSuccess={(preimage) => {
                void verifyPayment(invoiceData.paymentId, preimage);
              }}
            />
          </div>
        )}

        {error && (
          <p className="text-xs" style={{ color: 'var(--color-error, #ef4444)' }} role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleRefresh}
          className="text-xs font-semibold transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}
        >
          Already paid? Refresh
        </button>
      </div>
    </div>
  );
}
