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
