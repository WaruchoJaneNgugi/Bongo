import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { gradeQuiz, type StoredAnswer } from './quizGrading.js';
import { hasResourceAccess } from './resourceAccess.js';

/** Grade a learner's answers server-side, record the result, and return the
 *  score + per-question detail (the only place correct answers are revealed). */
export const submitVideoQuiz = onCall(async request => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in to take the quiz.');

  const { resourceId, answers } = (request.data ?? {}) as { resourceId?: string; answers?: number[] };
  if (!resourceId || !Array.isArray(answers)) {
    throw new HttpsError('invalid-argument', 'resourceId and answers[] are required.');
  }

  const db = getFirestore();
  const resSnap = await db.collection('resources').doc(resourceId).get();
  if (!resSnap.exists) throw new HttpsError('not-found', 'Resource not found.');
  const res = resSnap.data() as { sellerId: string; priceKsh: number; title: string; hasQuiz?: boolean };
  if (!res.hasQuiz) throw new HttpsError('failed-precondition', 'This resource has no quiz.');

  if (!(await hasResourceAccess(db, uid, resourceId, res))) {
    throw new HttpsError('permission-denied', 'Buy this resource to take the quiz.');
  }

  const answerSnap = await db.collection('resources').doc(resourceId)
    .collection('private').doc('quiz').get();
  const stored = (answerSnap.data()?.answers ?? []) as StoredAnswer[];
  const graded = gradeQuiz(answers, stored);

  // Upsert one result per (resource, buyer); latest submission wins.
  await db.collection('quizResults').doc(`${resourceId}_${uid}`).set({
    resourceId,
    sellerId: res.sellerId,
    buyerAccountId: uid,
    resourceTitle: res.title,
    score: graded.score,
    total: graded.total,
    createdAt: FieldValue.serverTimestamp(),
  });

  return graded;
});
