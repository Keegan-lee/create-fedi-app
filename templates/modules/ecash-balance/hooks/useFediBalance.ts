'use client';

import { useEffect, useState } from 'react';
import type { FediInternal } from '../lib/fedi-types';

type TMiniApp = { url: string };

export type TFediBalanceState =
  | { status: 'loading' }
  | { status: 'unavailable' }
  | {
      status: 'ready';
      version: 0 | 1 | 2;
      miniApps: TMiniApp[] | null;
      miniAppsError: boolean;
    };

/**
 * Reads `window.fediInternal` and, on v2, loads installed mini apps.
 */
export function useFediBalance(): TFediBalanceState {
  const [state, setState] = useState<TFediBalanceState>({ status: 'loading' });

  useEffect(() => {
    const fedi = window.fediInternal;
    if (!fedi) {
      setState({ status: 'unavailable' });
      return;
    }

    if (fedi.version < 2) {
      setState({
        status: 'ready',
        version: fedi.version,
        miniApps: null,
        miniAppsError: false,
      });
      return;
    }

    const v2 = fedi as Extract<FediInternal, { version: 2 }>;
    let cancelled = false;

    async function loadMiniApps() {
      try {
        const miniApps = await v2.getInstalledMiniApps();
        if (!cancelled) {
          setState({ status: 'ready', version: 2, miniApps, miniAppsError: false });
        }
      } catch {
        if (!cancelled) {
          setState({ status: 'ready', version: 2, miniApps: null, miniAppsError: true });
        }
      }
    }

    loadMiniApps();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
