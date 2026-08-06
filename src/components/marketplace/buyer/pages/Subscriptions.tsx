import { Check } from 'lucide-react';
import { ui } from '../ui';
import { subscriptions } from '../../../../lib/marketplace/mockBuyer';

export default function Subscriptions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl ${ui.h1}`}>Subscriptions</h1>
        <p className={`mt-1 ${ui.muted}`}>Upgrade for AI tools and unlimited learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subscriptions.plans.map((plan) => (
          <div
            key={plan.key}
            className={`${ui.card} p-5 flex flex-col gap-4 ${
              plan.current ? 'border-[#16a34a] bg-[#f0fdf4]' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#0f172a]">{plan.name}</span>
              {plan.current && (
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ui.status.green}`}
                >
                  Current
                </span>
              )}
            </div>

            <div>
              <span className="text-3xl font-bold text-[#0f172a]">
                KSh {plan.priceKsh.toLocaleString()}
              </span>
              <span className={`text-sm ${ui.muted}`}> / {plan.period}</span>
            </div>

            <ul className="flex-1 space-y-2">
              {plan.perks.map((perk) => (
                <li key={perk} className={`flex items-center gap-2 text-sm ${ui.muted}`}>
                  <Check size={14} className="text-[#16a34a] shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>

            <div>
              {plan.current ? (
                <button
                  disabled
                  className={`w-full px-4 py-2 text-sm ${ui.btnGhost} opacity-60 cursor-not-allowed`}
                >
                  Current Plan
                </button>
              ) : (
                <button className={`w-full px-4 py-2 text-sm ${ui.btnPrimary}`}>
                  Upgrade to {plan.name}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
