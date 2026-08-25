// Seller auth — phone + PIN via Firebase custom tokens, mirroring student auth.
// A seller session is entirely separate from a family/student account.
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { hashPin, pinMatches, cleanKenyanPhone, cleanSellerRegNumber, newSalt } from '../shared/auth.js';

// TEACHERS ONLY: teachers are currently the only accepted seller type. The
// tutor and school entries are kept commented so they can be re-enabled later.
const SELLER_TYPES = ['teacher' /*, 'tutor', 'school' */];
// Human label for each type's registration number, used in error messages.
const REG_LABEL: Record<string, string> = {
  teacher: 'TSC number',
  // school: 'school registration code',
  // tutor: 'National ID number',
};
// TESTING: accept any non-empty registration number. Set to false to enforce
// the per-type Kenyan formats (cleanSellerRegNumber).
const LENIENT_REG = true;

export const sellerSignup = onCall(async request => {
  // TEACHERS ONLY: `location` (tutor / school) is no longer read; re-add it here
  // when those seller types return.
  const { phone, pin, displayName, type, regNumber, schoolName } = (request.data ?? {}) as {
    phone?: string; pin?: string; displayName?: string; type?: string;
    regNumber?: string; location?: string; schoolName?: string;
  };
  const db = getFirestore();

  const cleanPhone = cleanKenyanPhone(phone ?? '');
  if (!cleanPhone) throw new HttpsError('invalid-argument', 'Enter a valid Kenyan phone number.');
  if (!/^\d{4}$/.test(pin ?? '')) throw new HttpsError('invalid-argument', 'PIN must be 4 digits.');
  if (!displayName || displayName.trim().length < 2) {
    throw new HttpsError('invalid-argument', 'Enter your name (2+ characters).');
  }
  if (!SELLER_TYPES.includes(type ?? '')) {
    throw new HttpsError('invalid-argument', 'type must be teacher.');
  }

  // Every seller supplies a type-specific registration number (teacher → TSC,
  // school → MoE/NEMIS code, tutor → National ID). It must be valid and unique,
  // and the account is held for admin review before it can sell.
  const cleanReg = LENIENT_REG
    ? ((regNumber ?? '').trim() || null)
    : cleanSellerRegNumber(type as string, regNumber ?? '');
  if (!cleanReg) {
    throw new HttpsError('invalid-argument', `Enter a valid ${REG_LABEL[type as string]}.`);
  }
  const dupReg = await db.collection('sellers').where('regNumber', '==', cleanReg).limit(1).get();
  if (!dupReg.empty) throw new HttpsError('already-exists', `This ${REG_LABEL[type as string]} is already registered.`);

  // TEACHERS ONLY: schools and tutors captured a location (town / county);
  // teachers don't. Restore this block when re-enabling those seller types.
  const sellerLocation: string | null = null;
  // if (type === 'school' || type === 'tutor') {
  //   sellerLocation = (location ?? '').trim();
  //   if (sellerLocation.length < 2) {
  //     throw new HttpsError('invalid-argument', type === 'school' ? 'Enter the school location.' : 'Enter your location.');
  //   }
  // }

  // Teachers record the school they operate in.
  const teacherSchool = (schoolName ?? '').trim();
  if (teacherSchool.length < 2) throw new HttpsError('invalid-argument', 'Enter the school you teach at.');

  const existing = await db.collection('sellers').where('phone', '==', cleanPhone).limit(1).get();
  if (!existing.empty) throw new HttpsError('already-exists', 'This number is already a seller.');

  const salt = newSalt();
  const ref = await db.collection('sellers').add({
    phone: cleanPhone,
    pinSalt: salt,
    pinHash: hashPin(pin as string, salt),
    displayName: displayName.trim(),
    type,
    regNumber: cleanReg,
    location: sellerLocation,
    schoolName: teacherSchool,
    status: 'pending',
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
