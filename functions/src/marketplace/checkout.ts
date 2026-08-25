// Server-authoritative marketplace checkout logic. All money — balances,
// commission splits, library access — is computed here; the client can request
// a purchase but never marks itself paid. These functions take a Firestore
// instance so they can be unit-tested against an in-memory mock.
import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';
import type { Firestore } from 'firebase-admin/firestore';
import { splitPayment } from './commission.js';

const DEFAULT_COMMISSION_PERCENT = 15;

interface ResolvedResource {
  id: string;
  sellerId: string;
  title: string;
  priceKsh: number;
}

/** Read the platform commission %, defaulting to 15 when unset. */
async function loadCommissionPercent(db: Firestore): Promise<number> {
  const snap = await db.collection('platformSettings').doc('marketplace').get();
  const pct = snap.exists ? (snap.data()?.commissionPercent as number | undefined) : undefined;
  return typeof pct === 'number' ? pct : DEFAULT_COMMISSION_PERCENT;
}

/**
 * Pay for a set of resources from a family account's wallet, in one transaction.
 * Skips resources that are unpublished, missing, or already owned. Returns which
 * ids were purchased, which were skipped, and the resulting wallet balance.
 */
export async function runWalletCheckout(
  db: Firestore,
  buyerAccountId: string,
  resourceIds: string[],
): Promise<{ purchased: string[]; skipped: string[]; newBalanceKsh: number }> {
  const uniqueIds = [...new Set(resourceIds)];

  // Resolve to published resources (prices always come from Firestore).
  const resolved: ResolvedResource[] = [];
  for (const id of uniqueIds) {
    const snap = await db.collection('resources').doc(id).get();
    const data = snap.exists ? snap.data() : undefined;
    if (data && data.status === 'published') {
      resolved.push({ id, sellerId: data.sellerId, title: data.title, priceKsh: data.priceKsh });
    }
  }

  // Drop resources the buyer already owns (an existing paid purchase).
  const ownedSnap = await db
    .collection('purchases')
    .where('buyerAccountId', '==', buyerAccountId)
    .where('status', '==', 'paid')
    .get();
  const owned = new Set(ownedSnap.docs.map(d => d.data().resourceId as string));
  const toBuy = resolved.filter(r => !owned.has(r.id));
  const purchasedIds = toBuy.map(r => r.id);
  const skipped = uniqueIds.filter(id => !purchasedIds.includes(id));

  const commissionPercent = await loadCommissionPercent(db);

  const newBalanceKsh = await db.runTransaction(async tx => {
    const accRef = db.collection('accounts').doc(buyerAccountId);
    const accSnap = await tx.get(accRef);
    if (!accSnap.exists) throw new HttpsError('not-found', 'account-not-found');
    const balance = (accSnap.data()?.walletBalanceKsh as number | undefined) ?? 0;

    const total = toBuy.reduce((n, r) => n + r.priceKsh, 0);
    if (total === 0) return balance; // nothing to buy (all skipped) — no writes
    if (balance < total) throw new HttpsError('failed-precondition', 'insufficient-funds');

    const nextBalance = balance - total;
    tx.update(accRef, { walletBalanceKsh: nextBalance });
    const now = FieldValue.serverTimestamp();

    for (const r of toBuy) {
      const purchaseRef = db.collection('purchases').doc();
      tx.set(purchaseRef, {
        resourceId: r.id,
        sellerId: r.sellerId,
        buyerAccountId,
        title: r.title,
        priceKsh: r.priceKsh,
        method: 'wallet',
        status: 'paid',
        createdAt: now,
        paidAt: now,
      });

      tx.set(accRef.collection('walletTx').doc(), {
        type: 'purchase',
        amountKsh: -r.priceKsh,
        ref: purchaseRef.id,
        createdAt: now,
      });

      const { sellerShareKsh, commissionKsh } = splitPayment(r.priceKsh, commissionPercent);
      tx.set(db.collection('ledger').doc(), {
        purchaseId: purchaseRef.id,
        type: 'seller_earning',
        sellerId: r.sellerId,
        amountKsh: sellerShareKsh,
        settled: false,
        createdAt: now,
      });
      tx.set(db.collection('ledger').doc(), {
        purchaseId: purchaseRef.id,
        type: 'platform_commission',
        amountKsh: commissionKsh,
        settled: false,
        createdAt: now,
      });

      tx.update(db.collection('sellers').doc(r.sellerId), {
        payoutBalancePending: FieldValue.increment(sellerShareKsh),
      });
    }
    return nextBalance;
  });

  return { purchased: purchasedIds, skipped, newBalanceKsh };
}

/** Admin-authorized wallet top-up: bump the balance and log a topup transaction. */
export async function runCreditWallet(
  db: Firestore,
  accountId: string,
  amountKsh: number,
): Promise<void> {
  if (!(amountKsh > 0)) throw new HttpsError('invalid-argument', 'Amount must be a positive number.');
  const accRef = db.collection('accounts').doc(accountId);
  await db.runTransaction(async tx => {
    tx.update(accRef, { walletBalanceKsh: FieldValue.increment(amountKsh) });
    tx.set(accRef.collection('walletTx').doc(), {
      type: 'topup',
      amountKsh,
      createdAt: FieldValue.serverTimestamp(),
    });
  });
}
