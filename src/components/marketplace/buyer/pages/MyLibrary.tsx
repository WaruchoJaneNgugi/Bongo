import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { ui } from '../ui';
import { accentFor } from '../presentation';
import { subscribePurchases } from '../../../../lib/marketplace/orders';
import { getPublishedResource } from '../../../../lib/marketplace/catalog';
import { fmtDate } from '../../../../lib/marketplace/format';
import { useStore } from '../../../../store/useStore';
import type { MarketResource, Purchase } from '../../../../lib/marketplace/types';

export default function MyLibrary() {
  const accountId = useStore(s => s.accountId);
  const [owned, setOwned] = useState<Purchase[]>([]);
  // Resolved resources (for the download URL) keyed by resourceId.
  const [resources, setResources] = useState<Record<string, MarketResource | null>>({});

  useEffect(() => {
    if (!accountId) return;
    return subscribePurchases(accountId, rows => setOwned(rows.filter(p => p.status === 'paid')));
  }, [accountId]);

  useEffect(() => {
    let cancelled = false;
    const missing = owned.map(p => p.resourceId).filter(id => !(id in resources));
    if (missing.length === 0) return;
    Promise.all(missing.map(id => getPublishedResource(id).then(r => [id, r] as const))).then(pairs => {
      if (cancelled) return;
      setResources(prev => ({ ...prev, ...Object.fromEntries(pairs) }));
    });
    return () => { cancelled = true; };
  }, [owned, resources]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`${ui.h1} text-xl`}>My Library</h1>
        <p className={`mt-1 text-sm ${ui.muted}`}>Resources you have purchased.</p>
      </div>

      {owned.length === 0 ? (
        <p className={`text-center py-16 ${ui.muted}`}>
          Your library is empty — browse the marketplace to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {owned.map(p => {
            const res = resources[p.resourceId];
            const file = res?.files?.[0];
            return (
              <div key={p.id} className={`${ui.card} overflow-hidden flex flex-col`}>
                <div className={`h-24 bg-gradient-to-br ${accentFor(res?.subject ?? p.title)} grid place-items-center`}>
                  <span className="text-white text-xs font-bold uppercase tracking-wide">{res?.subject ?? 'Resource'}</span>
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <h3 className="font-semibold text-[#0f172a] text-sm leading-snug line-clamp-2">{p.title}</h3>
                  <p className={`text-xs ${ui.muted}`}>Purchased {fmtDate(p.paidAt ?? p.createdAt)}</p>
                  <div className="mt-auto">
                    {file ? (
                      <a href={file.url} target="_blank" rel="noreferrer" download
                        className={`${ui.btnPrimary} px-4 py-2 text-sm w-full justify-center`}>
                        <Download size={15} /> Download
                      </a>
                    ) : (
                      <span className={`text-xs ${ui.muted}`}>
                        {p.resourceId in resources ? 'No longer available' : 'Loading…'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
