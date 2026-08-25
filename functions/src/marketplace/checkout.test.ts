import { describe, it, expect, vi, beforeEach } from 'vitest';

// FieldValue is the only firebase-admin surface the logic touches directly;
// mock it to inspectable sentinels so we can assert increments/timestamps.
vi.mock('firebase-admin/firestore', () => ({
  FieldValue: {
    increment: (n: number) => ({ __op: 'increment', n }),
    serverTimestamp: () => 'TS',
  },
}));

import { runWalletCheckout, runCreditWallet } from './checkout.js';

// ── Minimal in-memory Firestore mock ──────────────────────────────────────
// Models just what the checkout logic uses: collection().doc()/where().get(),
// doc().collection(), and runTransaction(tx.get/set/update). Captured writes
// land in `writes` for assertions.
type Data = Record<string, unknown>;

function makeDb(seed: {
  accounts?: Record<string, Data>;
  resources?: Record<string, Data>;
  sellers?: Record<string, Data>;
  purchases?: Data[];
  commissionPercent?: number | null;
}) {
  const store = {
    accounts: seed.accounts ?? {},
    resources: seed.resources ?? {},
    sellers: seed.sellers ?? {},
    purchases: seed.purchases ?? [],
  };
  const writes = {
    sets: [] as { path: string; data: Data }[],
    updates: [] as { path: string; data: Data }[],
  };
  let gen = 0;

  const snap = (id: string, data: Data | undefined) => ({
    id,
    exists: data !== undefined,
    data: () => data,
  });

  function docRef(path: string, id: string, lookup: () => Data | undefined) {
    return {
      id,
      path,
      get: async () => snap(id, lookup()),
      collection: (sub: string) => collectionRef(`${path}/${sub}`),
    };
  }

  function collectionRef(path: string) {
    const top = path.split('/')[0];
    const filters: [string, string, unknown][] = [];
    const query = {
      where(field: string, _op: string, val: unknown) {
        filters.push([field, _op, val]);
        return query;
      },
      async get() {
        const rows =
          top === 'purchases'
            ? store.purchases
            : Object.entries((store as Record<string, Data>)[top] as Record<string, Data> ?? {}).map(
                ([, d]) => d,
              );
        const matched = rows.filter(r => filters.every(([f, , v]) => (r as Data)[f] === v));
        return { docs: matched.map((d, i) => snap(`q${i}`, d as Data)) };
      },
    };
    return {
      ...query,
      doc(id?: string) {
        const realId = id ?? `${path}-${++gen}`;
        return docRef(`${path}/${realId}`, realId, () => {
          if (top === 'accounts' && !path.includes('/', top.length + 1)) {
            return store.accounts[realId];
          }
          if (top === 'resources') return store.resources[realId];
          if (top === 'sellers') return store.sellers[realId];
          const single = path.split('/').slice(1).join('/'); // e.g. platformSettings/marketplace
          if (top === 'platformSettings') {
            return seed.commissionPercent === null
              ? undefined
              : { commissionPercent: seed.commissionPercent ?? 15 };
          }
          void single;
          return undefined;
        });
      },
    };
  }

  const tx = {
    get: (ref: { get: () => Promise<unknown> }) => ref.get(),
    set: (ref: { path: string }, data: Data) => writes.sets.push({ path: ref.path, data }),
    update: (ref: { path: string }, data: Data) => writes.updates.push({ path: ref.path, data }),
  };

  const db = {
    collection: (name: string) => collectionRef(name),
    runTransaction: async (fn: (t: typeof tx) => Promise<unknown>) => fn(tx),
  };
  return { db, writes };
}

beforeEach(() => vi.clearAllMocks());

