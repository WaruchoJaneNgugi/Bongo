# Bongo UI Redesign — Phase 0: Foundation & Loader

**Date:** 2026-08-05
**Status:** Approved design (pre-implementation)
**Direction:** Premium & Modern on a **white** theme — refined, light-glassmorphic, generous whitespace, restrained gold accent. Green `#157347` primary, gold `#d4a017` premium accent, Poppins headings + Nunito body.

---

## Context

Bongo is a Kenyan CBC education platform (React 19 + TypeScript + Vite + Tailwind + Framer Motion, Firebase backend) with ~40 view components across public marketing, a learner dashboard, level portals, games, and admin. The user requested a full UI redesign delivered in **phases**.

The current styling is ~30 hand-written CSS files plus a token layer in `src/styles/globals.css`. The token layer works but carries debt:

- `--purple-*` custom properties actually hold **green** values (a legacy rename never propagated) — misleading to any developer.
- Dark theme is implemented as a large block of `!important` per-page overrides rather than token-level switching.
- The splash loader (`SplashScreen.tsx`) uses an off-brand **purple** wordmark (`#3b0764`) that clashes with the green brand.

This spec covers **Phase 0 only** — the shared foundation every later phase inherits. It does not redesign any page; it establishes tokens, primitives, and the loader.

## The phased roadmap (context — later phases are separate specs)

| Phase | Scope |
|---|---|
| **0 · Foundation** *(this spec)* | Token cleanup + reusable primitives + new splash loader + in-app loader |
| 1 · Public shell | Navbar, Footer, LandingPage, About, 404 |
| 2 · Learner core | DashboardLayout + LearnHome, Subjects, SubjectTopics, Settings |
| 3 · Learn flows | Exams, Revision, Books/Reader, Topic lesson/test, Leaderboard, Achievements, Challenges, Community |
| 4 · Level portals + Games | LowerPrimary / MiddleSchool / SeniorSchool dashboards, GamesPage/Hero |
| 5 · Admin | AdminPanel + sections |

Each subsequent phase gets its own spec → plan → build cycle and **adopts** the Phase 0 primitives as it is touched (no big-bang migration).

## Goals

1. A clean, single source of truth for design tokens on a premium-white theme.
2. A new, on-brand splash loader matching the approved concept.
3. A reusable in-app `<Loader/>` for route/data loading states.
4. A small set of primitive UI classes (Button, Card/glass surface, Chip, ProgressBar) later phases compose from.
5. **Zero visual regression** on existing pages (tokens resolve to the same green values; new primitives are additive/unused until adopted).

## Non-goals

- Redesigning any existing page (that is Phases 1–5).
- Migrating existing CSS files to the new primitives.
- Removing the dark theme (kept; only cleaned at the token level where low-risk).
- Introducing a new dependency or a Tailwind theme rewrite.

---

## Approach

**Evolve tokens + add primitives** (chosen over a full component library or a Tailwind rewrite). Keep the existing CSS-file architecture; improve the token layer in place; add new shared React/CSS primitives starting with the loader; let later phases adopt them incrementally. Lowest risk, ships value each phase.

## Design detail

### 1. Token layer (`src/styles/globals.css`)

**Premium-white surface & depth tokens (new / refined):**

```
--surface-1:   #ffffff;   /* base cards            */
--surface-2:   #fbfdfc;   /* page background       */
--surface-3:   #f4faf6;   /* subtle raised / hover */
--surface-glass: rgba(255,255,255,0.70);
--hairline:    #e7f0ea;   /* thin borders          */
--hairline-strong: #cfe6da;

/* green-tinted soft shadow scale */
--shadow-1: 0 2px 8px  rgba(16,60,40,0.06);
--shadow-2: 0 6px 20px rgba(16,60,40,0.07);
--shadow-3: 0 10px 34px rgba(16,60,40,0.10);
--shadow-cta: 0 6px 18px rgba(21,115,71,0.28);

/* gold accent scale */
--gold-100: #faf1d6; --gold-300: #ecc75a; --gold-500: #d4a017; --gold-700: #a87d0e;
```

