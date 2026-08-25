import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'firebase/firestore';
import { subscribePurchases } from './orders';

vi.mock('../firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ __col: true })),
  onSnapshot: vi.fn(),
  query: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
}));

beforeEach(() => vi.clearAllMocks());

describe('subscribePurchases', () => {
  it('subscribes to the buyer\'s purchases newest-first and maps docs to rows', () => {
    (fs.onSnapshot as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      (_q: unknown, cb: (snap: unknown) => void) => {
        cb({ docs: [{ id: 'p1', data: () => ({ resourceId: 'r1', status: 'paid', priceKsh: 150 }) }] });
        return () => undefined;
      },
    );
    const rows: unknown[] = [];
    const unsub = subscribePurchases('acc1', r => rows.push(...r));
    expect(fs.where).toHaveBeenCalledWith('buyerAccountId', '==', 'acc1');
    expect(fs.orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    expect(rows).toEqual([{ id: 'p1', resourceId: 'r1', status: 'paid', priceKsh: 150 }]);
    expect(typeof unsub).toBe('function');
  });
});
