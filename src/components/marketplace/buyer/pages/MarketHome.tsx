import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Wallet, Store } from 'lucide-react';
import { resources, categories, popularSubjects, stats, wallet } from '../../../../lib/marketplace/mockBuyer';
import ResourceCard from '../components/ResourceCard';
import SectionHeader from '../components/SectionHeader';

type Tab = 'Popular' | 'Latest' | 'Top Rated';

export default function MarketHome() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('Popular');

  const shown = [...resources]
    .filter(r => (tab === 'Latest' ? r.latest : true))
    .sort((a, b) => (tab === 'Top Rated' ? b.rating - a.rating : 0))
    .slice(0, 8);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-8 min-w-0">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-[#14532d] to-[#22a558] text-white p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-extrabold">Learn. Teach. Earn.</h1>
          <p className="text-white/85 mt-1">The leading education marketplace in Kenya.</p>
          <div className="mt-5 flex gap-2 max-w-xl">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa39a]" />
              <input placeholder="What are you looking for today?"
                className="w-full rounded-full pl-10 pr-4 py-3 text-sm text-[#1f2937] outline-none" />
            </div>
            <button onClick={() => navigate('/market/browse')}
              className="bg-[#0f3d21] hover:bg-[#0c3319] rounded-full px-5 text-sm font-bold">Search</button>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl px-3 py-2">
                <div className="font-extrabold">{s.value}</div>
                <div className="text-[12px] text-white/80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <section>
          <SectionHeader title="Browse by Category" onViewAll={() => navigate('/market/browse')} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map(c => (
              <button key={c.key} onClick={() => navigate('/market/browse')}
                className="text-left bg-white rounded-2xl border border-[#e8ece8] p-4 hover:shadow-md transition">
                <div className="font-bold text-sm text-[#1f2937]">{c.label}</div>
                <div className="text-xs text-[#8a938a] mt-0.5">{c.sub}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Top resources */}
        <section>
          <SectionHeader title="Top Resources" right={
            <div className="flex gap-1 bg-[#eef1ee] rounded-full p-1">
              {(['Popular', 'Latest', 'Top Rated'] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`text-xs font-bold rounded-full px-3 py-1 ${tab === t ? 'bg-white text-[#15803d] shadow-sm' : 'text-[#6b7280]'}`}>{t}</button>
              ))}
            </div>
          } />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shown.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        </section>

        {/* Popular subjects */}
        <section>
          <SectionHeader title="Popular Subjects" onViewAll={() => navigate('/market/browse')} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularSubjects.map(s => (
              <div key={s.subject} className="bg-white rounded-2xl border border-[#e8ece8] p-4">
                <div className="font-bold text-sm text-[#1f2937]">{s.subject}</div>
                <div className="text-xs text-[#8a938a] mt-0.5">{s.count}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right rail */}
      <aside className="space-y-4">
        <div className="bg-white rounded-2xl border border-[#e8ece8] p-4">
          <div className="flex items-center gap-2 font-bold text-[#1f2937]"><BookOpen size={18} className="text-[#16a34a]" /> My Learning</div>
          <ul className="mt-3 space-y-2 text-sm text-[#4b5563]">
            <li className="flex justify-between"><span>My Library</span><span className="text-[#8a938a]">2 items</span></li>
            <li className="flex justify-between"><span>Wishlist</span><span className="text-[#8a938a]">2 items</span></li>
            <li className="flex justify-between"><span>Recent Orders</span><span className="text-[#8a938a]">3 orders</span></li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8ece8] p-4">
          <div className="flex items-center gap-2 text-[#8a938a] text-sm"><Wallet size={16} /> Wallet Balance</div>
          <div className="text-2xl font-extrabold text-[#1f2937] mt-1">KSh {wallet.balanceKsh.toLocaleString()}</div>
          <button onClick={() => navigate('/market/payments')}
            className="mt-3 w-full bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-lg py-2">Top up Wallet</button>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-[#15803d] to-[#12673a] text-white p-4">
          <Store size={20} className="opacity-90" />
          <div className="font-bold mt-2">Become a Seller</div>
          <p className="text-[12px] text-white/80 mt-1">Turn your knowledge into income. Set your price, reach students.</p>
          <button onClick={() => navigate('/seller')}
            className="mt-3 w-full bg-white text-[#15803d] text-sm font-bold rounded-lg py-2">Start Selling</button>
        </div>
      </aside>
    </div>
  );
}
