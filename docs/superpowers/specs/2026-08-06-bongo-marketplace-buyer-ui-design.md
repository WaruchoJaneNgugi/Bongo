# Bongo Marketplace — Buyer/Student UI (UI-first) — Design

**Date:** 2026-08-06
**Branch:** `feat/marketplace-buyer-ui` (off `feat/marketplace-p1-seller-auth`)
**Status:** Approved design, pending spec review

## Summary

Add a **student-facing marketplace** to the Bongo/HighScores app. Today the student
top-nav has a **"Sell"** tab pointing at `/seller` (a seller login gate). We replace it
with a **"Market"** tab that opens a full buyer marketplace (`/market`) — its own shell
with an 8-item sidebar and eight pages, matching the provided mockup.

The **seller portal also gets a working marketplace**: the currently-dead "Marketplace"
sidebar item in `SellerLayout` becomes a real route (`/seller/marketplace`) that renders
the **same storefront pages** inside the seller's own chrome. The marketplace page
components are therefore **shell-agnostic** — one set of components, rendered in two shells
(buyer chrome for students, seller chrome for sellers).

This build is **UI-first with mock data**: every page is fully laid out and clickable,
populated with realistic sample data. Buy / wishlist / cart actions update local state
(with toasts) but are **not** wired to Firestore or M-Pesa. Real wiring lands later via
the already-committed Phase-1 marketplace plans (Plans 2–6 in
`2026-08-05-bongo-marketplace-phase1-digital-slice-design.md`). Mock data shapes mirror
the intended real schema so that wiring is a drop-in replacement — the same convention
established by `src/lib/marketplace/mockDashboard.ts`.

## Goals / Non-goals

**Goals**
- Replace the "Sell" nav tab with "Market" (desktop nav + mobile drawer).
- Build a buyer marketplace shell (sidebar + top bar + `<Outlet/>`) reusing the student session.
- Build 8 fully-styled pages populated with mock data.
- Keep the seller path reachable via a "Become a Seller" CTA inside the marketplace.
- Local, believable interactivity for cart/wishlist via a small Zustand store.

**Non-goals (this build)**
- No Firestore reads/writes, no M-Pesa STK, no real downloads, no server functions.
- No changes to the learner mobile bottom bar (Home/Subjects/Mock/Profile).
- No new backend, rules, or auth. `/market` reuses the existing `ProtectedRoute` student session.

## Access model

- `/market` is wrapped in the existing `ProtectedRoute` → any logged-in student opens it
  directly, no extra login.
- The seller entry point is **moved into** the marketplace: a "Become a Seller" CTA in the
  buyer sidebar links to the existing `/seller` gate. The top-nav "Sell" tab is removed in
  favour of "Market".
- `/seller/marketplace` sits inside the existing `SellerProtectedRoute` + `SellerLayout` →
  only logged-in sellers reach it, from their own sidebar.

## Two shells, shared pages

The storefront content (marketplace **Home** landing and **Browse** grid) is factored into
shell-agnostic components under `.../buyer/pages/`. They depend only on `mockBuyer.ts` and
`useMarketStore` — never on a specific layout — so the same component renders correctly
whether the surrounding chrome is `MarketLayout` (buyer) or `SellerLayout` (seller).

- **Buyer shell** (`MarketLayout`, `/market/*`): full 8-item sidebar + all 8 pages.
- **Seller shell** (`SellerLayout`, `/seller/marketplace`): renders the shared **Browse**
  storefront (`MarketBrowse`) inside the seller's existing sidebar/topbar. The seller keeps
  their own sidebar; only the main content is the shared storefront.

## Navigation changes

`src/components/Navbar.tsx`
- Desktop `nb-links`: change the `/seller` "Sell" `<Link>` to `/market` "Market" (keep `Store` icon).
- Mobile drawer: change the `/seller` "Sell on Bongo" item to `/market` "Market".
- Bottom bar unchanged.

`src/App.tsx`
- Add `const isMarket = location.pathname.startsWith('/market')`.
- Hide the learner `Navbar` and `Footer` on `/market` (extend the existing `isSeller` conditions),
  because the marketplace renders its own full-screen shell.
- Register the `/market` route group (below).
- Add `/seller/marketplace` inside the existing seller route group (`SellerProtectedRoute` →
  `SellerLayout`), rendering `MarketBrowse`.

`src/components/marketplace/SellerLayout.tsx`
- The `NAV` "Marketplace" entry becomes real: `{ label: 'Marketplace', icon: Store,
  to: '/seller/marketplace', real: true }` so it renders as an active `NavLink`.

## Routes

Wrapped in `ProtectedRoute` → `MarketLayout` (renders `<Outlet/>`):

| Path                     | Component        | Sidebar label   |
|--------------------------|------------------|-----------------|
| `/market`                | `MarketHome`     | Home            |
| `/market/browse`         | `MarketBrowse`   | Marketplace     |
| `/market/library`        | `MyLibrary`      | My Library      |
| `/market/messages`       | `Messages`       | Messages        |
| `/market/wishlist`       | `Wishlist`       | Wishlist        |
| `/market/orders`         | `Orders`         | Orders          |
| `/market/subscriptions`  | `Subscriptions`  | Subscriptions   |
| `/market/payments`       | `Payments`       | Payments        |

