import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Home, LayoutDashboard, FileText, Store, ShoppingBag, Wallet,
  MessageSquare, BarChart3, CreditCard, FilePlus, Sparkles, HelpCircle,
  Search, UploadCloud, Bell, ChevronDown, Banknote,
} from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';

// Primary nav. Only the Dashboard is wired to a route in Plan 1; the rest are
// visual placeholders that light up as later plans add their pages.
const NAV = [
  { label: 'Home', icon: Home, to: '/', real: true },
  { label: 'Teacher Dashboard', icon: LayoutDashboard, to: '/seller/dashboard', real: true },
  { label: 'My Resources', icon: FileText },
  { label: 'Marketplace', icon: Store },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Earnings', icon: Wallet },
  { label: 'Messages', icon: MessageSquare, badge: 3 },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Subscriptions', icon: CreditCard },
];

const QUICK = [
  { label: 'Create Resource', icon: FilePlus },
  { label: 'AI Assistant', icon: Sparkles },
  { label: 'Help & Support', icon: HelpCircle },
];

function initials(name?: string) {
  if (!name) return 'S';
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
}

export default function SellerLayout() {
  const { seller, logout } = useSellerStore();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/seller');
  }

  const itemBase =
    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors';

  return (
    <div className="min-h-screen bg-[#f6f8f6] text-[#1f2937] flex">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-[#e8ece8] h-screen sticky top-0">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-[#eef1ee]">
          <GraduationCap className="text-[#16a34a]" size={26} />
          <span className="font-extrabold text-lg tracking-tight">
            <span className="text-[#16a34a]">High</span><span className="text-[#1f2937]">Scores</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.map(({ label, icon: Icon, to, real, badge }) =>
            to && real ? (
              <NavLink key={label} to={to} end
                className={({ isActive }) =>
                  `${itemBase} ${isActive
                    ? 'bg-[#16a34a] text-white shadow-sm shadow-green-600/20'
                    : 'text-[#4b5563] hover:bg-[#eef7ef]'}`
                }>
                <Icon size={18} /> {label}
              </NavLink>
            ) : (
              <button key={label} type="button"
                className={`${itemBase} w-full text-[#4b5563] hover:bg-[#eef7ef]`}
                title="Coming soon">
                <Icon size={18} /> <span>{label}</span>
                {badge && (
                  <span className="ml-auto text-[11px] font-bold text-white bg-[#16a34a] rounded-full w-5 h-5 grid place-items-center">
                    {badge}
                  </span>
                )}
              </button>
            )
          )}

          <div className="pt-5 pb-2 px-3 text-[11px] font-bold tracking-wider text-[#9aa39a]">QUICK LINKS</div>
          {QUICK.map(({ label, icon: Icon }) => (
            <button key={label} type="button"
              className={`${itemBase} w-full text-[#4b5563] hover:bg-[#eef7ef]`} title="Coming soon">
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>

        <div className="p-3">
          <div className="rounded-2xl bg-gradient-to-b from-[#15803d] to-[#12673a] text-white p-4">
            <Banknote size={22} className="opacity-90" />
            <div className="font-bold mt-2 leading-tight">Earn more with HighScores</div>
            <p className="text-[12px] text-white/80 mt-1">Share your knowledge and help thousands of students.</p>
            <button className="mt-3 w-full bg-white text-[#15803d] text-sm font-bold rounded-lg py-2 hover:bg-white/90 transition">
              Create Your First Resource
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main column ─────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[#e8ece8] h-16 flex items-center gap-3 px-4 md:px-6">
          <div className="flex-1 max-w-xl relative hidden sm:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa39a]" />
            <input
              placeholder="Search resources, students, schools…"
              className="w-full bg-[#f2f5f2] rounded-full pl-10 pr-14 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#16a34a]/30"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#9aa39a] bg-white border border-[#e5e7eb] rounded px-1.5 py-0.5">Ctrl /</kbd>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-full px-4 py-2.5 transition">
              <UploadCloud size={17} /> <span className="hidden sm:inline">Upload Resource</span>
            </button>
            <button className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-[#eef7ef]">
              <Bell size={19} className="text-[#4b5563]" />
              <span className="absolute top-1.5 right-1.5 text-[10px] font-bold text-white bg-[#16a34a] rounded-full w-4 h-4 grid place-items-center">3</span>
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[#eef7ef]" title="Sign out">
              <span className="w-9 h-9 rounded-full bg-[#16a34a] text-white grid place-items-center text-sm font-bold">
                {initials(seller?.displayName)}
              </span>
              <span className="hidden md:block text-left leading-tight">
                <span className="block text-sm font-bold text-[#1f2937]">{seller?.displayName ?? 'Seller'}</span>
                <span className="block text-[11px] text-[#8a938a] capitalize">{seller?.type ?? 'teacher'}</span>
              </span>
              <ChevronDown size={16} className="text-[#9aa39a] hidden md:block" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
