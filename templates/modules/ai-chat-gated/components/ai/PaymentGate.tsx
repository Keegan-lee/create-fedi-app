'use client';

import { useCallback, useState } from 'react';
import { PayButton } from '../webln/PayButton';
import { formatSats } from '../../lib/payment-history';

export type TChatPaymentProof = {
  paymentId: string;
  preimage: string;
};

type TInvoiceResponse = {
  paymentId: string;
  invoice: string;
  amountSats: number;
  memo: string;
};

interface IPaymentGateProps {
  amountSats: number;
  disabled?: boolean;
  memo?: string;
  onPaymentConfirmed: (proof: TChatPaymentProof) => void;
  onError?: (message: string) => void;
}

type TGateStep = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Pay-to-send gate: fetches a server invoice, then wraps WebLN payment around submission.
 */
export function PaymentGate({
  amountSats,
  disabled = false,
  memo,
  onPaymentConfirmed,
  onError,
}: IPaymentGateProps) {
  const [step, setStep] = useState<TGateStep>('idle');
  const [invoiceData, setInvoiceData] = useState<TInvoiceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep('idle');
    setInvoiceData(null);
    setError(null);
  }, []);

  const requestInvoice = useCallback(async () => {
    setStep('loading');
    setError(null);

    const res = await fetch('/api/chat/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memo: memo ?? `AI chat (${formatSats(amountSats)})` }),
    });

    if (!res.ok) {
      const message = 'Could not create invoice';
      setError(message);
      setStep('error');
      onError?.(message);
      return null;
    }

    const data = (await res.json()) as TInvoiceResponse;
    setInvoiceData(data);
    setStep('ready');
    return data;
  }, [amountSats, memo, onError]);

  async function handlePrepare() {
    if (disabled || step === 'loading') return;
    await requestInvoice();
  }

  function handlePaid(preimage: string) {
    if (!invoiceData) return;
    onPaymentConfirmed({ paymentId: invoiceData.paymentId, preimage });
    reset();
  }

  if (step === 'idle') {
    return (
      <button
        type="button"
        onClick={handlePrepare}
        disabled={disabled}
        className="inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          background: 'var(--color-accent)',
          color: 'var(--color-primary-foreground)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        Pay {formatSats(amountSats)} to send
      </button>
    );
  }

  if (step === 'loading') {
    return (
      <p
        className="text-center text-xs font-mono"
        style={{ color: 'var(--color-text-subtle)' }}
        aria-live="polite"
      >
        Generating invoice…
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {invoiceData && (
        <PayButton
          invoice={invoiceData.invoice}
          amountSats={invoiceData.amountSats}
          memo={invoiceData.memo}
          onSuccess={handlePaid}
        />
      )}

      {error && (
        <p className="text-xs" style={{ color: 'var(--color-error, #ef4444)' }} role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={reset}
        className="w-full text-xs font-semibold transition-opacity duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] hover:opacity-80"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Cancel
      </button>
    </div>
  );
}
