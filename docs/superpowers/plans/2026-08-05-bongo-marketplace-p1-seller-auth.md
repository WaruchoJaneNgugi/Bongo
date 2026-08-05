# Bongo Marketplace — Plan 1: Seller Authentication (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A teacher/tutor/school can create a seller account (phone + 4-digit PIN) and log in, getting a Firebase session scoped to a `sellers/{id}` document, entirely separate from family/student accounts.

**Architecture:** Mirror the existing student auth mechanism (`functions/src/index.ts` `studentSignup`/`studentLogin`): the seller's hashed PIN lives in a Firestore `sellers` doc; Cloud Functions verify credentials and mint a Firebase **custom token** carrying a `{ seller: true }` claim; the client signs in with that token. Shared crypto/phone helpers are extracted so both student and seller auth use one copy (DRY). A small Zustand store holds the seller session; new `/seller` routes host the auth screen and a placeholder dashboard.

**Tech Stack:** Firebase (Auth custom tokens, Firestore, Cloud Functions v2, us-central1), Node 20 + TypeScript (ESM) in `functions/`, React 19 + React Router 7 + Zustand + Tailwind on the client, Vitest for tests.

**Reference:** Spec `docs/superpowers/specs/2026-08-05-bongo-marketplace-phase1-digital-slice-design.md` (§3 client/server units, §4 `sellers` schema, §6 security).

---

## File Structure

**Server (`functions/`):**
- Create `functions/src/shared/auth.ts` — pure helpers `hashPin`, `pinMatches`, `cleanKenyanPhone` (extracted from `index.ts`).
- Create `functions/src/shared/auth.test.ts` — Vitest unit tests for the helpers.
- Create `functions/src/marketplace/sellerAuth.ts` — `sellerSignup` + `sellerLogin` callables.
- Modify `functions/src/index.ts` — import shared helpers (replace local copies); re-export seller functions.
- Modify `functions/package.json` — add Vitest + `test` script.

**Client (`src/`):**
- Create `src/lib/marketplace/types.ts` — `Seller`, `SellerType` types.
- Create `src/lib/marketplace/sellerAuth.ts` — `signupSeller`, `loginSeller`, `logoutSeller`, `subscribeSeller`.
- Create `src/store/useSellerStore.ts` — Zustand seller-session store.
- Create `src/components/marketplace/SellerAuthPage.tsx` — signup/login screen.
- Create `src/components/marketplace/SellerDashboard.tsx` — placeholder dashboard (fleshed out in Plan 6).
- Create `src/components/marketplace/SellerProtectedRoute.tsx` — guards seller routes.
- Modify `src/App.tsx` — add `/seller` and `/seller/dashboard` routes.

**Rules:**
- Modify `firestore.rules` — add `isSeller()` helper + `sellers/{id}` block.

---

## Task 1: Vitest setup in the functions package

**Files:**
- Modify: `functions/package.json`

- [ ] **Step 1: Add Vitest dependency and test script**

Edit `functions/package.json` — add `"test": "vitest run"` to `scripts` and Vitest to `devDependencies`:

```json
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "serve": "npm run build && firebase emulators:start --only functions",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log",
    "test": "vitest run"
  },
```

```json
  "devDependencies": {
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  },
```

- [ ] **Step 2: Install**

Run: `cd functions && npm install`
Expected: adds `vitest` to `node_modules`, no errors.

- [ ] **Step 3: Exclude test files from the `tsc` build**

`functions/tsconfig.json` has `include: ["src"]`, so `tsc` would try to compile `*.test.ts` (which import `vitest`) into `lib/` and fail. Add an `exclude` so tests run under Vitest only. Edit `functions/tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["src/**/*.test.ts"]
}
```

- [ ] **Step 4: Verify the runner works (no tests yet)**

