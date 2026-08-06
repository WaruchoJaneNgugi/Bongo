import { Download, PlayCircle } from 'lucide-react';
import { library, findResource } from '../../../../lib/marketplace/mockBuyer';
import { ui } from '../ui';

export default function MyLibrary() {
  const items = library
    .map(l => ({ ...l, res: findResource(l.resourceId)! }))
    .filter(i => i.res);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`${ui.h1} text-xl`}>My Library</h1>
        <p className={`mt-1 text-sm ${ui.muted}`}>Resources you have purchased.</p>
      </div>

      {items.length === 0 ? (
        <p className={`text-center py-16 ${ui.muted}`}>
          Your library is empty — browse the marketplace to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(({ res, purchasedOn, progressPct }) => (
            <div key={res.id} className={`${ui.card} overflow-hidden flex flex-col`}>
              {/* Cover strip */}
              <div
                className={`h-24 bg-gradient-to-br ${res.accent} grid place-items-center`}
              >
                <span className="text-white text-xs font-bold uppercase tracking-wide">
                  {res.subject}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <h3 className="font-semibold text-[#0f172a] text-sm leading-snug line-clamp-2">
                  {res.title}
                </h3>
                <p className={`text-xs ${ui.muted}`}>Purchased {purchasedOn}</p>

                {/* Progress bar */}
                <div className="h-1.5 bg-[#eef2f7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16a34a] rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className={`text-xs ${ui.muted}`}>{progressPct}% complete</p>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2">
                  <button className={`${ui.btnPrimary} px-4 py-2 text-sm flex-1`}>
                    <PlayCircle size={15} />
                    Open
                  </button>
                  <button
                    aria-label="Download"
                    className={`${ui.btnGhost} w-9 h-9 rounded-xl`}
                  >
                    <Download size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
