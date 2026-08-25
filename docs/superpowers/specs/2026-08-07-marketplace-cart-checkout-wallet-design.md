# Marketplace — Cart Checkout: Wallet now, M-Pesa STK ready (Design)

**Date:** 2026-08-07
**Status:** Approved
**Slice:** Cart → checkout → payment (wallet now; M-Pesa STK Daraja-ready but inert) → order + library + commission ledger.

Builds on the approved Phase-1 digital-slice design
(`2026-08-05-bongo-marketplace-phase1-digital-slice-design.md`), adapted from the
planned `listings` model to the real `resources` model, and adding the **cart
multi-item checkout** and **wallet** payment that Phase 1 had deferred.

## Purpose

Today the cart badge does nothing, "In Cart" leads nowhere, and Orders / My Library /
Payments read mock data. This slice makes buying real: a signed-in student checks out
their cart and pays from a **wallet balance**, which creates orders, grants library
access, and writes a commission split that credits the seller's pending payout (which
the honest seller dashboard already displays). M-Pesa STK Push is written and
Daraja-ready but stays inert until credentials are configured.

## Decisions (from brainstorming)

1. **No Daraja credentials yet** → build the full flow + wallet payment now; the STK
   Cloud Functions exist but return a "not configured" error until Daraja env vars are
   set. Activating M-Pesa later needs no schema change.
2. **Wallet funding** = **admin credit** (authorized, honest). Self-service M-Pesa
   top-up is deferred to when Daraja is live.
3. **On successful purchase** = create **order + library access + commission ledger**
   (credits `sellers/{id}.payoutBalancePending`).
4. **Wallet model** = **shared family wallet on the account doc**
   (`accounts/{accountId}.walletBalanceKsh` + `walletTx` subcollection).
5. **Checkout pays the whole cart** in one server-side wallet transaction.
6. **Money principle:** all balances/splits/access are computed **server-side only**;
   the client can request a purchase but never mark itself paid.

## Data model (Firestore)

```
accounts/{accountId}
  …existing… + walletBalanceKsh: number       // function/admin-written only
  walletTx/{txId} (subcollection)             // { type: 'topup'|'purchase', amountKsh, ref?, createdAt }

purchases/{purchaseId}                         // function-written only
  resourceId, sellerId, buyerAccountId,
  title, priceKsh, method: 'wallet' | 'mpesa',
  status: 'paid' | 'pending' | 'failed',
  createdAt, paidAt

ledger/{entryId}                               // append-only, function-written only
  purchaseId, type: 'seller_earning' | 'platform_commission',
  sellerId?, amountKsh, settled: false, createdAt

platformSettings/marketplace                   // single doc
  commissionPercent: number   // default 15
```

- **Library** is derived: `purchases where buyerAccountId == me && status == 'paid'`.
  No separate library collection.
- **Seller earnings** = increment `sellers/{sellerId}.payoutBalancePending` on each
  paid sale — already surfaced by the seller dashboard.
- A buyer can only own a resource once: `walletCheckout` skips resources the buyer has
  already paid for (dedupe by an existing `paid` purchase for `resourceId`).

## Cloud Functions (`functions/src/marketplace/`)

All money logic lives here; the client cannot write `purchases`/`ledger`/wallet.

- **`walletCheckout({ resourceIds })`** — auth required (a student account). Steps:
  1. Load the buyer's account; resolve each `resourceId` from Firestore (must be
     `status: 'published'`); drop any the buyer already owns.
  2. Sum prices from Firestore (never client-sent). If `walletBalanceKsh < total` →
     throw `failed-precondition` `insufficient-funds`.
  3. In a Firestore transaction: decrement `walletBalanceKsh` by total; for each item
     write a `purchase` (`paid`), a buyer `walletTx` (`purchase`), the ledger split
     (`seller_earning` = price × (1 − commission%), `platform_commission` = the rest),
     and increment that seller's `payoutBalancePending`.
  4. Return `{ purchased: string[], skipped: string[], newBalanceKsh }`.
- **`creditWallet({ accountId, amountKsh })`** — **admin-only** (staff/admin claim).
  Validates a positive amount; increments `walletBalanceKsh`; writes a `topup`
  `walletTx`.
