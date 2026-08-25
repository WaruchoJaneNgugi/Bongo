import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      wishlist: [],
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
