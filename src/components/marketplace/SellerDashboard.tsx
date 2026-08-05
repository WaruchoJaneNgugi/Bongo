import {
  UploadCloud, FileText, Star, Heart, Check, TrendingUp, Wallet, ShoppingCart,
  Sparkles, Lightbulb, Users, ChevronRight, Banknote, LayoutGrid,
} from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import {
  dashboardStats as S, recentSales, topResources, earningsTrend,
  teacherLevel, teachingTips,
} from '../../lib/marketplace/mockDashboard';

/* Small presentational helpers ------------------------------------------------ */

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13}
          className={i < Math.round(rating) ? 'fill-[#f2b01e] text-[#f2b01e]' : 'text-[#d8ddd8]'} />
      ))}
    </span>
  );
}

function StatCard({ icon, label, value, delta, deltaLabel }: {
  icon: React.ReactNode; label: string; value: string; delta?: string; deltaLabel?: string;
}) {
  return (
    <div className="bg-white border border-[#e8ece8] rounded-2xl p-5">
      <div className="w-11 h-11 rounded-xl bg-[#eaf7ee] grid place-items-center text-[#16a34a] mb-3">{icon}</div>
      <div className="text-[13px] text-[#7a847a]">{label}</div>
      <div className="text-[26px] font-extrabold text-[#1f2937] leading-tight mt-0.5">{value}</div>
      {delta && (
        <div className="text-[12px] mt-1 text-[#16a34a] font-semibold flex items-center gap-1">
          <TrendingUp size={13} /> {delta} <span className="text-[#9aa39a] font-normal">{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}

/* Earnings sparkline ---------------------------------------------------------- */

function EarningsChart() {
  const w = 300, h = 90, pad = 6;
  const max = Math.max(...earningsTrend), min = Math.min(...earningsTrend);
  const pts = earningsTrend.map((v, i) => {
    const x = pad + (i / (earningsTrend.length - 1)) * (w - 2 * pad);
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - 2 * pad);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
      <defs>
        <linearGradient id="earn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#earn)" />
      <path d={line} fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill="#16a34a" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

/* Reusable rail button -------------------------------------------------------- */

function RailButton({ icon, label, solid }: { icon: React.ReactNode; label: string; solid?: boolean }) {
  return (
    <button className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
      solid ? 'bg-[#16a34a] text-white hover:bg-[#15913f]'
            : 'border border-[#e2e8e2] text-[#374151] hover:bg-[#f3f7f3]'}`}>
      {icon} {label}
    </button>
  );
}

/* Page ------------------------------------------------------------------------ */

export default function SellerDashboard() {
  const seller = useSellerStore(s => s.seller);
  const firstName = seller?.displayName?.split(/\s+/)[0] ?? 'there';

  return (
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
              <button className="flex items-center gap-2 bg-white text-[#15803d] font-bold rounded-xl px-5 py-2.5 text-sm hover:bg-white/90 transition">
                <UploadCloud size={17} /> Upload New Resource
              </button>
              <button className="flex items-center gap-2 border border-white/60 text-white font-bold rounded-xl px-5 py-2.5 text-sm hover:bg-white/10 transition">
                View My Resources
              </button>
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

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Wallet size={20} />} label="Total Earnings"
            value={`KSh ${S.totalEarningsKsh.toLocaleString()}`} delta={`+${S.earningsDeltaPct}%`} deltaLabel="from last month" />
          <StatCard icon={<ShoppingCart size={20} />} label="Total Sales"
            value={S.totalSales.toLocaleString()} delta={`+${S.salesDeltaPct}%`} deltaLabel="from last month" />
          <StatCard icon={<FileText size={20} />} label="Published Resources"
            value={String(S.publishedResources)} delta={`+${S.newResourcesThisMonth} new`} deltaLabel="this month" />
          <StatCard icon={<Star size={20} />} label="Average Rating"
            value={S.averageRating.toFixed(1)} delta={`(${S.ratingReviews} reviews)`} />
        </div>

        {/* Recent sales */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#eef1ee]">
            <h2 className="font-bold text-[#1f2937]">Recent Sales</h2>
            <button className="text-sm font-semibold text-[#16a34a] hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[12px] text-[#9aa39a]">
                  <th className="font-medium px-5 py-2.5">Resource</th>
                  <th className="font-medium px-3 py-2.5">Buyer</th>
                  <th className="font-medium px-3 py-2.5">Amount</th>
                  <th className="font-medium px-3 py-2.5">Your Earnings</th>
                  <th className="font-medium px-3 py-2.5">Status</th>
                  <th className="font-medium px-5 py-2.5">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map(sale => (
                  <tr key={sale.id} className="border-t border-[#f1f4f1]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#14532d] to-[#22a558] shrink-0" />
                        <div>
                          <div className="font-semibold text-[#1f2937]">{sale.title}</div>
                          <div className="text-[12px] text-[#9aa39a]">{sale.kind}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[#4b5563]">{sale.buyer}</td>
                    <td className="px-3 py-3 font-semibold text-[#1f2937]">KSh {sale.amountKsh}</td>
                    <td className="px-3 py-3 font-bold text-[#16a34a]">KSh {sale.earningsKsh}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#16a34a] bg-[#eaf7ee] rounded-full px-2 py-1">
                        <Check size={12} /> {sale.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#9aa39a] whitespace-nowrap">{sale.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top resources */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#1f2937]">My Top Resources</h2>
            <button className="text-sm font-semibold text-[#16a34a] hover:underline">View all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topResources.map(r => (
              <div key={r.id} className="bg-white border border-[#e8ece8] rounded-2xl overflow-hidden">
                <div className={`relative h-28 bg-gradient-to-br ${r.accent} grid place-items-center`}>
                  <span className="text-white font-extrabold text-sm tracking-wide text-center px-2">{r.subject}</span>
                  {r.bestSeller && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold uppercase bg-[#f2b01e] text-[#3a2a00] rounded px-2 py-0.5">Best Seller</span>
                  )}
                  <span className="absolute top-2 right-2 flex items-center gap-1 text-[11px] text-white bg-black/25 rounded-full px-2 py-0.5">
                    <Heart size={11} /> {r.views}
                  </span>
                </div>
                <div className="p-3">
                  <div className="font-semibold text-[#1f2937] text-sm leading-tight">{r.title}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Stars rating={r.rating} />
                    <span className="text-[12px] text-[#7a847a]">{r.rating.toFixed(1)} ({r.reviews})</span>
                  </div>
                  <div className="text-[12px] text-[#9aa39a] mt-1">{r.views} views · {r.sales} sales</div>
                  <div className="font-extrabold text-[#1f2937] mt-2">KSh {r.priceKsh}</div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button className="border border-[#e2e8e2] text-[#374151] text-sm font-semibold rounded-lg py-1.5 hover:bg-[#f3f7f3]">Edit</button>
                    <button className="bg-[#16a34a] text-white text-sm font-semibold rounded-lg py-1.5 hover:bg-[#15913f]">View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Right rail ──────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Teacher level */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#1f2937]">Teacher Level</h2>
            <span className="flex items-center gap-1 text-[12px] font-bold text-[#a06a00] bg-[#fff4d6] rounded-full px-2.5 py-1">
              <Star size={12} className="fill-[#f2b01e] text-[#f2b01e]" /> {teacherLevel.name}
            </span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-[#eef1ee] overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#16a34a] to-[#22c55e]"
              style={{ width: `${(teacherLevel.points / teacherLevel.nextPoints) * 100}%` }} />
          </div>
          <div className="text-right text-[12px] text-[#9aa39a] mt-1">
            {teacherLevel.points} / {teacherLevel.nextPoints.toLocaleString()} points
          </div>
          <ul className="mt-3 space-y-2">
            {teacherLevel.perks.map(p => (
              <li key={p} className="flex items-center gap-2 text-[13px] text-[#4b5563]">
                <Check size={15} className="text-[#16a34a]" /> {p}
              </li>
            ))}
          </ul>
          <button className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#16a34a] hover:underline">
            How levels work <ChevronRight size={15} />
          </button>
        </section>

        {/* Quick actions */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5">
          <h2 className="font-bold text-[#1f2937] mb-3">Quick Actions</h2>
          <div className="space-y-2.5">
            <RailButton solid icon={<UploadCloud size={16} />} label="Upload New Resource" />
            <RailButton icon={<Sparkles size={16} />} label="Create with AI" />
            <RailButton icon={<LayoutGrid size={16} />} label="Manage Resources" />
            <RailButton icon={<Banknote size={16} />} label="Withdraw Earnings" />
          </div>
        </section>

        {/* Teaching tips */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5">
          <h2 className="font-bold text-[#1f2937] flex items-center gap-2"><Lightbulb size={18} className="text-[#f2b01e]" /> Teaching Tips</h2>
          <p className="text-[13px] font-semibold text-[#4b5563] mt-3">Use our AI Assistant to:</p>
          <ul className="mt-2 space-y-2">
            {teachingTips.map(t => (
              <li key={t} className="flex items-center gap-2 text-[13px] text-[#4b5563]">
                <Check size={15} className="text-[#16a34a]" /> {t}
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full bg-[#eaf7ee] text-[#16a34a] font-bold rounded-xl py-2.5 text-sm hover:bg-[#e0f2e6] transition">
            Try AI Assistant
          </button>
        </section>

        {/* Earnings trend */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#1f2937]">Earnings Trend</h2>
            <span className="text-[12px] text-[#7a847a] border border-[#e5e7eb] rounded-lg px-2 py-1">Last 30 Days</span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-extrabold text-[#1f2937]">KSh {S.totalEarningsKsh.toLocaleString()}</span>
            <span className="text-[12px] font-semibold text-[#16a34a] flex items-center gap-0.5"><TrendingUp size={13} /> +{S.earningsDeltaPct}%</span>
          </div>
          <EarningsChart />
          <div className="flex justify-between text-[11px] text-[#9aa39a] mt-1">
            <span>Aug 1</span><span>Aug 8</span><span>Aug 15</span><span>Aug 22</span><span>Aug 30</span>
          </div>
        </section>
      </div>
    </div>
  );
}
