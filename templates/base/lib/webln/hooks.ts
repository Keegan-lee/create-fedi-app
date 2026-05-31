import { useContext, useState } from 'react';
import { WebLNContext } from './provider';
import type { RequestInvoiceArgs } from '../fedi-types';

export function useWebLN() {
  const ctx = useContext(WebLNContext);
  if (ctx === null) {
    throw new Error('useWebLN must be used within a WebLNProvider');
  }
  return {
    provider: ctx.provider,
    isLoading: ctx.isLoading,
    error: ctx.error,
    isConnected: ctx.provider !== null,
  };
}

export function usePayment() {
  const { provider } = useWebLN();
  const [isPaying, setIsPaying] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [paymentError, setPaymentError] = useState<Error | null>(null);
  const [lastPreimage, setLastPreimage] = useState<string | null>(null);
  const [lastInvoice, setLastInvoice] = useState<string | null>(null);

  async function sendPayment(paymentRequest: string) {
    if (!provider) return null;
    setIsPaying(true);
    setPaymentError(null);
    try {
      const result = await provider.sendPayment(paymentRequest);
      setLastPreimage(result.preimage);
      return result;
    } catch (err) {
      setPaymentError(err instanceof Error ? err : new Error('Payment failed'));
      return null;
    } finally {
      setIsPaying(false);
    }
  }

  async function makeInvoice(args: RequestInvoiceArgs | string | number) {
    if (!provider) return null;
    setIsCreatingInvoice(true);
    setPaymentError(null);
    try {
      const result = await provider.makeInvoice(args);
      setLastInvoice(result.paymentRequest);
      return result;
    } catch (err) {
      setPaymentError(err instanceof Error ? err : new Error('Failed to create invoice'));
      return null;
    } finally {
      setIsCreatingInvoice(false);
    }
  }

  return {
    sendPayment,
    makeInvoice,
    isPaying,
    isCreatingInvoice,
    paymentError,
    lastPreimage,
    lastInvoice,
  };
}
