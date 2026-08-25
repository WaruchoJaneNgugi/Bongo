import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'firebase/firestore';
import * as fn from 'firebase/functions';
import { subscribeWallet, subscribeWalletTx, walletCheckout, initiateMpesa, creditWallet } from './wallet';

vi.mock('../firebase', () => ({ db: {}, functions: {} }));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ __ref: true })),
  collection: vi.fn(() => ({ __col: true })),
  onSnapshot: vi.fn(),
  query: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
}));

vi.mock('firebase/functions', () => ({ httpsCallable: vi.fn() }));

beforeEach(() => vi.clearAllMocks());

describe('subscribeWallet', () => {
  it('reports the live balance, defaulting to 0 when unset', () => {
    (fs.onSnapshot as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      (_ref: unknown, cb: (snap: unknown) => void) => {
        cb({ data: () => ({ walletBalanceKsh: 250 }) });
        return () => undefined;
      },
    );
    let balance = -1;
    subscribeWallet('acc1', b => (balance = b));
    expect(fs.doc).toHaveBeenCalledWith({}, 'accounts', 'acc1');
    expect(balance).toBe(250);
  });
});

describe('subscribeWalletTx', () => {
  it('subscribes to the account walletTx subcollection newest-first and maps rows', () => {
    (fs.onSnapshot as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      (_q: unknown, cb: (snap: unknown) => void) => {
        cb({ docs: [{ id: 't1', data: () => ({ type: 'topup', amountKsh: 500 }) }] });
        return () => undefined;
      },
    );
    const rows: unknown[] = [];
    const unsub = subscribeWalletTx('acc1', r => rows.push(...r));
    expect(fs.collection).toHaveBeenCalledWith({}, 'accounts', 'acc1', 'walletTx');
    expect(fs.orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    expect(rows).toEqual([{ id: 't1', type: 'topup', amountKsh: 500 }]);
    expect(typeof unsub).toBe('function');
  });
});

describe('walletCheckout', () => {
  it('calls the walletCheckout function with the resource ids and returns its result', async () => {
    const call = vi.fn(async () => ({ data: { purchased: ['r1'], skipped: [], newBalanceKsh: 100 } }));
    (fn.httpsCallable as unknown as ReturnType<typeof vi.fn>).mockReturnValue(call);

    const res = await walletCheckout(['r1', 'r2']);

    expect(fn.httpsCallable).toHaveBeenCalledWith({}, 'walletCheckout');
    expect(call).toHaveBeenCalledWith({ resourceIds: ['r1', 'r2'] });
    expect(res).toEqual({ purchased: ['r1'], skipped: [], newBalanceKsh: 100 });
  });
});

describe('creditWallet', () => {
  it('calls the creditWallet function with the account id and amount', async () => {
    const call = vi.fn(async () => ({ data: { ok: true } }));
    (fn.httpsCallable as unknown as ReturnType<typeof vi.fn>).mockReturnValue(call);

    await creditWallet('acc1', 500);

    expect(fn.httpsCallable).toHaveBeenCalledWith({}, 'creditWallet');
    expect(call).toHaveBeenCalledWith({ accountId: 'acc1', amountKsh: 500 });
  });
});

describe('initiateMpesa', () => {
  it('calls the mpesaInitiate function with the resource ids', async () => {
    const call = vi.fn(async () => ({ data: { ok: true } }));
    (fn.httpsCallable as unknown as ReturnType<typeof vi.fn>).mockReturnValue(call);

    await initiateMpesa(['r1']);

    expect(fn.httpsCallable).toHaveBeenCalledWith({}, 'mpesaInitiate');
    expect(call).toHaveBeenCalledWith({ resourceIds: ['r1'] });
  });
});
