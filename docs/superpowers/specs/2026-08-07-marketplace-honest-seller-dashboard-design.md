# Marketplace — Honest Seller Dashboard (Design)

**Date:** 2026-08-07
**Status:** Approved
**Slice:** Replace the seller dashboard's mock data with real data where it exists, and honest empty/zero states everywhere else.

## Purpose

`SellerDashboard.tsx` currently renders entirely from `mockDashboard.ts`: fabricated
earnings (KSh 12,450), sales (245), rating (4.9 / 186 reviews), four fake "Recent
Sales" rows, four fake "Top Resources", a gamified "Gold Teacher 720/1000" level, and
a fabricated 30-day earnings sparkline. None of it reflects the signed-in seller.

This slice makes the dashboard truthful. The data it can show honestly **already
exists** — no new data-access layer is needed:
- `subscribeSellerResources(sellerId)` (from the resource-CRUD slice) — a live list of
  the seller's real resources, each with `status`, `sales`, `views`, `createdAt`.
- `useSellerStore().seller` — the real seller doc, carrying `status`
  (`active | pending | suspended | rejected`), `payoutBalancePending`,
  `payoutBalancePaid`.

Everything that depends on data that does not exist yet (orders, a commission ledger,
reviews) is shown as an honest zero or empty state, not invented.

## Constraint that shapes the design

There are no orders, no ledger entries, and no reviews in the system yet. Therefore
earnings, sales counts, "recent sales", ratings, and earnings history are genuinely
zero/empty for every seller today. The dashboard must present that truthfully. Those
tiles become real when the later payments/orders and reviews slices land.

## Data derivation (all client-side, from the two existing sources)

Given `resources: MarketResource[]` (live) and `seller` (from the store):
- `publishedCount = resources.filter(r => r.status === 'published').length`
- `draftCount     = resources.filter(r => r.status === 'draft').length`
- `totalSales     = resources.reduce((n, r) => n + r.sales, 0)`   // 0 today
- `totalEarnings  = (seller.payoutBalancePaid ?? 0) + (seller.payoutBalancePending ?? 0)` // 0 today
- `topResources   = [...resources].sort(by sales desc, then views desc, then createdAt desc).slice(0, 4)`
- Ratings: none exist → shown as `—` with "No reviews yet".

## Section-by-section changes to `SellerDashboard.tsx`

**Status banners (pending / rejected):** unchanged — already real, driven by
`seller.status`.

**Hero:** copy unchanged. Wire the two dead buttons:
- "Upload New Resource" → navigate `/seller/resources/new`
- "View My Resources" → navigate `/seller/resources`
The "Join 5,000+" badge is marketing copy (not per-user data) — kept.

**Stat cards (4):**
- Total Earnings → `KSh {totalEarnings}` (real payout fields; 0 today). No fake delta.
- Total Sales → `{totalSales}` (0 today). No fake delta.
- Published Resources → real `publishedCount`; subtitle shows real `draftCount`
  (e.g. "2 drafts"), or "All published" when `draftCount === 0`.
- Average Rating → `—`, subtitle "No reviews yet".
The `+18% / +24% / +3 new` deltas are removed (they were fabricated).

**Recent Sales:** the table of 4 fake rows is replaced by an empty state:
"No sales yet — your sales will appear here after your first purchase." (The table
markup returns with the orders slice.)

**My Top Resources:** render the real `topResources`.
- Cover: `thumbnailUrl` when set; otherwise a single fixed brand gradient
  (`from-[#14532d] to-[#22a558]`) with the subject label overlaid. (No shared
  subject→gradient helper exists yet; do not introduce one in this slice.)
- Rating row hidden (no reviews). Show "`{views}` views · `{sales}` sales" (0 · 0 today).
- "Best Seller" badge only when `sales > 0` (so it does not show today).
- Edit → `/seller/resources/:id/edit`; View → `/market/resource/:id` (buyer detail
  route; if that route does not exist yet, View links to the edit page — see Open
  dependency).
- Empty state when the seller has no resources: a prompt linking to
  `/seller/resources/new`.

**Right rail — "Teacher Level" → replaced with an honest "Your account" card:**
- Real status badge from `seller.status` (Active / Pending / Rejected / Suspended).
- Published resources count (real).
- Payout balance: `KSh {totalEarnings}` (0 today).
The fabricated points/progress bar and the "Gold Teacher" tier are removed.

**Right rail — Quick Actions:** wire what is real, disable what is not:
- "Upload New Resource" → `/seller/resources/new`
- "Manage Resources" → `/seller/resources`
- "Create with AI" → disabled / "Coming soon" (no handler yet)
- "Withdraw Earnings" → disabled, with helper text "Available once you have
  earnings" (balance is 0 and there is no payout flow).

**Right rail — Teaching Tips:** kept as-is — generic advice, not fabricated per-user
metrics.

**Right rail — Earnings Trend:** the fabricated sparkline is removed. The card stays
in place showing `KSh 0` and an empty state: "No earnings yet — your trend appears
after your first sale." (The chart returns with the ledger slice.)

## Files

- Modify: `src/components/marketplace/SellerDashboard.tsx` — rewrite to consume real
  data; add empty/zero states; wire navigation.
- Delete: `src/lib/marketplace/mockDashboard.ts` — no longer imported by anything.
- Create: `src/components/marketplace/SellerDashboard.test.tsx`.

The `EarningsChart`, `Stars`, and other small presentational helpers currently inside
`SellerDashboard.tsx` that are no longer used after the rewrite are removed with it.

## Open dependency (does not block this slice)

The buyer resource-detail route `/market/resource/:id` is planned but not yet built.
For the "View" action on a top resource, link to the buyer detail route if it exists;
otherwise fall back to the edit route `/seller/resources/:id/edit`. This slice does not
create the buyer detail route.

## Testing

`src/components/marketplace/SellerDashboard.test.tsx`, mocking
`../../lib/marketplace/resources` (`subscribeSellerResources`) and
`../../store/useSellerStore`:
- Published Resources tile shows the real count of `status==='published'` resources.
- Total Earnings shows `KSh 0` when payout fields are 0.
- Recent Sales shows the "No sales yet" empty state (no fabricated rows).
- Average Rating shows the "No reviews yet" state.
- My Top Resources renders the real resource titles; with zero resources it shows the
  create prompt.
- "Upload New Resource" (hero) links/navigates to `/seller/resources/new`.

## Scope boundaries

Out of scope (later slices): real earnings/sales/recent-sales (payments + orders),
ratings/reviews, gamified levels, the earnings sparkline, "Create with AI", and the
buyer-side listing/detail wiring (its own parked slice).
