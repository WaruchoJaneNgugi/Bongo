import { ui } from '../ui';

interface Props { title: string; onViewAll?: () => void; right?: React.ReactNode; }

export default function SectionHeader({ title, onViewAll, right }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className={`text-lg ${ui.h2}`}>{title}</h2>
      {right ?? (onViewAll && (
        <button onClick={onViewAll} className={`text-sm font-bold ${ui.brand} hover:underline`}>
          View all ›
        </button>
      ))}
    </div>
  );
}