- **`mpesaInitiate({ resourceIds })`** / **`mpesaCallback`** — Daraja-ready. While
  Daraja env vars are absent, `mpesaInitiate` throws `failed-precondition`
  `mpesa-not-configured`. Documented so that, once configured, a confirmed STK payment
  runs the *same* purchase/ledger writes as `walletCheckout` (via a shared internal
  helper).

Commission math is a shared **pure** helper (`splitPayment(priceKsh, commissionPercent)`
→ `{ sellerShareKsh, commissionKsh }`), unit-tested independently.

## Client

New/rewired under `src/lib/marketplace/` and `src/components/marketplace/buyer/`:

- **`src/lib/marketplace/wallet.ts`** — `subscribeWallet(accountId, cb)` (live balance),
  `subscribeWalletTx(accountId, cb)`, `walletCheckout(resourceIds)` (calls the
  function), `initiateMpesa(resourceIds)` (calls the function; surfaces
  `mpesa-not-configured`).
- **`src/lib/marketplace/orders.ts`** — `subscribePurchases(accountId, cb)` (orders +
  library, newest first).
- **`Checkout.tsx`** at route **`/market/checkout`** — resolves cart items via
  `getPublishedResource`, shows line items + total, two payment methods:
  - **Wallet**: shows live balance; if `balance < total`, the pay button is disabled
    with "Top up to continue".
  - **M-Pesa**: prefilled with the account's saved `phone`; shows "Not available yet"
    (disabled) until Daraja.
  Pay → `walletCheckout` → on success clear the cart → navigate to **My Library** with
  a success state. Requires login (reuses the market auth gate).
- **Cart entry points** → `/market/checkout`: the cart icon in
  `MarketLayout` and the "In Cart ✓" affordance on `ResourceCard`/`ResourceDetail`.
- **Rewired to real data** (drop the mock imports):
  - `MyLibrary.tsx` ← `subscribePurchases` (owned items; each shows a **download**
    link using the file's public URL — see boundaries).
  - `Orders.tsx` ← `subscribePurchases` (all orders with status/date/amount).
  - `Payments.tsx` ← `subscribeWallet` + `subscribeWalletTx` (real balance +
    transaction history; "Top up" shows "Available once M-Pesa is set up").
- **Admin**: a "Credit wallet" control in the existing admin panel (select/enter an
  account id + KSh → `creditWallet`).

## Security rules (Firestore)

```
match /purchases/{id} {
  allow read:   if isStaff() || (request.auth != null && request.auth.uid == resource.data.buyerAccountId);
  allow write:  if false;   // Cloud Functions only
}
match /ledger/{id} {
  allow read:   if isStaff();
  allow write:  if false;   // Cloud Functions only
}
match /platformSettings/{id} {
  allow read:   if true;
  allow write:  if isAdmin();
}
```
`accounts/{id}` already allows the owner to read/update their own doc; to keep the
balance server-authoritative, tighten the existing `accounts` **update** rule so an
owner update may not change `walletBalanceKsh`:
`request.resource.data.walletBalanceKsh == resource.data.walletBalanceKsh` (admins and
Cloud Functions — which bypass rules — remain able to set it). The `walletTx`
subcollection: owner + staff **read**, no client **write** (functions only).

## Testing (Vitest, mocked-firebase style)

- `splitPayment` pure math (rounding, various commission %).
- `walletCheckout` logic (mocked firebase-admin): insufficient funds rejected;
  sufficient funds deduct + create purchase + ledger split + seller-balance increment;
  already-owned resources skipped.
- `Checkout.tsx`: renders line items + total; wallet-insufficient disables pay; success
  clears the cart and routes to library (mock `wallet.ts`).
- `MyLibrary`/`Orders`/`Payments`: render real data from mocked subscriptions;
  M-Pesa/top-up controls show the "not available yet" state.

## Scope boundaries

- **M-Pesa STK inert** until Daraja credentials exist (then activates, same
  purchase/ledger path, no schema change).
- **Self-service wallet top-up** (via M-Pesa) deferred — admin credits for now.
- **Secure signed-URL downloads** deferred: files are public-read, so library uses the
  public URL; the detail page stays locked for non-owners.
- **Seller payout** accrues as `payoutBalancePending`; actual disbursement + marking
  ledger rows `settled` is manual/later.
- **Single-currency (KES), no refunds/disputes** in this slice.
