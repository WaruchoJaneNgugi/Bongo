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
