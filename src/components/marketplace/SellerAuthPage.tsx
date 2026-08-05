import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerStore } from '../../store/useSellerStore';
import type { SellerType } from '../../lib/marketplace/types';

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
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface,#faf9fc)] p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-xl font-extrabold text-[#241a3d]">
          {mode === 'signup' ? 'Become a Bongo seller' : 'Seller sign in'}
        </h1>

        {mode === 'signup' && (
          <>
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Your name"
              value={name} onChange={e => setName(e.target.value)} />
            <select className="w-full border rounded-lg px-3 py-2"
              value={type} onChange={e => setType(e.target.value as SellerType)}>
              <option value="teacher">Teacher</option>
              <option value="tutor">Tutor</option>
              <option value="school">School</option>
            </select>
          </>
        )}

        <input className="w-full border rounded-lg px-3 py-2" placeholder="07XXXXXXXX"
          value={phone} onChange={e => setPhone(e.target.value)} />
        <input className="w-full border rounded-lg px-3 py-2" placeholder="4-digit PIN"
          inputMode="numeric" maxLength={4} value={pin} onChange={e => setPin(e.target.value)} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={busy}
          className="w-full bg-[#5b3ea8] text-white rounded-lg py-2 font-bold disabled:opacity-60">
          {busy ? 'Please wait…' : mode === 'signup' ? 'Create seller account' : 'Sign in'}
        </button>

        <button type="button" className="w-full text-sm text-[#5b3ea8]"
          onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(null); }}>
          {mode === 'signup' ? 'Already a seller? Sign in' : 'New here? Create a seller account'}
        </button>
      </form>
    </div>
  );
}
