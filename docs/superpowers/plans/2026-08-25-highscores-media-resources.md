# HighScores Media Resources (Video + Audio + Quiz) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let teachers publish access-gated video and audio resources on HighScores, with an optional server-graded MCQ quiz shown after a video.

**Architecture:** Extend the existing `MarketResource` model with a `kind` and a primary `media` file. Gated media lives under a private Storage prefix (`media/{sellerId}/...`) and is streamed via short-lived signed URLs minted by a Cloud Function that checks ownership/purchase. Video quizzes store their correct answers in a private Firestore subdoc; a Cloud Function grades submissions and records results the teacher can read.

**Tech Stack:** React + TypeScript + Vite, Firebase (Firestore, Storage, Cloud Functions v2), Zustand, Vitest + @testing-library/react. Pure logic is extracted into testable helpers; thin `onCall` wrappers stay untested.

---

## File Structure

**Frontend**
- `src/lib/marketplace/types.ts` — new `ResourceKind`, `QuizQuestionPublic`, `MarketResource` fields (Task 1).
- `src/lib/marketplace/resourceDefaults.ts` — NEW: pure `normalizeResource()` read-mapping (Task 1).
- `src/lib/marketplace/resources.ts` — media upload, create/update extensions, quiz answer write, callable wrappers (Tasks 2, 7).
- `src/components/marketplace/ResourceForm.tsx` — kind picker, media dropzone, duration read, quiz builder (Task 8).
- `src/components/marketplace/MediaPlayer.tsx` — NEW (Task 9).
- `src/components/marketplace/QuizRunner.tsx` — NEW (Task 10).
- `src/components/marketplace/buyer/pages/MyLibrary.tsx` — wire player + quiz (Task 11).
- `src/components/marketplace/buyer/components/ResourceCard.tsx` — kind badge (Task 12).
- `src/components/marketplace/ResourceResults.tsx` — NEW teacher results view (Task 13).

**Backend (`functions/src`)**
- `functions/src/marketplace/quizGrading.ts` — NEW: pure `gradeQuiz()` + `canAccessResource()` helpers (Task 5, 6).
- `functions/src/marketplace/media.ts` — NEW: `getResourceMediaUrl` callable (Task 5).
- `functions/src/marketplace/quiz.ts` — NEW: `submitVideoQuiz` callable (Task 6).
- `functions/src/index.ts` — export the new callables (Tasks 5, 6).

**Rules**
- `storage.rules` — gated media prefix (Task 3).
- `firestore.rules` — private quiz subdoc + `quizResults` (Task 4).

---

## Task 1: Resource types + read-mapping defaults

**Files:**
- Modify: `src/lib/marketplace/types.ts`
- Create: `src/lib/marketplace/resourceDefaults.ts`
- Test: `src/lib/marketplace/resourceDefaults.test.ts`

- [ ] **Step 1: Add the new types**

In `src/lib/marketplace/types.ts`, replace the `ResourceStatus` line region and `MarketResource` interface with the additions below (keep every existing field):

```ts
export type ResourceStatus = 'draft' | 'published';

export type ResourceKind = 'document' | 'video' | 'audio';

/** A quiz question as shown to the student — NO correct answer is included. */
export interface QuizQuestionPublic {
  prompt: string;
  options: string[];            // 2–4 options
}

/** The gradable half of a question, stored in resources/{id}/private/quiz. */
export interface QuizAnswer {
  correctIndex: number;
  explanation?: string;
}
```

Then add these fields to `MarketResource` (after `thumbnailPath`):

```ts
  kind: ResourceKind;
  media: ResourceFile | null;
  durationSec: number | null;
  hasQuiz: boolean;
  quiz: QuizQuestionPublic[];
```

Add to `ResourceInput` (after `status`):

```ts
  kind: ResourceKind;
```

- [ ] **Step 2: Write the failing test for normalizeResource**

Create `src/lib/marketplace/resourceDefaults.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { normalizeResource } from './resourceDefaults';
import type { MarketResource } from './types';

describe('normalizeResource', () => {
  it('defaults legacy resources (no kind) to a document', () => {
    const legacy = { id: 'r1', sellerId: 's1', title: 'Old', files: [] } as unknown as MarketResource;
    const r = normalizeResource(legacy);
    expect(r.kind).toBe('document');
    expect(r.media).toBeNull();
    expect(r.durationSec).toBeNull();
    expect(r.hasQuiz).toBe(false);
    expect(r.quiz).toEqual([]);
  });

  it('preserves media fields when present', () => {
    const vid = {
      id: 'r2', kind: 'video',
      media: { name: 'v.mp4', url: '', path: 'media/s1/r2/v.mp4', size: 10, contentType: 'video/mp4' },
      durationSec: 120, hasQuiz: true, quiz: [{ prompt: 'Q', options: ['a', 'b'] }],
    } as unknown as MarketResource;
    const r = normalizeResource(vid);
    expect(r.kind).toBe('video');
    expect(r.media?.path).toBe('media/s1/r2/v.mp4');
    expect(r.hasQuiz).toBe(true);
    expect(r.quiz).toHaveLength(1);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/lib/marketplace/resourceDefaults.test.ts`
