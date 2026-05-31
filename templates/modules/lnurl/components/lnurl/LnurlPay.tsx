'use client';

import { useMemo } from 'react';
import { encodeLnurl } from '../../lib/lnurl-utils';
import { LnurlQR } from './LnurlQR';

interface ILnurlPayProps {
  /** Username segment in `/api/lnurlp/[username]`. */
  username: string;
  /** Optional override for the public origin (defaults to `window.location.origin`). */
  baseUrl?: string;
  className?: string;
}

/**
 * Builds an LNURL-pay link for the given username and displays it as a QR code.
 */
export function LnurlPay({ username, baseUrl, className }: ILnurlPayProps) {
  const payUrl = useMemo(() => {
    const origin =
      baseUrl?.replace(/\/$/, '') ??
      (typeof window !== 'undefined' ? window.location.origin : '');
    return `${origin}/api/lnurlp/${encodeURIComponent(username)}`;
  }, [username, baseUrl]);

  const lnurl = useMemo(() => encodeLnurl(payUrl), [payUrl]);

  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <LnurlQR value={lnurl} label={`LNURL-pay QR for @${username}`} />
      <p className="text-center text-xs" style={{ color: 'var(--color-text-subtle)' }}>
        Wallets scan this code, fetch metadata, then request an invoice from your callback.
      </p>
    </div>
  );
}
