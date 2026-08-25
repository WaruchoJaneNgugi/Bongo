import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import type { Unsubscribe } from 'firebase/firestore';
import { auth } from '../lib/firebase';
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

  /** Wire the Firebase auth listener once so a seller session is restored on refresh. */
  bootstrap: () => void;
  signup: (input: SellerSignupInput) => Promise<void>;
  login: (phone: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Attach a live listener once we know the seller id (e.g. after auth restore). */
  bind: (sellerId: string) => void;
}

// Module-level so bootstrap is idempotent across re-renders / HMR.
let authUnsub: (() => void) | null = null;

export const useSellerStore = create<SellerState>((set, get) => ({
  sellerId: null,
  seller: null,
  authReady: false,
  _unsub: null,

  bootstrap: () => {
    if (authUnsub) return; // already wired
    authUnsub = onAuthStateChanged(auth, async current => {
      // Signed out / anonymous chat sessions are not sellers.
      if (!current || current.isAnonymous) {
        get()._unsub?.();
        set({ sellerId: null, seller: null, _unsub: null, authReady: true });
        return;
      }
      // A seller custom token carries a `seller` claim — only then restore the
      // seller session. Student/admin sessions resolve to "no seller".
      try {
        const { claims } = await current.getIdTokenResult();
        if (claims.seller === true) {
          get().bind(current.uid);
          return;
        }
      } catch {
        // fall through and resolve as non-seller
      }
      get()._unsub?.();
      set({ sellerId: null, seller: null, _unsub: null, authReady: true });
    });
  },

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
