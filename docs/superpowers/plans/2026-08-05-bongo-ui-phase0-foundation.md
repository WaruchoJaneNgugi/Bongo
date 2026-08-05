# Bongo UI Phase 0 — Foundation & Loader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the premium-white design foundation — cleaned-up tokens, reusable UI primitives, a new on-brand splash loader, and a reusable in-app loader — with zero visual regression on existing pages.

**Architecture:** Additive, token-first. We extend the token layer in `src/styles/globals.css` (new premium-white surface/shadow/gold tokens + a semantic `--brand-*` rename backed by aliases so nothing breaks), add two new stylesheet modules (`primitives.css`, `splash.css`), rewrite `SplashScreen.tsx`'s internals against the new splash CSS, and add a standalone `ui/Loader.tsx`. No existing page selectors are modified, so existing pages render unchanged.

**Tech Stack:** React 19 + TypeScript, Vite 7, CSS custom properties, lucide-react (already a dependency). No new dependencies.

**Verification model (read before starting):** This project has **no test runner** and this phase adds **no new dependency** (per spec non-goals). Each task is verified by: (a) `npx tsc -b` with no new errors, (b) `npm run build` succeeds, (c) targeted `grep` assertions that existing token *values* are unchanged, and (d) for the loader, a `npm run dev` visual check. Where a step says "Verify", run the exact command shown and confirm the exact expected result before committing.

**Branch:** `ui-premium-redesign` (already created; the design spec is committed here).

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `src/styles/globals.css` | Token source of truth; import order | Modify (add tokens + aliases; import new modules; remove inline splash block) |
| `src/styles/primitives.css` | Composable UI classes: button, card/glass, chip, progress, in-app loader | Create |
| `src/styles/splash.css` | Scoped splash-loader styles | Create |
| `src/components/SplashScreen.tsx` | Splash markup + timing (contract unchanged) | Modify |
| `src/components/ui/Loader.tsx` | Reusable in-app loader component | Create |

---

## Task 1: Add premium-white surface, shadow, and gold tokens

**Files:**
- Modify: `src/styles/globals.css` (inside the `:root` block, after the existing `--accent-*` lines ~line 37)

- [ ] **Step 1: Add the new tokens**

In `src/styles/globals.css`, locate the `/* Accent (Kenyan gold) */` block in `:root` (ends at `--accent-dark: #a87d0e;`). Immediately **after** that line, insert:

```css
  /* ── Premium-white surfaces (Phase 0) ── */
  --surface-1:       #ffffff;   /* base cards            */
  --surface-2:       #fbfdfc;   /* page background       */
  --surface-3:       #f4faf6;   /* subtle raised / hover */
  --surface-glass:   rgba(255,255,255,0.70);
  --hairline:        #e7f0ea;
  --hairline-strong: #cfe6da;

  /* Green-tinted soft shadow scale */
  --shadow-1:   0 2px 8px   rgba(16,60,40,0.06);
  --shadow-2:   0 6px 20px  rgba(16,60,40,0.07);
  --shadow-3:   0 10px 34px rgba(16,60,40,0.10);
  --shadow-cta: 0 6px 18px  rgba(21,115,71,0.28);

  /* Gold accent scale */
  --gold-100: #faf1d6;
  --gold-300: #ecc75a;
  --gold-500: #d4a017;
  --gold-700: #a87d0e;
```

- [ ] **Step 2: Verify build compiles**

Run: `cd /home/jane-ngugi/Bongo && npm run build`
Expected: build completes with no errors (CSS parses; new custom properties are valid).

- [ ] **Step 3: Verify no existing token changed**

