# Bongo Marketplace — Phase 1: Digital Vertical Slice (Design)

**Date:** 2026-08-05
**Status:** Approved (brainstorming) — pending implementation plan
**Repo:** `/home/jane-ngugi/Bongo` (React 19 + TS + Vite + Tailwind + Firebase; Firestore, Cloud Functions, Storage; Zustand; Framer Motion)

---

## 1. Goal & Scope

### One-sentence goal
A teacher registers as a seller, uploads a digital resource (PDF notes/exam) that an admin approves, a student finds it in a search-first storefront and pays via M-Pesa, the sale is split into a commission ledger, and the student gets permanent library access with a secure download.

### In scope (Phase 1)
- Seller accounts + authentication (separate from family/student accounts).
- Listing upload with metadata + admin approval workflow (pending → approved/rejected).
- Search-first storefront: search + subject/form/type/price filters + product grid.
- Product page with a free page-preview (first pages) before purchase.
- M-Pesa STK Push checkout with asynchronous callback confirmation.
- Commission ledger (append-only, double-entry style) with configurable commission %.
- Buyer library + secure, access-controlled download.
- Seller dashboard: listings + earnings (pending vs paid balance).
- Admin: review queue + commission-percent setting.

### Explicitly deferred (later phases — NOT in this build)
- Reviews / ratings.
- AI features (Claude summary, quiz generation, flashcards) — unlock **after purchase** in a later phase.
- Video courses, live classes, one-on-one tutoring.
- Subscriptions / premium tiers.
- Automated B2C payouts (Phase 1 payouts are manual/batched off the ledger).
- Physical goods (uniforms, laptops, calculators, etc.).
- Cart / multi-item checkout (Phase 1 = buy one item at a time).
- Third-party search infra (Algolia/Typesense) — Phase 1 uses Firestore keyword-array filtering.

---

## 2. Key Decisions (from brainstorming)

| # | Decision | Choice |
|---|----------|--------|
| 1 | V1 scope | Digital vertical slice (list → pay → credit → download) |
| 2 | Money model | Collect now via STK into platform Paybill; ledger records seller share + platform commission; **manual/batched payout later** (schema designed so automated B2C drops in with no schema change) |
| 3 | Moderation | **Admin approval before live** (pending/approved/rejected) |
| 4 | Seller identity | **Separate `sellers` collection** with its own phone+PIN auth and dashboard; one phone may also hold a family account |
| 5 | Browse model | **Search-first storefront** (search + filters + grid); Firestore keyword-array filtering for MVP |
| 6 | AI timing | **After purchase** (owner perk, later phase); free page-preview sells before purchase |
| 7 | Payment confirmation | **Server-side only** — Safaricom callback confirms; browser never marks paid |
| 8 | Commission | Admin-configurable **platform setting**, default **15%** (seller keeps 85%) |

---

## 3. Architecture & Units

Everything lives inside the existing `Bongo` app/repo, reusing Firebase (Firestore, Storage, Cloud Functions, custom-token auth). New code is namespaced under `src/lib/marketplace/`, `src/components/marketplace/`, and additions to `functions/src/`.

### Client units
- `src/lib/marketplace/sellerAuth.ts` — seller signup/login. Mirrors `src/lib/studentAuth.ts`: phone+PIN → Cloud Function → Firebase custom token → `signInWithCustomToken`.
- `src/lib/marketplace/listings.ts` — listing CRUD wrappers + search/filter queries.
- `src/lib/marketplace/purchases.ts` — initiate purchase, subscribe to purchase status, library queries.
- `src/components/marketplace/MarketplaceBrowse.tsx` — search bar + filter sidebar + product grid (search-first storefront).
- `src/components/marketplace/ProductPage.tsx` — details, tags, free preview, "Buy with M-Pesa".
- `src/components/marketplace/BuyerLibrary.tsx` — student's purchased items + download buttons.
- `src/components/marketplace/SellerDashboard.tsx` — seller's listings, statuses, earnings (pending/paid).
- `src/components/marketplace/ListingEditor.tsx` — upload file + preview + metadata; submit for review.
- Admin: a **Review Queue** view added to the existing admin panel (`src/components/admin/`).

### Server units (Cloud Functions — hold all secrets & trust)
- `sellerSignup` / `sellerLogin` — PIN hashed server-side; returns custom token (reuse existing student auth mechanism).
- `createListing` / `submitForReview` — persists listing with `status: pending`.
- `reviewListing` — admin-only; sets `approved` or `rejected` (+ reason).
- `mpesaInitiate` — re-reads listing price from Firestore, creates `pending` purchase, calls Daraja STK Push, returns `checkoutRequestId`.
- `mpesaCallback` — **trust boundary**. Verifies Safaricom callback, idempotent on `checkoutRequestId`, flips purchase → `paid`, writes ledger split, increments seller pending balance, grants access.
- `getDownloadUrl` — verifies caller owns a `paid` purchase for the listing; returns a short-lived signed Storage URL for the original file.

### Design principle
The client can **request** actions but can never **confirm payment** or **grant file access** — only server functions can, because only they can verify Safaricom callbacks and mint signed URLs. Each function has one clear responsibility.

---

## 4. Data Model (Firestore)

