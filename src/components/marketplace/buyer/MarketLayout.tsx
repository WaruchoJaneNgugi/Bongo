import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Home, Store, Library, MessageSquare, Heart, ShoppingBag,
  CreditCard, Wallet, Search, Bell, ShoppingCart, Menu, X, ArrowLeft, Store as SellerIcon,
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useMarketStore } from '../../../store/useMarketStore';
import MarketAuthGate from './MarketAuthGate';
import { ui } from './ui';

const NAV = [
  { label: 'Home', icon: Home, to: '/market', end: true },
  { label: 'Marketplace', icon: Store, to: '/market/browse' },
  { label: 'My Library', icon: Library, to: '/market/library' },
  { label: 'Messages', icon: MessageSquare, to: '/market/messages', badge: 2 },
  { label: 'Wishlist', icon: Heart, to: '/market/wishlist' },
  { label: 'Orders', icon: ShoppingBag, to: '/market/orders' },
  { label: 'Subscriptions', icon: CreditCard, to: '/market/subscriptions' },
  { label: 'Payments', icon: Wallet, to: '/market/payments' },
];

export default function MarketLayout() {
  const { user, isLoggedIn, authReady } = useStore();
  const { cart, wishlist } = useMarketStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const profile = user?.profiles.find(p => p.id === user.activeProfileId) ?? user?.profiles[0];
  const itemBase = 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors';

  // The Market tab is reachable while logged out, but the marketplace needs an
  // account — prompt Log In / Sign Up instead of rendering the shell.
  if (!authReady) return null;
  if (!isLoggedIn) return <MarketAuthGate />;

  const sidebar = (
    <>
      <button
        onClick={() => { navigate('/home'); setOpen(false); }}
        title="Back to HighScores"
        className={`flex items-center gap-2 px-5 h-16 border-b ${ui.hairline} w-full hover:bg-[#f8fafc] transition-colors`}
      >
        <GraduationCap className="text-[#16a34a]" size={26} />
        <span className="font-extrabold text-lg tracking-tight">
          <span className="text-[#16a34a]">High</span><span className="text-[#0f172a]">Scores</span>
        </span>
      </button>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map(({ label, icon: Icon, to, end, badge }) => (
          <NavLink key={label} to={to} end={end} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${itemBase} ${isActive ? 'bg-[#f0fdf4] text-[#15803d] font-semibold' : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]'}`
            }>
            <Icon size={18} /> <span>{label}</span>
            {label === 'Wishlist' && wishlist.length > 0 && (
              <span className="ml-auto text-[11px] font-bold text-[#15803d] bg-[#dcfce7] rounded-full px-2 py-0.5">{wishlist.length}</span>
            )}
            {badge && <span className="ml-auto text-[11px] font-bold text-white bg-[#16a34a] rounded-full w-5 h-5 grid place-items-center">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <div className={`${ui.card} p-4`}>
          <SellerIcon size={22} className="text-[#16a34a]" />
          <div className="font-bold mt-2 leading-tight text-[#0f172a]">Sell on HighScores</div>
          <p className={`text-[12px] mt-1 ${ui.muted}`}>Earn money by sharing your knowledge.</p>
          <button onClick={() => navigate('/seller')}
            className={`mt-3 w-full ${ui.btnPrimary} px-4 py-2 text-sm`}>
            Become a Seller
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className={`min-h-screen ${ui.page} flex`}>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex w-64 shrink-0 flex-col bg-white border-r ${ui.hairline} h-screen sticky top-0`}>
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 flex flex-col lg:hidden">{sidebar}</aside>
        </>
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className={`sticky top-0 z-10 bg-white/90 backdrop-blur border-b ${ui.hairline} h-16 flex items-center gap-3 px-4 md:px-6`}>
          <button className="lg:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-[#f1f5f9]" onClick={() => setOpen(v => !v)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button
            onClick={() => navigate('/home')}
            aria-label="Exit marketplace"
            title="Back to HighScores"
            className={`${ui.btnGhost} px-3 py-2 text-sm`}
          >
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Exit</span>
          </button>
          <div className="flex-1 max-w-xl relative hidden sm:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input placeholder="Search notes, exams, tutors, schools…"
              className={`w-full ${ui.input} pl-10 pr-4 py-2.5 text-sm`} />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-[#f1f5f9]" aria-label="Cart">
              <ShoppingCart size={19} className="text-[#64748b]" />
              {cart.length > 0 && <span className="absolute top-1 right-1 text-[10px] font-bold text-white bg-[#16a34a] rounded-full w-4 h-4 grid place-items-center">{cart.length}</span>}
            </button>
            <button className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-[#f1f5f9]" aria-label="Notifications">
              <Bell size={19} className="text-[#64748b]" />
              <span className="absolute top-1.5 right-1.5 text-[10px] font-bold text-white bg-[#16a34a] rounded-full w-4 h-4 grid place-items-center">3</span>
            </button>
            <div className="flex items-center gap-2 pl-1">
              <span className="w-9 h-9 rounded-full bg-[#16a34a] text-white grid place-items-center text-sm font-bold">
                {profile?.username?.charAt(0).toUpperCase() ?? 'S'}
              </span>
              <span className="hidden md:block text-left leading-tight">
                <span className="block text-sm font-bold text-[#0f172a]">{profile?.username ?? 'Student'}</span>
                <span className={`block text-[11px] ${ui.faint}`}>Grade {profile?.grade ?? '—'}</span>
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
