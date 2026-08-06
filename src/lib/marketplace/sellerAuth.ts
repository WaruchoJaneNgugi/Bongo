// Seller auth client: phone + PIN via Firebase custom tokens (verified server-side).
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from '../firebase';
import type { Seller, SellerType } from './types';

/** Create a seller account (server hashes the PIN) and sign in. Every seller
 *  passes a type-specific registration number (teacher → TSC, school → MoE/NEMIS
 *  code, tutor → National ID); the server validates it and holds for review. */
export async function signupSeller(
  phone: string, pin: string, displayName: string, type: SellerType,
  regNumber?: string, location?: string
): Promise<string> {
  const fn = httpsCallable<
    { phone: string; pin: string; displayName: string; type: SellerType; regNumber?: string; location?: string },
    { token: string; sellerId: string }
  >(functions, 'sellerSignup');
  const { token, sellerId } = (await fn({ phone, pin, displayName, type, regNumber, location })).data;
  await signInWithCustomToken(auth, token);
  return sellerId;
}

/** Verify phone + PIN server-side and sign in. */
export async function loginSeller(
  phone: string, pin: string
): Promise<{ sellerId: string; displayName: string; type: SellerType }> {
  const fn = httpsCallable<
    { phone: string; pin: string },
    { token: string; sellerId: string; displayName: string; type: SellerType }
  >(functions, 'sellerLogin');
  const res = (await fn({ phone, pin })).data;
  await signInWithCustomToken(auth, res.token);
  return { sellerId: res.sellerId, displayName: res.displayName, type: res.type };
}

export async function logoutSeller(): Promise<void> {
  await signOut(auth);
}

/** Live subscription to the signed-in seller's document. */
export function subscribeSeller(sellerId: string, cb: (data: Seller | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'sellers', sellerId), snap => {
    cb(snap.exists() ? (snap.data() as Seller) : null);
  });
}