Run: `grep -E -- "--accent:\s*#d4a017|--primary:\s*#157347" src/styles/globals.css`
Expected: both original lines still present and unchanged (we only *added* tokens).

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css
git commit -m "feat(tokens): add premium-white surface, shadow, and gold scales"
```

---

## Task 2: Introduce semantic `--brand-*` names backed by aliases (debt fix)

**Context:** `--purple-50…900` currently hold *green* values (legacy misnomer). We add correctly-named `--brand-*` tokens with the identical values, then redefine `--purple-*` to *reference* the new names. Because the values are identical, every existing consumer resolves to the same color — zero regression — but new code can use the honest names.

**Files:**
- Modify: `src/styles/globals.css` (the `/* Brand */` block, ~lines 10-20)

- [ ] **Step 1: Replace the Brand block**

In `src/styles/globals.css`, replace this exact block:

```css
  /* Brand */
  --purple-50:  #f0f9f4;
  --purple-100: #e3f5ea;
  --purple-200: #c9ebd8;
  --purple-300: #97d4b4;
  --purple-400: #5cba8a;
  --purple-500: #2f9e6a;
  --purple-600: #15803d;
  --purple-700: #126b3f;
  --purple-800: #0f5132;
  --purple-900: #0b3d28;
  --primary:    #157347;
  --primary-light: #2f9e6a;
  --primary-dark:  #0f5132;
```

with:

```css
  /* Brand (green) — semantic source of truth */
  --brand-50:  #f0f9f4;
  --brand-100: #e3f5ea;
  --brand-200: #c9ebd8;
  --brand-300: #97d4b4;
  --brand-400: #5cba8a;
  --brand-500: #2f9e6a;
  --brand-600: #15803d;
  --brand-700: #126b3f;
  --brand-800: #0f5132;
  --brand-900: #0b3d28;
  --primary:       #157347;
  --primary-light: #2f9e6a;
  --primary-dark:  #0f5132;

  /* Legacy aliases — kept 1 phase so existing selectors keep resolving.
     Migrate `--purple-*` refs to `--brand-*` in later phases, then remove. */
  --purple-50:  var(--brand-50);
  --purple-100: var(--brand-100);
  --purple-200: var(--brand-200);
  --purple-300: var(--brand-300);
  --purple-400: var(--brand-400);
  --purple-500: var(--brand-500);
  --purple-600: var(--brand-600);
  --purple-700: var(--brand-700);
  --purple-800: var(--brand-800);
  --purple-900: var(--brand-900);
```

- [ ] **Step 2: Verify build compiles**

Run: `cd /home/jane-ngugi/Bongo && npm run build`
Expected: build succeeds. `var(--brand-*)` resolves for every `--purple-*` alias.

- [ ] **Step 3: Verify aliases resolve to identical values**

Run: `grep -n -- "--purple-300\|--brand-300" src/styles/globals.css`
Expected: `--brand-300: #97d4b4;` and `--purple-300: var(--brand-300);` — i.e. purple-300 still resolves to `#97d4b4` exactly as before.

- [ ] **Step 4: Sanity-check consumers still exist**

Run: `grep -rl -- "--purple-" src | head`
Expected: files (e.g. `globals.css`) — confirms aliases are still referenced somewhere and nothing was orphaned. (No action needed; informational.)

- [ ] **Step 5: Commit**

```bash
git add src/styles/globals.css
git commit -m "refactor(tokens): add semantic --brand-* names; alias legacy --purple-*"
```

---

## Task 3: Create the primitives stylesheet (button, card, chip, progress, in-app loader)

**Files:**
- Create: `src/styles/primitives.css`
- Modify: `src/styles/globals.css` (add `@import './primitives.css';` near the top imports)

- [ ] **Step 1: Create `src/styles/primitives.css`**

