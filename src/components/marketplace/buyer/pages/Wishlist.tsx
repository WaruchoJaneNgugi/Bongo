import { useEffect, useMemo, useState } from 'react';
import { listPublishedResources } from '../../../../lib/marketplace/catalog';
import type { MarketResource } from '../../../../lib/marketplace/types';
import { useMarketStore } from '../../../../store/useMarketStore';
import ResourceCard from '../components/ResourceCard';
import { ui } from '../ui';

export default function Wishlist() {
  const wishlist = useMarketStore(s => s.wishlist);
  const [all, setAll] = useState<MarketResource[] | null>(null);

  useEffect(() => {
    listPublishedResources().then(setAll).catch(() => setAll([]));
  }, []);

  const items = useMemo(
    () => (all ?? []).filter(r => wishlist.includes(r.id)),
    [all, wishlist],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`${ui.h1} text-xl`}>Wishlist</h1>
        <p className={`mt-1 text-sm ${ui.muted}`}>Resources you saved for later.</p>
      </div>

      {all === null ? (
        <p className={`text-center py-16 ${ui.muted}`}>Loading…</p>
      ) : items.length === 0 ? (
        <p className={`text-center py-16 ${ui.muted}`}>
          Nothing saved yet. Tap the heart on any resource to save it.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(r => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}
