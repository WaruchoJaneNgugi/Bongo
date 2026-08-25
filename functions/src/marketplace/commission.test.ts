import { describe, it, expect } from 'vitest';
import { splitPayment } from './commission.js';

describe('splitPayment', () => {
  it('splits a price into seller share and platform commission', () => {
    // 15% of 100 = 15 commission, 85 to the seller.
    expect(splitPayment(100, 15)).toEqual({ sellerShareKsh: 85, commissionKsh: 15 });
  });

  it('rounds the commission and gives the seller the remainder so the split is exact', () => {
    // 15% of 150 = 22.5 → commission rounds to 23; seller gets 127; sum stays 150.
    const { sellerShareKsh, commissionKsh } = splitPayment(150, 15);
    expect(commissionKsh).toBe(23);
    expect(sellerShareKsh).toBe(127);
    expect(sellerShareKsh + commissionKsh).toBe(150);
  });

  it('handles a free resource (zero price)', () => {
    expect(splitPayment(0, 15)).toEqual({ sellerShareKsh: 0, commissionKsh: 0 });
  });

  it('gives the whole price to the seller at 0% commission', () => {
    expect(splitPayment(200, 0)).toEqual({ sellerShareKsh: 200, commissionKsh: 0 });
  });

  it('takes the whole price as commission at 100%', () => {
    expect(splitPayment(200, 100)).toEqual({ sellerShareKsh: 0, commissionKsh: 200 });
  });

  it('never drifts: seller share + commission always equals the price', () => {
    for (const price of [1, 7, 33, 99, 149, 1234]) {
      const { sellerShareKsh, commissionKsh } = splitPayment(price, 15);
      expect(sellerShareKsh + commissionKsh).toBe(price);
    }
  });
});
