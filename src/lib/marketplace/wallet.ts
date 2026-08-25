import {
  collection, doc, onSnapshot, orderBy, query, type Unsubscribe,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import type { WalletTx } from './types';

/** Live subscription to a family account's shared wallet balance (KSh, defaults 0). */
export function subscribeWallet(accountId: string, cb: (balanceKsh: number) => void): Unsubscribe {
  return onSnapshot(doc(db, 'accounts', accountId), snap => {
    const data = snap.data() as { walletBalanceKsh?: number } | undefined;
    cb(data?.walletBalanceKsh ?? 0);
  });
}

/** Live wallet transaction history for an account, newest first. */
export function subscribeWalletTx(accountId: string, cb: (tx: WalletTx[]) => void): Unsubscribe {
  const q = query(collection(db, 'accounts', accountId, 'walletTx'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<WalletTx, 'id'>) })));
  });
}

export interface CheckoutResult {
  purchased: string[];
  skipped: string[];
  newBalanceKsh: number;
}

/** Pay for the given resources from the wallet (server-authoritative). */
export async function walletCheckout(resourceIds: string[]): Promise<CheckoutResult> {
  const fn = httpsCallable<{ resourceIds: string[] }, CheckoutResult>(functions, 'walletCheckout');
  return (await fn({ resourceIds })).data;
}

/** Admin-only: credit a family account's wallet by KSh (honest, authorized top-up). */
export async function creditWallet(accountId: string, amountKsh: number): Promise<void> {
  const fn = httpsCallable<{ accountId: string; amountKsh: number }, { ok: boolean }>(functions, 'creditWallet');
  await fn({ accountId, amountKsh });
}

/** Start an M-Pesa STK payment. Throws `mpesa-not-configured` until Daraja is live. */
export async function initiateMpesa(resourceIds: string[]): Promise<unknown> {
  const fn = httpsCallable<{ resourceIds: string[] }, unknown>(functions, 'mpesaInitiate');
  return (await fn({ resourceIds })).data;
}
