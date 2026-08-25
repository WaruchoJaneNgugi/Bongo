import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { creditWallet } from '../../lib/marketplace/wallet';

// Admin control to top up a family account's marketplace wallet (honest,
// authorized funding while self-service M-Pesa top-up is not yet live).
const WalletsSection: React.FC = () => {
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const amountKsh = Number(amount);
  const valid = accountId.trim().length > 0 && Number.isFinite(amountKsh) && amountKsh > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setMsg(null);
    try {
      await creditWallet(accountId.trim(), amountKsh);
      setMsg({ ok: true, text: `Credited KSh ${amountKsh.toLocaleString()} to ${accountId.trim()}.` });
      setAmount('');
    } catch (err) {
      setMsg({ ok: false, text: (err as { message?: string }).message ?? 'Could not credit wallet.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h2>Wallets</h2>
          <p>Credit a family account's marketplace wallet. Balance is written server-side.</p>
        </div>
        <Wallet size={20} />
      </div>

      <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: 420, display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          Account ID
          <input
            type="text"
            value={accountId}
            onChange={e => setAccountId(e.target.value)}
            placeholder="accounts/{id} document id"
          />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          Amount (KSh)
          <input
            type="number"
            min="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="500"
          />
        </label>
        <button type="submit" disabled={!valid || busy}>
          <Wallet size={16} />
          {busy ? 'Crediting…' : 'Credit wallet'}
        </button>
        {msg && (
          <p style={{ color: msg.ok ? '#15803d' : '#ef4444', fontSize: 13, margin: 0 }}>{msg.text}</p>
        )}
      </form>
    </section>
  );
};

export default WalletsSection;
