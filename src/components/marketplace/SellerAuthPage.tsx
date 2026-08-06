import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import type { SellerType } from '../../lib/marketplace/types';

const INPUT =
  'w-full bg-white border border-[#e5e9f0] rounded-xl px-3 py-2.5 text-sm text-[#0f172a] outline-none focus:ring-4 focus:ring-[#16a34a]/10 focus:border-[#16a34a]/40 transition';

// Per-type registration number (how we uniquely identify each Kenyan seller).
// The server re-validates with the matching rule in shared/auth.ts.
const REG: Record<SellerType, {
  label: string; hint: string; numeric: boolean;
  clean: (v: string) => string; test: (v: string) => boolean;
}> = {
  teacher: {
    label: 'TSC number',
    hint: 'Your Kenyan Teachers Service Commission number.',
    numeric: true,
    clean: v => v.replace(/\D/g, ''),
    test: v => /^\d{5,9}$/.test(v.trim()),
  },
  school: {
    label: 'School registration code',
    hint: 'Your Ministry of Education (NEMIS / KEMIS) school code.',
    numeric: false,
    clean: v => v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
    test: v => /^[A-Z0-9]{4,15}$/.test(v.trim()),
  },
  tutor: {
    label: 'National ID number',
    hint: 'Your Kenyan National ID number.',
    numeric: true,
    clean: v => v.replace(/\D/g, ''),
    test: v => /^\d{6,9}$/.test(v.trim()),
  },
};

// TESTING: accept any non-empty registration number. Set to false to enforce
// the per-type Kenyan formats above.
const LENIENT_REG = true;

export default function SellerAuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<SellerType>('teacher');
  const [location, setLocation] = useState('');
  const [reg, setReg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { login, signup } = useSellerStore();
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    // Fast client-side guard for instant feedback; the server re-validates and
    // is authoritative.
    const regOk = LENIENT_REG ? reg.trim().length > 0 : REG[type].test(reg);
    if (mode === 'signup' && !regOk) {
      setError(`Enter a valid ${REG[type].label}.`);
      return;
    }
    if (mode === 'signup' && type === 'school' && location.trim().length < 2) {
      setError('Enter the school location.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') {
        await signup(phone, pin, name, type, reg.trim(), type === 'school' ? location.trim() : undefined);
      } else await login(phone, pin);
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
            <input className={INPUT} placeholder={type === 'school' ? 'School name' : 'Your name'}
              value={name} onChange={e => setName(e.target.value)} />
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1.5">I'm registering as</label>
              <div className="grid grid-cols-3 gap-2">
                {(['teacher', 'tutor', 'school'] as SellerType[]).map(t => (
                  <button key={t} type="button" onClick={() => { setType(t); setReg(''); }}
                    aria-pressed={type === t}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold capitalize transition-colors ${
                      type === t
                        ? 'border-[#16a34a] bg-[#f0fdf4] text-[#15803d]'
                        : 'border-[#e5e9f0] bg-white text-[#64748b] hover:bg-[#f8fafc]'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {type === 'school' && (
              <input className={INPUT} placeholder="School location (town / county)"
                value={location} onChange={e => setLocation(e.target.value)} />
            )}

            <div>
              <input className={INPUT} placeholder={REG[type].label}
                inputMode={LENIENT_REG ? 'text' : (REG[type].numeric ? 'numeric' : 'text')} value={reg}
                onChange={e => setReg(LENIENT_REG ? e.target.value : REG[type].clean(e.target.value))} />
              <p className="text-xs text-[#94a3b8] mt-1.5">
                {REG[type].hint} All seller accounts are verified before selling.
              </p>
            </div>
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
