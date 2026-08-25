import { useEffect, useState } from 'react';
import { ui } from '../ui';
import { subscribePurchases } from '../../../../lib/marketplace/orders';
import { fmtDate } from '../../../../lib/marketplace/format';
import { useStore } from '../../../../store/useStore';
import type { Purchase, PurchaseStatus } from '../../../../lib/marketplace/types';

// Purchase status → human label + badge style.
const STATUS: Record<PurchaseStatus, { label: string; style: string }> = {
  paid: { label: 'Completed', style: ui.status.green },
  pending: { label: 'Pending', style: ui.status.amber },
  failed: { label: 'Failed', style: ui.status.red },
};

export default function Orders() {
  const accountId = useStore(s => s.accountId);
  const [orders, setOrders] = useState<Purchase[]>([]);

  useEffect(() => {
    if (!accountId) return;
    return subscribePurchases(accountId, setOrders);
  }, [accountId]);

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl ${ui.h1}`}>Order History</h1>

      {orders.length === 0 ? (
        <p className={`text-center py-16 ${ui.muted}`}>
          No orders yet — browse the marketplace to make your first purchase.
        </p>
      ) : (
        <div className={`${ui.card} overflow-hidden`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide ${ui.muted}`}>Resource</th>
                <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide ${ui.muted} hidden sm:table-cell`}>Date</th>
                <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide ${ui.muted}`}>Amount</th>
                <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide ${ui.muted}`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const s = STATUS[order.status] ?? STATUS.pending;
                return (
                  <tr key={order.id} className="border-t border-[#eceff3]">
                    <td className="px-5 py-4 font-medium text-[#0f172a]">{order.title}</td>
                    <td className={`px-5 py-4 hidden sm:table-cell ${ui.muted}`}>{fmtDate(order.createdAt)}</td>
                    <td className="px-5 py-4 font-bold text-[#15803d]">KSh {order.priceKsh.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${s.style}`}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
