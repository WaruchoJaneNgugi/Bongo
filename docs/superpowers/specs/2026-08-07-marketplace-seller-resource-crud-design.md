# Marketplace — Seller Resource CRUD (Design)

**Date:** 2026-08-07
**Status:** Approved
**Slice:** Seller resource management (create / list / edit / publish / delete)

## Purpose

The Bongo marketplace frontend is ~80% mock: browse, orders, library, payments,
dashboard analytics and messages all read from `src/lib/marketplace/mockBuyer.ts`
and `mockDashboard.ts` with no Firestore behind them. The root cause is that
**nothing produces real resources** — there is no way for a seller to create the
digital products the entire buyer side would read.

This slice builds that root: a seller can create, list, edit, publish/unpublish
and delete their own resources, backed by Firestore and Firebase Storage. It is
the prerequisite for every later marketplace slice (buyer browse, orders,
library, payments, commission ledger, analytics).

## What already exists (context)

- **Seller auth is real.** `sellerSignup`/`sellerLogin` Cloud Functions issue a
  Firebase custom token via `createCustomToken(sellerId, { seller: true })`, and
  the client calls `signInWithCustomToken`. So in security rules
  `request.auth.uid == sellerId` and `request.auth.token.seller == true`.
- **Seller doc** `sellers/{sellerId}` carries `status`
  (`active | pending | suspended | rejected`), `payoutBalancePending`,
  `payoutBalancePaid` — a ledger foundation for a later slice.
- **Access-layer pattern** already established in `src/lib/adminData.ts`
  (live `onSnapshot` subscriptions + `updateDoc` mutations); this slice mirrors it.
- **Rules helpers** already defined in `firestore.rules`: `isSeller()`,
  `isStaff()`, `isAdmin()`, `isOwner(uid)`.
- **Seller shell** `SellerLayout.tsx` has placeholder nav entries ("My Resources",
  "Create Resource", "Upload Resource" button) not yet wired to routes.

## Decisions

1. **Resource = multi-file bundle.** One resource holds several files (e.g.
   worksheet + answer key + slides), not a single file.
2. **Direct Firestore + Storage writes, secured by rules** (not onCall Functions).
   Mirrors the existing `adminData.ts` pattern; real-time; least boilerplate.
3. **Public read for files in this slice.** Paid-file download gating is deferred
   to the payments slice. See *Known limitations*.
4. **Level-linked subject/grade.** The form constrains level → grade → subject
   using `LEVEL_CONFIG` as the single source of truth (via a small `taxonomy.ts`
   helper), so resource metadata matches how learners browse the rest of the app.

## Data model

### Firestore `resources/{resourceId}`

```
sellerId       string     // == owner's auth uid (the sellerId)
sellerName     string     // denormalized for cheap listing display
title          string
description    string
level          'lower_primary' | 'middle_school' | 'senior_school'  // LEVEL_CONFIG key
grade          string     // e.g. "Grade 5" (from the level's grade band)
subject        string     // e.g. "Mathematics" (from the level's subject list)
priceKsh       number     // 0 = free
files          ResourceFile[]      // the multi-file bundle (>= 1)
thumbnailUrl   string | null
thumbnailPath  string | null       // Storage path retained so it can be deleted
status         'draft' | 'published'
sales          number     // starts 0; orders slice increments server-side later
views          number     // starts 0
createdAt      timestamp  // serverTimestamp
updatedAt      timestamp  // serverTimestamp
```

```
ResourceFile = {
  name        string
  url         string     // download URL
  path        string     // full Storage path, retained for deletion
  size        number     // bytes
  contentType string
}
```

### Storage layout

```
marketplace/{sellerId}/{resourceId}/thumb.<ext>
marketplace/{sellerId}/{resourceId}/files/<filename>
```

Public read (per decision). Seller writes only under their own `{sellerId}` prefix.

## Access layer — `src/lib/marketplace/resources.ts`

A thin data module in the style of `adminData.ts`. UI imports these functions and
never touches Firestore/Storage directly.

- `subscribeSellerResources(sellerId, cb): Unsubscribe`
  Live `onSnapshot` of `resources` where `sellerId == uid`, ordered `createdAt`
  desc. Returns `MarketResource[]` (with `id`) to the callback.
- `getResource(id): Promise<MarketResource | null>`
- `createResource(seller, input, files, thumbnail?, onProgress?): Promise<string>`
  Generates a new doc id, uploads `files` (and optional `thumbnail`) to Storage
  under that id, then writes the doc. Returns the new resource id. `onProgress`
  reports overall upload progress (0–1).
- `updateResource(id, patch, opts?): Promise<void>`
  `patch` covers metadata fields (title/description/subject/grade/priceKsh).
  `opts = { addFiles?, removeFilePaths?, newThumbnail? }` handles file bundle
  changes and thumbnail replacement, updating Storage and the `files` array.
- `setResourceStatus(id, status): Promise<void>` — publish/unpublish toggle.
- `deleteResource(resource): Promise<void>` — deletes all Storage objects (files +
  thumbnail) then the Firestore doc.

### New types (`src/lib/marketplace/types.ts`)

```ts
export type ResourceStatus = 'draft' | 'published';

/** LEVEL_CONFIG keys (src/hooks/LevelConfigs.ts). */
export type ResourceLevel = 'lower_primary' | 'middle_school' | 'senior_school';

export interface ResourceFile {
  name: string;
  url: string;
  path: string;
  size: number;
  contentType: string;
}

export interface MarketResource {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  level: ResourceLevel;
  grade: string;
  subject: string;
  priceKsh: number;
  files: ResourceFile[];
  thumbnailUrl: string | null;
  thumbnailPath: string | null;
  status: ResourceStatus;
  sales: number;
  views: number;
  createdAt: unknown;   // Firestore Timestamp
  updatedAt: unknown;
}

/** Editable metadata supplied by the form (files handled separately). */
export interface ResourceInput {
  title: string;
  description: string;
  level: ResourceLevel;
  grade: string;
  subject: string;
  priceKsh: number;
  status: ResourceStatus;
}
```

