import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Wallet, Banknote, LogOut, Store } from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';

/** Menu items. `soon` items are visible (so the seller sees what's coming) but not yet linked. */
const NAV = [
  { to: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard, soon: false },
  { to: '/seller/listings', label: 'My Listings', icon: FileText, soon: true },
  { to: '/seller/earnings', label: 'Earnings', icon: Wallet, soon: true },
  { to: '/seller/payouts', label: 'Payouts', icon: Banknote, soon: true },
];

export default function SellerLayout() {
  const { seller, logout } = useSellerStore();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/seller');
  }

  return (
    <div className="min-h-screen bg-[#faf9fc] flex flex-col md:flex-row">
      {/* Sidebar (desktop) / top bar (mobile) */}
      <aside className="md:w-64 shrink-0 bg-white border-b md:border-b-0 md:border-r border-[#ece9f2] flex md:flex-col">
        <div className="flex items-center gap-2 px-5 py-4 md:py-6">
          <Store size={20} className="text-[#5b3ea8]" />
          <span className="font-extrabold text-[#241a3d]">Bongo Seller</span>
        </div>

        <nav className="flex md:flex-col gap-1 px-2 md:px-3 overflow-x-auto">
          {NAV.map(({ to, label, icon: Icon, soon }) =>
            soon ? (
              <span key={to}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#a49dbb] cursor-not-allowed whitespace-nowrap"
                title="Coming soon">
                <Icon size={18} /> {label}
                <span className="ml-auto text-[10px] font-bold uppercase bg-[#f4f1fa] text-[#8a7bc0] px-1.5 py-0.5 rounded">Soon</span>
              </span>
            ) : (
              <NavLink key={to} to={to} end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
                    isActive ? 'bg-[#5b3ea8] text-white' : 'text-[#4a4360] hover:bg-[#f4f1fa]'
                  }`
                }>
                <Icon size={18} /> {label}
              </NavLink>
            )
          )}
        </nav>

        {/* Seller identity + sign out (desktop: pinned bottom) */}
        <div className="mt-auto hidden md:block px-3 pb-5">
          <div className="border-t border-[#ece9f2] pt-4">
            <div className="text-sm font-bold text-[#241a3d] truncate">{seller?.displayName ?? 'Seller'}</div>
            <div className="text-xs text-[#8a83a0] capitalize">{seller?.type ?? ''}</div>
            <button onClick={handleLogout}
              className="mt-3 flex items-center gap-2 text-sm text-[#5b3ea8] hover:underline">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>

        {/* Mobile sign out */}
        <button onClick={handleLogout}
          className="md:hidden ml-auto mr-3 flex items-center gap-1 text-sm text-[#5b3ea8]">
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      {/* Page content */}
      <main className="flex-1 p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
