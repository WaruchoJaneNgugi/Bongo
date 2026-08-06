# Marketplace Buyer/Student UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the student "Sell" nav tab with a "Market" tab opening a full buyer marketplace (`/market`, 8 pages, own shell), and make the seller portal's dead "Marketplace" item a real page (`/seller/marketplace`) that reuses the same storefront inside seller chrome — all UI-first with mock data.

**Architecture:** A buyer shell (`MarketLayout`) with an 8-item sidebar renders shell-agnostic page components under `ProtectedRoute`. The seller shell (`SellerLayout`) renders the shared `MarketBrowse` storefront at `/seller/marketplace`. All catalog data comes from `mockBuyer.ts` (schema-shaped for later drop-in wiring); cart/wishlist interactivity is local via a Zustand `useMarketStore`. Visual feedback is dependency-free: sidebar badge counts + filled button states (no toast library).

**Tech Stack:** React 19, react-router-dom 7, Zustand 5, Tailwind CSS, lucide-react. Tests: Vitest + @testing-library/react + jsdom (new frontend harness).

---

## File Structure

```
src/store/useMarketStore.ts                              # cart[] + wishlist[] local state
src/lib/marketplace/mockBuyer.ts                         # all buyer mock data + types
src/components/marketplace/buyer/
  MarketLayout.tsx                                       # buyer shell: sidebar + topbar + drawer + <Outlet/>
  components/ResourceCard.tsx                            # cover/title/seller/rating/price + Buy/Wishlist
  components/SectionHeader.tsx                           # "Title … View all"
  pages/MarketHome.tsx                                   # mockup home
  pages/MarketBrowse.tsx                                 # storefront grid + filters (shared w/ seller)
  pages/MyLibrary.tsx
  pages/Wishlist.tsx
  pages/Orders.tsx
  pages/Subscriptions.tsx
  pages/Payments.tsx
  pages/Messages.tsx
src/components/Navbar.tsx                                # MODIFY: Sell→Market
src/App.tsx                                              # MODIFY: routes + hide chrome on /market
src/components/marketplace/SellerLayout.tsx              # MODIFY: Marketplace item → real route
```

Tests live beside source as `*.test.ts(x)`.

---

## Task 1: Frontend test harness (Vitest + Testing Library)

**Files:**
- Modify: `package.json`
- Create: `vitest.setup.ts`
- Modify: `vite.config.ts`

- [ ] **Step 1: Install dev dependencies**

```bash
npm i -D vitest@^3 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Add the test script**

In `package.json` `"scripts"`, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create the setup file**

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Wire Vitest into vite.config.ts**

Add a `test` block to the config object in `vite.config.ts` (keep existing plugins/config):

```ts
/// <reference types="vitest/config" />
// ...existing imports & config...
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
  },
```

- [ ] **Step 5: Add a smoke test to prove the harness runs**

Create `src/lib/marketplace/harness.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('test harness', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run and verify PASS**

Run: `npm test`
Expected: PASS, 1 test passed.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.setup.ts vite.config.ts src/lib/marketplace/harness.test.ts
git commit -m "test: add Vitest + Testing Library frontend harness"
```

---

## Task 2: Mock buyer data + types

**Files:**
- Create: `src/lib/marketplace/mockBuyer.ts`
- Create: `src/lib/marketplace/mockBuyer.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/marketplace/mockBuyer.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  resources, categories, popularSubjects, orders, library,
  wishlistSeed, subscriptions, payments, wallet, conversations, findResource,
} from './mockBuyer';