```
sellers/{sellerId}
  phone, pinHash (server-only), displayName,
  type: teacher | tutor | school,
  status: active | suspended,
  payoutBalancePending, payoutBalancePaid,
  createdAt

listings/{listingId}
  sellerId, title, description,
  subject, form: 1 | 2 | 3 | 4 | KCSE,
  type: notes | exam | scheme | ppt | marking,
  priceKsh,
  status: pending | approved | rejected, rejectionReason?,
  filePath (Storage, protected), previewPath (Storage, readable), fileSizeKb,
  keywords: string[]  // denormalized for search/filter
  salesCount,
  createdAt, reviewedAt, reviewedBy

purchases/{purchaseId}
  listingId, sellerId, buyerAccountId, buyerProfileId?,
  priceKsh,
  status: pending | paid | failed,
  mpesa: { checkoutRequestId, merchantRequestId, mpesaReceipt?, phone },
  commissionKsh, sellerShareKsh,
  createdAt, paidAt

ledger/{entryId}   // append-only; one seller_earning + one platform_commission per paid sale
  purchaseId,
  type: seller_earning | platform_commission,
  sellerId?, amountKsh,
  settled: bool, settledAt?,
  createdAt

platformSettings/marketplace   // single document
  commissionPercent   // default 15
  payoutMinimumKsh
```

### Access model
- A student's purchases are keyed by `buyerAccountId`. The library queries `purchases where buyerAccountId == me && status == paid`.
- Downloads never expose raw Storage paths — only `getDownloadUrl` issues short-lived signed URLs.
- `keywords[]` is built at write time (from title/subject/type/form) so the storefront can filter/search without external search infra.

---

## 5. Key Flows

### 5.1 Seller onboarding & listing
1. Seller signs up (phone+PIN) → `sellers` doc, `status: active`.
2. Seller uploads file + preview + metadata via `ListingEditor` → `createListing` writes `status: pending`.
3. Admin sees it in the Review Queue → `reviewListing` sets `approved` (visible in storefront) or `rejected` (with reason, visible only to seller).

### 5.2 Purchase (M-Pesa STK Push — asynchronous)
1. **Initiated:** student taps "Buy with M-Pesa", confirms phone (prefilled). Client calls `mpesaInitiate`.
2. `mpesaInitiate` re-reads listing price, creates a `pending` purchase, triggers Daraja STK Push, returns `checkoutRequestId`.
3. **Pending:** student sees "Check your phone, enter M-Pesa PIN". Nothing unlocked. Client subscribes to the purchase doc.
4. **Confirmed:** Safaricom calls `mpesaCallback`. Function verifies + is idempotent on `checkoutRequestId`, flips purchase → `paid`, writes ledger split, credits seller pending balance, increments `salesCount`. Client sees the status change and unlocks the library entry.
5. **Failed/timeout:** cancelled, wrong PIN, or no callback → purchase → `failed`. No access, no ledger entry. Student may retry.

### 5.3 Ledger split (example: KSh 250 sale, 15% commission)
- `seller_earning`: KSh 212.50 → seller `payoutBalancePending`.
- `platform_commission`: KSh 37.50 → platform.
- Amounts computed **only** in `mpesaCallback` from the Firestore listing price (never client-sent).

### 5.4 Download
- Student opens library item → client calls `getDownloadUrl` → function verifies a `paid` purchase → returns short-lived signed URL → download.

### 5.5 Payout (manual, Phase 1)
- Admin views seller pending balances (from unsettled `seller_earning` ledger rows), pays out via M-Pesa manually, and marks the corresponding ledger rows `settled` (moves seller balance pending → paid). Automated B2C is a later phase using the same ledger.

---

## 6. Security & Integrity

- **Payment confirmation is server-only** via verified Safaricom callback; idempotent on `checkoutRequestId` so duplicate callbacks never double-credit.
- **Firestore rules:**
  - `listings`: public read only when `status == approved`; `pending`/`rejected` readable only by owning seller + admins; writes via functions/owner rules only.
  - `purchases` and `ledger`: **not client-writable** — Cloud Functions only. Sellers cannot read other sellers' earnings.
  - `platformSettings`: read by app; write admin-only.
- **File protection:** original files in a Storage path with **no public read**; access only via short-lived signed URLs from `getDownloadUrl`. Previews live in a separate, publicly readable path.
- **Money math** (split, balances) computed exclusively in `mpesaCallback`, re-reading listing price from Firestore.

---

## 7. Testing & Build Sequence

### Testing
- Add **Vitest** (no runner exists yet). Unit-test the risk-carrying pure logic with the Firebase layer behind thin, mockable interfaces:
  - commission/split math,
  - ledger entry generation,
  - purchase state transitions,
  - callback idempotency.
- STK initiate + callback: integration test against Daraja **sandbox**.

### Build order (each becomes a plan step)
1. Seller auth (signup/login client + Cloud Functions) — reuse student pattern.
2. Listing model + upload + admin review queue.
3. Storefront: browse/search/filter + product page + preview.
4. M-Pesa: `mpesaInitiate` + `mpesaCallback` + ledger split (sandbox).
5. Buyer library + `getDownloadUrl` secure download.
6. Seller earnings/pending-balance view + commission setting.

### Config
- Daraja runs against **sandbox** with credentials in Functions config/env. Going live swaps keys — no code change.

---

## 8. Open Items for Implementation Planning
- Exact Daraja endpoints/params + sandbox credential setup steps.
- Preview generation: whether sellers upload a separate preview file (Phase 1 default) vs auto-extracting first pages (deferred).
- Firestore composite indexes needed for filter combinations.
- Reuse vs adapt of existing PIN-hashing helper in `functions/src/index.ts`.