```css
/* primitives.css — composable, token-driven UI classes (Phase 0).
   Additive only. Consumed opt-in by later phases; safe to ship unused. */

/* ── Buttons ─────────────────────────────────────────── */
.ui-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--font-display); font-weight: 700; font-size: 14px;
  color: #fff; border: none; cursor: pointer;
  padding: 11px 20px; border-radius: var(--r);
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  box-shadow: var(--shadow-cta);
  transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
}
.ui-btn:hover { transform: translateY(-1px); filter: brightness(1.03); }
.ui-btn:active { transform: translateY(0); }
.ui-btn--ghost {
  background: var(--surface-1); color: var(--primary);
  border: 1px solid var(--hairline-strong); box-shadow: var(--shadow-1);
}
.ui-btn--ghost:hover { background: var(--surface-3); }

/* ── Cards / surfaces ────────────────────────────────── */
.ui-card {
  background: var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-2);
  padding: var(--sp-5);
}
.ui-card--glass {
  background: var(--surface-glass);
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
}

/* ── Chip ────────────────────────────────────────────── */
.ui-chip {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--surface-1); border: 1px solid var(--hairline);
  border-radius: var(--r-full); padding: 6px 12px;
  font-family: var(--font-display); font-weight: 700; font-size: 12px;
  color: var(--primary); box-shadow: var(--shadow-1);
}
.ui-chip .ui-chip-gold { color: var(--gold-500); }

/* ── Progress bar ────────────────────────────────────── */
.ui-progress { height: 6px; border-radius: var(--r-full); background: var(--surface-3); overflow: hidden; }
.ui-progress > i { display: block; height: 100%; border-radius: var(--r-full);
  background: linear-gradient(90deg, var(--primary), var(--primary-light)); }

/* ── In-app loader (used by ui/Loader.tsx) ───────────── */
.ui-loader { display: inline-flex; flex-direction: column; align-items: center; gap: 10px; }
.ui-loader--full { position: fixed; inset: 0; justify-content: center;
  background: var(--surface-2); z-index: 500; }
.ui-loader-ring {
  border-radius: 50%; border: 3px solid var(--hairline);
  border-top-color: var(--primary); border-right-color: var(--gold-500);
  animation: ui-loader-spin 1s cubic-bezier(.6,.1,.3,.9) infinite;
}
.ui-loader--sm .ui-loader-ring { width: 22px; height: 22px; border-width: 2px; }
.ui-loader--md .ui-loader-ring { width: 40px; height: 40px; }
.ui-loader--lg .ui-loader-ring { width: 64px; height: 64px; }
.ui-loader-label { font-family: var(--font-body); font-size: 13px; color: var(--text-muted); }
@keyframes ui-loader-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .ui-loader-ring { animation-duration: 2.4s; }
}
```

- [ ] **Step 2: Import it from `globals.css`**

In `src/styles/globals.css`, find line 2 `@import './animations.css';` and add a line directly after it:

```css
@import './animations.css';
@import './primitives.css';
```

- [ ] **Step 3: Verify build**

Run: `cd /home/jane-ngugi/Bongo && npm run build`
Expected: build succeeds; `primitives.css` is bundled.

- [ ] **Step 4: Commit**

```bash
git add src/styles/primitives.css src/styles/globals.css
git commit -m "feat(ui): add primitives stylesheet (button, card, chip, progress, loader)"
```

---

## Task 4: Extract splash styles into `splash.css` and replace with the new loader design

**Context:** The current splash CSS lives inline in `globals.css` (lines ~423-476, the `.splash-*` block and its `@keyframes splash-pop`/`splash-load`). We move splash styling into its own module and replace it with the approved premium-white dual-ring design.

**Files:**
- Create: `src/styles/splash.css`
- Modify: `src/styles/globals.css` (remove the inline `.splash-*` block + its keyframes; add `@import './splash.css';`)

- [ ] **Step 1: Create `src/styles/splash.css`**

