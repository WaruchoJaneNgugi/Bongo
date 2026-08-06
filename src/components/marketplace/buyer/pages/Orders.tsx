import { ui } from '../ui';
import { orders } from '../../../../lib/marketplace/mockBuyer';

const statusStyle: Record<string, string> = {
  Completed: ui.status.green,
  Pending: ui.status.amber,
  Refunded: ui.status.red,
};

export default function Orders() {
  return (
    <div className="space-y-6">
      <h1 className={`text-2xl ${ui.h1}`}>Order History</h1>

      <div className={`${ui.card} overflow-hidden`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide ${ui.muted}`}>
                Resource
              </th>
              <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide ${ui.muted} hidden sm:table-cell`}>
                Date
              </th>
              <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide ${ui.muted}`}>
                Amount
              </th>
              <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide ${ui.muted}`}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-[#eceff3]">
                <td className="px-5 py-4 font-medium text-[#0f172a]">{order.title}</td>
                <td className={`px-5 py-4 hidden sm:table-cell ${ui.muted}`}>{order.date}</td>
                <td className="px-5 py-4 font-bold text-[#15803d]">
                  KSh {order.amountKsh.toLocaleString()}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
