import * as React from 'react';
import { cn } from '@/lib/utils';

function formatSats(sats: number): string {
  if (sats >= 100_000) return `${(sats / 100_000_000).toFixed(6)} BTC`;
  return `${sats.toLocaleString()} sats`;
}

interface SatsAmountProps {
  sats: number;
  className?: string;
}

export function SatsAmount({ sats, className }: SatsAmountProps) {
  return (
    <span
      className={cn('font-mono tabular-nums text-[var(--color-text)]', className)}
    >
      {formatSats(sats)}
    </span>
  );
}
