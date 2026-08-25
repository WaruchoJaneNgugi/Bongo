# HighScores Media Resources (Video + Audio + Post-Watch Quiz) — Design

**Date:** 2026-08-25
**Status:** Approved (design), pending implementation plan
**Phase:** A+B of the "full online learning platform" initiative. Phase C (live
classes) is deliberately deferred to its own spec.

## Context

HighScores is a CBC marketplace where **teachers** (the only seller type as of
the teachers-only change) sell learning resources. Today a resource is:

- Metadata in Firestore (`resources/{id}`): title, description, level, grade,
  subject, price, status, sales, views.
- Files in Firebase Storage under `marketplace/{sellerId}/...` (currently a
  50 MB cap, **public-read**).
- A marketing thumbnail.
- Bought via a `purchase` record; "My Library" is derived from paid purchases.

This phase turns HighScores into a media learning platform by letting teachers
publish **pre-recorded video** and **audio session** resources, gate them behind
purchase, and attach an **optional graded quiz** to videos.

## Goals

1. Teachers can upload an edited **video** lesson (with grade, subject, and an
   optional post-watch quiz).
2. Teachers can upload an **audio** session recording with a required thumbnail.
3. Paid media is **access-gated** — only the owning teacher or a paid buyer can
   stream it.
4. Students watch/listen in-app (stream-only), then take the optional quiz;
   their scores are recorded and visible to the teacher.

## Non-Goals (YAGNI)

- Live classes / real-time broadcast (Phase C, separate spec).
- Video transcoding, adaptive bitrate, or captions — we play the raw uploaded
  file via native HTML5 media elements.
- Downloadable media (gated media is stream-only).
- Mixed quiz question types, timers, question banks, or retake analytics beyond
  the latest score.

## Decisions (from brainstorming)

| Decision | Choice |
|----------|--------|
| Sequencing | Video + Audio uploads now; Live classes later |
| Media model | Add a resource `kind: 'document' \| 'video' \| 'audio'` |
| Max video size | 500 MB (audio: 100 MB) |
| Access control | Gate media now via signed URLs (thumbnails stay public) |
| Primary media | One primary media file per resource + optional attachments |
| Playback | Stream-only, no download for gated media |
| Quiz | Video-only, optional, MCQ, **scored & recorded** server-side |

---

## 1. Data Model

### 1.1 `MarketResource` additions (`src/lib/marketplace/types.ts`)

```ts
export type ResourceKind = 'document' | 'video' | 'audio';

export interface QuizQuestionPublic {
  prompt: string;
  options: string[];            // 2–4 options
}

export interface MarketResource {
  ...existing fields...
  kind: ResourceKind;           // NEW; missing/legacy → treated as 'document'
  media: ResourceFile | null;   // NEW; the one primary video/audio (null for documents)
  durationSec: number | null;   // NEW; read client-side before upload, for display
  hasQuiz: boolean;             // NEW; true only for videos with a saved quiz
  quiz: QuizQuestionPublic[];   // NEW; display-only (prompt + options, NO answers)
}
```

- `files[]` keeps its meaning: **optional supporting attachments** (worksheets,
  slides) alongside the primary media.
- `thumbnailUrl/Path` keeps its meaning: marketing image. **Required** for audio
  (which has no visual frame) and videos; optional for documents (unchanged).
- Backward compatibility: existing docs have no `kind` → the client and any
  read-mapping default them to `'document'`, `media: null`, `hasQuiz: false`,
  `quiz: []`.

### 1.2 Private quiz answers (`resources/{id}/private/quiz`)

A single subdoc holding the gradable data, **never** sent to buyers:

```ts
interface QuizAnswersDoc {
  answers: Array<{ correctIndex: number; explanation?: string }>;
  // index-aligned with resource.quiz[]
}
```

### 1.3 Quiz results (`quizResults/{autoId}`)

Written only by the grading Cloud Function:

```ts
interface QuizResult {
  resourceId: string;
  sellerId: string;             // denormalized for the teacher read-rule
  buyerAccountId: string;
  resourceTitle: string;
  score: number;                // number correct
  total: number;                // number of questions
  createdAt: Timestamp;
}
```

One logical result per (resourceId, buyerAccountId) — latest submission wins
(deterministic doc id `${resourceId}_${buyerAccountId}`, overwritten on retake).

---

## 2. Upload Flow (`src/components/marketplace/ResourceForm.tsx`)

1. **Kind picker** at the top: Document / Video / Audio. Switching kind resets
   the media-specific state.
2. **Grade & subject** remain required for all kinds (existing CBC taxonomy).
3. Kind-specific dropzone:
   - Video: accepts `video/*`, client cap **500 MB**.
   - Audio: accepts `audio/*`, client cap **100 MB**, and the **thumbnail field
     becomes required**.
   - Document: unchanged (existing multi-file `files[]`).
4. On media select, read `durationSec` via a hidden `<video>`/`<audio>` element
   (`loadedmetadata`) before upload.
5. **Quiz builder** (video only, optional): add/remove questions; each has a
   prompt, 2–4 option inputs, a "correct" radio, and an optional explanation.
   Validation: if any question exists, each must have a prompt, ≥2 non-empty
   options, and a selected correct option.
6. Reuse the existing resumable-upload + progress UI. Primary media uploads to
   the gated prefix (§3); thumbnail + attachments keep current public prefix.
7. On save: write resource metadata (including `kind`, `media`, `durationSec`,
   `hasQuiz`, display-only `quiz`) and, when a quiz exists, write the private
   answers subdoc.

Client guards mirror the Storage rules but the rules are the real enforcement.

---