Expected: FAIL — `Cannot find module './resourceDefaults'`.

- [ ] **Step 4: Implement normalizeResource**

Create `src/lib/marketplace/resourceDefaults.ts`:

```ts
import type { MarketResource } from './types';

/** Fill in media/quiz fields on resources read from Firestore so legacy
 *  documents (written before this feature) behave as plain documents. */
export function normalizeResource(r: MarketResource): MarketResource {
  return {
    ...r,
    kind: r.kind ?? 'document',
    media: r.media ?? null,
    durationSec: r.durationSec ?? null,
    hasQuiz: r.hasQuiz ?? false,
    quiz: r.quiz ?? [],
  };
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/lib/marketplace/resourceDefaults.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Apply normalizeResource at every read**

In `src/lib/marketplace/resources.ts`, import it and wrap the two read paths:

```ts
import { normalizeResource } from './resourceDefaults';
```

In `subscribeSellerResources`, change the map callback body to:

```ts
    cb(snap.docs.map(d => normalizeResource({ id: d.id, ...(d.data() as ResourceDoc) })));
```

In `getResource`, change the return to:

```ts
  return snap.exists() ? normalizeResource({ id: snap.id, ...(snap.data() as ResourceDoc) }) : null;
```

- [ ] **Step 7: Typecheck and commit**

Run: `npx tsc -p tsconfig.app.json --noEmit`
Expected: no output (pass).

```bash
git add src/lib/marketplace/types.ts src/lib/marketplace/resourceDefaults.ts src/lib/marketplace/resourceDefaults.test.ts src/lib/marketplace/resources.ts
git commit -m "feat(marketplace): add resource kind + media/quiz fields with read defaults"
```

---

## Task 2: Media upload + create/update with kind, media and quiz answers

**Files:**
- Modify: `src/lib/marketplace/resources.ts`
- Test: `src/lib/marketplace/resources.test.ts` (existing — add cases)

- [ ] **Step 1: Add the media upload helper**

In `src/lib/marketplace/resources.ts`, add after `uploadFile`:

```ts
/** Upload a primary media file (video/audio) to the PRIVATE gated prefix.
 *  Unlike uploadFile we do NOT fetch a download URL — gated media is streamed
 *  via short-lived signed URLs from the getResourceMediaUrl function. */
async function uploadMedia(
  sellerId: string, resourceId: string, file: File, name: string = file.name,
): Promise<ResourceFile> {
  const path = `media/${sellerId}/${resourceId}/${name}`;
  const r = storageRef(storage, path);
  await uploadBytes(r, file);
  return { name, url: '', path, size: file.size, contentType: file.type };
}
```

- [ ] **Step 2: Write the failing test for the media path**

Add to `src/lib/marketplace/resources.test.ts` (a pure helper is easiest to test; export `mediaPath` from resources.ts). First add the case:

```ts
import { mediaPath } from './resources';

