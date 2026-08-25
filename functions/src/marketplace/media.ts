import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { canAccess } from './quizGrading.js';

/** Mint a short-lived signed URL for a resource's gated media, but only for the
 *  owning teacher, a paid buyer, or a free resource. */
export const getResourceMediaUrl = onCall(async request => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in to watch.');

  const { resourceId } = (request.data ?? {}) as { resourceId?: string };
  if (!resourceId) throw new HttpsError('invalid-argument', 'resourceId is required.');

  const db = getFirestore();
  const snap = await db.collection('resources').doc(resourceId).get();
  if (!snap.exists) throw new HttpsError('not-found', 'Resource not found.');
  const res = snap.data() as { sellerId: string; priceKsh: number; media?: { path: string } | null };
  if (!res.media?.path) throw new HttpsError('failed-precondition', 'This resource has no media.');

  let paid = false;
  if (uid !== res.sellerId && res.priceKsh > 0) {
    const purchases = await db.collection('purchases')
      .where('resourceId', '==', resourceId)
      .where('buyerAccountId', '==', uid)
      .where('status', '==', 'paid')
      .limit(1).get();
    paid = !purchases.empty;
  }
  if (!canAccess(uid, res, paid)) throw new HttpsError('permission-denied', 'Buy this resource to watch it.');

  const [url] = await getStorage().bucket().file(res.media.path).getSignedUrl({
    action: 'read',
    expires: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
  });
  return { url };
});
