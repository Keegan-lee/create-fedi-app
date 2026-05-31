import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { WebLNProvider as WebLNProviderInterface } from '@create-fedi-app/fedi-types';

interface WebLNContextValue {
  provider: WebLNProviderInterface | null;
  isLoading: boolean;
  error: Error | null;
}

export const WebLNContext = createContext<WebLNContextValue | null>(null);

interface WebLNProviderProps {
  children: ReactNode;
  mockProvider?: WebLNProviderInterface;
}

export function WebLNProvider({ children, mockProvider }: WebLNProviderProps) {
  const [provider, setProvider] = useState<WebLNProviderInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (typeof window !== 'undefined' && window.webln) {
        try {
          await window.webln.enable();
          if (!cancelled) setProvider(window.webln);
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err : new Error('Failed to enable WebLN'));
          }
        }
      } else if (mockProvider !== undefined && process.env.NODE_ENV !== 'production') {
        if (!cancelled) setProvider(mockProvider);
      }
      if (!cancelled) setIsLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [mockProvider]);

  return (
    <WebLNContext.Provider value={{ provider, isLoading, error }}>
      {children}
    </WebLNContext.Provider>
  );
}