**Brand rename (debt fix):** introduce semantic `--brand-50…--brand-900` mapped to the existing green values. Keep `--purple-*` as **aliases** pointing at the new `--brand-*` names for one phase so nothing breaks; later phases migrate references and the aliases are removed. `--primary`, `--primary-light`, `--primary-dark` stay.

**Constraint:** every existing token keeps its current resolved value (or an identical one). This is what guarantees no regression.

### 2. Splash loader (`src/components/SplashScreen.tsx` + scoped CSS)

Replace the current cap+wordmark+bar with the approved concept:

- Light radial base (`--surface-1` → `--surface-3`) with a faint masked dot-grid.
- **Dual-ring** spinner: outer ring green top / gold right; inner ring counter-rotating green-light; cap glyph pulsing at center.
- Wordmark "High**Scores**." — `#0f5132` + `--primary` + gold period. (No purple.)
- Letter-spaced uppercase sublabel ("Learning, elevated").
- Thin gradient progress bar (green→gold).

**Behavior unchanged:** `SplashScreen` still calls `onDone` after the intro animation; `App` still holds the splash until intro finishes **and** `authReady` is true (prevents flashing landing before dashboard). Timings preserved (~1.8s reveal → 2.3s done) unless we tune during build.

New CSS lives in a dedicated block (or `src/styles/splash.css`) rather than inline in `globals.css`, keeping `globals.css` focused on tokens.

### 3. In-app `<Loader/>` component (new: `src/components/ui/Loader.tsx`)

Small reusable loader for route transitions and Firebase data fetches. Props: `size` (`sm|md|lg`), `label?`, `fullscreen?`. Renders the single-ring green/gold variant on a transparent or `--surface-2` backdrop. Later phases use this in place of ad-hoc "Loading…" text and the `authReady`/`null` route gaps in `App.tsx`.

### 4. Primitive classes (new: `src/styles/primitives.css`, imported once)

Composable, token-driven classes matching the mockup — additive, no existing selector touched:

- `.ui-btn`, `.ui-btn--ghost` — gradient primary CTA + white ghost.
- `.ui-card`, `.ui-card--glass` — white/near-white surface with hairline + `--shadow-2`; glass adds blur + translucency.
- `.ui-chip` — pill (used for XP, badges, filters).
- `.ui-progress` / `.ui-progress > i` — track + green-gradient fill.

### Component & data flow

- `App.tsx` — unchanged control flow; only swaps the visual of `SplashScreen` (already imported) and may later render `<Loader/>` in the `!authReady` route gaps (deferred to when a phase touches those routes).
- `SplashScreen.tsx` — same props/callback contract; new internals + markup.
- `ui/Loader.tsx` — standalone, dependency-free, used opt-in by later phases.
- CSS import order in `globals.css`: tokens → `animations.css` → `primitives.css`.

### Error handling / edge cases

- Loader is presentational; no failure modes. Reduced-motion: honor `prefers-reduced-motion` by pausing ring spin and showing a static state (accessibility).
- Token rename must not break third-party/global selectors — verified by grepping `--purple-` usage and keeping aliases.

## Testing / verification

1. `tsc -b` and `vite build` complete with no new errors.
2. `vite dev` boots; the new splash loader shows on cold load and dismisses correctly once `authReady`.
3. Visual regression pass: LandingPage, a learner dashboard page, and Games page render unchanged (tokens resolve to identical values).
4. `grep -r "--purple-" src` — every remaining reference still resolves via alias.
5. `prefers-reduced-motion` honored (manual toggle).

## Risks

- **Token rename breakage** — mitigated by keeping `--purple-*` aliases this phase.
- **Dark-theme interactions** — we only add light-theme tokens and leave existing dark overrides intact this phase; no dark regressions expected.
- **Scope creep** — Phase 0 explicitly ships *no page redesign*; primitives are unused until later phases adopt them.
