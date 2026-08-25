import type { Firestore } from 'firebase-admin/firestore';
import { canAccess } from './quizGrading.js';

/** True if `uid` may access `resource`'s gated content: the owning seller, a
 *  free resource, or a buyer with a paid purchase. Centralizes the purchase
 *  lookup so callables don't duplicate it. */
export async function hasResourceAccess(
  db: Firestore,
  uid: string,
  resourceId: string,
  resource: { sellerId: string; priceKsh: number },
): Promise<boolean> {
  let paid = false;
  if (uid !== resource.sellerId && resource.priceKsh > 0) {
    const purchases = await db.collection('purchases')
      .where('resourceId', '==', resourceId)
      .where('buyerAccountId', '==', uid)
      .where('status', '==', 'paid')
      .limit(1).get();
    paid = !purchases.empty;
  }
  return canAccess(uid, resource, paid);
}
