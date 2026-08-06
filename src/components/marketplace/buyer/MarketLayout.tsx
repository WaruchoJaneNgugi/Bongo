import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Home, Store, Library, MessageSquare, Heart, ShoppingBag,
  CreditCard, Wallet, Search, Bell, ShoppingCart, Menu, X, Store as SellerIcon,
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useMarketStore } from '../../../store/useMarketStore';

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
  const { user } = useStore();
  const { cart, wishlist } = useMarketStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const profile = user?.profiles.find(p => p.id === user.activeProfileId) ?? user?.profiles[0];
  const itemBase = 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors';

  const sidebar = (
    <>
      <div className="flex items-center gap-2 px-5 h-16 border-b border-[#eef1ee]">
        <GraduationCap className="text-[#16a34a]" size={26} />
        <span className="font-extrabold text-lg tracking-tight">
          <span className="text-[#16a34a]">High</span><span className="text-[#1f2937]">Scores</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map(({ label, icon: Icon, to, end, badge }) => (
          <NavLink key={label} to={to} end={end} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${itemBase} ${isActive ? 'bg-[#16a34a] text-white shadow-sm shadow-green-600/20' : 'text-[#4b5563] hover:bg-[#eef7ef]'}`
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
        <div className="rounded-2xl bg-gradient-to-b from-[#15803d] to-[#12673a] text-white p-4">
          <SellerIcon size={22} className="opacity-90" />
          <div className="font-bold mt-2 leading-tight">Sell on HighScores</div>
          <p className="text-[12px] text-white/80 mt-1">Earn money by sharing your knowledge.</p>
          <button onClick={() => navigate('/seller')}
            className="mt-3 w-full bg-white text-[#15803d] text-sm font-bold rounded-lg py-2 hover:bg-white/90 transition">
            Become a Seller
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f6f8f6] text-[#1f2937] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-[#e8ece8] h-screen sticky top-0">
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
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[#e8ece8] h-16 flex items-center gap-3 px-4 md:px-6">
          <button className="lg:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-[#eef7ef]" onClick={() => setOpen(v => !v)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1 max-w-xl relative hidden sm:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa39a]" />
            <input placeholder="Search notes, exams, tutors, schools…"
              className="w-full bg-[#f2f5f2] rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#16a34a]/30" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-[#eef7ef]" aria-label="Cart">
              <ShoppingCart size={19} className="text-[#4b5563]" />
              {cart.length > 0 && <span className="absolute top-1 right-1 text-[10px] font-bold text-white bg-[#16a34a] rounded-full w-4 h-4 grid place-items-center">{cart.length}</span>}
            </button>
            <button className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-[#eef7ef]" aria-label="Notifications">
              <Bell size={19} className="text-[#4b5563]" />
              <span className="absolute top-1.5 right-1.5 text-[10px] font-bold text-white bg-[#16a34a] rounded-full w-4 h-4 grid place-items-center">3</span>
            </button>
            <div className="flex items-center gap-2 pl-1">
              <span className="w-9 h-9 rounded-full bg-[#16a34a] text-white grid place-items-center text-sm font-bold">
                {profile?.username?.charAt(0).toUpperCase() ?? 'S'}
              </span>
              <span className="hidden md:block text-left leading-tight">
                <span className="block text-sm font-bold text-[#1f2937]">{profile?.username ?? 'Student'}</span>
                <span className="block text-[11px] text-[#8a938a]">Grade {profile?.grade ?? '—'}</span>
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
