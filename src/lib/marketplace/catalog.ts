// Buyer-facing, read-only catalog access. Published resources are world-readable
// (Firestore rules allow read when status == 'published'), so these work for
// signed-out visitors too.
import {
  collection, doc, getDoc, getDocs, query, where, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { MarketResource } from './types';

type ResourceDoc = Omit<MarketResource, 'id'>;

/** All published resources, newest first. */
export async function listPublishedResources(): Promise<MarketResource[]> {
  const q = query(
    collection(db, 'resources'),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as ResourceDoc) }));
}

/** A single published resource, or null if missing / not published / read-denied. */
export async function getPublishedResource(id: string): Promise<MarketResource | null> {
  try {
    const snap = await getDoc(doc(db, 'resources', id));
    if (!snap.exists()) return null;
    const data = snap.data() as ResourceDoc;
    return data.status === 'published' ? { id: snap.id, ...data } : null;
  } catch {
    return null; // a draft read is denied by rules — treat as not found
  }
}
