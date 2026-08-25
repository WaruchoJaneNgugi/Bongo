import { useCallback, useEffect, useState } from 'react';
import { listPublishedResources } from '../../../lib/marketplace/catalog';
import type { MarketResource } from '../../../lib/marketplace/types';

/** Shared loader for the buyer surfaces. Surfaces load errors (instead of
 *  silently showing an empty state) and exposes a retry. */
export function usePublishedResources() {
  const [resources, setResources] = useState<MarketResource[] | null>(null);
  const [error, setError] = useState(false);
  const [nonce, setNonce] = useState(0);

  // Retry: reset to the loading state and re-run the effect (called from a click).
  const reload = useCallback(() => {
    setResources(null);
    setError(false);
    setNonce(n => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    listPublishedResources()
      .then(r => { if (!cancelled) setResources(r); })
      .catch(err => {
        // e.g. a Firestore composite index still building, or a rules/network error.
        console.error('[marketplace] failed to load published resources:', err);
        if (!cancelled) { setError(true); setResources([]); }
      });
    return () => { cancelled = true; };
  }, [nonce]);

  return { resources, loading: resources === null, error, reload };
}
