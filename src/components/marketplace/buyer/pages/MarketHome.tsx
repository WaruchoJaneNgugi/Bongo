import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Wallet, Store } from 'lucide-react';
import { categories, popularSubjects, stats, wallet, library, orders } from '../../../../lib/marketplace/mockBuyer';
import { useMarketStore } from '../../../../store/useMarketStore';
import { usePublishedResources } from '../usePublishedResources';
import ResourceCard from '../components/ResourceCard';
import SectionHeader from '../components/SectionHeader';
import { ui } from '../ui';

type Tab = 'Popular' | 'Latest' | 'Top Rated';

export default function MarketHome() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('Popular');
  const wishlistCount = useMarketStore(s => s.wishlist.length);

  const { resources: all, loading, error, reload } = usePublishedResources();

  const shown = (() => {
    const arr = [...(all ?? [])];
    if (tab === 'Popular') arr.sort((a, b) => b.views - a.views);
    else if (tab === 'Top Rated') arr.sort((a, b) => b.sales - a.sales);
    // 'Latest' keeps the createdAt-desc order from the query.
    return arr.slice(0, 8);
  })();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-8 min-w-0">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-[#f0fdf4] to-white border border-[#eceff3] shadow-card p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a]">Learn. Teach. Earn.</h1>
          <p className={`mt-1 ${ui.muted}`}>The leading education marketplace in Kenya.</p>
          <div className="mt-5 flex gap-2 max-w-xl">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input placeholder="What are you looking for today?"
                className={`w-full ${ui.input} pl-10 pr-4 py-3 text-sm`} />
            </div>
            <button onClick={() => navigate('/market/browse')}
              className={`${ui.btnPrimary} rounded-xl px-5 text-sm`}>Search</button>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map(s => (
              <div key={s.label} className="bg-white border border-[#eceff3] rounded-xl px-3 py-2">
                <div className="font-extrabold text-[#16a34a]">{s.value}</div>
                <div className={`text-[12px] ${ui.muted}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <section>
          <SectionHeader title="Browse by Category" onViewAll={() => navigate('/market/browse')} />
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x no-scrollbar">
            {categories.map(c => (
              <button key={c.key} onClick={() => navigate('/market/browse')}
                className={`text-left ${ui.cardInteractive} p-4 shrink-0 w-44 snap-start`}>
                <div className="font-bold text-sm text-[#0f172a]">{c.label}</div>
                <div className={`text-xs mt-0.5 ${ui.muted}`}>{c.sub}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Top resources */}
        <section>
          <SectionHeader title="Top Resources" right={
            <div className="flex gap-1 bg-[#f1f5f9] rounded-full p-1">
              {(['Popular', 'Latest', 'Top Rated'] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`text-xs font-bold rounded-full px-3 py-1 transition-all ${tab === t ? 'bg-white text-[#15803d] shadow-card' : 'text-[#64748b]'}`}>{t}</button>
              ))}
            </div>
          } />
          {loading ? (
            <div className={`${ui.muted} py-10 text-center`}>Loading resources…</div>
          ) : error ? (
            <div className="py-10 text-center space-y-2">
              <p className={ui.muted}>Couldn’t load resources right now.</p>
              <button onClick={reload} className={`${ui.btnGhost} px-4 py-2 text-sm`}>Try again</button>
            </div>
          ) : shown.length === 0 ? (
            <div className={`${ui.muted} py-10 text-center`}>No resources have been published yet.</div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-4">
              {shown.map(r => <ResourceCard key={r.id} resource={r} />)}
            </div>
          )}
        </section>

        {/* Popular subjects */}
        <section>
          <SectionHeader title="Popular Subjects" onViewAll={() => navigate('/market/browse')} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularSubjects.map(s => (
              <div key={s.subject} className={`${ui.card} p-4`}>
                <div className="font-bold text-sm text-[#0f172a]">{s.subject}</div>
                <div className={`text-xs mt-0.5 ${ui.muted}`}>{s.count}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right rail */}
      <aside className="space-y-4">
        <div className={`${ui.card} p-4`}>
          <div className="flex items-center gap-2 font-bold text-[#0f172a]"><BookOpen size={18} className="text-[#16a34a]" /> My Learning</div>
          <ul className={`mt-3 space-y-2 text-sm ${ui.muted}`}>
            <li className="flex justify-between"><span>My Library</span><span className={ui.faint}>{library.length} items</span></li>
            <li className="flex justify-between"><span>Wishlist</span><span className={ui.faint}>{wishlistCount} items</span></li>
            <li className="flex justify-between"><span>Recent Orders</span><span className={ui.faint}>{orders.length} orders</span></li>
          </ul>
        </div>

        <div className={`${ui.card} p-4`}>
          <div className={`flex items-center gap-2 text-sm ${ui.muted}`}><Wallet size={16} /> Wallet Balance</div>
          <div className="text-2xl font-extrabold text-[#0f172a] mt-1">KSh {wallet.balanceKsh.toLocaleString()}</div>
          <button onClick={() => navigate('/market/payments')}
            className={`mt-3 w-full ${ui.btnPrimary} px-4 py-2 text-sm`}>Top up Wallet</button>
        </div>

        <div className={`${ui.card} p-4`}>
          <Store size={20} className="text-[#16a34a]" />
          <div className="font-bold mt-2 text-[#0f172a]">Become a Seller</div>
          <p className={`text-[12px] mt-1 ${ui.muted}`}>Turn your knowledge into income. Set your price, reach students.</p>
          <button onClick={() => navigate('/seller')}
            className={`mt-3 w-full ${ui.btnPrimary} px-4 py-2 text-sm`}>Start Selling</button>
        </div>
      </aside>
    </div>
  );
}
