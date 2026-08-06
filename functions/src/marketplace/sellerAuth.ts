// Seller auth — phone + PIN via Firebase custom tokens, mirroring student auth.
// A seller session is entirely separate from a family/student account.
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { hashPin, pinMatches, cleanKenyanPhone, cleanTscNumber, newSalt } from '../shared/auth.js';

const SELLER_TYPES = ['teacher', 'tutor', 'school'];

export const sellerSignup = onCall(async request => {
  const { phone, pin, displayName, type, tscNumber } = (request.data ?? {}) as {
    phone?: string; pin?: string; displayName?: string; type?: string; tscNumber?: string;
  };
  const db = getFirestore();

  const cleanPhone = cleanKenyanPhone(phone ?? '');
  if (!cleanPhone) throw new HttpsError('invalid-argument', 'Enter a valid Kenyan phone number.');
  if (!/^\d{4}$/.test(pin ?? '')) throw new HttpsError('invalid-argument', 'PIN must be 4 digits.');
  if (!displayName || displayName.trim().length < 2) {
    throw new HttpsError('invalid-argument', 'Enter your name (2+ characters).');
  }
  if (!SELLER_TYPES.includes(type ?? '')) {
    throw new HttpsError('invalid-argument', 'type must be teacher, tutor, or school.');
  }

  // Teachers must supply a valid, unique Kenyan TSC number and are held for
  // admin review before they can sell. Tutors/schools are auto-active.
  const isTeacher = type === 'teacher';
  let cleanTsc: string | null = null;
  if (isTeacher) {
    cleanTsc = cleanTscNumber(tscNumber ?? '');
    if (!cleanTsc) {
      throw new HttpsError('invalid-argument', 'Enter a valid TSC number (5–9 digits).');
    }
    const dupTsc = await db.collection('sellers').where('tscNumber', '==', cleanTsc).limit(1).get();
    if (!dupTsc.empty) throw new HttpsError('already-exists', 'This TSC number is already registered.');
  }

  const existing = await db.collection('sellers').where('phone', '==', cleanPhone).limit(1).get();
  if (!existing.empty) throw new HttpsError('already-exists', 'This number is already a seller.');

  const salt = newSalt();
  const ref = await db.collection('sellers').add({
    phone: cleanPhone,
    pinSalt: salt,
    pinHash: hashPin(pin as string, salt),
    displayName: displayName.trim(),
    type,
    tscNumber: cleanTsc,
    status: isTeacher ? 'pending' : 'active',
    payoutBalancePending: 0,
    payoutBalancePaid: 0,
    failedAttempts: 0,
    lockoutUntil: null,
    createdAt: FieldValue.serverTimestamp(),
  });

  const token = await getAuth().createCustomToken(ref.id, { seller: true });
  return { token, sellerId: ref.id };
});

export const sellerLogin = onCall(async request => {
  const { phone, pin } = (request.data ?? {}) as { phone?: string; pin?: string };
  const db = getFirestore();

  const cleanPhone = cleanKenyanPhone(phone ?? '');
  if (!cleanPhone) throw new HttpsError('invalid-argument', 'Enter a valid Kenyan phone number.');
  if (!/^\d{4}$/.test(pin ?? '')) throw new HttpsError('invalid-argument', 'Enter your 4-digit PIN.');

  const snap = await db.collection('sellers').where('phone', '==', cleanPhone).limit(1).get();
  if (snap.empty) throw new HttpsError('not-found', 'No seller account for this number.');

  const docSnap = snap.docs[0];
  const s = docSnap.data();
  const now = Date.now();
  const lockoutUntil = s.lockoutUntil ?? null;
  if (lockoutUntil && lockoutUntil > now) {
    const mins = Math.ceil((lockoutUntil - now) / 60000);
    throw new HttpsError('resource-exhausted', `Too many attempts. Try again in ${mins} min.`);
  }
  if (s.status === 'suspended') {
    throw new HttpsError('permission-denied', 'This seller account is suspended.');
  }

  if (!pinMatches(pin as string, s.pinSalt, s.pinHash)) {
    const attempts = (s.failedAttempts ?? 0) + 1;
    await docSnap.ref.update({
      failedAttempts: attempts,
      lockoutUntil: attempts >= 5 ? now + 5 * 60 * 1000 : null,
    });
    throw new HttpsError('permission-denied', 'Incorrect PIN.');
  }

  await docSnap.ref.update({ failedAttempts: 0, lockoutUntil: null });
  const token = await getAuth().createCustomToken(docSnap.id, { seller: true });
  return {
    token,
    sellerId: docSnap.id,
    displayName: s.displayName,
    type: s.type,
  };
});
