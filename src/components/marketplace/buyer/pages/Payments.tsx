import { ArrowDownLeft, ArrowUpRight, Plus, Smartphone, Wallet } from 'lucide-react';
import { ui } from '../ui';
import { payments, wallet } from '../../../../lib/marketplace/mockBuyer';

export default function Payments() {
  return (
    <div className="space-y-6">
      <h1 className={`text-2xl ${ui.h1}`}>Payments</h1>

      {/* Top row: Wallet + Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wallet card */}
        <div className={`${ui.card} p-5 flex flex-col gap-4`}>
          <div className={`flex items-center gap-2 text-sm ${ui.muted}`}>
            <Wallet size={16} />
            Wallet Balance
          </div>
          <p className="text-3xl font-bold text-[#0f172a]">
            KSh {wallet.balanceKsh.toLocaleString()}
          </p>
          <div>
            <button className={`${ui.btnPrimary} px-4 py-2 text-sm`}>
              <Plus size={14} />
              Top up
            </button>
          </div>
        </div>

        {/* Payment Methods card */}
        <div className={`${ui.card} p-5 flex flex-col gap-4`}>
          <h2 className={`font-semibold ${ui.h2}`}>Payment Methods</h2>
          <ul className="space-y-3">
            {payments.methods.map((method) => (
              <li key={method.key} className="flex items-center gap-3">
                <Smartphone size={18} className="text-[#16a34a] shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-[#0f172a]">{method.label}</span>
                  <span className={`ml-2 text-sm ${ui.muted}`}>{method.detail}</span>
                </div>
                {method.primary && (
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ui.status.green}`}
                  >
                    Primary
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transaction History */}
      <div className={`${ui.card} p-5`}>
        <h2 className={`font-semibold mb-4 ${ui.h2}`}>Transaction History</h2>
        <ul className="divide-y divide-[#eceff3]">
          {payments.transactions.map((tx) => {
            const isIn = tx.direction === 'in';
            return (
              <li key={tx.id} className="flex items-center gap-3 py-3">
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                    isIn ? ui.status.green : ui.status.red
                  }`}
                >
                  {isIn ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0f172a] truncate">{tx.label}</p>
                  <p className={`text-xs ${ui.muted}`}>{tx.date}</p>
                </div>

                <span
                  className={`font-semibold text-sm whitespace-nowrap ${
                    isIn ? 'text-[#15803d]' : 'text-[#b91c1c]'
                  }`}
                >
                  {isIn ? '+' : '−'}KSh {tx.amountKsh.toLocaleString()}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