describe('runWalletCheckout', () => {
  it('rejects with insufficient-funds when the wallet cannot cover the total', async () => {
    const { db } = makeDb({
      accounts: { acc1: { walletBalanceKsh: 50 } },
      resources: { r1: { status: 'published', priceKsh: 100, sellerId: 's1', title: 'Pack' } },
    });
    await expect(runWalletCheckout(db as never, 'acc1', ['r1'])).rejects.toMatchObject({
      code: 'failed-precondition',
      message: 'insufficient-funds',
    });
  });

  it('deducts the total, writes a purchase + walletTx + ledger split, and credits the seller', async () => {
    const { db, writes } = makeDb({
      accounts: { acc1: { walletBalanceKsh: 500 } },
      resources: {
        r1: { status: 'published', priceKsh: 150, sellerId: 's1', title: 'Fractions' },
        r2: { status: 'published', priceKsh: 100, sellerId: 's2', title: 'Verbs' },
      },
      sellers: { s1: {}, s2: {} },
      commissionPercent: 15,
    });

    const res = await runWalletCheckout(db as never, 'acc1', ['r1', 'r2']);

    expect(res).toEqual({ purchased: ['r1', 'r2'], skipped: [], newBalanceKsh: 250 });

    // Wallet balance decremented to the exact new balance.
    expect(writes.updates).toContainEqual({ path: 'accounts/acc1', data: { walletBalanceKsh: 250 } });

    // One purchase per item, marked paid via wallet.
    const purchases = writes.sets.filter(w => w.path.startsWith('purchases/'));
    expect(purchases).toHaveLength(2);
    expect(purchases[0].data).toMatchObject({
      resourceId: 'r1', sellerId: 's1', buyerAccountId: 'acc1',
      title: 'Fractions', priceKsh: 150, method: 'wallet', status: 'paid',
    });

    // A wallet transaction row per item (negative amount).
    const walletTx = writes.sets.filter(w => w.path.includes('/walletTx/'));
    expect(walletTx).toHaveLength(2);
    expect(walletTx[0].data).toMatchObject({ type: 'purchase', amountKsh: -150 });

    // Two ledger entries per item: seller earning + platform commission.
    const ledger = writes.sets.filter(w => w.path.startsWith('ledger/'));
    expect(ledger).toHaveLength(4);
    expect(ledger).toContainEqual(
      expect.objectContaining({
        data: expect.objectContaining({ type: 'seller_earning', sellerId: 's1', amountKsh: 127, settled: false }),
      }),
    );
    expect(ledger).toContainEqual(
      expect.objectContaining({
        data: expect.objectContaining({ type: 'platform_commission', amountKsh: 23, settled: false }),
      }),
    );

    // Seller pending payout incremented by their share.
    expect(writes.updates).toContainEqual({
      path: 'sellers/s1', data: { payoutBalancePending: { __op: 'increment', n: 127 } },
    });
    expect(writes.updates).toContainEqual({
      path: 'sellers/s2', data: { payoutBalancePending: { __op: 'increment', n: 85 } },
    });
  });

  it('skips resources the buyer already owns', async () => {
    const { db, writes } = makeDb({
      accounts: { acc1: { walletBalanceKsh: 500 } },
      resources: {
        r1: { status: 'published', priceKsh: 150, sellerId: 's1', title: 'Owned' },
        r2: { status: 'published', priceKsh: 100, sellerId: 's2', title: 'New' },
      },
      sellers: { s1: {}, s2: {} },
      purchases: [{ resourceId: 'r1', buyerAccountId: 'acc1', status: 'paid' }],
      commissionPercent: 15,
    });

    const res = await runWalletCheckout(db as never, 'acc1', ['r1', 'r2']);

    expect(res.purchased).toEqual(['r2']);
    expect(res.skipped).toEqual(['r1']);
    expect(res.newBalanceKsh).toBe(400); // only r2's 100 deducted
    expect(writes.sets.filter(w => w.path.startsWith('purchases/'))).toHaveLength(1);
  });

  it('drops resources that are missing or not published', async () => {
    const { db } = makeDb({
      accounts: { acc1: { walletBalanceKsh: 500 } },
      resources: {
        r1: { status: 'draft', priceKsh: 150, sellerId: 's1', title: 'Draft' },
      },
      commissionPercent: 15,
    });

    const res = await runWalletCheckout(db as never, 'acc1', ['r1', 'missing']);
    expect(res.purchased).toEqual([]);
    expect(res.skipped).toEqual(['r1', 'missing']);
  });

  it('defaults to 15% commission when no platformSettings doc exists', async () => {
    const { db, writes } = makeDb({
      accounts: { acc1: { walletBalanceKsh: 500 } },
      resources: { r1: { status: 'published', priceKsh: 100, sellerId: 's1', title: 'X' } },
      sellers: { s1: {} },
      commissionPercent: null, // no settings doc
    });
    await runWalletCheckout(db as never, 'acc1', ['r1']);
    expect(writes.updates).toContainEqual({
      path: 'sellers/s1', data: { payoutBalancePending: { __op: 'increment', n: 85 } },
    });
  });
});

describe('runCreditWallet', () => {
  it('increments the wallet balance and records a topup transaction', async () => {
    const { db, writes } = makeDb({ accounts: { acc1: { walletBalanceKsh: 0 } } });
    await runCreditWallet(db as never, 'acc1', 500);
    expect(writes.updates).toContainEqual({
      path: 'accounts/acc1', data: { walletBalanceKsh: { __op: 'increment', n: 500 } },
    });
    const topup = writes.sets.find(w => w.path.includes('/walletTx/'));
    expect(topup?.data).toMatchObject({ type: 'topup', amountKsh: 500 });
  });

  it('rejects a non-positive amount', async () => {
    const { db } = makeDb({ accounts: { acc1: { walletBalanceKsh: 0 } } });
    await expect(runCreditWallet(db as never, 'acc1', 0)).rejects.toMatchObject({
      code: 'invalid-argument',
    });
  });
});
