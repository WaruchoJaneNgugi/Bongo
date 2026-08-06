import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import type { SellerType } from '../../lib/marketplace/types';

const INPUT =
  'w-full bg-white border border-[#e5e9f0] rounded-xl px-3 py-2.5 text-sm text-[#0f172a] outline-none focus:ring-4 focus:ring-[#16a34a]/10 focus:border-[#16a34a]/40 transition';

export default function SellerAuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<SellerType>('teacher');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { login, signup } = useSellerStore();
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'signup') await signup(phone, pin, name, type);
      else await login(phone, pin);
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-market p-4">
      <form onSubmit={submit}
        className="w-full max-w-sm bg-white rounded-2xl border border-[#eceff3] shadow-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-[#16a34a]" size={26} />
          <span className="font-extrabold text-lg tracking-tight">
            <span className="text-[#16a34a]">High</span><span className="text-[#0f172a]">Scores</span>
          </span>
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0f172a]">
            {mode === 'signup' ? 'Become a seller' : 'Seller sign in'}
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            {mode === 'signup'
              ? 'Sell your notes, past papers and classes on HighScores.'
              : 'Sign in to your seller dashboard.'}
          </p>
        </div>

        {mode === 'signup' && (
          <>
            <input className={INPUT} placeholder="Your name"
              value={name} onChange={e => setName(e.target.value)} />
            <select className={INPUT}
              value={type} onChange={e => setType(e.target.value as SellerType)}>
              <option value="teacher">Teacher</option>
              <option value="tutor">Tutor</option>
              <option value="school">School</option>
            </select>
          </>
        )}

        <input className={INPUT} placeholder="07XXXXXXXX"
          value={phone} onChange={e => setPhone(e.target.value)} />
        <input className={INPUT} placeholder="4-digit PIN"
          inputMode="numeric" maxLength={4} value={pin} onChange={e => setPin(e.target.value)} />

        {error && <p className="text-sm text-[#b91c1c]">{error}</p>}

        <button type="submit" disabled={busy}
          className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl py-2.5 font-semibold transition-colors disabled:opacity-60">
          {busy ? 'Please wait…' : mode === 'signup' ? 'Create seller account' : 'Sign in'}
        </button>

        <button type="button" className="w-full text-sm font-semibold text-[#16a34a] hover:underline"
          onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(null); }}>
          {mode === 'signup' ? 'Already a seller? Sign in' : 'New here? Create a seller account'}
        </button>
      </form>
    </div>
  );
}