Plus, inside the **seller** route group (`SellerProtectedRoute` → `SellerLayout`):

| Path                     | Component        | Sidebar label   |
|--------------------------|------------------|-----------------|
| `/seller/marketplace`    | `MarketBrowse`   | Marketplace     |

## Files

```
src/components/marketplace/buyer/
  MarketLayout.tsx          # sidebar + top bar + <Outlet/>; mobile hamburger drawer
  pages/
    MarketHome.tsx
    MarketBrowse.tsx
    MyLibrary.tsx
    Messages.tsx
    Wishlist.tsx
    Orders.tsx
    Subscriptions.tsx
    Payments.tsx
  components/               # small shared bits used across pages
    ResourceCard.tsx        # cover, title, seller, rating, price, Buy/Wishlist
    SectionHeader.tsx       # "Title  ...  View all"
src/lib/marketplace/
  mockBuyer.ts              # all buyer mock data (schema-shaped)
src/store/
  useMarketStore.ts         # cart[] + wishlist[] local state (Zustand)
```

## Component boundaries

- **MarketLayout** — owns chrome only (sidebar nav via `NavLink`, top bar with search/cart/
  bell/avatar, mobile drawer open/close state). Reads student name/grade from `useStore`,
  cart/wishlist counts from `useMarketStore`. Renders `<Outlet/>`. Knows nothing about page data.
- **Pages** — each reads its slice from `mockBuyer.ts` and, where interactive, calls
  `useMarketStore` actions. Each page is independently understandable and renders in isolation.
  Pages are **shell-agnostic**: no imports from `MarketLayout`/`SellerLayout`, no assumptions
  about surrounding chrome. `MarketBrowse` is the page shared between both shells.
- **ResourceCard** — presentational; takes a `Resource` + handlers. Reused by Home, Browse,
  Wishlist, Library.
- **useMarketStore** — the only stateful logic. `cart`, `wishlist` arrays of resource ids;
  actions `addToCart/removeFromCart/toggleWishlist/clearCart`; selectors for counts and membership.

## Data flow

```
mockBuyer.ts ──(static catalog: resources, categories, subjects,
                orders, library, subscriptions, payments, wallet)──► pages
useStore ──(student profile: name, grade, xp)──► MarketLayout top bar
useMarketStore ──(cart[], wishlist[])──► MarketLayout badges + interactive pages
                    ▲
                    └── Buy / Add-to-cart / Wishlist buttons dispatch actions + toast
```

## Page contents

- **MarketHome** (mirrors mockup): green hero ("Learn. Teach. Earn."), search + category
  select, stat chips (10K+ Resources, 5K+ Teachers, 50K+ Students, 100+ Schools), Browse by
  Category, Top Resources with Popular / Latest / Top-Rated tabs, Popular Subjects strip,
  right rail (My Learning, Wallet Balance + Top-up, How It Works). The mockup's "Seller
  Earnings" widget is **replaced** with a "Become a Seller" promo card (this is a student view).
- **MarketBrowse** — resource grid with sidebar/inline filters (category, subject, price band,
  rating) + search + sort. Reuses `ResourceCard`.
- **MyLibrary** — grid of purchased resources with Open / Download; empty-state when none.
- **Wishlist** — saved resources (from `useMarketStore.wishlist`), remove / move-to-cart.
- **Orders** — order history list/table: item, date, amount, status (Completed/Pending/Refunded),
  receipt link.
- **Subscriptions** — current plan card + available plans (Free / Student Plus / Family) with CTAs.
- **Payments** — wallet balance + Top-up, M-Pesa payment method card, transaction history table.
- **Messages** — two-pane: conversation list + selected thread (mock messages).

## Styling & responsiveness

- Tailwind, brand green (`#16a34a` primary, `#157347`/`#15803d` deep), lucide icons — matching
  `SellerLayout`.
- Desktop: fixed 260px sidebar + fluid main. Mobile (`<lg`): sidebar hidden, opened via a
  hamburger in the top bar as a slide-in drawer with overlay.
- Cards use gradient cover accents (`from-… to-…`) as in `mockDashboard.ts`.

## Testing

UI-first, so tests focus on the parts with real behaviour:
- `useMarketStore` unit tests: add/remove cart, toggle wishlist (idempotence, counts).
- Smoke render tests: `MarketLayout` renders the 8 sidebar items; each page renders without
  crashing given mock data.
- Nav test: `Navbar` renders a **Market** link to `/market` and no longer a "Sell" link.
- `MarketBrowse` renders standalone (shell-agnostic) — the seller `/seller/marketplace` reuse
  works because the page has no layout dependency.

## Rollout / follow-ups

- Later: wire MarketBrowse/Home to real Firestore listings (Phase-1 Plan 3 storefront),
  MyLibrary/Orders/Payments to ledger + downloads (Plans 4–6). Mock shapes are kept stable to
  make these drop-in.
