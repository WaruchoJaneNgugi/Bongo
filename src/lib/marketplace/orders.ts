import {
  collection, onSnapshot, orderBy, query, where, type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Purchase } from './types';

/**
 * Live subscription to a buyer's purchases, newest first. This is the source of
 * both the Orders list and the derived My Library (owned = status 'paid').
 */
export function subscribePurchases(accountId: string, cb: (purchases: Purchase[]) => void): Unsubscribe {
  const q = query(
    collection(db, 'purchases'),
    where('buyerAccountId', '==', accountId),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Purchase, 'id'>) })));
  });
}