## 3. Access Gating

### 3.1 Storage layout & rules (`storage.rules`)

- **Thumbnails & document files:** stay under the current public-read prefix
  (`marketplace/{sellerId}/...`) — unchanged, they are marketing/allowed.
- **Primary media:** new gated prefix `marketplace/{sellerId}/media/{...}`.
  - Public read **denied**.
  - Owning seller may read/write their own media; size cap raised to **500 MB**
    on this prefix.
  - Everyone else reads only via signed URLs minted by a Cloud Function (§3.2).

```
match /marketplace/{sellerId}/media/{allPaths=**} {
  allow read:  if request.auth != null
               && request.auth.uid == sellerId
               && request.auth.token.seller == true;      // owner direct-read only
  allow write: if request.auth != null
               && request.auth.uid == sellerId
               && request.auth.token.seller == true
               && (request.resource == null || request.resource.size < 500 * 1024 * 1024);
}
// existing non-media marketplace prefix keeps public read.
```

### 3.2 `getResourceMediaUrl(resourceId)` — callable Cloud Function

1. Load the resource. If it has no gated `media`, error.
2. Authorize: caller is the **owning teacher**, OR the resource is **free**
   (`priceKsh === 0`), OR a **paid `purchase`** exists for
   (resourceId, caller account).
3. Return a **v4 signed URL** for the media object, expiry ~2 hours.
4. Deny otherwise.

The player fetches this on play; the URL is never embedded in list/detail docs.

---

## 4. Playback (buyer side)

- New `MediaPlayer` component: native `<video controls>` / `<audio controls>`
  chosen by `kind`, fed the signed URL from `getResourceMediaUrl`.
  `controlsList="nodownload"` + no download affordance (stream-only).
- Used in `MyLibrary` resource view and the owned-resource detail. Marketplace
  Browse/`ResourceDetail` (pre-purchase) show only the thumbnail + a
  "▶ Video" / "🎧 Audio" badge and duration; no signed URL is requested until
  the user owns the resource (or it is free).
- **Quiz gate:** for videos with `hasQuiz`, the quiz UI appears when the media
  `ended` event fires (or via a "Take the quiz" button).

---

## 5. Quiz Taking & Grading

- Student answers the display-only `quiz` (from the resource doc), submits.
- **`submitVideoQuiz(resourceId, answers[])`** callable Cloud Function:
  1. Authorize like §3.2 (owner or paid buyer or free).
  2. Read `resources/{id}/private/quiz`, grade server-side.
  3. Upsert `quizResults/${resourceId}_${buyerAccountId}` with score/total.
  4. Return `{ score, total, perQuestion: [{ correctIndex, chosen, correct,
     explanation? }] }` so the student sees results + explanations.
- Correct answers are **only** returned in the grading response — never in the
  browseable resource doc.

### Teacher visibility

- A results list on the teacher's resource view / Analytics: each buyer's latest
  score. Firestore rule: a seller reads `quizResults` where
  `sellerId == request.auth.uid && seller == true`.

---

## 6. Marketplace Surfacing

- `kind` badge on `ResourceCard` (play/headphone icon overlay on the thumbnail),
  plus duration.
- Optional `kind` filter chips on Browse (Documents / Videos / Audio).

---

## 7. Firestore Rules Summary

- `resources/{id}`: unchanged public read of the main doc (now includes
  display-only `quiz`). Write stays owner-only.
- `resources/{id}/private/quiz`: read/write only owner teacher / admin; buyers
  denied.
- `quizResults/{id}`: no client create/update (Functions only). Read allowed to
  the owning seller (`sellerId == uid`) and to the buyer for their own result.

---

## 8. Testing

- **Model migration:** legacy resource (no `kind`) maps to `document`, `media:
  null`, `hasQuiz: false`.
- **ResourceForm:** kind switching resets media state; audio requires a
  thumbnail; video size cap enforced; quiz validation (prompt, ≥2 options,
  correct selected).
- **`getResourceMediaUrl`:** owner ✓, paid buyer ✓, free resource ✓, stranger ✗,
  document/no-media → error.
- **`submitVideoQuiz`:** grades correctly; unauthorized ✗; upsert overwrites
  prior result; response never leaks answers for unrelated resources.
- **MediaPlayer:** renders `<video>` for video, `<audio>` for audio; no download
  control.
- **Quiz UI:** appears after `ended`; shows score + explanations from the
  function response.

---

## 9. Components & Files (anticipated)

**Frontend**
- `src/lib/marketplace/types.ts` — new types/fields.
- `src/lib/marketplace/resources.ts` — read-mapping defaults; media upload to
  gated prefix; write private quiz answers; `getMediaUrl` / `submitQuiz`
  wrappers over the callables.
- `src/components/marketplace/ResourceForm.tsx` — kind picker, media dropzones,
  duration read, quiz builder.
- `src/components/marketplace/MediaPlayer.tsx` — NEW.
- `src/components/marketplace/QuizRunner.tsx` — NEW (take + results).
- Buyer `ResourceDetail` / `MyLibrary` — wire in player + quiz.
- `ResourceCard` / Browse — kind badge + filter.

**Backend (`functions/src`)**
- `marketplace/media.ts` — `getResourceMediaUrl`.
- `marketplace/quiz.ts` — `submitVideoQuiz`.
- Export from `functions/src/index.ts`.

**Rules**
- `storage.rules` — gated media prefix.
- `firestore.rules` — private quiz subdoc + `quizResults`.

## 10. Rollout Notes

- Storage/Firestore rules and Functions require `firebase deploy` to take
  effect.
- No data backfill needed — legacy resources default to `document` on read.
