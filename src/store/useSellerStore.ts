import { create } from 'zustand';
import type { Unsubscribe } from 'firebase/firestore';
import type { Seller } from '../lib/marketplace/types';
import {
  signupSeller, loginSeller, logoutSeller, subscribeSeller,
  type SellerSignupInput,
} from '../lib/marketplace/sellerAuth';

interface SellerState {
  sellerId: string | null;
  seller: Seller | null;
  authReady: boolean;
  _unsub: Unsubscribe | null;

  signup: (input: SellerSignupInput) => Promise<void>;
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

  signup: async (input) => {
    const sellerId = await signupSeller(input);
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
