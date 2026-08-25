import { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Plus, Wallet } from 'lucide-react';
import { ui } from '../ui';
import { subscribeWallet, subscribeWalletTx } from '../../../../lib/marketplace/wallet';
import { fmtDate } from '../../../../lib/marketplace/format';
import { useStore } from '../../../../store/useStore';
import type { WalletTx } from '../../../../lib/marketplace/types';

const LABEL: Record<WalletTx['type'], string> = {
  topup: 'Wallet top-up',
  purchase: 'Purchase',
};

export default function Payments() {
  const accountId = useStore(s => s.accountId);
  const [balance, setBalance] = useState(0);
  const [tx, setTx] = useState<WalletTx[]>([]);

  useEffect(() => {
    if (!accountId) return;
    const unsubBal = subscribeWallet(accountId, setBalance);
    const unsubTx = subscribeWalletTx(accountId, setTx);
    return () => { unsubBal(); unsubTx(); };
  }, [accountId]);

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl ${ui.h1}`}>Payments</h1>

      {/* Wallet balance */}
      <div className={`${ui.card} p-5 flex flex-col gap-4 max-w-md`}>
        <div className={`flex items-center gap-2 text-sm ${ui.muted}`}>
          <Wallet size={16} /> Wallet Balance
        </div>
        <p className="text-3xl font-bold text-[#0f172a]">KSh {balance.toLocaleString()}</p>
        <div>
          <button disabled title="Available once M-Pesa is set up"
            className={`${ui.btnGhost} px-4 py-2 text-sm opacity-60 cursor-not-allowed`}>
            <Plus size={14} /> Top up
          </button>
          <p className={`mt-2 text-[11px] ${ui.faint}`}>Self-service top-up arrives once M-Pesa is configured. Ask an admin to credit your wallet for now.</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className={`${ui.card} p-5`}>
        <h2 className={`font-semibold mb-4 ${ui.h2}`}>Transaction History</h2>
        {tx.length === 0 ? (
          <p className={`text-sm ${ui.muted}`}>No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-[#eceff3]">
            {tx.map(t => {
              const isIn = t.amountKsh >= 0;
              return (
                <li key={t.id} className="flex items-center gap-3 py-3">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm ${isIn ? ui.status.green : ui.status.red}`}>
                    {isIn ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#0f172a] truncate">{LABEL[t.type]}</p>
                    <p className={`text-xs ${ui.muted}`}>{fmtDate(t.createdAt)}</p>
                  </div>
                  <span className={`font-semibold text-sm whitespace-nowrap ${isIn ? 'text-[#15803d]' : 'text-[#b91c1c]'}`}>
                    {isIn ? '+' : '−'}KSh {Math.abs(t.amountKsh).toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
