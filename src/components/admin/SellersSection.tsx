import React, { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Search, Store, X } from 'lucide-react';
import { subscribeSellers, setSellerStatus, type AdminSeller } from '../../lib/adminData';

const STATUS_CLASS: Record<string, string> = {
  active: 'is-live',
  pending: 'is-pending',
  suspended: 'is-off',
  rejected: 'is-off',
};

const SellersSection: React.FC = () => {
  const [sellers, setSellers] = useState<AdminSeller[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => subscribeSellers(setSellers), []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sellers;
    return sellers.filter(s =>
      (s.displayName ?? '').toLowerCase().includes(term) ||
      (s.phone ?? '').includes(term) ||
      (s.tscNumber ?? '').includes(term)
    );
  }, [sellers, search]);

  const pendingCount = sellers.filter(s => s.status === 'pending').length;

  const approve = (s: AdminSeller) => setSellerStatus(s.id, 'active').catch(() => {});
  const reject = (s: AdminSeller) => {
    if (window.confirm(`Reject ${s.displayName ?? 'this seller'}? They will not be able to sell.`)) {
      setSellerStatus(s.id, 'rejected').catch(() => {});
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel-header admin-header-actions">
        <div>
          <h2>Sellers</h2>
          <p>Review teacher registrations. {pendingCount} pending TSC verification.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={18} />
          <input placeholder="Search name, phone or TSC number" value={search} onChange={e => setSearch(e.target.value)} />
        </label>
      </div>

      <div className="admin-leaderboard-list">
        {filtered.length === 0 && <p style={{ color: 'var(--muted)', padding: '1rem' }}>No sellers yet.</p>}
        {filtered.map(s => (
          <article className="admin-leaderboard-card" key={s.id}>
            <div className="admin-player-rank"><Store size={18} /></div>
            <div className="admin-player-main">
              <h3>{s.displayName ?? 'Unnamed'} <span style={{ color: 'var(--muted)', fontWeight: 500, textTransform: 'capitalize' }}>· {s.type ?? '—'}</span></h3>
              <p>{[s.phone, s.tscNumber ? `TSC ${s.tscNumber}` : null].filter(Boolean).join(' · ') || '—'}</p>
            </div>
            <span className={`admin-status ${STATUS_CLASS[s.status ?? ''] ?? 'is-off'}`}>{s.status ?? 'unknown'}</span>
            <div className="admin-row-actions">
              {s.status === 'pending' ? (
                <>
                  <button type="button" aria-label="Approve" title="Approve seller" onClick={() => approve(s)}>
                    <BadgeCheck size={17} />
                  </button>
                  <button type="button" aria-label="Reject" title="Reject seller" onClick={() => reject(s)}>
                    <X size={17} />
                  </button>
                </>
              ) : s.status === 'active' ? (
                <button type="button" aria-label="Suspend" title="Reject / suspend" onClick={() => reject(s)}>
                  <X size={17} />
                </button>
              ) : (
                <button type="button" aria-label="Approve" title="Approve seller" onClick={() => approve(s)}>
                  <BadgeCheck size={17} />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SellersSection;