```css
/* splash.css — full-screen intro loader (Phase 0, premium-white). */
.splash-root {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px;
  background: radial-gradient(130% 100% at 50% 0%, var(--surface-1) 0%, var(--surface-3) 60%, #eef7f1 100%);
  transition: opacity .5s ease, transform .5s ease;
}
.splash-root::before {
  content: ''; position: absolute; inset: 0;
  background-image: radial-gradient(circle at center, rgba(21,115,71,.05) 1px, transparent 1px);
  background-size: 22px 22px;
  -webkit-mask-image: radial-gradient(60% 60% at 50% 45%, #000 40%, transparent 100%);
          mask-image: radial-gradient(60% 60% at 50% 45%, #000 40%, transparent 100%);
}
.splash-hide { opacity: 0; transform: scale(1.04); pointer-events: none; }

.splash-loader { position: relative; width: 78px; height: 78px; z-index: 1; }
.splash-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 3px solid var(--hairline);
  border-top-color: var(--primary); border-right-color: var(--gold-500);
  animation: splash-spin 1s cubic-bezier(.6,.1,.3,.9) infinite;
}
.splash-ring--inner {
  inset: 11px; border: 2px solid #eef4f1; border-bottom-color: var(--primary-light);
  animation: splash-spin 1.4s linear infinite reverse; opacity: .8;
}
.splash-cap {
  position: absolute; inset: 0; margin: auto; color: var(--primary-dark);
  animation: splash-pulse 1.6s ease-in-out infinite;
}

.splash-word {
  position: relative; z-index: 1;
  font-family: var(--font-display); font-weight: 700; font-size: 27px;
  color: #0f5132; letter-spacing: -.01em;
}
.splash-word strong { color: var(--primary); }
.splash-word-dot { color: var(--gold-500); }
.splash-sub {
  position: relative; z-index: 1;
  font-size: 11px; letter-spacing: .30em; text-transform: uppercase; color: #8aa89a;
}
.splash-bar { position: relative; z-index: 1; width: 150px; height: 5px;
  border-radius: 99px; background: var(--hairline); overflow: hidden; }
.splash-bar-fill { height: 100%; border-radius: 99px;
  background: linear-gradient(90deg, var(--primary), var(--primary-light) 60%, var(--gold-500));
  animation: splash-load 1.6s ease forwards; }

@keyframes splash-spin { to { transform: rotate(360deg); } }
@keyframes splash-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.12); } }
@keyframes splash-load { from { width: 0%; } to { width: 100%; } }

@media (prefers-reduced-motion: reduce) {
  .splash-ring, .splash-ring--inner, .splash-cap { animation: none; }
  .splash-bar-fill { animation-duration: .8s; }
}
```

- [ ] **Step 2: Remove the old inline splash block from `globals.css`**

In `src/styles/globals.css`, delete the entire block starting at the comment `/* ── Splash screen ── */` through the closing `@keyframes splash-load { ... }` (the current lines defining `.splash-root`, `.splash-hide`, `.splash-logo`, `.splash-wordmark`, `.splash-wordmark strong`, `.splash-bar`, `.splash-bar-fill`, `@keyframes splash-pop`, `@keyframes splash-load`). Leave the `/* ── Games Mode ── */` block that follows it intact.

- [ ] **Step 3: Import `splash.css`**

In `src/styles/globals.css`, update the top imports to:

```css
@import './animations.css';
@import './primitives.css';
@import './splash.css';
```

- [ ] **Step 4: Verify no duplicate splash selectors remain in globals**

Run: `grep -c "splash-root" src/styles/globals.css`
Expected: `0` (all splash styles now live in `splash.css`).

- [ ] **Step 5: Verify build**

Run: `cd /home/jane-ngugi/Bongo && npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/styles/splash.css src/styles/globals.css
git commit -m "feat(splash): extract splash styles into splash.css with premium-white dual-ring design"
```

---

## Task 5: Rewrite `SplashScreen.tsx` markup for the new loader

**Context:** Keep the exact same props/contract (`{ onDone }`) and timing behavior so `App.tsx` continues to work unchanged. Only the returned markup changes to match `splash.css`.

**Files:**
- Modify: `src/components/SplashScreen.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';

export function SplashScreen({ onDone }: { onDone: () => void }) {
    const [hiding, setHiding] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setHiding(true), 1800);
        const t2 = setTimeout(onDone, 2300);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onDone]);

    return (
        <div
            className={`splash-root ${hiding ? 'splash-hide' : ''}`}
            role="status"
            aria-label="Loading High Scores"
        >
            <div className="splash-loader" aria-hidden="true">
                <span className="splash-ring" />
                <span className="splash-ring splash-ring--inner" />
                <GraduationCap size={26} className="splash-cap" />
            </div>
            <div className="splash-word">
                High<strong>Scores</strong><span className="splash-word-dot">.</span>
            </div>
            <div className="splash-sub">Learning, elevated</div>
            <div className="splash-bar"><div className="splash-bar-fill" /></div>
        </div>
    );
}
```

- [ ] **Step 2: Type-check**

Run: `cd /home/jane-ngugi/Bongo && npx tsc -b`
Expected: no errors (the `GraduationCap` `className` prop is supported by lucide-react icons).

- [ ] **Step 3: Visual check in dev**