describe('mediaPath', () => {
  it('puts media under the private media/ prefix, not marketplace/', () => {
    expect(mediaPath('s1', 'r1', 'Maths Grade 5 - HighScores.mp4'))
      .toBe('media/s1/r1/Maths Grade 5 - HighScores.mp4');
  });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx vitest run src/lib/marketplace/resources.test.ts`
Expected: FAIL — `mediaPath` is not exported.

- [ ] **Step 4: Extract and export mediaPath, use it in uploadMedia**

Replace the `uploadMedia` path line with a shared helper:

```ts
export function mediaPath(sellerId: string, resourceId: string, name: string): string {
  return `media/${sellerId}/${resourceId}/${name}`;
}
```

And in `uploadMedia` use `const path = mediaPath(sellerId, resourceId, name);`.

- [ ] **Step 5: Run to verify it passes**

Run: `npx vitest run src/lib/marketplace/resources.test.ts`
Expected: PASS.

- [ ] **Step 6: Extend createResource to accept kind, media and quiz**

Change the `createResource` signature and body. Replace the signature with:

```ts
export async function createResource(
  sellerId: string,
  sellerName: string,
  input: ResourceInput,
  files: File[],
  thumbnail?: File | null,
  onProgress?: (p: number) => void,
  opts?: {
    media?: File | null;
    durationSec?: number | null;
    quiz?: QuizQuestionPublic[];
    quizAnswers?: QuizAnswer[];
  },
): Promise<string> {
```

Add the import at the top:

```ts
import { setDoc as fbSetDoc } from 'firebase/firestore';
import type { MarketResource, ResourceFile, ResourceInput, ResourceStatus, QuizQuestionPublic, QuizAnswer } from './types';
```

(If `setDoc` is already imported, do NOT add `fbSetDoc`; reuse `setDoc`. The existing import already includes `setDoc` and `doc` — reuse them and only add the two type imports `QuizQuestionPublic, QuizAnswer`.)

Inside the body, after the thumbnail upload block and before `await setDoc(resRef, {`, add media upload:

```ts
  const media = opts?.media
    ? await uploadMedia(sellerId, id, opts.media, `${baseName(input.subject, input.grade)}.${extOf(opts.media.name)}`)
    : null;
  const quiz = opts?.quiz ?? [];
  const quizAnswers = opts?.quizAnswers ?? [];
```

Add these keys to the `setDoc` object (alongside `files`):

```ts
    kind: input.kind,
    media,
    durationSec: opts?.durationSec ?? null,
    hasQuiz: input.kind === 'video' && quiz.length > 0,
    quiz,
```

After the `await setDoc(resRef, {...})` call, write the private answers when present:

```ts
  if (input.kind === 'video' && quiz.length > 0) {
    await setDoc(doc(db, 'resources', id, 'private', 'quiz'), { answers: quizAnswers });
  }
```

- [ ] **Step 7: Typecheck and commit**

Run: `npx tsc -p tsconfig.app.json --noEmit`
Expected: no output.

```bash
git add src/lib/marketplace/resources.ts src/lib/marketplace/resources.test.ts
git commit -m "feat(marketplace): upload gated media + persist video quiz on create"
```

> Note: `updateResource` gains media/quiz editing in Task 8's UI wiring is out of scope here; editing a media resource re-uses createResource semantics for new uploads. Editing quiz-only metadata is supported by writing the private subdoc again from the form (Task 8). Keep `updateResource` unchanged in this task.

---

## Task 3: Storage rules — gated media prefix

**Files:**
- Modify: `storage.rules`

- [ ] **Step 1: Add the private media match above the catch-all**

In `storage.rules`, inside `match /b/{bucket}/o {`, add this block BEFORE the existing `match /marketplace/...` block:

```
    // Gated primary media (video/audio). NOT publicly readable — buyers stream
    // it via short-lived signed URLs from the getResourceMediaUrl function.
    // Only the owning seller may read/write their own media directly.
    match /media/{sellerId}/{allPaths=**} {
      allow read:  if request.auth != null
                   && request.auth.uid == sellerId
                   && request.auth.token.seller == true;
      allow write: if request.auth != null
                   && request.auth.uid == sellerId
                   && request.auth.token.seller == true
                   && (request.resource == null || request.resource.size < 500 * 1024 * 1024);
    }
```

The existing `marketplace/{sellerId}/{allPaths=**}` (thumbnails, documents) stays public-read and unchanged.

- [ ] **Step 2: Verify rules compile**

Run: `npx firebase deploy --only storage --dry-run` (if unavailable, run `npx firebase emulators:start --only storage` briefly, or visually confirm brace balance).
Expected: rules parse without error.

- [ ] **Step 3: Commit**

```bash
git add storage.rules
git commit -m "feat(storage): private gated prefix for primary media (500MB)"
```

> Rollout: `firebase deploy --only storage` is required for this to take effect.

---

## Task 4: Firestore rules — private quiz subdoc + quizResults

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: Add a private quiz subcollection rule under resources**

In `firestore.rules`, inside the `match /resources/{id} { ... }` block, add a nested match before its closing brace:

```
      // Correct answers + explanations for the video quiz. Readable only by the
      // owning seller / staff; written by the seller. Cloud Functions (admin
      // SDK) bypass these rules when grading. Buyers can NEVER read this.
      match /private/{docId} {
        allow read, write: if isAdmin()
                           || (isSeller() && request.auth.uid == get(/databases/$(database)/documents/resources/$(id)).data.sellerId);
      }
```

- [ ] **Step 2: Add the quizResults collection rule**

After the `match /purchases/{id} { ... }` block, add:

```
    /* ── Video quiz results ── written only by the submitVideoQuiz function. */
    match /quizResults/{id} {
      allow read:  if isStaff()
                   || (isSeller() && request.auth.uid == resource.data.sellerId)
                   || (request.auth != null && request.auth.uid == resource.data.buyerAccountId);
      allow write: if false;
    }
```

- [ ] **Step 3: Verify rules compile**

Run: `npx firebase deploy --only firestore:rules --dry-run` (or visually confirm brace balance).
Expected: parse OK.

- [ ] **Step 4: Commit**

```bash
git add firestore.rules
git commit -m "feat(rules): private quiz answers subdoc + quizResults read rules"
```

> Rollout: `firebase deploy --only firestore:rules` required.

---

## Task 5: Grading/access helpers + getResourceMediaUrl function

**Files:**
- Create: `functions/src/marketplace/quizGrading.ts`
- Create: `functions/src/marketplace/media.ts`
- Create: `functions/src/marketplace/quizGrading.test.ts`
- Modify: `functions/src/index.ts`

- [ ] **Step 1: Write the failing test for pure helpers**

Create `functions/src/marketplace/quizGrading.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { gradeQuiz } from './quizGrading';

describe('gradeQuiz', () => {
  const answers = [{ correctIndex: 1, explanation: 'because' }, { correctIndex: 0 }];

  it('scores correct/incorrect and returns per-question detail', () => {
    const r = gradeQuiz([1, 2], answers);
    expect(r.score).toBe(1);
    expect(r.total).toBe(2);
    expect(r.perQuestion[0]).toEqual({ correctIndex: 1, chosen: 1, correct: true, explanation: 'because' });
    expect(r.perQuestion[1]).toEqual({ correctIndex: 0, chosen: 2, correct: false, explanation: undefined });
  });

  it('treats a missing/blank answer as incorrect', () => {
    const r = gradeQuiz([undefined as unknown as number, 0], answers);
    expect(r.score).toBe(1);
    expect(r.perQuestion[0].correct).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd functions && npx vitest run src/marketplace/quizGrading.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the pure helpers**

Create `functions/src/marketplace/quizGrading.ts`:

```ts
export interface StoredAnswer { correctIndex: number; explanation?: string }

export interface GradedQuestion {
  correctIndex: number;
  chosen: number | null;
  correct: boolean;
  explanation?: string;
}

export interface GradeResult {
  score: number;
  total: number;
  perQuestion: GradedQuestion[];
}

/** Grade a learner's chosen option indexes against the stored correct answers. */
export function gradeQuiz(chosen: number[], answers: StoredAnswer[]): GradeResult {
  const perQuestion = answers.map((a, i) => {
    const pick = typeof chosen[i] === 'number' ? chosen[i] : null;
    return {
      correctIndex: a.correctIndex,
      chosen: pick,
      correct: pick === a.correctIndex,
      explanation: a.explanation,
    };
  });
  return {
    score: perQuestion.filter(q => q.correct).length,
    total: answers.length,
    perQuestion,
  };
}

/** Decide whether `uid` may access a resource's media/quiz: the owning seller,
 *  a free resource, or a paid buyer. Pure so it can be unit-tested. */
export function canAccess(
  uid: string,
  resource: { sellerId: string; priceKsh: number },
  hasPaidPurchase: boolean,
): boolean {
  return uid === resource.sellerId || resource.priceKsh === 0 || hasPaidPurchase;
}
```

- [ ] **Step 4: Add the canAccess test**

Append to `quizGrading.test.ts`:

```ts
import { canAccess } from './quizGrading';

describe('canAccess', () => {
  const res = { sellerId: 's1', priceKsh: 100 };
  it('allows the owner', () => expect(canAccess('s1', res, false)).toBe(true));
  it('allows a paid buyer', () => expect(canAccess('b1', res, true)).toBe(true));
  it('allows anyone for a free resource', () => expect(canAccess('b1', { sellerId: 's1', priceKsh: 0 }, false)).toBe(true));
  it('denies an unpaid stranger', () => expect(canAccess('b1', res, false)).toBe(false));
});
```

- [ ] **Step 5: Run to verify all pass**

Run: `cd functions && npx vitest run src/marketplace/quizGrading.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 6: Implement the getResourceMediaUrl callable**

Create `functions/src/marketplace/media.ts`:

```ts
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { canAccess } from './quizGrading.js';

/** Mint a short-lived signed URL for a resource's gated media, but only for the
 *  owning teacher, a paid buyer, or a free resource. */
export const getResourceMediaUrl = onCall(async request => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in to watch.');

  const { resourceId } = (request.data ?? {}) as { resourceId?: string };
  if (!resourceId) throw new HttpsError('invalid-argument', 'resourceId is required.');

  const db = getFirestore();
  const snap = await db.collection('resources').doc(resourceId).get();
  if (!snap.exists) throw new HttpsError('not-found', 'Resource not found.');
  const res = snap.data() as { sellerId: string; priceKsh: number; media?: { path: string } | null };
  if (!res.media?.path) throw new HttpsError('failed-precondition', 'This resource has no media.');

  let paid = false;
  if (uid !== res.sellerId && res.priceKsh > 0) {
    const purchases = await db.collection('purchases')
      .where('resourceId', '==', resourceId)
      .where('buyerAccountId', '==', uid)
      .where('status', '==', 'paid')
      .limit(1).get();
    paid = !purchases.empty;
  }
  if (!canAccess(uid, res, paid)) throw new HttpsError('permission-denied', 'Buy this resource to watch it.');

  const [url] = await getStorage().bucket().file(res.media.path).getSignedUrl({
    action: 'read',
    expires: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
  });
  return { url };
});
```

- [ ] **Step 7: Export it**

In `functions/src/index.ts`, add near the other marketplace exports at the bottom:

```ts
export { getResourceMediaUrl } from './marketplace/media.js';
```

- [ ] **Step 8: Typecheck functions and commit**

Run: `cd functions && npx tsc --noEmit`
Expected: no output.

```bash
git add functions/src/marketplace/quizGrading.ts functions/src/marketplace/quizGrading.test.ts functions/src/marketplace/media.ts functions/src/index.ts
git commit -m "feat(functions): signed-URL media access + grading/access helpers"
```

---

## Task 6: submitVideoQuiz function

**Files:**
- Create: `functions/src/marketplace/quiz.ts`
- Modify: `functions/src/index.ts`

- [ ] **Step 1: Implement the callable (uses the tested gradeQuiz/canAccess helpers)**

Create `functions/src/marketplace/quiz.ts`:

```ts
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { canAccess, gradeQuiz, type StoredAnswer } from './quizGrading.js';

/** Grade a learner's answers server-side, record the result, return the score
 *  and per-question detail (the only place correct answers are ever revealed). */
export const submitVideoQuiz = onCall(async request => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in to take the quiz.');

  const { resourceId, answers } = (request.data ?? {}) as { resourceId?: string; answers?: number[] };
  if (!resourceId || !Array.isArray(answers)) {
    throw new HttpsError('invalid-argument', 'resourceId and answers[] are required.');
  }

  const db = getFirestore();
  const resSnap = await db.collection('resources').doc(resourceId).get();
  if (!resSnap.exists) throw new HttpsError('not-found', 'Resource not found.');
  const res = resSnap.data() as { sellerId: string; priceKsh: number; title: string; hasQuiz?: boolean };
  if (!res.hasQuiz) throw new HttpsError('failed-precondition', 'This resource has no quiz.');

  let paid = false;
  if (uid !== res.sellerId && res.priceKsh > 0) {
    const purchases = await db.collection('purchases')
      .where('resourceId', '==', resourceId)
      .where('buyerAccountId', '==', uid)
      .where('status', '==', 'paid')
      .limit(1).get();
    paid = !purchases.empty;
  }
  if (!canAccess(uid, res, paid)) throw new HttpsError('permission-denied', 'Buy this resource to take the quiz.');

  const answerSnap = await db.collection('resources').doc(resourceId)
    .collection('private').doc('quiz').get();
  const stored = (answerSnap.data()?.answers ?? []) as StoredAnswer[];
  const graded = gradeQuiz(answers, stored);

  // Upsert one result per (resource, buyer); latest submission wins.
  await db.collection('quizResults').doc(`${resourceId}_${uid}`).set({
    resourceId,
    sellerId: res.sellerId,
    buyerAccountId: uid,
    resourceTitle: res.title,
    score: graded.score,
    total: graded.total,
    createdAt: FieldValue.serverTimestamp(),
  });

  return graded;
});
```

- [ ] **Step 2: Export it**

In `functions/src/index.ts`, add:

```ts
export { submitVideoQuiz } from './marketplace/quiz.js';
```

- [ ] **Step 3: Typecheck and commit**

Run: `cd functions && npx tsc --noEmit`
Expected: no output.

```bash
git add functions/src/marketplace/quiz.ts functions/src/index.ts
git commit -m "feat(functions): submitVideoQuiz — server-graded, recorded results"
```

---

## Task 7: Client wrappers for the callables

**Files:**
- Create: `src/lib/marketplace/media.ts`
- Test: `src/lib/marketplace/media.test.ts`

- [ ] **Step 1: Write the failing test (shape of the wrapper)**

Create `src/lib/marketplace/media.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';

vi.mock('firebase/functions', () => ({
  httpsCallable: (_fns: unknown, name: string) =>
    async (data: unknown) => ({ data: { echoed: name, ...(data as object) } }),
}));
vi.mock('../firebase', () => ({ functions: {} }));

import { fetchMediaUrl, submitQuiz } from './media';

describe('media callables', () => {
  it('fetchMediaUrl calls getResourceMediaUrl with the id', async () => {
    const r = await fetchMediaUrl('r1');
    expect(r).toMatchObject({ echoed: 'getResourceMediaUrl', resourceId: 'r1' });
  });
  it('submitQuiz calls submitVideoQuiz with answers', async () => {
    const r = await submitQuiz('r1', [0, 1]);
    expect(r).toMatchObject({ echoed: 'submitVideoQuiz', resourceId: 'r1', answers: [0, 1] });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/marketplace/media.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the wrappers**

Create `src/lib/marketplace/media.ts`:

```ts
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import type { GradeResult } from './types';

/** Fetch a short-lived signed URL to stream a gated resource's media. */
export async function fetchMediaUrl(resourceId: string): Promise<{ url: string }> {
  const fn = httpsCallable<{ resourceId: string }, { url: string }>(functions, 'getResourceMediaUrl');
  return (await fn({ resourceId })).data;
}

/** Submit quiz answers (0-based option indexes) for server-side grading. */
export async function submitQuiz(resourceId: string, answers: number[]): Promise<GradeResult> {
  const fn = httpsCallable<{ resourceId: string; answers: number[] }, GradeResult>(functions, 'submitVideoQuiz');
  return (await fn({ resourceId, answers })).data;
}
```

Add the shared `GradeResult` type to `src/lib/marketplace/types.ts`:

```ts
export interface GradedQuestion {
  correctIndex: number;
  chosen: number | null;
  correct: boolean;
  explanation?: string;
}
export interface GradeResult {
  score: number;
  total: number;
  perQuestion: GradedQuestion[];
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/marketplace/media.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/marketplace/media.ts src/lib/marketplace/media.test.ts src/lib/marketplace/types.ts
git commit -m "feat(marketplace): client wrappers for media URL + quiz submit"
```

---

## Task 8: ResourceForm — kind picker, media dropzone, duration, quiz builder

**Files:**
- Modify: `src/components/marketplace/ResourceForm.tsx`
- Test: `src/components/marketplace/ResourceForm.test.tsx` (add cases)

- [ ] **Step 1: Add the kind + media + quiz state**

In `ResourceForm.tsx`, add state near the other `useState`s:

```ts
const [kind, setKind] = useState<ResourceKind>('document');
const [media, setMedia] = useState<File | null>(null);
const [durationSec, setDurationSec] = useState<number | null>(null);
type QuizDraft = { prompt: string; options: string[]; correctIndex: number; explanation: string };
const [quiz, setQuiz] = useState<QuizDraft[]>([]);
```

Import `ResourceKind` from types and `QuizQuestionPublic, QuizAnswer` where needed.

- [ ] **Step 2: Read media duration on select**

Add this helper inside the component:

```ts
function readDuration(file: File): Promise<number | null> {
  return new Promise(resolve => {
    const el = document.createElement(file.type.startsWith('audio') ? 'audio' : 'video');
    el.preload = 'metadata';
    el.onloadedmetadata = () => { URL.revokeObjectURL(el.src); resolve(Math.round(el.duration) || null); };
    el.onerror = () => resolve(null);
    el.src = URL.createObjectURL(file);
  });
}

async function onMediaSelected(file: File) {
  const cap = kind === 'audio' ? 100 : 500;
  if (file.size > cap * 1024 * 1024) { setError(`File exceeds the ${cap} MB limit.`); return; }
  setMedia(file);
  setDurationSec(await readDuration(file));
}
```

- [ ] **Step 3: Render the kind picker + media dropzone + quiz builder**

Above the existing file dropzone, add a 3-way kind picker (Document/Video/Audio) that sets `kind` and clears `media`/`quiz`. When `kind !== 'document'`, render a single-file input accepting `video/*` or `audio/*` that calls `onMediaSelected`. When `kind === 'audio'`, mark the thumbnail required. When `kind === 'video'`, render the quiz builder: a list of `quiz` items each with a prompt input, 2–4 option inputs, a "correct" radio, and an explanation input, plus "Add question"/"Remove" buttons wired to `setQuiz`.

(Follow the existing dropzone markup/classes in this file for visual consistency; the picker is three `<button>`s like the seller-type picker pattern.)

- [ ] **Step 4: Validate and submit media + quiz**

In the submit handler, before calling `createResource`, add:

```ts
if (kind !== 'document' && !editing && !media) { setError('Add the video/audio file.'); return; }
if (kind === 'audio' && !thumbnail && !oldThumbnailPath) { setError('Audio resources need a thumbnail.'); return; }
if (kind === 'video' && quiz.some(q => !q.prompt.trim() || q.options.filter(o => o.trim()).length < 2)) {
  setError('Each quiz question needs a prompt and at least 2 options.'); return;
}
const quizPublic: QuizQuestionPublic[] = quiz.map(q => ({ prompt: q.prompt.trim(), options: q.options.filter(o => o.trim()) }));
const quizAnswers: QuizAnswer[] = quiz.map(q => ({ correctIndex: q.correctIndex, explanation: q.explanation.trim() || undefined }));
```

Pass `kind` in the `input` object and the new `opts` to `createResource`:

```ts
await createResource(sellerId, sellerName, { ...input, kind }, newFiles, thumbnail, setProgress,
  { media, durationSec, quiz: quizPublic, quizAnswers });
```

- [ ] **Step 5: Add a component test for kind switching + audio thumbnail rule**

Add to `ResourceForm.test.tsx`:

```ts
it('requires a thumbnail for audio resources', async () => {
  // render the form (reuse the existing render helper/mocks in this file),
  // click the "Audio" kind button, fill title/grade/subject, attempt submit,
  // and assert the "Audio resources need a thumbnail." error appears.
});
```

Fill in using the file's existing render + mock setup (mirror the nearest existing test's arrange/act/assert).

- [ ] **Step 6: Run tests + typecheck**

Run: `npx vitest run src/components/marketplace/ResourceForm.test.tsx`
Expected: PASS.
Run: `npx tsc -p tsconfig.app.json --noEmit`
Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/components/marketplace/ResourceForm.tsx src/components/marketplace/ResourceForm.test.tsx
git commit -m "feat(marketplace): video/audio upload + quiz builder in ResourceForm"
```

---

## Task 9: MediaPlayer component

**Files:**
- Create: `src/components/marketplace/MediaPlayer.tsx`
- Test: `src/components/marketplace/MediaPlayer.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `MediaPlayer.test.tsx`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../../lib/marketplace/media', () => ({ fetchMediaUrl: vi.fn(async () => ({ url: 'blob:signed' })) }));
import MediaPlayer from './MediaPlayer';

describe('MediaPlayer', () => {
  it('renders a video element for kind=video with the signed src', async () => {
    render(<MediaPlayer resourceId="r1" kind="video" onEnded={() => {}} />);
    await waitFor(() => expect(screen.getByTestId('media-el').tagName).toBe('VIDEO'));
    expect(screen.getByTestId('media-el')).toHaveAttribute('src', 'blob:signed');
  });
  it('renders an audio element for kind=audio', async () => {
    render(<MediaPlayer resourceId="r2" kind="audio" onEnded={() => {}} />);
    await waitFor(() => expect(screen.getByTestId('media-el').tagName).toBe('AUDIO'));
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/components/marketplace/MediaPlayer.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement MediaPlayer**

Create `MediaPlayer.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { fetchMediaUrl } from '../../lib/marketplace/media';

interface Props {
  resourceId: string;
  kind: 'video' | 'audio';
  onEnded?: () => void;
}

/** Streams gated media via a short-lived signed URL. Stream-only (no download). */
export default function MediaPlayer({ resourceId, kind, onEnded }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    fetchMediaUrl(resourceId)
      .then(r => { if (alive) setUrl(r.url); })
      .catch(e => { if (alive) setError(e instanceof Error ? e.message : 'Could not load media.'); });
    return () => { alive = false; };
  }, [resourceId]);

  if (error) return <p className="text-sm text-[#b91c1c]">{error}</p>;
  if (!url) return <p className="text-sm text-[#64748b]">Loading…</p>;

  const common = {
    'data-testid': 'media-el',
    src: url,
    controls: true,
    controlsList: 'nodownload',
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    onEnded,
    className: 'w-full rounded-xl bg-black',
  } as const;

  return kind === 'video' ? <video {...common} /> : <audio {...common} className="w-full" />;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/components/marketplace/MediaPlayer.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/marketplace/MediaPlayer.tsx src/components/marketplace/MediaPlayer.test.tsx
git commit -m "feat(marketplace): MediaPlayer streams gated media (no download)"
```

---

## Task 10: QuizRunner component

**Files:**
- Create: `src/components/marketplace/QuizRunner.tsx`
- Test: `src/components/marketplace/QuizRunner.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `QuizRunner.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const submitQuiz = vi.fn(async () => ({
  score: 1, total: 1,
  perQuestion: [{ correctIndex: 0, chosen: 0, correct: true, explanation: 'yes' }],
}));
vi.mock('../../lib/marketplace/media', () => ({ submitQuiz }));
import QuizRunner from './QuizRunner';

const quiz = [{ prompt: '2+2?', options: ['4', '5'] }];

describe('QuizRunner', () => {
  it('submits chosen answers and shows the score', async () => {
    render(<QuizRunner resourceId="r1" quiz={quiz} />);
    await userEvent.click(screen.getByLabelText('4'));
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(submitQuiz).toHaveBeenCalledWith('r1', [0]);
    expect(await screen.findByText(/1 \/ 1/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/components/marketplace/QuizRunner.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement QuizRunner**

Create `QuizRunner.tsx`:

```tsx
import { useState } from 'react';
import { submitQuiz } from '../../lib/marketplace/media';
import type { QuizQuestionPublic, GradeResult } from '../../lib/marketplace/types';

interface Props { resourceId: string; quiz: QuizQuestionPublic[] }

export default function QuizRunner({ resourceId, quiz }: Props) {
  const [chosen, setChosen] = useState<number[]>(() => quiz.map(() => -1));
  const [result, setResult] = useState<GradeResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setBusy(true); setError('');
    try {
      setResult(await submitQuiz(resourceId, chosen.map(c => (c < 0 ? -1 : c))));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit.');
    } finally { setBusy(false); }
  }

  if (result) {
    return (
      <div className="space-y-3">
        <p className="font-bold text-[#0f172a]">You scored {result.score} / {result.total}</p>
        {quiz.map((q, i) => {
          const d = result.perQuestion[i];
          return (
            <div key={i} className="rounded-xl border border-[#eceff3] p-3">
              <p className="font-semibold">{q.prompt}</p>
              <p className={`text-sm ${d.correct ? 'text-[#16a34a]' : 'text-[#b91c1c]'}`}>
                {d.correct ? 'Correct' : `Correct answer: ${q.options[d.correctIndex]}`}
              </p>
              {d.explanation && <p className="text-sm text-[#64748b] mt-1">{d.explanation}</p>}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quiz.map((q, i) => (
        <fieldset key={i} className="rounded-xl border border-[#eceff3] p-3">
          <legend className="font-semibold px-1">{q.prompt}</legend>
          {q.options.map((opt, j) => (
            <label key={j} className="flex items-center gap-2 py-1 text-sm">
              <input type="radio" name={`q${i}`} aria-label={opt}
                checked={chosen[i] === j}
                onChange={() => setChosen(c => c.map((v, k) => (k === i ? j : v)))} />
              {opt}
            </label>
          ))}
        </fieldset>
      ))}
      {error && <p className="text-sm text-[#b91c1c]">{error}</p>}
      <button type="button" disabled={busy} onClick={submit}
        className="bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl px-4 py-2 font-semibold disabled:opacity-60">
        {busy ? 'Submitting…' : 'Submit answers'}
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/components/marketplace/QuizRunner.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketplace/QuizRunner.tsx src/components/marketplace/QuizRunner.test.tsx
git commit -m "feat(marketplace): QuizRunner — take + score the post-watch quiz"
```

---

## Task 11: Wire player + quiz into the buyer library

**Files:**
- Modify: `src/components/marketplace/buyer/pages/MyLibrary.tsx`

- [ ] **Step 1: Render the player + quiz for owned media resources**

In the owned-resource detail area of `MyLibrary.tsx`, when a resource's `kind` is `video`/`audio`, render `<MediaPlayer resourceId={r.id} kind={r.kind} onEnded={() => setShowQuiz(true)} />`. When `r.kind === 'video' && r.hasQuiz`, render a "Take the quiz" button (and auto-reveal on `onEnded`) that mounts `<QuizRunner resourceId={r.id} quiz={r.quiz} />`. Documents keep their existing download/list behavior.

Add the imports:

```ts
import MediaPlayer from '../../MediaPlayer';
import QuizRunner from '../../QuizRunner';
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`, sign in as a buyer who owns a video resource, open it in My Library.
Expected: video streams; when it ends (or the button is clicked) the quiz appears; submitting shows a score.

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc -p tsconfig.app.json --noEmit`
Expected: no output.

```bash
git add src/components/marketplace/buyer/pages/MyLibrary.tsx
git commit -m "feat(marketplace): play gated media + quiz in My Library"
```

---

## Task 12: Kind badge on ResourceCard + Browse

**Files:**
- Modify: `src/components/marketplace/buyer/components/ResourceCard.tsx`
- Test: `src/components/marketplace/buyer/components/ResourceCard.test.tsx` (add case)

- [ ] **Step 1: Write the failing test**

Add to `ResourceCard.test.tsx`:

```ts
it('shows a Video badge for video resources', () => {
  // render <ResourceCard> with a resource whose kind === 'video' (reuse the
  // existing render helper/fixture in this file), then:
  expect(screen.getByText(/video/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/components/marketplace/buyer/components/ResourceCard.test.tsx`
Expected: FAIL — no badge.

- [ ] **Step 3: Add the badge**

In `ResourceCard.tsx`, when `resource.kind === 'video'` or `'audio'`, overlay a small badge on the thumbnail:

```tsx
{resource.kind !== 'document' && (
  <span className="absolute top-2 left-2 rounded-full bg-black/70 text-white text-xs font-semibold px-2 py-0.5">
    {resource.kind === 'video' ? '▶ Video' : '🎧 Audio'}
  </span>
)}
```

(Ensure the thumbnail wrapper is `relative`.)

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/components/marketplace/buyer/components/ResourceCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketplace/buyer/components/ResourceCard.tsx src/components/marketplace/buyer/components/ResourceCard.test.tsx
git commit -m "feat(marketplace): kind badge on resource cards"
```

---

## Task 13: Teacher quiz-results view

**Files:**
- Create: `src/components/marketplace/ResourceResults.tsx`
- Modify: `src/lib/marketplace/resources.ts` (add `subscribeQuizResults`)
- Test: `src/lib/marketplace/resources.test.ts` (add query-shape case if a helper is extracted)

- [ ] **Step 1: Add a results subscription**

In `resources.ts`, add:

```ts
export interface QuizResultRow {
  id: string; resourceId: string; buyerAccountId: string;
  resourceTitle: string; score: number; total: number;
}

/** Live subscription to a seller's quiz results across their resources. */
export function subscribeQuizResults(
  sellerId: string, cb: (rows: QuizResultRow[]) => void,
): Unsubscribe {
  const q = query(collection(db, 'quizResults'), where('sellerId', '==', sellerId));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<QuizResultRow, 'id'>) }))));
}
```

- [ ] **Step 2: Implement the results view**

Create `ResourceResults.tsx`: subscribe with `subscribeQuizResults(sellerId, ...)`, render a table (learner id, resource title, score/total). Show an empty state when there are none. Follow the styling of `SellersSection.tsx`'s table.

- [ ] **Step 3: Link it from the seller Analytics/resource view**

Add a route/tab in the seller layout that renders `<ResourceResults />` (mirror how existing seller pages are registered in the router/`SellerLayout`).

- [ ] **Step 4: Typecheck + manual check + commit**

Run: `npx tsc -p tsconfig.app.json --noEmit`
Expected: no output.

```bash
git add src/components/marketplace/ResourceResults.tsx src/lib/marketplace/resources.ts
git commit -m "feat(marketplace): teacher view of video quiz results"
```

---

## Final verification

- [ ] Run the full frontend suite: `npx vitest run` — expected: all pass.
- [ ] Run the functions suite: `cd functions && npx vitest run` — expected: all pass.
- [ ] Typecheck both: `npx tsc -p tsconfig.app.json --noEmit` and `cd functions && npx tsc --noEmit`.
- [ ] Deploy backend for gating to take effect: `firebase deploy --only storage,firestore:rules,functions`.
- [ ] Smoke test as a teacher (upload a short video + 2-question quiz, publish) and as a buyer (purchase, watch, take quiz, see score); confirm the teacher sees the recorded result.

## Notes

- **Signed URLs require the Functions service account to have the Service Account Token Creator role** (`roles/iam.serviceAccountTokenCreator`) to sign blobs. If `getSignedUrl` fails with a signing error at runtime, grant that role to the function's runtime service account.
- No data backfill is needed — `normalizeResource` defaults every legacy resource to a document.
- `updateResource` media/quiz editing is intentionally minimal in this phase; full media replacement on edit can be a follow-up.
