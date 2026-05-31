import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { NostrProvider as NostrProviderInterface } from '../fedi-types';

interface NostrContextValue {
  provider: NostrProviderInterface | null;
  pubkey: string | null;
  isLoading: boolean;
  error: Error | null;
}

export const NostrContext = createContext<NostrContextValue | null>(null);

interface NostrProviderProps {
  children: ReactNode;
  mockProvider?: NostrProviderInterface;
}

export function NostrProvider({ children, mockProvider }: NostrProviderProps) {
  const [provider, setProvider] = useState<NostrProviderInterface | null>(null);
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      let activeProvider: NostrProviderInterface | null = null;

      if (typeof window !== 'undefined' && window.nostr) {
        activeProvider = window.nostr;
      } else if (mockProvider !== undefined && process.env.NODE_ENV === 'development') {
        activeProvider = mockProvider;
      }

      if (activeProvider) {
        try {
          const pk = await activeProvider.getPublicKey();
          if (!cancelled) {
            setProvider(activeProvider);
            setPubkey(pk);
          }
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err : new Error('Failed to connect Nostr'));
          }
        }
      }

      if (!cancelled) setIsLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [mockProvider]);

  return (
    <NostrContext.Provider value={{ provider, pubkey, isLoading, error }}>
      {children}
    </NostrContext.Provider>
  );
}