Run: `cd /home/jane-ngugi/Bongo && npm run dev`
Open the served URL. Expected: on cold load the splash shows the dual-ring spinner + cap, the "High**Scores**." wordmark (green + gold period, **no purple**), the "Learning, elevated" sublabel, and a green→gold progress bar that fills, then the splash fades out and the app appears. Stop the dev server (Ctrl-C) when confirmed.

- [ ] **Step 4: Commit**

```bash
git add src/components/SplashScreen.tsx
git commit -m "feat(splash): new dual-ring on-brand splash markup"
```

---

## Task 6: Add the reusable in-app `<Loader/>` component

**Context:** A small loader for route/data-loading states in later phases (replaces ad-hoc "Loading…" text and `null` route gaps). Styling already exists in `primitives.css` (`.ui-loader*`, Task 3).

**Files:**
- Create: `src/components/ui/Loader.tsx`

- [ ] **Step 1: Create `src/components/ui/Loader.tsx`**

```tsx
type LoaderSize = 'sm' | 'md' | 'lg';

export interface LoaderProps {
  /** Ring diameter. Default 'md'. */
  size?: LoaderSize;
  /** Optional caption shown under the ring. */
  label?: string;
  /** Cover the viewport on a page-2 background. Default false. */
  fullscreen?: boolean;
}

export function Loader({ size = 'md', label, fullscreen = false }: LoaderProps) {
  const className = `ui-loader ui-loader--${size}${fullscreen ? ' ui-loader--full' : ''}`;
  return (
    <div className={className} role="status" aria-live="polite" aria-label={label ?? 'Loading'}>
      <span className="ui-loader-ring" aria-hidden="true" />
      {label && <span className="ui-loader-label">{label}</span>}
    </div>
  );
}

export default Loader;
```

- [ ] **Step 2: Type-check**

Run: `cd /home/jane-ngugi/Bongo && npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Verify build**

Run: `cd /home/jane-ngugi/Bongo && npm run build`
Expected: build succeeds. (Component is unused for now; TS may not error on unused exports. If the build fails on an unused-import rule, it will name the file — there are no imports to remove here, so this should pass.)

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Loader.tsx
git commit -m "feat(ui): reusable in-app Loader component"
```

---

## Task 7: Final regression & accessibility pass

**Files:** none (verification only)

- [ ] **Step 1: Full build**

Run: `cd /home/jane-ngugi/Bongo && npm run build`
Expected: clean build, no errors.

- [ ] **Step 2: Confirm existing pages are visually unchanged**

Run: `cd /home/jane-ngugi/Bongo && npm run dev`
Visit `/` (landing), log in to reach a learner dashboard page, and visit `/games`. Expected: these render exactly as before Phase 0 (green brand colors unchanged; only the splash on cold load is new). Stop the dev server when confirmed.

- [ ] **Step 3: Confirm token values are unchanged**

Run: `grep -E -- "--primary:\s*#157347|--accent:\s*#d4a017|--brand-800:\s*#0f5132" src/styles/globals.css`
Expected: all three present — the core brand values did not drift.

- [ ] **Step 4: Reduced-motion check**

In the browser dev tools, emulate `prefers-reduced-motion: reduce` and cold-reload. Expected: splash rings stop spinning (static), the bar still fills quickly, no motion sickness triggers.

- [ ] **Step 5: Final commit (if any doc/notes to add) — otherwise skip**

```bash
git status   # should be clean; nothing to commit if all tasks committed
```

---

## Self-Review (completed during authoring)

- **Spec coverage:** tokens (Task 1-2) ✓, splash loader (Task 4-5) ✓, in-app Loader (Task 6) ✓, primitives (Task 3) ✓, no-regression (Task 7) ✓, reduced-motion (Task 4/6 CSS + Task 7 check) ✓, brand rename with aliases (Task 2) ✓.
- **Placeholders:** none — every CSS/TSX step shows complete content.
- **Type/name consistency:** `.ui-loader*` classes defined in Task 3 match `ui/Loader.tsx` in Task 6; `.splash-*` classes in Task 4 match `SplashScreen.tsx` markup in Task 5; `--brand-*`/`--surface-*`/`--gold-*`/`--shadow-*` tokens from Tasks 1-2 are the ones referenced in Tasks 3-4.
- **Scope:** single foundation phase; no page redesigns; no new dependencies.
