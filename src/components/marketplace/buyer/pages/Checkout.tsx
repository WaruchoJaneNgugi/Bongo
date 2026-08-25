import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Wallet, Smartphone, FileText } from 'lucide-react';
import { getPublishedResource } from '../../../../lib/marketplace/catalog';
import { subscribeWallet, walletCheckout } from '../../../../lib/marketplace/wallet';
import { useMarketStore } from '../../../../store/useMarketStore';
import { useStore } from '../../../../store/useStore';
import { accentFor } from '../presentation';
import type { MarketResource } from '../../../../lib/marketplace/types';
import { ui } from '../ui';

export default function Checkout() {
  const cart = useMarketStore(s => s.cart);
  const removeFromCart = useMarketStore(s => s.removeFromCart);
  const clearCart = useMarketStore(s => s.clearCart);
  const accountId = useStore(s => s.accountId);
  const phone = useStore(s => s.user?.phone);
  const navigate = useNavigate();

  const [items, setItems] = useState<MarketResource[] | null>(null);
  const [balance, setBalance] = useState(0);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolve cart ids to published resources (drops any no longer available).
  useEffect(() => {
    let cancelled = false;
    Promise.all(cart.map(id => getPublishedResource(id)))
      .then(rows => { if (!cancelled) setItems(rows.filter((r): r is MarketResource => r !== null)); })
      .catch(() => { if (!cancelled) setItems([]); });
    return () => { cancelled = true; };
  }, [cart]);

  useEffect(() => {
    if (!accountId) return;
    return subscribeWallet(accountId, setBalance);
  }, [accountId]);

  const total = useMemo(() => (items ?? []).reduce((n, r) => n + r.priceKsh, 0), [items]);
  const canAfford = balance >= total && total > 0;

  async function payFromWallet() {
    if (!items || items.length === 0 || paying) return;
    setPaying(true);
    setError(null);
    try {
      const res = await walletCheckout(items.map(r => r.id));
      clearCart();
      navigate('/market/library', { state: { justPurchased: res.purchased } });
    } catch (e) {
      const code = (e as { code?: string })?.code ?? '';
      setError(
        code.includes('insufficient')
          ? 'Not enough wallet balance — top up to continue.'
          : 'Payment failed. Please try again.',
      );
    } finally {
      setPaying(false);
    }
  }

  if (items === null) {
    return <div className={`py-20 text-center ${ui.muted}`}>Loading your cart…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className={ui.muted}>Your cart is empty.</p>
        <Link to="/market/browse" className={`${ui.brand} font-semibold hover:underline`}>Browse the marketplace</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/market/browse" className={`inline-flex items-center gap-1.5 text-sm font-semibold ${ui.brand} hover:underline`}>
        <ArrowLeft size={16} /> Continue shopping
      </Link>
      <h1 className={`text-2xl ${ui.h1}`}>Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
        {/* Line items */}
        <div className="space-y-3">
          {items.map(r => (
            <div key={r.id} className={`${ui.card} flex items-center gap-3 p-3`}>
              <div className={`w-12 h-12 rounded-lg overflow-hidden grid place-items-center bg-gradient-to-br ${accentFor(r.subject)} shrink-0`}>
                {r.thumbnailUrl
                  ? <img src={r.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  : <FileText size={18} className="text-white" />}
              </div>
              <div className="min-w-0 flex-1">
                <Link to={`/market/resource/${r.id}`} className="block text-sm font-bold text-[#0f172a] truncate hover:text-[#15803d]">{r.title}</Link>
                <div className={`text-xs ${ui.muted}`}>{r.subject} · {r.grade}</div>
              </div>
              <div className="text-sm font-extrabold text-[#0f172a] tabular-nums">
                {r.priceKsh === 0 ? 'Free' : `KSh ${r.priceKsh}`}
              </div>
              <button type="button" onClick={() => removeFromCart(r.id)} aria-label={`Remove ${r.title}`}
                className="w-8 h-8 grid place-items-center rounded-full text-[#94a3b8] hover:bg-[#fef2f2] hover:text-[#ef4444] transition">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary + payment */}
        <aside className="space-y-4">
          <div className={`${ui.card} p-5`}>
            <div className="flex items-center justify-between text-sm">
              <span className={ui.muted}>{items.length} item{items.length === 1 ? '' : 's'}</span>
              <span className="font-semibold text-[#0f172a]">KSh {total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#eceff3]">
              <span className="font-bold text-[#0f172a]">Total</span>
              <span className="text-xl font-extrabold text-[#0f172a]">KSh {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className={`${ui.card} p-5 space-y-3`}>
            <h2 className={`text-sm ${ui.h2}`}>Payment</h2>

            <div className="rounded-xl border border-[#e5e9f0] p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                <Wallet size={16} className="text-[#16a34a]" /> Wallet
                <span className="ml-auto text-[#0f172a]">KSh {balance.toLocaleString()}</span>
              </div>
              {total > balance && (
                <p className="text-[12px] text-[#b45309] mt-1">Not enough balance — top up to continue.</p>
              )}
              {error && <p className="text-[12px] text-[#ef4444] mt-1">{error}</p>}
              <button type="button" onClick={payFromWallet} disabled={!canAfford || paying}
                className={`mt-3 w-full rounded-xl py-2.5 text-sm font-bold text-white transition ${
                  !canAfford || paying ? 'bg-[#16a34a]/50 cursor-not-allowed' : 'bg-[#16a34a] hover:bg-[#15803d]'
                }`}>
                {paying ? 'Paying…' : 'Pay from wallet'}
              </button>
            </div>

            <div className="rounded-xl border border-[#e5e9f0] p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                <Smartphone size={16} className="text-[#16a34a]" /> M-Pesa
                {phone && <span className="ml-auto text-[12px] text-[#64748b]">{phone}</span>}
              </div>
              <button type="button" disabled
                title="M-Pesa is not configured yet"
                className={`mt-3 w-full ${ui.btnGhost} py-2.5 text-sm opacity-60 cursor-not-allowed`}>
                Pay with M-Pesa (coming soon)
              </button>
            </div>

            <p className={`text-[11px] ${ui.faint}`}>
              Pay instantly from your wallet. M-Pesa top-up is coming soon.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
