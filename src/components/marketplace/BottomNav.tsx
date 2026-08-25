import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

export interface BottomNavItem {
  label: string;
  icon: LucideIcon;
  to: string;
  end?: boolean;
  badge?: number;
}

/** Fixed bottom tab bar shown on small screens (hidden on lg+). */
export default function BottomNav({ items }: { items: BottomNavItem[] }) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-[#e8ece8] flex">
      {items.map(({ label, icon: Icon, to, end, badge }) => (
        <NavLink key={label} to={to} end={end}
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-[10px] font-semibold transition-colors ${
              isActive ? 'text-[#16a34a]' : 'text-[#94a3b8] hover:text-[#0f172a]'}`
          }>
          <span className="relative">
            <Icon size={20} />
            {badge ? (
              <span className="absolute -top-1.5 -right-2 text-[9px] font-bold text-white bg-[#16a34a] rounded-full min-w-4 h-4 px-1 grid place-items-center">{badge}</span>
            ) : null}
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