describe('mockBuyer data', () => {
  it('has a catalog with unique ids', () => {
    expect(resources.length).toBeGreaterThanOrEqual(8);
    const ids = new Set(resources.map(r => r.id));
    expect(ids.size).toBe(resources.length);
  });

  it('library items reference real resources', () => {
    for (const item of library) {
      expect(findResource(item.resourceId)).toBeDefined();
    }
  });

  it('exposes storefront metadata collections', () => {
    expect(categories.length).toBeGreaterThan(0);
    expect(popularSubjects.length).toBeGreaterThan(0);
    expect(orders.length).toBeGreaterThan(0);
    expect(subscriptions.plans.length).toBeGreaterThan(0);
    expect(payments.transactions.length).toBeGreaterThan(0);
    expect(wallet.balanceKsh).toBeGreaterThanOrEqual(0);
    expect(conversations.length).toBeGreaterThan(0);
    expect(wishlistSeed.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/marketplace/mockBuyer.test.ts`
Expected: FAIL — cannot find module `./mockBuyer`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/marketplace/mockBuyer.ts`:

```ts
// Buyer-side marketplace mock data. Shapes mirror the intended Firestore schema so
// later plans (storefront/library/orders/payments) can swap these for live data with
// no component changes. Same convention as mockDashboard.ts.

export type ResourceKind = 'Notes' | 'Revision' | 'Past Papers' | 'Live Class' | 'AI Resource';

export interface Resource {
  id: string;
  title: string;
  subject: string;          // e.g. "Biology"
  kind: ResourceKind;
  sellerName: string;
  sellerType: 'Teacher' | 'Tutor' | 'School' | 'AI';
  accent: string;           // tailwind gradient for the cover, e.g. "from-[#14532d] to-[#22a558]"
  rating: number;
  reviews: number;
  priceKsh: number;
  cta: 'Buy Now' | 'Book Now';
  latest?: boolean;
  featured?: boolean;
}

export const resources: Resource[] = [
  { id: 'r1', title: 'KCSE Biology 2026 Revision', subject: 'Biology', kind: 'Revision', sellerName: 'Teacher Jane', sellerType: 'Teacher', accent: 'from-[#14532d] to-[#22a558]', rating: 5.0, reviews: 120, priceKsh: 250, cta: 'Buy Now', featured: true },
  { id: 'r2', title: 'Form 2 Mathematics Notes', subject: 'Mathematics', kind: 'Notes', sellerName: 'Teacher Peter', sellerType: 'Teacher', accent: 'from-[#0f766e] to-[#14b8a6]', rating: 5.0, reviews: 98, priceKsh: 150, cta: 'Buy Now', featured: true },
  { id: 'r3', title: 'Physics Live Classes (Weekly)', subject: 'Physics', kind: 'Live Class', sellerName: 'Tutor Brian', sellerType: 'Tutor', accent: 'from-[#1e3a8a] to-[#3b82f6]', rating: 5.0, reviews: 75, priceKsh: 500, cta: 'Book Now', featured: true },
  { id: 'r4', title: 'AI Generated Chemistry Notes', subject: 'Chemistry', kind: 'AI Resource', sellerName: 'HighScores AI', sellerType: 'AI', accent: 'from-[#6b21a8] to-[#a855f7]', rating: 4.9, reviews: 60, priceKsh: 200, cta: 'Buy Now', featured: true },
  { id: 'r5', title: 'English Essays Bundle', subject: 'English', kind: 'Notes', sellerName: 'Teacher Aisha', sellerType: 'Teacher', accent: 'from-[#9a3412] to-[#f97316]', rating: 4.8, reviews: 54, priceKsh: 100, cta: 'Buy Now', latest: true },
  { id: 'r6', title: 'KCSE History Past Papers 2020-2025', subject: 'History', kind: 'Past Papers', sellerName: 'Elite School', sellerType: 'School', accent: 'from-[#334155] to-[#64748b]', rating: 4.9, reviews: 88, priceKsh: 180, cta: 'Buy Now', latest: true },
  { id: 'r7', title: 'Geography Map Work Masterclass', subject: 'Geography', kind: 'Live Class', sellerName: 'Tutor Njeri', sellerType: 'Tutor', accent: 'from-[#047857] to-[#34d399]', rating: 4.7, reviews: 41, priceKsh: 350, cta: 'Book Now', latest: true },
  { id: 'r8', title: 'CRE Form 3 Complete Notes', subject: 'CRE', kind: 'Notes', sellerName: 'Teacher Otieno', sellerType: 'Teacher', accent: 'from-[#7c2d12] to-[#ea580c]', rating: 4.8, reviews: 37, priceKsh: 120, cta: 'Buy Now' },
  { id: 'r9', title: 'Business Studies Revision Kit', subject: 'Business', kind: 'Revision', sellerName: 'Teacher Wanjiru', sellerType: 'Teacher', accent: 'from-[#164e63] to-[#06b6d4]', rating: 4.9, reviews: 66, priceKsh: 220, cta: 'Buy Now' },
  { id: 'r10', title: 'Kiswahili Insha na Ufupisho', subject: 'Kiswahili', kind: 'Notes', sellerName: 'Mwalimu Hassan', sellerType: 'Teacher', accent: 'from-[#3f6212] to-[#84cc16]', rating: 4.6, reviews: 29, priceKsh: 90, cta: 'Buy Now' },
];

export interface Category { key: string; label: string; sub: string; }
export const categories: Category[] = [
  { key: 'teachers', label: 'Teachers', sub: 'Notes, Exams & Lesson Plans' },
  { key: 'tutors', label: 'Tutors', sub: 'Courses & Live Classes' },
  { key: 'schools', label: 'Schools', sub: 'Uniforms & Admission' },
  { key: 'students', label: 'Students', sub: 'Study Materials & Revision' },
  { key: 'ai', label: 'AI Resources', sub: 'AI Books & Quizzes' },
  { key: 'all', label: 'All Subjects', sub: 'Explore All Subjects' },
];

export interface PopularSubject { subject: string; count: string; }
export const popularSubjects: PopularSubject[] = [
  { subject: 'Mathematics', count: '2,450 resources' },
  { subject: 'English', count: '1,890 resources' },
  { subject: 'Biology', count: '1,560 resources' },
  { subject: 'Chemistry', count: '1,230 resources' },
  { subject: 'Physics', count: '1,100 resources' },
  { subject: 'History', count: '980 resources' },
];

export const stats = [
  { value: '10K+', label: 'Resources' },
  { value: '5K+', label: 'Teachers' },
  { value: '50K+', label: 'Students' },
  { value: '100+', label: 'Schools' },
];

export interface Order {
  id: string;
  resourceId: string;
  title: string;
  date: string;
  amountKsh: number;
  status: 'Completed' | 'Pending' | 'Refunded';
}
export const orders: Order[] = [
  { id: 'o1', resourceId: 'r1', title: 'KCSE Biology 2026 Revision', date: 'Aug 5, 2026', amountKsh: 250, status: 'Completed' },
  { id: 'o2', resourceId: 'r2', title: 'Form 2 Mathematics Notes', date: 'Aug 3, 2026', amountKsh: 150, status: 'Completed' },
  { id: 'o3', resourceId: 'r4', title: 'AI Generated Chemistry Notes', date: 'Aug 1, 2026', amountKsh: 200, status: 'Pending' },
];

export interface LibraryItem { resourceId: string; purchasedOn: string; progressPct: number; }
export const library: LibraryItem[] = [
  { resourceId: 'r1', purchasedOn: 'Aug 5, 2026', progressPct: 40 },
  { resourceId: 'r2', purchasedOn: 'Aug 3, 2026', progressPct: 100 },
];

export const wishlistSeed: string[] = ['r3', 'r6'];

export interface SubPlan { key: string; name: string; priceKsh: number; period: string; perks: string[]; current?: boolean; }
export const subscriptions = {
  plans: [
    { key: 'free', name: 'Free', priceKsh: 0, period: 'forever', perks: ['Browse marketplace', 'Buy single resources', 'Community access'], current: true },
    { key: 'plus', name: 'Student Plus', priceKsh: 499, period: 'month', perks: ['10 resources / month', 'AI summaries & quizzes', 'Priority support'] },
    { key: 'family', name: 'Family', priceKsh: 999, period: 'month', perks: ['Up to 4 learners', 'Unlimited AI tools', 'Shared library'] },
  ] as SubPlan[],
};

export interface Transaction { id: string; label: string; date: string; amountKsh: number; direction: 'in' | 'out'; }
export const payments = {
  methods: [{ key: 'mpesa', label: 'M-Pesa', detail: '•••• 0712', primary: true }],
  transactions: [
    { id: 't1', label: 'Top-up via M-Pesa', date: 'Aug 5, 2026', amountKsh: 1000, direction: 'in' },
    { id: 't2', label: 'KCSE Biology 2026 Revision', date: 'Aug 5, 2026', amountKsh: 250, direction: 'out' },
    { id: 't3', label: 'Form 2 Mathematics Notes', date: 'Aug 3, 2026', amountKsh: 150, direction: 'out' },
  ] as Transaction[],
};

export const wallet = { balanceKsh: 1250 };

export interface Conversation { id: string; from: string; role: string; preview: string; when: string; unread: boolean; messages: { me: boolean; text: string }[]; }
export const conversations: Conversation[] = [
  { id: 'c1', from: 'Teacher Jane', role: 'Teacher', preview: 'The revision notes are updated for 2026…', when: '10:24 AM', unread: true,
    messages: [ { me: false, text: 'Hi! Thanks for buying the Biology revision.' }, { me: false, text: 'The revision notes are updated for 2026.' }, { me: true, text: 'Great, thank you!' } ] },
  { id: 'c2', from: 'Tutor Brian', role: 'Tutor', preview: 'Live class starts Saturday 10am.', when: 'Yesterday', unread: false,
    messages: [ { me: false, text: 'Live class starts Saturday 10am.' } ] },
];

export function findResource(id: string): Resource | undefined {
  return resources.find(r => r.id === id);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/marketplace/mockBuyer.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/marketplace/mockBuyer.ts src/lib/marketplace/mockBuyer.test.ts
git commit -m "feat(market): add buyer marketplace mock data + types"
```

---

## Task 3: useMarketStore (cart + wishlist)

**Files:**
- Create: `src/store/useMarketStore.ts`
- Create: `src/store/useMarketStore.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/store/useMarketStore.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useMarketStore } from './useMarketStore';

const reset = () => useMarketStore.setState({ cart: [], wishlist: [] });

describe('useMarketStore', () => {
  beforeEach(reset);

  it('adds to cart without duplicates', () => {
    const s = useMarketStore.getState();
    s.addToCart('r1');
    s.addToCart('r1');
    expect(useMarketStore.getState().cart).toEqual(['r1']);
  });

  it('removes from cart', () => {
    const s = useMarketStore.getState();
    s.addToCart('r1');
    s.removeFromCart('r1');
    expect(useMarketStore.getState().cart).toEqual([]);
  });

  it('toggles wishlist membership', () => {
    const s = useMarketStore.getState();
    s.toggleWishlist('r2');
    expect(useMarketStore.getState().wishlist).toContain('r2');
    s.toggleWishlist('r2');
    expect(useMarketStore.getState().wishlist).not.toContain('r2');
  });

  it('reports membership + counts', () => {
    const s = useMarketStore.getState();
    s.addToCart('r1');
    s.toggleWishlist('r2');
    const st = useMarketStore.getState();
    expect(st.inCart('r1')).toBe(true);
    expect(st.inWishlist('r2')).toBe(true);
    expect(st.cart.length).toBe(1);
    expect(st.wishlist.length).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/store/useMarketStore.test.ts`
Expected: FAIL — cannot find module `./useMarketStore`.

- [ ] **Step 3: Write the implementation**

Create `src/store/useMarketStore.ts`:

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistSeed } from '../lib/marketplace/mockBuyer';

interface MarketState {
  cart: string[];
  wishlist: string[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  clearCart: () => void;
  inCart: (id: string) => boolean;
  inWishlist: (id: string) => boolean;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [...wishlistSeed],
      addToCart: (id) => set(s => (s.cart.includes(id) ? s : { cart: [...s.cart, id] })),
      removeFromCart: (id) => set(s => ({ cart: s.cart.filter(x => x !== id) })),
      toggleWishlist: (id) => set(s => ({
        wishlist: s.wishlist.includes(id) ? s.wishlist.filter(x => x !== id) : [...s.wishlist, id],
      })),
      clearCart: () => set({ cart: [] }),
      inCart: (id) => get().cart.includes(id),
      inWishlist: (id) => get().wishlist.includes(id),
    }),
    { name: 'market-store' },
  ),
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/store/useMarketStore.test.ts`
Expected: PASS, 4 tests. (The test's `reset` clears state, so the `wishlistSeed` default does not affect assertions.)

- [ ] **Step 5: Commit**

```bash
git add src/store/useMarketStore.ts src/store/useMarketStore.test.ts
git commit -m "feat(market): add cart + wishlist store"
```

---

## Task 4: Shared presentational components (ResourceCard, SectionHeader)

**Files:**
- Create: `src/components/marketplace/buyer/components/SectionHeader.tsx`
- Create: `src/components/marketplace/buyer/components/ResourceCard.tsx`
- Create: `src/components/marketplace/buyer/components/ResourceCard.test.tsx`

- [ ] **Step 1: Create SectionHeader**

Create `src/components/marketplace/buyer/components/SectionHeader.tsx`:

```tsx
interface Props { title: string; onViewAll?: () => void; right?: React.ReactNode; }

export default function SectionHeader({ title, onViewAll, right }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-extrabold text-[#1f2937]">{title}</h2>
      {right ?? (onViewAll && (
        <button onClick={onViewAll} className="text-sm font-bold text-[#16a34a] hover:underline">
          View all ›
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write the failing test for ResourceCard**

Create `src/components/marketplace/buyer/components/ResourceCard.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResourceCard from './ResourceCard';
import { resources } from '../../../../lib/marketplace/mockBuyer';

describe('ResourceCard', () => {
  it('shows title, price and CTA', () => {
    render(<ResourceCard resource={resources[0]} />);
    expect(screen.getByText(resources[0].title)).toBeInTheDocument();
    expect(screen.getByText(/KSh 250/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: resources[0].cta })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/components/marketplace/buyer/components/ResourceCard.test.tsx`
Expected: FAIL — cannot find module `./ResourceCard`.

- [ ] **Step 4: Create ResourceCard**

Create `src/components/marketplace/buyer/components/ResourceCard.tsx`:

```tsx
import { Heart, Star } from 'lucide-react';
import type { Resource } from '../../../../lib/marketplace/mockBuyer';
import { useMarketStore } from '../../../../store/useMarketStore';

interface Props { resource: Resource; }

export default function ResourceCard({ resource }: Props) {
  const { inWishlist, toggleWishlist, inCart, addToCart } = useMarketStore();
  const wished = inWishlist(resource.id);
  const carted = inCart(resource.id);

  return (
    <div className="bg-white rounded-2xl border border-[#e8ece8] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className={`relative h-32 bg-gradient-to-br ${resource.accent} grid place-items-center`}>
        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide text-white/90 bg-black/25 rounded px-2 py-0.5">
          {resource.sellerType}
        </span>
        <button
          onClick={() => toggleWishlist(resource.id)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 w-8 h-8 grid place-items-center rounded-full bg-white/90 hover:bg-white"
        >
          <Heart size={16} className={wished ? 'fill-[#ef4444] text-[#ef4444]' : 'text-[#4b5563]'} />
        </button>
        <span className="text-white font-extrabold text-sm uppercase tracking-wide px-3 text-center">{resource.subject}</span>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-sm text-[#1f2937] leading-snug line-clamp-2">{resource.title}</h3>
        <p className="text-xs text-[#8a938a]">{resource.sellerName}</p>
        <div className="flex items-center gap-1 text-xs text-[#4b5563]">
          <Star size={13} className="fill-[#f59e0b] text-[#f59e0b]" />
          <span className="font-bold">{resource.rating.toFixed(1)}</span>
          <span className="text-[#9aa39a]">({resource.reviews})</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-extrabold text-[#15803d]">KSh {resource.priceKsh}</span>
        </div>
        <button
          onClick={() => addToCart(resource.id)}
          className={`w-full rounded-lg py-2 text-sm font-bold transition ${
            carted ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#16a34a] hover:bg-[#15913f] text-white'
          }`}
        >
          {carted ? 'In Cart ✓' : resource.cta}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/marketplace/buyer/components/ResourceCard.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/marketplace/buyer/components
git commit -m "feat(market): add ResourceCard + SectionHeader"
```

---

## Task 5: Buyer shell — MarketLayout

**Files:**
- Create: `src/components/marketplace/buyer/MarketLayout.tsx`
- Create: `src/components/marketplace/buyer/MarketLayout.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/marketplace/buyer/MarketLayout.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MarketLayout from './MarketLayout';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<MarketLayout />}>
          <Route path="/market" element={<div>HOME PAGE</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('MarketLayout', () => {
  it('renders all 8 sidebar items and the outlet', () => {
    renderAt('/market');
    for (const label of ['Home', 'Marketplace', 'My Library', 'Messages', 'Wishlist', 'Orders', 'Subscriptions', 'Payments']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByText('HOME PAGE')).toBeInTheDocument();
    expect(screen.getByText('Become a Seller')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/marketplace/buyer/MarketLayout.test.tsx`
Expected: FAIL — cannot find module `./MarketLayout`.

- [ ] **Step 3: Create MarketLayout**

Create `src/components/marketplace/buyer/MarketLayout.tsx`:

```tsx
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Home, Store, Library, MessageSquare, Heart, ShoppingBag,
  CreditCard, Wallet, Search, Bell, ShoppingCart, Menu, X, Store as SellerIcon,
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useMarketStore } from '../../../store/useMarketStore';
import { wallet } from '../../../lib/marketplace/mockBuyer';

const NAV = [
  { label: 'Home', icon: Home, to: '/market', end: true },
  { label: 'Marketplace', icon: Store, to: '/market/browse' },
  { label: 'My Library', icon: Library, to: '/market/library' },
  { label: 'Messages', icon: MessageSquare, to: '/market/messages', badge: 2 },
  { label: 'Wishlist', icon: Heart, to: '/market/wishlist' },
  { label: 'Orders', icon: ShoppingBag, to: '/market/orders' },
  { label: 'Subscriptions', icon: CreditCard, to: '/market/subscriptions' },
  { label: 'Payments', icon: Wallet, to: '/market/payments' },
];

export default function MarketLayout() {
  const { user } = useStore();
  const { cart, wishlist } = useMarketStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const profile = user?.profiles.find(p => p.id === user.activeProfileId) ?? user?.profiles[0];
  const itemBase = 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors';

  const sidebar = (
    <>
      <div className="flex items-center gap-2 px-5 h-16 border-b border-[#eef1ee]">
        <GraduationCap className="text-[#16a34a]" size={26} />
        <span className="font-extrabold text-lg tracking-tight">
          <span className="text-[#16a34a]">High</span><span className="text-[#1f2937]">Scores</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map(({ label, icon: Icon, to, end, badge }) => (
          <NavLink key={label} to={to} end={end} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${itemBase} ${isActive ? 'bg-[#16a34a] text-white shadow-sm shadow-green-600/20' : 'text-[#4b5563] hover:bg-[#eef7ef]'}`
            }>
            <Icon size={18} /> <span>{label}</span>
            {label === 'Wishlist' && wishlist.length > 0 && (
              <span className="ml-auto text-[11px] font-bold text-[#15803d] bg-[#dcfce7] rounded-full px-2 py-0.5">{wishlist.length}</span>
            )}
            {badge && <span className="ml-auto text-[11px] font-bold text-white bg-[#16a34a] rounded-full w-5 h-5 grid place-items-center">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <div className="rounded-2xl bg-gradient-to-b from-[#15803d] to-[#12673a] text-white p-4">
          <SellerIcon size={22} className="opacity-90" />
          <div className="font-bold mt-2 leading-tight">Sell on HighScores</div>
          <p className="text-[12px] text-white/80 mt-1">Earn money by sharing your knowledge.</p>
          <button onClick={() => navigate('/seller')}
            className="mt-3 w-full bg-white text-[#15803d] text-sm font-bold rounded-lg py-2 hover:bg-white/90 transition">
            Become a Seller
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f6f8f6] text-[#1f2937] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-[#e8ece8] h-screen sticky top-0">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 flex flex-col lg:hidden">{sidebar}</aside>
        </>
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[#e8ece8] h-16 flex items-center gap-3 px-4 md:px-6">
          <button className="lg:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-[#eef7ef]" onClick={() => setOpen(v => !v)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1 max-w-xl relative hidden sm:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa39a]" />
            <input placeholder="Search notes, exams, tutors, schools…"
              className="w-full bg-[#f2f5f2] rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#16a34a]/30" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-[#eef7ef]" aria-label="Cart">
              <ShoppingCart size={19} className="text-[#4b5563]" />
              {cart.length > 0 && <span className="absolute top-1 right-1 text-[10px] font-bold text-white bg-[#16a34a] rounded-full w-4 h-4 grid place-items-center">{cart.length}</span>}
            </button>
            <button className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-[#eef7ef]" aria-label="Notifications">
              <Bell size={19} className="text-[#4b5563]" />
              <span className="absolute top-1.5 right-1.5 text-[10px] font-bold text-white bg-[#16a34a] rounded-full w-4 h-4 grid place-items-center">3</span>
            </button>
            <div className="flex items-center gap-2 pl-1">
              <span className="w-9 h-9 rounded-full bg-[#16a34a] text-white grid place-items-center text-sm font-bold">
                {profile?.username?.charAt(0).toUpperCase() ?? 'S'}
              </span>
              <span className="hidden md:block text-left leading-tight">
                <span className="block text-sm font-bold text-[#1f2937]">{profile?.username ?? 'Student'}</span>
                <span className="block text-[11px] text-[#8a938a]">Grade {profile?.grade ?? '—'}</span>
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/marketplace/buyer/MarketLayout.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketplace/buyer/MarketLayout.tsx src/components/marketplace/buyer/MarketLayout.test.tsx
git commit -m "feat(market): add buyer MarketLayout shell"
```

---

## Task 6: Nav swap + route wiring + hide chrome

**Files:**
- Modify: `src/components/Navbar.tsx` (desktop link ~81-83, drawer link ~157-159)
- Modify: `src/App.tsx` (imports, `isMarket`, hide-chrome, route group)
- Create: `src/components/Navbar.test.tsx`

> Note: pages referenced by the routes are created in Tasks 7–9. To keep this task's build green, create the eight page files as one-line stubs first (Step 3), then flesh them out in later tasks.

- [ ] **Step 1: Write the failing nav test**

Create `src/components/Navbar.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('links to the marketplace and not the seller page', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    const market = screen.getByRole('link', { name: /Market/i });
    expect(market).toHaveAttribute('href', '/market');
    expect(screen.queryByRole('link', { name: /^Sell$/i })).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Navbar.test.tsx`
Expected: FAIL — current Navbar has a "Sell" link to `/seller`, no "Market" link.

- [ ] **Step 3: Create page stubs so routes compile**

Create each of these files with a minimal default export (they are fully implemented in later tasks):

`src/components/marketplace/buyer/pages/MarketHome.tsx`,
`MarketBrowse.tsx`, `MyLibrary.tsx`, `Wishlist.tsx`, `Orders.tsx`,
`Subscriptions.tsx`, `Payments.tsx`, `Messages.tsx` — each containing:

```tsx
export default function Page() { return <div />; }
```

(Use the matching component name per file, e.g. `export default function MarketHome() { return <div />; }`.)

- [ ] **Step 4: Update Navbar desktop link**

In `src/components/Navbar.tsx`, replace the desktop Sell link:

```tsx
<Link to="/seller" className={`nb-link ${isActive('/seller') ? 'active' : ''}`}>
  <Store size={17} /> Sell
</Link>
```

with:

```tsx
<Link to="/market" className={`nb-link ${isActive('/market') ? 'active' : ''}`}>
  <Store size={17} /> Market
</Link>
```

- [ ] **Step 5: Update Navbar drawer link**

Replace the drawer Sell link:

```tsx
<Link to="/seller" className={`nb-drawer-item ${isActive('/seller') ? 'active' : ''}`}>
  <Store size={20} /> Sell on Bongo
</Link>
```

with:

```tsx
<Link to="/market" className={`nb-drawer-item ${isActive('/market') ? 'active' : ''}`}>
  <Store size={20} /> Market
</Link>
```

- [ ] **Step 6: Wire routes + hide chrome in App.tsx**

In `src/App.tsx`, add imports near the other marketplace imports:

```tsx
import MarketLayout from './components/marketplace/buyer/MarketLayout';
import MarketHome from './components/marketplace/buyer/pages/MarketHome';
import MarketBrowse from './components/marketplace/buyer/pages/MarketBrowse';
import MyLibrary from './components/marketplace/buyer/pages/MyLibrary';
import Wishlist from './components/marketplace/buyer/pages/Wishlist';
import Orders from './components/marketplace/buyer/pages/Orders';
import Subscriptions from './components/marketplace/buyer/pages/Subscriptions';
import Payments from './components/marketplace/buyer/pages/Payments';
import Messages from './components/marketplace/buyer/pages/Messages';
```

Add the flag next to `isSeller`:

```tsx
const isMarket = location.pathname.startsWith('/market');
```

Extend the footer-hide condition (add `|| isMarket` alongside `isSeller`):

```tsx
    isSeller ||
    isMarket ||
```

Change the Navbar render guard from `{!isAdmin && !isSeller && <Navbar />}` to:

```tsx
{!isAdmin && !isSeller && !isMarket && <Navbar />}
```

Add the market route group (place it just after the existing `/seller` routes, still inside `<Routes>`):

```tsx
<Route element={<ProtectedRoute><MarketLayout /></ProtectedRoute>}>
  <Route path="/market"               element={<MarketHome />} />
  <Route path="/market/browse"        element={<MarketBrowse />} />
  <Route path="/market/library"       element={<MyLibrary />} />
  <Route path="/market/messages"      element={<Messages />} />
  <Route path="/market/wishlist"      element={<Wishlist />} />
  <Route path="/market/orders"        element={<Orders />} />
  <Route path="/market/subscriptions" element={<Subscriptions />} />
  <Route path="/market/payments"      element={<Payments />} />
</Route>
```

- [ ] **Step 7: Run nav test + typecheck**

Run: `npx vitest run src/components/Navbar.test.tsx && npx tsc -b`
Expected: test PASS; tsc clean.

- [ ] **Step 8: Commit**

```bash
git add src/components/Navbar.tsx src/components/Navbar.test.tsx src/App.tsx src/components/marketplace/buyer/pages
git commit -m "feat(market): swap Sell→Market nav, wire /market routes"
```

---

## Task 7: MarketHome page

**Files:**
- Modify (replace stub): `src/components/marketplace/buyer/pages/MarketHome.tsx`
- Create: `src/components/marketplace/buyer/pages/MarketHome.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/marketplace/buyer/pages/MarketHome.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MarketHome from './MarketHome';

describe('MarketHome', () => {
  it('renders hero, stats and a resource', () => {
    render(<MemoryRouter><MarketHome /></MemoryRouter>);
    expect(screen.getByText(/Learn\. Teach\. Earn\./i)).toBeInTheDocument();
    expect(screen.getByText('Browse by Category')).toBeInTheDocument();
    expect(screen.getByText('KCSE Biology 2026 Revision')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/marketplace/buyer/pages/MarketHome.test.tsx`
Expected: FAIL — stub renders empty `<div/>`.

- [ ] **Step 3: Implement MarketHome**

Replace `src/components/marketplace/buyer/pages/MarketHome.tsx`:

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Wallet, Store } from 'lucide-react';
import { resources, categories, popularSubjects, stats, wallet } from '../../../../lib/marketplace/mockBuyer';
import ResourceCard from '../components/ResourceCard';
import SectionHeader from '../components/SectionHeader';

type Tab = 'Popular' | 'Latest' | 'Top Rated';

export default function MarketHome() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('Popular');

  const shown = [...resources]
    .filter(r => (tab === 'Latest' ? r.latest : true))
    .sort((a, b) => (tab === 'Top Rated' ? b.rating - a.rating : 0))
    .slice(0, 8);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-8 min-w-0">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-[#14532d] to-[#22a558] text-white p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-extrabold">Learn. Teach. Earn.</h1>
          <p className="text-white/85 mt-1">The leading education marketplace in Kenya.</p>
          <div className="mt-5 flex gap-2 max-w-xl">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa39a]" />
              <input placeholder="What are you looking for today?"
                className="w-full rounded-full pl-10 pr-4 py-3 text-sm text-[#1f2937] outline-none" />
            </div>
            <button onClick={() => navigate('/market/browse')}
              className="bg-[#0f3d21] hover:bg-[#0c3319] rounded-full px-5 text-sm font-bold">Search</button>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl px-3 py-2">
                <div className="font-extrabold">{s.value}</div>
                <div className="text-[12px] text-white/80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <section>
          <SectionHeader title="Browse by Category" onViewAll={() => navigate('/market/browse')} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map(c => (
              <button key={c.key} onClick={() => navigate('/market/browse')}
                className="text-left bg-white rounded-2xl border border-[#e8ece8] p-4 hover:shadow-md transition">
                <div className="font-bold text-sm text-[#1f2937]">{c.label}</div>
                <div className="text-xs text-[#8a938a] mt-0.5">{c.sub}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Top resources */}
        <section>
          <SectionHeader title="Top Resources" right={
            <div className="flex gap-1 bg-[#eef1ee] rounded-full p-1">
              {(['Popular', 'Latest', 'Top Rated'] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`text-xs font-bold rounded-full px-3 py-1 ${tab === t ? 'bg-white text-[#15803d] shadow-sm' : 'text-[#6b7280]'}`}>{t}</button>
              ))}
            </div>
          } />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shown.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>
        </section>

        {/* Popular subjects */}
        <section>
          <SectionHeader title="Popular Subjects" onViewAll={() => navigate('/market/browse')} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularSubjects.map(s => (
              <div key={s.subject} className="bg-white rounded-2xl border border-[#e8ece8] p-4">
                <div className="font-bold text-sm text-[#1f2937]">{s.subject}</div>
                <div className="text-xs text-[#8a938a] mt-0.5">{s.count}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right rail */}
      <aside className="space-y-4">
        <div className="bg-white rounded-2xl border border-[#e8ece8] p-4">
          <div className="flex items-center gap-2 font-bold text-[#1f2937]"><BookOpen size={18} className="text-[#16a34a]" /> My Learning</div>
          <ul className="mt-3 space-y-2 text-sm text-[#4b5563]">
            <li className="flex justify-between"><span>My Library</span><span className="text-[#8a938a]">2 items</span></li>
            <li className="flex justify-between"><span>Wishlist</span><span className="text-[#8a938a]">2 items</span></li>
            <li className="flex justify-between"><span>Recent Orders</span><span className="text-[#8a938a]">3 orders</span></li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8ece8] p-4">
          <div className="flex items-center gap-2 text-[#8a938a] text-sm"><Wallet size={16} /> Wallet Balance</div>
          <div className="text-2xl font-extrabold text-[#1f2937] mt-1">KSh {wallet.balanceKsh.toLocaleString()}</div>
          <button onClick={() => navigate('/market/payments')}
            className="mt-3 w-full bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-lg py-2">Top up Wallet</button>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-[#15803d] to-[#12673a] text-white p-4">
          <Store size={20} className="opacity-90" />
          <div className="font-bold mt-2">Become a Seller</div>
          <p className="text-[12px] text-white/80 mt-1">Turn your knowledge into income. Set your price, reach students.</p>
          <button onClick={() => navigate('/seller')}
            className="mt-3 w-full bg-white text-[#15803d] text-sm font-bold rounded-lg py-2">Start Selling</button>
        </div>
      </aside>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/marketplace/buyer/pages/MarketHome.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketplace/buyer/pages/MarketHome.tsx src/components/marketplace/buyer/pages/MarketHome.test.tsx
git commit -m "feat(market): implement MarketHome page"
```

---

## Task 8: MarketBrowse page + seller reuse

**Files:**
- Modify (replace stub): `src/components/marketplace/buyer/pages/MarketBrowse.tsx`
- Create: `src/components/marketplace/buyer/pages/MarketBrowse.test.tsx`
- Modify: `src/components/marketplace/SellerLayout.tsx` (NAV "Marketplace" entry, ~line 15)
- Modify: `src/App.tsx` (add `/seller/marketplace` route)

- [ ] **Step 1: Write the failing test (standalone, shell-agnostic)**

Create `src/components/marketplace/buyer/pages/MarketBrowse.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MarketBrowse from './MarketBrowse';

describe('MarketBrowse', () => {
  it('renders the storefront grid without any layout wrapper', () => {
    render(<MemoryRouter><MarketBrowse /></MemoryRouter>);
    expect(screen.getByText('KCSE Biology 2026 Revision')).toBeInTheDocument();
    expect(screen.getByText('All Subjects')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/marketplace/buyer/pages/MarketBrowse.test.tsx`
Expected: FAIL — stub renders empty `<div/>`.

- [ ] **Step 3: Implement MarketBrowse**

Replace `src/components/marketplace/buyer/pages/MarketBrowse.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { resources } from '../../../../lib/marketplace/mockBuyer';
import ResourceCard from '../components/ResourceCard';

const SUBJECTS = ['All Subjects', ...Array.from(new Set(resources.map(r => r.subject)))];
type Sort = 'Top Rated' | 'Price ↑' | 'Price ↓';

export default function MarketBrowse() {
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [sort, setSort] = useState<Sort>('Top Rated');

  const list = useMemo(() => {
    let out = resources.filter(r =>
      (subject === 'All Subjects' || r.subject === subject) &&
      (q === '' || r.title.toLowerCase().includes(q.toLowerCase()) || r.sellerName.toLowerCase().includes(q.toLowerCase())),
    );
    out = [...out].sort((a, b) =>
      sort === 'Price ↑' ? a.priceKsh - b.priceKsh :
      sort === 'Price ↓' ? b.priceKsh - a.priceKsh :
      b.rating - a.rating,
    );
    return out;
  }, [q, subject, sort]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-[#1f2937]">Marketplace</h1>
        <p className="text-sm text-[#8a938a]">Browse resources from teachers, tutors and schools.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa39a]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search resources…"
            className="w-full bg-white border border-[#e8ece8] rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#16a34a]/30" />
        </div>
        <select value={subject} onChange={e => setSubject(e.target.value)}
          className="bg-white border border-[#e8ece8] rounded-full px-4 py-2.5 text-sm outline-none">
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value as Sort)}
          className="bg-white border border-[#e8ece8] rounded-full px-4 py-2.5 text-sm outline-none">
          {(['Top Rated', 'Price ↑', 'Price ↓'] as Sort[]).map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <div className="text-center text-[#8a938a] py-16">No resources match your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map(r => <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/marketplace/buyer/pages/MarketBrowse.test.tsx`
Expected: PASS.

- [ ] **Step 5: Make the seller "Marketplace" nav real**

In `src/components/marketplace/SellerLayout.tsx`, change the NAV entry:

```tsx
{ label: 'Marketplace', icon: Store },
```

to:

```tsx
{ label: 'Marketplace', icon: Store, to: '/seller/marketplace', real: true },
```

- [ ] **Step 6: Add the seller route**

In `src/App.tsx`, add `MarketBrowse` inside the existing seller protected group so it renders in seller chrome:

```tsx
<Route element={<SellerProtectedRoute><SellerLayout /></SellerProtectedRoute>}>
  <Route path="/seller/dashboard" element={<SellerDashboard />} />
  <Route path="/seller/marketplace" element={<MarketBrowse />} />
</Route>
```

(`MarketBrowse` is already imported from Task 6.)

- [ ] **Step 7: Typecheck**

Run: `npx tsc -b`
Expected: clean.

- [ ] **Step 8: Commit**

```bash
git add src/components/marketplace/buyer/pages/MarketBrowse.tsx src/components/marketplace/buyer/pages/MarketBrowse.test.tsx src/components/marketplace/SellerLayout.tsx src/App.tsx
git commit -m "feat(market): MarketBrowse storefront + reuse in seller portal"
```

---

## Task 9: MyLibrary + Wishlist pages

**Files:**
- Modify (replace stubs): `MyLibrary.tsx`, `Wishlist.tsx`
- Create: `MyLibrary.test.tsx`, `Wishlist.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/marketplace/buyer/pages/MyLibrary.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyLibrary from './MyLibrary';

describe('MyLibrary', () => {
  it('lists purchased resources', () => {
    render(<MyLibrary />);
    expect(screen.getByText('My Library')).toBeInTheDocument();
    expect(screen.getByText('Form 2 Mathematics Notes')).toBeInTheDocument();
  });
});
```

Create `src/components/marketplace/buyer/pages/Wishlist.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Wishlist from './Wishlist';
import { useMarketStore } from '../../../../store/useMarketStore';

describe('Wishlist', () => {
  beforeEach(() => useMarketStore.setState({ cart: [], wishlist: ['r3'] }));

  it('shows wishlisted resources', () => {
    render(<MemoryRouter><Wishlist /></MemoryRouter>);
    expect(screen.getByText('Physics Live Classes (Weekly)')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/marketplace/buyer/pages/MyLibrary.test.tsx src/components/marketplace/buyer/pages/Wishlist.test.tsx`
Expected: FAIL — stubs render empty.

- [ ] **Step 3: Implement MyLibrary**

Replace `src/components/marketplace/buyer/pages/MyLibrary.tsx`:

```tsx
import { Download, PlayCircle } from 'lucide-react';
import { library, findResource } from '../../../../lib/marketplace/mockBuyer';

export default function MyLibrary() {
  const items = library.map(l => ({ ...l, res: findResource(l.resourceId)! })).filter(i => i.res);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-[#1f2937]">My Library</h1>
        <p className="text-sm text-[#8a938a]">Resources you have purchased.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-[#8a938a] py-16">Your library is empty — browse the marketplace to get started.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(({ res, purchasedOn, progressPct }) => (
            <div key={res.id} className="bg-white rounded-2xl border border-[#e8ece8] overflow-hidden">
              <div className={`h-24 bg-gradient-to-br ${res.accent} grid place-items-center text-white font-extrabold text-sm uppercase`}>{res.subject}</div>
              <div className="p-3 space-y-2">
                <h3 className="font-bold text-sm text-[#1f2937] line-clamp-2">{res.title}</h3>
                <p className="text-xs text-[#8a938a]">Purchased {purchasedOn}</p>
                <div className="h-1.5 bg-[#eef1ee] rounded-full overflow-hidden">
                  <div className="h-full bg-[#16a34a]" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="flex gap-2 pt-1">
                  <button className="flex-1 flex items-center justify-center gap-1 bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-lg py-2">
                    <PlayCircle size={16} /> Open
                  </button>
                  <button className="w-10 grid place-items-center border border-[#e8ece8] rounded-lg hover:bg-[#eef7ef]" aria-label="Download">
                    <Download size={16} className="text-[#4b5563]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Implement Wishlist**

Replace `src/components/marketplace/buyer/pages/Wishlist.tsx`:

```tsx
import { resources } from '../../../../lib/marketplace/mockBuyer';
import { useMarketStore } from '../../../../store/useMarketStore';
import ResourceCard from '../components/ResourceCard';

export default function Wishlist() {
  const { wishlist } = useMarketStore();
  const items = resources.filter(r => wishlist.includes(r.id));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-[#1f2937]">Wishlist</h1>
        <p className="text-sm text-[#8a938a]">Resources you saved for later.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-[#8a938a] py-16">Nothing saved yet. Tap the heart on any resource to save it.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(r => <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/marketplace/buyer/pages/MyLibrary.test.tsx src/components/marketplace/buyer/pages/Wishlist.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/marketplace/buyer/pages/MyLibrary.tsx src/components/marketplace/buyer/pages/MyLibrary.test.tsx src/components/marketplace/buyer/pages/Wishlist.tsx src/components/marketplace/buyer/pages/Wishlist.test.tsx
git commit -m "feat(market): implement MyLibrary + Wishlist pages"
```

---

## Task 10: Orders + Subscriptions + Payments pages

**Files:**
- Modify (replace stubs): `Orders.tsx`, `Subscriptions.tsx`, `Payments.tsx`
- Create: `Orders.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/marketplace/buyer/pages/Orders.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Orders from './Orders';

describe('Orders', () => {
  it('renders order history rows', () => {
    render(<Orders />);
    expect(screen.getByText('Order History')).toBeInTheDocument();
    expect(screen.getByText('KCSE Biology 2026 Revision')).toBeInTheDocument();
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/marketplace/buyer/pages/Orders.test.tsx`
Expected: FAIL — stub renders empty.

- [ ] **Step 3: Implement Orders**

Replace `src/components/marketplace/buyer/pages/Orders.tsx`:

```tsx
import { orders } from '../../../../lib/marketplace/mockBuyer';

const STATUS: Record<string, string> = {
  Completed: 'bg-[#dcfce7] text-[#15803d]',
  Pending: 'bg-[#fef9c3] text-[#a16207]',
  Refunded: 'bg-[#fee2e2] text-[#b91c1c]',
};

export default function Orders() {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold text-[#1f2937]">Order History</h1>
      <div className="bg-white rounded-2xl border border-[#e8ece8] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f6f8f6] text-[#6b7280] text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Resource</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t border-[#eef1ee]">
                <td className="px-4 py-3 font-medium text-[#1f2937]">{o.title}</td>
                <td className="px-4 py-3 text-[#6b7280] hidden sm:table-cell">{o.date}</td>
                <td className="px-4 py-3 font-bold text-[#15803d]">KSh {o.amountKsh}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${STATUS[o.status]}`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Implement Subscriptions**

Replace `src/components/marketplace/buyer/pages/Subscriptions.tsx`:

```tsx
import { Check } from 'lucide-react';
import { subscriptions } from '../../../../lib/marketplace/mockBuyer';

export default function Subscriptions() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-[#1f2937]">Subscriptions</h1>
        <p className="text-sm text-[#8a938a]">Upgrade for AI tools and unlimited learning.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subscriptions.plans.map(p => (
          <div key={p.key} className={`rounded-2xl border p-5 flex flex-col ${p.current ? 'border-[#16a34a] bg-[#f0fdf4]' : 'border-[#e8ece8] bg-white'}`}>
            <div className="font-extrabold text-[#1f2937]">{p.name}</div>
            <div className="mt-1"><span className="text-2xl font-extrabold text-[#15803d]">KSh {p.priceKsh}</span>
              <span className="text-sm text-[#8a938a]"> / {p.period}</span></div>
            <ul className="mt-4 space-y-2 text-sm text-[#4b5563] flex-1">
              {p.perks.map(perk => (
                <li key={perk} className="flex items-start gap-2"><Check size={16} className="text-[#16a34a] mt-0.5 shrink-0" /> {perk}</li>
              ))}
            </ul>
            <button disabled={p.current}
              className={`mt-5 w-full rounded-lg py-2.5 text-sm font-bold ${p.current ? 'bg-[#dcfce7] text-[#15803d] cursor-default' : 'bg-[#16a34a] hover:bg-[#15913f] text-white'}`}>
              {p.current ? 'Current Plan' : `Upgrade to ${p.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Implement Payments**

Replace `src/components/marketplace/buyer/pages/Payments.tsx`:

```tsx
import { Wallet, Smartphone, ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';
import { wallet, payments } from '../../../../lib/marketplace/mockBuyer';

export default function Payments() {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold text-[#1f2937]">Payments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#15803d] to-[#12673a] text-white p-5">
          <div className="flex items-center gap-2 text-white/85 text-sm"><Wallet size={16} /> Wallet Balance</div>
          <div className="text-3xl font-extrabold mt-1">KSh {wallet.balanceKsh.toLocaleString()}</div>
          <button className="mt-4 flex items-center gap-1 bg-white text-[#15803d] text-sm font-bold rounded-lg px-4 py-2">
            <Plus size={16} /> Top up
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8ece8] p-5">
          <div className="font-bold text-[#1f2937] mb-3">Payment Methods</div>
          {payments.methods.map(m => (
            <div key={m.key} className="flex items-center gap-3 border border-[#e8ece8] rounded-xl p-3">
              <Smartphone size={20} className="text-[#16a34a]" />
              <div className="flex-1">
                <div className="font-bold text-sm text-[#1f2937]">{m.label}</div>
                <div className="text-xs text-[#8a938a]">{m.detail}</div>
              </div>
              {m.primary && <span className="text-[11px] font-bold text-[#15803d] bg-[#dcfce7] rounded-full px-2 py-0.5">Primary</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ece8] p-5">
        <div className="font-bold text-[#1f2937] mb-3">Transaction History</div>
        <ul className="divide-y divide-[#eef1ee]">
          {payments.transactions.map(t => (
            <li key={t.id} className="flex items-center gap-3 py-3">
              <span className={`w-9 h-9 grid place-items-center rounded-full ${t.direction === 'in' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'}`}>
                {t.direction === 'in' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium text-[#1f2937]">{t.label}</div>
                <div className="text-xs text-[#8a938a]">{t.date}</div>
              </div>
              <span className={`text-sm font-bold ${t.direction === 'in' ? 'text-[#15803d]' : 'text-[#b91c1c]'}`}>
                {t.direction === 'in' ? '+' : '−'}KSh {t.amountKsh}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run test to verify it passes + typecheck**

Run: `npx vitest run src/components/marketplace/buyer/pages/Orders.test.tsx && npx tsc -b`
Expected: PASS; tsc clean.

- [ ] **Step 7: Commit**

```bash
git add src/components/marketplace/buyer/pages/Orders.tsx src/components/marketplace/buyer/pages/Orders.test.tsx src/components/marketplace/buyer/pages/Subscriptions.tsx src/components/marketplace/buyer/pages/Payments.tsx
git commit -m "feat(market): implement Orders, Subscriptions, Payments pages"
```

---

## Task 11: Messages page

**Files:**
- Modify (replace stub): `Messages.tsx`
- Create: `Messages.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/marketplace/buyer/pages/Messages.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Messages from './Messages';

describe('Messages', () => {
  it('shows conversation list and opens the first thread', () => {
    render(<Messages />);
    expect(screen.getByText('Teacher Jane')).toBeInTheDocument();
    expect(screen.getByText('Great, thank you!')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/marketplace/buyer/pages/Messages.test.tsx`
Expected: FAIL — stub renders empty.

- [ ] **Step 3: Implement Messages**

Replace `src/components/marketplace/buyer/pages/Messages.tsx`:

```tsx
import { useState } from 'react';
import { Send } from 'lucide-react';
import { conversations } from '../../../../lib/marketplace/mockBuyer';

export default function Messages() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const active = conversations.find(c => c.id === activeId)!;

  return (
    <div className="bg-white rounded-2xl border border-[#e8ece8] overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr] h-[calc(100vh-8rem)]">
      {/* Conversation list */}
      <div className="border-r border-[#eef1ee] overflow-y-auto">
        <div className="px-4 py-3 font-extrabold text-[#1f2937] border-b border-[#eef1ee]">Messages</div>
        {conversations.map(c => (
          <button key={c.id} onClick={() => setActiveId(c.id)}
            className={`w-full text-left px-4 py-3 border-b border-[#f2f5f2] hover:bg-[#f6f8f6] ${c.id === activeId ? 'bg-[#f0fdf4]' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#1f2937]">{c.from}</span>
              <span className="text-[11px] text-[#9aa39a]">{c.when}</span>
            </div>
            <div className="text-xs text-[#8a938a] truncate">{c.preview}</div>
          </button>
        ))}
      </div>

      {/* Thread */}
      <div className="flex flex-col">
        <div className="px-4 py-3 border-b border-[#eef1ee] font-bold text-[#1f2937]">{active.from} <span className="text-xs font-normal text-[#8a938a]">· {active.role}</span></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#f6f8f6]">
          {active.messages.map((m, i) => (
            <div key={i} className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.me ? 'ml-auto bg-[#16a34a] text-white' : 'bg-white border border-[#e8ece8] text-[#1f2937]'}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-[#eef1ee] flex gap-2">
          <input placeholder="Type a message…" className="flex-1 bg-[#f2f5f2] rounded-full px-4 py-2.5 text-sm outline-none" />
          <button className="w-10 h-10 grid place-items-center bg-[#16a34a] text-white rounded-full" aria-label="Send"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/marketplace/buyer/pages/Messages.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketplace/buyer/pages/Messages.tsx src/components/marketplace/buyer/pages/Messages.test.tsx
git commit -m "feat(market): implement Messages page"
```

---

## Task 12: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the entire test suite**

Run: `npm test`
Expected: PASS — all marketplace tests green (harness, mockBuyer, store, ResourceCard, MarketLayout, Navbar, MarketHome, MarketBrowse, MyLibrary, Wishlist, Orders, Messages).

- [ ] **Step 2: Typecheck + production build**

Run: `npm run build`
Expected: `tsc -b` clean and `vite build` succeeds with no errors.

- [ ] **Step 3: Lint the new files**

Run: `npm run lint`
Expected: no new errors in `src/components/marketplace/buyer/**` or the modified `Navbar.tsx` / `App.tsx` / `SellerLayout.tsx`.

- [ ] **Step 4: Manual smoke (dev server)**

Run: `npm run dev`, then verify in the browser:
- Logged-in student top nav shows **Market** (not Sell); clicking it opens `/market` with the sidebar + home page.
- All 8 sidebar tabs navigate and render.
- Heart/Buy buttons update the wishlist badge + cart badge.
- Seller portal (`/seller/dashboard` → sidebar **Marketplace**) opens `/seller/marketplace` showing the same storefront inside seller chrome.

- [ ] **Step 5: Final commit (if any lint/build fixups were needed)**

```bash
git add -A
git commit -m "chore(market): verification fixups"
```

---

## Self-Review Notes

- **Spec coverage:** nav swap (T6), buyer shell + 8 sidebar items (T5), all 8 pages (T7–T11), seller reuse of storefront (T8), mock data schema-shaped (T2), cart/wishlist local state (T3), dependency-free feedback via badges/button states (T4/T5), tests (every task). Access model via existing `ProtectedRoute`/`SellerProtectedRoute` (T6/T8).
- **Type consistency:** `Resource`, `findResource`, `wishlistSeed`, `wallet`, `subscriptions.plans`, `payments.transactions`, `conversations` defined in T2 and consumed unchanged in later tasks. Store API `addToCart/removeFromCart/toggleWishlist/inCart/inWishlist/cart/wishlist` defined in T3 and used consistently in T4/T5/T9.
- **No placeholders:** page stubs in T6 are explicitly temporary and replaced in T7–T11; every replacement ships full code.