### Taxonomy helper (`src/lib/marketplace/taxonomy.ts`)

Single source of truth for the form's level-linked dropdowns, derived from
`LEVEL_CONFIG` (`src/hooks/LevelConfigs.ts`) so subjects never drift from the rest
of the app. `LEVEL_CONFIG` already provides each level's `label` and `subjects`;
this helper adds the explicit per-band grade arrays (LEVEL_CONFIG only stores a
display string like `'Grade 1–3'`).

```ts
export interface LevelTaxonomy {
  key: ResourceLevel;
  label: string;      // from LEVEL_CONFIG[key].label
  grades: string[];   // e.g. ['Grade 1','Grade 2','Grade 3']
  subjects: string[]; // from LEVEL_CONFIG[key].subjects
}

export const RESOURCE_LEVELS: LevelTaxonomy[] = [ /* lower_primary, middle_school, senior_school */ ];
```

Grade bands: lower_primary → Grade 1–3, middle_school → Grade 4–9,
senior_school → Grade 10–12.

## Security rules

### `firestore.rules` — new block (uses existing helpers)

```
match /resources/{id} {
  allow read:   if resource.data.status == 'published'
                || isStaff()
                || (isSeller() && request.auth.uid == resource.data.sellerId);
  allow create: if isSeller()
                && request.auth.uid == request.resource.data.sellerId;
  allow update: if (isSeller()
                    && request.auth.uid == resource.data.sellerId
                    && request.resource.data.sellerId == resource.data.sellerId)  // owner cannot be reassigned
                || isAdmin();
  allow delete: if (isSeller() && request.auth.uid == resource.data.sellerId)
                || isAdmin();
}
```

`sales`/`views` start at 0 and are client-written in this slice; they will be
locked to server-only writes when the orders slice adds server-side increments.

### `storage.rules` — add seller-writable marketplace path

Public read is already granted by the existing top-level `match /{allPaths=**}`
wildcard; this rule adds seller write to their own prefix.

```
match /marketplace/{sellerId}/{allPaths=**} {
  allow read:  if true;
  allow write: if request.auth != null
               && request.auth.uid == sellerId
               && request.auth.token.seller == true
               && request.resource.size < 50 * 1024 * 1024;   // 50 MB per file
}
```

## UI (under `SellerLayout`)

Two new components plus routes, wiring the existing sidebar placeholders.

- **`MyResources.tsx`** — route `/seller/resources`. Live list (via
  `subscribeSellerResources`) of the seller's resources: thumbnail, title,
  subject/grade, price, file count, status badge (`draft`/`published`), and
  per-row actions (edit, publish-toggle, delete with confirm). Empty state links
  to create.
- **`ResourceForm.tsx`** — routes `/seller/resources/new` and
  `/seller/resources/:id/edit`. Fields: title, description, **level → grade →
  subject** (level-linked dropdowns from `RESOURCE_LEVELS`; choosing a level
  filters the grade and subject options, and clears grade/subject if they no
  longer belong to the new level), priceKsh, a multi-file dropzone (add/remove),
  optional thumbnail. Actions: "Save draft" and "Publish". Shows upload progress;
  disables submit while uploading. On edit, loads the existing resource
  (pre-selecting its level so grade/subject populate) and supports adding/removing
  files.

### Nav wiring (`SellerLayout.tsx`)

- "My Resources" nav item → `/seller/resources` (mark `real: true`).
- "Create Resource" quick link, "Upload Resource" top-bar button, and the sidebar
  CTA → `/seller/resources/new`.
- Register the three routes wherever seller routes are declared (alongside the
  existing `/seller/dashboard` route), nested under `SellerLayout` and guarded by
  `SellerProtectedRoute`.

## Testing (Vitest, mocked-firebase style matching existing tests)

- `resources.test.ts` — `ResourceInput` validation, Storage path construction,
  and access-layer functions (create/update/setStatus/delete) with `firebase/*`
  mocked; asserts the Firestore/Storage calls and payloads.
- `MyResources.test.tsx` — empty state, list rendering, publish-toggle and delete
  invoking the access layer (mocking `resources.ts`).
- `ResourceForm.test.tsx` — required-field validation, level-linked dropdown
  behavior (changing level filters grade/subject options and clears now-invalid
  selections), and that "Save draft" vs. "Publish" produce the correct `status`
  in the submitted payload.
- `taxonomy.test.ts` — `RESOURCE_LEVELS` exposes the three levels with correct
  grade bands and subjects sourced from `LEVEL_CONFIG`.

## Known limitations (accepted for this slice)

- **Paid files are publicly readable.** Anyone with a file URL can download it
  without paying. Acceptable now because no buyer purchase flow exists; download
  gating (signed URLs or a purchase-check function) is part of the payments slice.
- **Publishing is not gated on seller approval status.** Any authenticated seller
  (including `pending`) may create and publish. Enforcing "only `active` sellers
  may publish/sell" is deferred; it will be enforced at the buyer/checkout layer
  and/or by tightening the `create`/`update` rule with a `get()` on the seller
  doc.
- **`sales`/`views` are client-writable** until the orders slice moves increments
  server-side.

## Out of scope (later slices)

Buyer-side browse/read of these resources, download gating, orders/checkout,
M-Pesa payments, commission ledger/payouts, seller analytics, AI assist.