Run: `cd functions && npx vitest run`
Expected: exits reporting "No test files found" (exit code may be non-zero; that's fine — the next task adds a test).

- [ ] **Step 5: Commit**

```bash
git add functions/package.json functions/package-lock.json functions/tsconfig.json
git commit -m "chore(functions): add Vitest test runner"
```

---

## Task 2: Extract shared auth helpers (TDD)

Pull the PIN-hashing and phone-cleaning helpers out of `index.ts` into a testable module, then repoint `index.ts` at it so there is exactly one copy.

**Files:**
- Create: `functions/src/shared/auth.ts`
- Create: `functions/src/shared/auth.test.ts`
- Modify: `functions/src/index.ts` (lines ~663-674 hold the current local copies)

- [ ] **Step 1: Write the failing test**

Create `functions/src/shared/auth.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { hashPin, pinMatches, cleanKenyanPhone } from './auth.js';

describe('hashPin / pinMatches', () => {
  it('is deterministic for the same pin+salt', () => {
    const salt = 'abc123';
    expect(hashPin('1234', salt)).toBe(hashPin('1234', salt));
  });

  it('matches a correct pin and rejects a wrong one', () => {
    const salt = 'deadbeef';
    const stored = hashPin('4321', salt);
    expect(pinMatches('4321', salt, stored)).toBe(true);
    expect(pinMatches('0000', salt, stored)).toBe(false);
  });

  it('does not throw when the stored hash length differs', () => {
    expect(pinMatches('1234', 'salt', 'short')).toBe(false);
  });
});

describe('cleanKenyanPhone', () => {
  it('accepts 07XXXXXXXX and +2547XXXXXXXX', () => {
    expect(cleanKenyanPhone('0712345678')).toBe('0712345678');
    expect(cleanKenyanPhone('+254712345678')).toBe('+254712345678');
    expect(cleanKenyanPhone('07 1234 5678')).toBe('0712345678');
  });

  it('rejects invalid numbers', () => {
    expect(cleanKenyanPhone('12345')).toBeNull();
    expect(cleanKenyanPhone('0812345678')).toBeNull();
    expect(cleanKenyanPhone('')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd functions && npx vitest run src/shared/auth.test.ts`
Expected: FAIL — cannot resolve `./auth.js` (module does not exist yet).

- [ ] **Step 3: Create the helper module**

Create `functions/src/shared/auth.ts`:

```ts
// Shared auth primitives used by both student and seller sign-in.
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function hashPin(pin: string, salt: string): string {
  return scryptSync(pin, salt, 64).toString('hex');
}

export function pinMatches(pin: string, salt: string, expected: string): boolean {
  const a = Buffer.from(hashPin(pin, salt), 'hex');
  const b = Buffer.from(expected, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Returns the normalised number (spaces stripped) if valid, else null. */
export function cleanKenyanPhone(phone: string): string | null {
  const p = (phone || '').replace(/\s/g, '');
  return /^(\+254|0)[7][0-9]{8}$/.test(p) ? p : null;
}

export function newSalt(): string {
  return randomBytes(16).toString('hex');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd functions && npx vitest run src/shared/auth.test.ts`
Expected: PASS (3 + 2 assertions green).

- [ ] **Step 5: Repoint `index.ts` at the shared module**

In `functions/src/index.ts`: (a) add the import near the top with the other imports:

```ts
import { hashPin, pinMatches, cleanKenyanPhone, newSalt } from './shared/auth.js';
```

(b) Delete the now-duplicated local definitions of `hashPin`, `pinMatches`, and `cleanKenyanPhone` (the `function hashPin…`, `function pinMatches…`, `function cleanKenyanPhone…` blocks around lines 663-674). Leave `PACKAGES` in place. (c) In `studentSignup`, replace `const salt = randomBytes(16).toString('hex');` with `const salt = newSalt();`. (d) The `crypto` import is now fully unused in `index.ts` (all of `randomBytes`, `scryptSync`, `timingSafeEqual` moved to the shared module) and `noUnusedLocals: true` will error — **delete the whole line** `import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';` (line ~8).

- [ ] **Step 6: Build to confirm no breakage**

Run: `cd functions && npm run build`
Expected: `tsc` completes with no errors.

- [ ] **Step 7: Commit**

```bash
git add functions/src/shared/auth.ts functions/src/shared/auth.test.ts functions/src/index.ts
git commit -m "refactor(functions): extract shared PIN/phone auth helpers with tests"
```

---

## Task 3: Seller signup & login Cloud Functions

**Files:**
- Create: `functions/src/marketplace/sellerAuth.ts`
- Modify: `functions/src/index.ts` (add re-export)

- [ ] **Step 1: Write the seller auth callables**

Create `functions/src/marketplace/sellerAuth.ts`:

```ts
// Seller auth — phone + PIN via Firebase custom tokens, mirroring student auth.
// A seller session is entirely separate from a family/student account.
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { hashPin, pinMatches, cleanKenyanPhone, newSalt } from '../shared/auth.js';

const SELLER_TYPES = ['teacher', 'tutor', 'school'];

export const sellerSignup = onCall(async request => {
  const { phone, pin, displayName, type } = (request.data ?? {}) as {
    phone?: string; pin?: string; displayName?: string; type?: string;
  };
  const db = getFirestore();

  const cleanPhone = cleanKenyanPhone(phone ?? '');
  if (!cleanPhone) throw new HttpsError('invalid-argument', 'Enter a valid Kenyan phone number.');
  if (!/^\d{4}$/.test(pin ?? '')) throw new HttpsError('invalid-argument', 'PIN must be 4 digits.');
  if (!displayName || displayName.trim().length < 2) {
    throw new HttpsError('invalid-argument', 'Enter your name (2+ characters).');
  }
  if (!SELLER_TYPES.includes(type ?? '')) {
    throw new HttpsError('invalid-argument', 'type must be teacher, tutor, or school.');
  }

  const existing = await db.collection('sellers').where('phone', '==', cleanPhone).limit(1).get();
  if (!existing.empty) throw new HttpsError('already-exists', 'This number is already a seller.');

  const salt = newSalt();
  const ref = await db.collection('sellers').add({
    phone: cleanPhone,
    pinSalt: salt,
    pinHash: hashPin(pin as string, salt),
    displayName: displayName.trim(),
    type,
    status: 'active',
    payoutBalancePending: 0,
    payoutBalancePaid: 0,
    failedAttempts: 0,
    lockoutUntil: null,
    createdAt: FieldValue.serverTimestamp(),
  });

  const token = await getAuth().createCustomToken(ref.id, { seller: true });
  return { token, sellerId: ref.id };
});

export const sellerLogin = onCall(async request => {
  const { phone, pin } = (request.data ?? {}) as { phone?: string; pin?: string };
  const db = getFirestore();

  const cleanPhone = cleanKenyanPhone(phone ?? '');
  if (!cleanPhone) throw new HttpsError('invalid-argument', 'Enter a valid Kenyan phone number.');
  if (!/^\d{4}$/.test(pin ?? '')) throw new HttpsError('invalid-argument', 'Enter your 4-digit PIN.');

  const snap = await db.collection('sellers').where('phone', '==', cleanPhone).limit(1).get();
  if (snap.empty) throw new HttpsError('not-found', 'No seller account for this number.');

  const docSnap = snap.docs[0];
  const s = docSnap.data();
  const now = Date.now();
  const lockoutUntil = s.lockoutUntil ?? null;
  if (lockoutUntil && lockoutUntil > now) {
    const mins = Math.ceil((lockoutUntil - now) / 60000);
    throw new HttpsError('resource-exhausted', `Too many attempts. Try again in ${mins} min.`);
  }
  if (s.status === 'suspended') {
    throw new HttpsError('permission-denied', 'This seller account is suspended.');
  }

  if (!pinMatches(pin as string, s.pinSalt, s.pinHash)) {
    const attempts = (s.failedAttempts ?? 0) + 1;
    await docSnap.ref.update({
      failedAttempts: attempts,
      lockoutUntil: attempts >= 5 ? now + 5 * 60 * 1000 : null,
    });
    throw new HttpsError('permission-denied', 'Incorrect PIN.');
  }

  await docSnap.ref.update({ failedAttempts: 0, lockoutUntil: null });
  const token = await getAuth().createCustomToken(docSnap.id, { seller: true });
  return {
    token,
    sellerId: docSnap.id,
    displayName: s.displayName,
    type: s.type,
  };
});
```

- [ ] **Step 2: Re-export from `index.ts`**

Add near the bottom of `functions/src/index.ts` (with other exports):

```ts
export { sellerSignup, sellerLogin } from './marketplace/sellerAuth.js';
```

- [ ] **Step 3: Build**

Run: `cd functions && npm run build`
Expected: `tsc` completes with no errors.

- [ ] **Step 4: Manual verification against the emulator**

Run: `cd /home/jane-ngugi/Bongo && firebase emulators:start --only functions,firestore,auth`
In the Emulator UI (or a scratch script) call `sellerSignup` with `{ phone: '0712345678', pin: '1234', displayName: 'Teacher Jane', type: 'teacher' }`.
Expected: returns `{ token, sellerId }`; a `sellers/{id}` doc appears in the Firestore emulator with `status: 'active'`, `payoutBalancePending: 0`, and no plaintext PIN (only `pinHash`/`pinSalt`). Then call `sellerLogin` with the same phone/PIN → returns a token; with a wrong PIN → `permission-denied`.

- [ ] **Step 5: Commit**

```bash
git add functions/src/marketplace/sellerAuth.ts functions/src/index.ts
git commit -m "feat(functions): sellerSignup + sellerLogin callables"
```

---

## Task 4: Firestore rules for sellers

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: Add the `isSeller()` helper**

In `firestore.rules`, alongside `isStaff`/`isAdmin`/`isOwner`, add:

```
    function isSeller() { return request.auth != null && request.auth.token.seller == true; }
```

- [ ] **Step 2: Add the `sellers` collection block**

Add before the closing comment (`/* Everything else is denied by default. */`):

```
    /* ── Marketplace sellers ── */
    // Created by the sellerSignup function (admin SDK bypasses rules).
    // A seller reads only their own doc; staff read all; balances/status
    // are written by Cloud Functions or admins, never by the seller.
    match /sellers/{id} {
      allow read:   if isStaff() || (isSeller() && request.auth.uid == id);
      allow update: if isAdmin();
      allow create, delete: if false;
    }
```

- [ ] **Step 3: Validate the rules compile**

Run: `cd /home/jane-ngugi/Bongo && firebase emulators:start --only firestore`
Expected: Firestore emulator starts without a rules-compilation error, then Ctrl-C to stop.

- [ ] **Step 4: Commit**

```bash
git add firestore.rules
git commit -m "feat(rules): seller read-own + isSeller helper"
```

---

## Task 5: Client seller types + auth library

**Files:**
- Create: `src/lib/marketplace/types.ts`
- Create: `src/lib/marketplace/sellerAuth.ts`

- [ ] **Step 1: Define seller types**

Create `src/lib/marketplace/types.ts`:

```ts
export type SellerType = 'teacher' | 'tutor' | 'school';

export interface Seller {
  displayName: string;
  phone: string;
  type: SellerType;
  status: 'active' | 'suspended';
  payoutBalancePending: number;
  payoutBalancePaid: number;
}
```

- [ ] **Step 2: Write the client auth wrapper**

Create `src/lib/marketplace/sellerAuth.ts` (mirrors `src/lib/studentAuth.ts`):

```ts
// Seller auth client: phone + PIN via Firebase custom tokens (verified server-side).
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from '../firebase';
import type { Seller, SellerType } from './types';

/** Create a seller account (server hashes the PIN) and sign in. */
export async function signupSeller(
  phone: string, pin: string, displayName: string, type: SellerType
): Promise<string> {
  const fn = httpsCallable<
    { phone: string; pin: string; displayName: string; type: SellerType },
    { token: string; sellerId: string }
  >(functions, 'sellerSignup');
  const { token, sellerId } = (await fn({ phone, pin, displayName, type })).data;
  await signInWithCustomToken(auth, token);
  return sellerId;
}

/** Verify phone + PIN server-side and sign in. */
export async function loginSeller(
  phone: string, pin: string
): Promise<{ sellerId: string; displayName: string; type: SellerType }> {
  const fn = httpsCallable<
    { phone: string; pin: string },
    { token: string; sellerId: string; displayName: string; type: SellerType }
  >(functions, 'sellerLogin');
  const res = (await fn({ phone, pin })).data;
  await signInWithCustomToken(auth, res.token);
  return { sellerId: res.sellerId, displayName: res.displayName, type: res.type };
}

export async function logoutSeller(): Promise<void> {
  await signOut(auth);
}

/** Live subscription to the signed-in seller's document. */
export function subscribeSeller(sellerId: string, cb: (data: Seller | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'sellers', sellerId), snap => {
    cb(snap.exists() ? (snap.data() as Seller) : null);
  });
}
```

- [ ] **Step 3: Type-check**

Run: `cd /home/jane-ngugi/Bongo && npx tsc -b`
Expected: no type errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/marketplace/types.ts src/lib/marketplace/sellerAuth.ts
git commit -m "feat(marketplace): client seller types + auth wrapper"
```

---

## Task 6: Seller session store

**Files:**
- Create: `src/store/useSellerStore.ts`

- [ ] **Step 1: Write the store**

Create `src/store/useSellerStore.ts`:

```ts
import { create } from 'zustand';
import type { Unsubscribe } from 'firebase/firestore';
import type { Seller, SellerType } from '../lib/marketplace/types';
import {
  signupSeller, loginSeller, logoutSeller, subscribeSeller,
} from '../lib/marketplace/sellerAuth';

interface SellerState {
  sellerId: string | null;
  seller: Seller | null;
  authReady: boolean;
  _unsub: Unsubscribe | null;

  signup: (phone: string, pin: string, displayName: string, type: SellerType) => Promise<void>;
  login: (phone: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Attach a live listener once we know the seller id (e.g. after auth restore). */
  bind: (sellerId: string) => void;
}

export const useSellerStore = create<SellerState>((set, get) => ({
  sellerId: null,
  seller: null,
  authReady: false,
  _unsub: null,

  bind: (sellerId) => {
    get()._unsub?.();
    const unsub = subscribeSeller(sellerId, seller => set({ seller, authReady: true }));
    set({ sellerId, _unsub: unsub });
  },

  signup: async (phone, pin, displayName, type) => {
    const sellerId = await signupSeller(phone, pin, displayName, type);
    get().bind(sellerId);
  },

  login: async (phone, pin) => {
    const { sellerId } = await loginSeller(phone, pin);
    get().bind(sellerId);
  },

  logout: async () => {
    get()._unsub?.();
    await logoutSeller();
    set({ sellerId: null, seller: null, _unsub: null });
  },
}));
```

- [ ] **Step 2: Type-check**

Run: `cd /home/jane-ngugi/Bongo && npx tsc -b`
Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/store/useSellerStore.ts
git commit -m "feat(marketplace): seller session store"
```

---

## Task 7: Seller auth screen, protected route, placeholder dashboard

**Files:**
- Create: `src/components/marketplace/SellerAuthPage.tsx`
- Create: `src/components/marketplace/SellerProtectedRoute.tsx`
- Create: `src/components/marketplace/SellerDashboard.tsx`

- [ ] **Step 1: Auth screen**

Create `src/components/marketplace/SellerAuthPage.tsx`:

```tsx
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
```

- [ ] **Step 2: Protected route guard**

Create `src/components/marketplace/SellerProtectedRoute.tsx`:

```tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSellerStore } from '../../store/useSellerStore';

export default function SellerProtectedRoute({ children }: { children: React.ReactNode }) {
  const sellerId = useSellerStore(s => s.sellerId);
  if (!sellerId) return <Navigate to="/seller" replace />;
  return <>{children}</>;
}
```

- [ ] **Step 3: Placeholder dashboard**

Create `src/components/marketplace/SellerDashboard.tsx`:

```tsx
import React from 'react';
import { useSellerStore } from '../../store/useSellerStore';

export default function SellerDashboard() {
  const { seller, logout } = useSellerStore();
  return (
    <div className="min-h-screen bg-[#faf9fc] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-extrabold text-[#241a3d]">
          Welcome{seller ? `, ${seller.displayName}` : ''} 👋
        </h1>
        <p className="text-sm text-[#6a6480] mt-2">
          Your seller dashboard. Listings and earnings arrive in the next milestones.
        </p>
        <button onClick={() => logout()}
          className="mt-6 text-sm text-[#5b3ea8] underline">Sign out</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Type-check**

Run: `cd /home/jane-ngugi/Bongo && npx tsc -b`
Expected: no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketplace/SellerAuthPage.tsx src/components/marketplace/SellerProtectedRoute.tsx src/components/marketplace/SellerDashboard.tsx
git commit -m "feat(marketplace): seller auth screen + guard + placeholder dashboard"
```

---

## Task 8: Wire seller routes into the app

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add imports**

Near the other imports in `src/App.tsx`:

```tsx
import SellerAuthPage from './components/marketplace/SellerAuthPage';
import SellerDashboard from './components/marketplace/SellerDashboard';
import SellerProtectedRoute from './components/marketplace/SellerProtectedRoute';
```

- [ ] **Step 2: Add the routes**

Inside `<Routes>` (e.g. just after the `/admin/*` route at `src/App.tsx:108`), add:

```tsx
        <Route path="/seller"           element={<SellerAuthPage />} />
        <Route path="/seller/dashboard" element={<SellerProtectedRoute><SellerDashboard /></SellerProtectedRoute>} />
```

- [ ] **Step 3: Build the app**

Run: `cd /home/jane-ngugi/Bongo && npm run build`
Expected: `tsc -b && vite build` completes with no errors.

- [ ] **Step 4: Manual end-to-end verification**

Run the app against the emulator suite: `firebase emulators:start` (separate terminal) and `npm run dev`.
Visit `/seller` → create a seller account (name, teacher, `0712345678`, PIN `1234`) → lands on `/seller/dashboard` showing "Welcome, <name>". Sign out → `/seller` → sign in with the same phone/PIN → back to the dashboard. Wrong PIN shows "Incorrect PIN." Visiting `/seller/dashboard` directly while signed out redirects to `/seller`.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat(marketplace): wire /seller auth + dashboard routes"
```

---

## Definition of Done (Plan 1)

- `cd functions && npx vitest run` passes (shared auth helper tests green).
- `npm run build` (client) and `cd functions && npm run build` both succeed.
- A seller can sign up and log in end-to-end against the emulator; the `sellers/{id}` doc stores only a hashed PIN; wrong PIN and lockout behave correctly; `/seller/dashboard` is guarded.
- Firestore rules let a seller read only their own doc and block self-writes to balances/status.

## Notes for later plans
- **Single Firebase Auth session:** a browser is signed in as *either* a student or a seller at a time (seller custom token replaces any student token). Acceptable for Phase 1; revisit if simultaneous roles are needed.
- **Auth restore across reload:** Plan 1 binds the live seller doc on login/signup. Persisting the seller session across a hard refresh (reading the `seller` custom claim from `auth.currentUser` on boot and calling `bind`) is a small follow-up folded into Plan 2 when the seller dashboard gains real content.
