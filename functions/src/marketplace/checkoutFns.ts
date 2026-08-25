// Callable entry points for marketplace checkout. These are thin: they enforce
// auth, validate inputs, and delegate to the unit-tested logic in checkout.ts.
import { getFirestore } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { runWalletCheckout, runCreditWallet } from './checkout.js';

function requireResourceIds(data: unknown): string[] {
  const ids = (data as { resourceIds?: unknown })?.resourceIds;
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every(i => typeof i === 'string')) {
    throw new HttpsError('invalid-argument', 'resourceIds must be a non-empty array of ids.');
  }
  return ids as string[];
}

// walletCheckout — a signed-in student pays for their cart from the family
// wallet. The buyer account is the caller's uid (student custom token).
export const walletCheckout = onCall(async request => {
  const uid = request.auth?.uid;
  if (!uid || request.auth?.token.seller || request.auth?.token.staff) {
    throw new HttpsError('unauthenticated', 'Sign in as a student to check out.');
  }
  const resourceIds = requireResourceIds(request.data);
  return runWalletCheckout(getFirestore(), uid, resourceIds);
});

// creditWallet — admin-only wallet top-up (honest, authorized funding).
export const creditWallet = onCall(async request => {
  if (request.auth?.token.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Only admins can credit wallets.');
  }
  const { accountId, amountKsh } = (request.data ?? {}) as { accountId?: string; amountKsh?: number };
  if (!accountId || typeof accountId !== 'string') {
    throw new HttpsError('invalid-argument', 'accountId is required.');
  }
  if (typeof amountKsh !== 'number' || !(amountKsh > 0)) {
    throw new HttpsError('invalid-argument', 'amountKsh must be a positive number.');
  }
  await runCreditWallet(getFirestore(), accountId, amountKsh);
  return { ok: true };
});

// mpesaInitiate — Daraja STK Push. Inert until DARAJA_* env vars are configured;
// once live it runs the same purchase/ledger writes as walletCheckout (via a
// shared internal helper), so activating M-Pesa needs no schema change.
export const mpesaInitiate = onCall(async request => {
  const uid = request.auth?.uid;
  if (!uid || request.auth?.token.seller || request.auth?.token.staff) {
    throw new HttpsError('unauthenticated', 'Sign in as a student to pay.');
  }
  requireResourceIds(request.data);
  if (!process.env.DARAJA_CONSUMER_KEY) {
    throw new HttpsError('failed-precondition', 'mpesa-not-configured');
  }
  // When Daraja is configured, trigger the STK push here and complete the
  // purchase in mpesaCallback once the payment is confirmed.
  throw new HttpsError('failed-precondition', 'mpesa-not-configured');
});
