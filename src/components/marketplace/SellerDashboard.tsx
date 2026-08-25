import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud, FileText, Star, Check, Wallet, ShoppingCart,
  Sparkles, Lightbulb, Users, Banknote, LayoutGrid, TrendingUp, FilePlus,
} from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import { subscribeSellerResources } from '../../lib/marketplace/resources';
import type { MarketResource, SellerStatus } from '../../lib/marketplace/types';

/* Helpers -------------------------------------------------------------------- */

// createdAt is a Firestore Timestamp at runtime (or a plain number in tests).
function tsMillis(ts: unknown): number {
  if (ts && typeof ts === 'object') {
    const o = ts as { toMillis?: () => number; seconds?: number };
    if (typeof o.toMillis === 'function') return o.toMillis();
    if (typeof o.seconds === 'number') return o.seconds * 1000;
  }
  return typeof ts === 'number' ? ts : 0;
}

const STATUS_BADGE: Record<SellerStatus, { label: string; cls: string }> = {
  active:    { label: 'Active',           cls: 'text-[#15803d] bg-[#eaf7ee]' },
  pending:   { label: 'Pending approval', cls: 'text-[#a06a00] bg-[#fff4d6]' },
  rejected:  { label: 'Not approved',     cls: 'text-[#b91c1c] bg-[#fef2f2]' },
  suspended: { label: 'Suspended',        cls: 'text-[#b91c1c] bg-[#fef2f2]' },
};

const TEACHING_TIPS = [
  'Check grammar & formatting',
  'Generate quizzes from your notes',
  'Create summaries',
  'Improve your lesson plans',
];

function StatCard({ icon, label, value, sub }: {
  icon: React.ReactNode; label: string; value: string; sub?: string;
}) {
  return (
    <div className="bg-white border border-[#e8ece8] rounded-2xl p-5">
      <div className="w-11 h-11 rounded-xl bg-[#eaf7ee] grid place-items-center text-[#16a34a] mb-3">{icon}</div>
      <div className="text-[13px] text-[#7a847a]">{label}</div>
      <div className="text-[26px] font-extrabold text-[#1f2937] leading-tight mt-0.5">{value}</div>
      {sub && <div className="text-[12px] mt-1 text-[#9aa39a]">{sub}</div>}
    </div>
  );
}

/* Page ----------------------------------------------------------------------- */

export default function SellerDashboard() {
  const seller = useSellerStore(s => s.seller);
  const sellerId = useSellerStore(s => s.sellerId);
  const firstName = seller?.displayName?.split(/\s+/)[0] ?? 'there';

  const [resources, setResources] = useState<MarketResource[]>([]);
  useEffect(() => {
    if (!sellerId) return;
    return subscribeSellerResources(sellerId, setResources);
  }, [sellerId]);

  const publishedCount = resources.filter(r => r.status === 'published').length;
  const draftCount = resources.filter(r => r.status === 'draft').length;
  const totalSales = resources.reduce((n, r) => n + (r.sales ?? 0), 0);
  const totalEarnings = (seller?.payoutBalancePaid ?? 0) + (seller?.payoutBalancePending ?? 0);
  const topResources = [...resources]
    .sort((a, b) => (b.sales - a.sales) || (b.views - a.views) || tsMillis(b.createdAt) - tsMillis(a.createdAt))
    .slice(0, 4);

  const statusBadge = seller ? STATUS_BADGE[seller.status] : null;

  return (
    <div className="space-y-6">
      {/* Teacher accounts await verification before they can sell. */}
      {seller?.status === 'pending' && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#fef3c7] bg-[#fffbeb] p-4">
          <Check size={18} className="text-[#b45309] mt-0.5 shrink-0" />
          <div>
            <div className="font-bold text-[#92400e]">Account pending approval</div>
            <p className="text-sm text-[#b45309]">
              Thanks for registering! We're verifying your registration details. You can set things up now,
              but selling unlocks once an admin approves your account.
            </p>
          </div>
        </div>
      )}
      {seller?.status === 'rejected' && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#fee2e2] bg-[#fef2f2] p-4">
          <div>
            <div className="font-bold text-[#991b1b]">Account not approved</div>
            <p className="text-sm text-[#b91c1c]">
              We couldn't verify your registration. Please contact support if you think this is a mistake.
            </p>
          </div>
        </div>
      )}

    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_336px] gap-6">
      {/* ── Main column ─────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#15803d] via-[#178a44] to-[#1faf59] text-white p-7 md:p-9">
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute right-24 bottom-0 w-40 h-40 rounded-full bg-white/5" />
          <div className="relative max-w-xl">
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
              Welcome back, {firstName}! <span>👋</span>
            </h1>
            <p className="text-lg font-semibold text-white/90 mt-1">Inspire. Teach. Earn.</p>
            <p className="text-sm text-white/80 mt-2 max-w-md">
              Share your knowledge, reach more students and grow your income on HighScores.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link to="/seller/resources/new"
                className="flex items-center gap-2 bg-white text-[#15803d] font-bold rounded-xl px-5 py-2.5 text-sm hover:bg-white/90 transition">
                <UploadCloud size={17} /> Upload New Resource
              </Link>
              <Link to="/seller/resources"
                className="flex items-center gap-2 border border-white/60 text-white font-bold rounded-xl px-5 py-2.5 text-sm hover:bg-white/10 transition">
                View My Resources
              </Link>
            </div>
          </div>
          <div className="absolute right-7 top-7 hidden md:flex items-center gap-3 bg-white/12 backdrop-blur rounded-2xl px-4 py-3 border border-white/15">
            <Users size={22} className="text-white/90" />
            <div className="leading-tight">
              <div className="font-extrabold">Join 5,000+</div>
              <div className="text-[11px] text-white/75">Teachers earning on HighScores</div>
            </div>
          </div>
        </section>

        {/* Stat cards — real where data exists, honest zeros otherwise */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Wallet size={20} />} label="Total Earnings"
            value={`KSh ${totalEarnings.toLocaleString()}`} sub="Available after your first sale" />
          <StatCard icon={<ShoppingCart size={20} />} label="Total Sales"
            value={totalSales.toLocaleString()} sub="Across all your resources" />
          <StatCard icon={<FileText size={20} />} label="Published Resources"
            value={String(publishedCount)}
            sub={draftCount > 0 ? `${draftCount} draft${draftCount === 1 ? '' : 's'}` : 'All published'} />
          <StatCard icon={<Star size={20} />} label="Average Rating"
            value="—" sub="No reviews yet" />
        </div>

        {/* Recent sales — empty until the orders slice lands */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#eef1ee]">
            <h2 className="font-bold text-[#1f2937]">Recent Sales</h2>
          </div>
          <div className="px-5 py-12 text-center">
            <ShoppingCart size={40} className="mx-auto text-[#cbd5cb]" />
            <p className="mt-3 text-sm text-[#7a847a]">
              No sales yet — your sales will appear here after your first purchase.
            </p>
          </div>
        </section>

        {/* Top resources — real */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#1f2937]">My Top Resources</h2>
            {topResources.length > 0 && (
              <Link to="/seller/resources" className="text-sm font-semibold text-[#16a34a] hover:underline">View all</Link>
            )}
          </div>

          {topResources.length === 0 ? (
            <div className="bg-white border border-[#e8ece8] rounded-2xl px-5 py-12 text-center">
              <FileText size={40} className="mx-auto text-[#cbd5cb]" />
              <p className="mt-3 text-sm text-[#7a847a]">You haven't created any resources yet.</p>
              <Link to="/seller/resources/new"
                className="mt-4 inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-full px-5 py-2.5">
                <FilePlus size={16} /> Create a resource
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topResources.map(r => (
                <div key={r.id} className="bg-white border border-[#e8ece8] rounded-2xl overflow-hidden">
                  <div className="relative h-28 bg-gradient-to-br from-[#14532d] to-[#22a558] grid place-items-center overflow-hidden">
                    {r.thumbnailUrl
                      ? <img src={r.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      : <span className="text-white font-extrabold text-sm tracking-wide text-center px-2 uppercase">{r.subject}</span>}
                    {r.sales > 0 && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold uppercase bg-[#f2b01e] text-[#3a2a00] rounded px-2 py-0.5">Best Seller</span>
                    )}
                    <span className={`absolute top-2 right-2 text-[11px] font-bold rounded-full px-2 py-0.5 ${
                      r.status === 'published' ? 'text-white bg-black/25' : 'text-[#374151] bg-white/85'}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-[#1f2937] text-sm leading-tight line-clamp-2">{r.title}</div>
                    <div className="text-[12px] text-[#9aa39a] mt-1">{r.subject} · {r.grade}</div>
                    <div className="text-[12px] text-[#9aa39a] mt-0.5">{r.views} views · {r.sales} sales</div>
                    <div className="font-extrabold text-[#1f2937] mt-2">{r.priceKsh === 0 ? 'Free' : `KSh ${r.priceKsh}`}</div>
                    <Link to={`/seller/resources/${r.id}/edit`}
                      className="mt-3 block text-center bg-[#16a34a] text-white text-sm font-semibold rounded-lg py-1.5 hover:bg-[#15913f]">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Right rail ──────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Your account — real status + payout balance */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#1f2937]">Your account</h2>
            {statusBadge && (
              <span className={`text-[12px] font-bold rounded-full px-2.5 py-1 ${statusBadge.cls}`}>
                {statusBadge.label}
              </span>
            )}
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-[#7a847a]">Published resources</dt>
              <dd className="font-bold text-[#1f2937]">{publishedCount}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[#7a847a]">Payout balance</dt>
              <dd className="font-bold text-[#1f2937]">KSh {totalEarnings.toLocaleString()}</dd>
            </div>
          </dl>
        </section>

        {/* Quick actions */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5">
          <h2 className="font-bold text-[#1f2937] mb-3">Quick Actions</h2>
          <div className="space-y-2.5">
            <Link to="/seller/resources/new"
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition bg-[#16a34a] text-white hover:bg-[#15913f]">
              <UploadCloud size={16} /> Upload New Resource
            </Link>
            <Link to="/seller/resources"
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition border border-[#e2e8e2] text-[#374151] hover:bg-[#f3f7f3]">
              <LayoutGrid size={16} /> Manage Resources
            </Link>
            <button type="button" disabled title="Coming soon"
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold border border-[#e2e8e2] text-[#9aa39a] cursor-not-allowed">
              <Sparkles size={16} /> Create with AI
            </button>
            <button type="button" disabled title="Available once you have earnings"
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold border border-[#e2e8e2] text-[#9aa39a] cursor-not-allowed">
              <Banknote size={16} /> Withdraw Earnings
            </button>
          </div>
          <p className="mt-2 text-[11px] text-[#9aa39a]">Withdrawals unlock once you have earnings.</p>
        </section>

        {/* Teaching tips — generic guidance */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5">
          <h2 className="font-bold text-[#1f2937] flex items-center gap-2"><Lightbulb size={18} className="text-[#f2b01e]" /> Teaching Tips</h2>
          <p className="text-[13px] font-semibold text-[#4b5563] mt-3">Use our AI Assistant to:</p>
          <ul className="mt-2 space-y-2">
            {TEACHING_TIPS.map(t => (
              <li key={t} className="flex items-center gap-2 text-[13px] text-[#4b5563]">
                <Check size={15} className="text-[#16a34a]" /> {t}
              </li>
            ))}
          </ul>
        </section>

        {/* Earnings trend — empty until the ledger slice lands */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#1f2937]">Earnings Trend</h2>
            <span className="text-[12px] text-[#7a847a] border border-[#e5e7eb] rounded-lg px-2 py-1">Last 30 Days</span>
          </div>
          <div className="text-2xl font-extrabold text-[#1f2937] mt-3">KSh {totalEarnings.toLocaleString()}</div>
          <div className="mt-4 py-6 text-center">
            <TrendingUp size={32} className="mx-auto text-[#cbd5cb]" />
            <p className="mt-2 text-[13px] text-[#7a847a]">No earnings yet — your trend appears after your first sale.</p>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
}
