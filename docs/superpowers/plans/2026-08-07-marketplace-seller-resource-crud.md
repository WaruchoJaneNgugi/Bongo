# Seller Resource CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a marketplace seller create, list, edit, publish/unpublish and delete their own multi-file resources, backed by Firestore + Firebase Storage.

**Architecture:** A thin data-access module (`resources.ts`) mirrors the existing `adminData.ts` pattern (live `onSnapshot` + direct writes). Two React pages under `SellerLayout` (a list and a create/edit form) consume it. Security is enforced by Firestore/Storage rules keyed on the seller's `request.auth.uid` (== sellerId) and `seller` custom claim. Subject/grade are constrained to `LEVEL_CONFIG` via a small taxonomy helper.

**Tech Stack:** React 18 + TypeScript, react-router-dom v6, Zustand, Firebase (Firestore, Storage, Auth custom tokens), Vitest + @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-08-07-marketplace-seller-resource-crud-design.md`

---

## File Structure

- Create: `src/lib/marketplace/taxonomy.ts` — `RESOURCE_LEVELS` derived from `LEVEL_CONFIG`.
- Create: `src/lib/marketplace/taxonomy.test.ts`
- Modify: `src/lib/marketplace/types.ts` — add resource types.
- Create: `src/lib/marketplace/resources.ts` — data-access layer.
- Create: `src/lib/marketplace/resources.test.ts`
- Modify: `firestore.rules` — `resources` collection block.
- Modify: `storage.rules` — seller-writable `marketplace/{sellerId}` path.
- Modify: `firestore.indexes.json` — composite index for `sellerId + createdAt`.
- Create: `src/components/marketplace/MyResources.tsx` — seller resource list.
- Create: `src/components/marketplace/MyResources.test.tsx`
- Create: `src/components/marketplace/ResourceForm.tsx` — create/edit form.
- Create: `src/components/marketplace/ResourceForm.test.tsx`
- Modify: `src/App.tsx` — register three seller routes.
- Modify: `src/components/marketplace/SellerLayout.tsx` — wire nav + CTAs.
- Create: `src/components/marketplace/SellerLayout.test.tsx`

Test commands (from repo root): `npm test` runs all; `npx vitest run <path>` runs one file.

---

## Task 1: Types + taxonomy helper

**Files:**
- Modify: `src/lib/marketplace/types.ts`
- Create: `src/lib/marketplace/taxonomy.ts`
- Test: `src/lib/marketplace/taxonomy.test.ts`

- [ ] **Step 1: Add resource types to `types.ts`**

Append to `src/lib/marketplace/types.ts`:

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
  updatedAt: unknown;   // Firestore Timestamp
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

- [ ] **Step 2: Write the failing taxonomy test**

Create `src/lib/marketplace/taxonomy.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { RESOURCE_LEVELS, levelByKey } from './taxonomy';

describe('RESOURCE_LEVELS', () => {
  it('exposes the three levels in order', () => {
    expect(RESOURCE_LEVELS.map(l => l.key)).toEqual([
      'lower_primary', 'middle_school', 'senior_school',
    ]);
  });

  it('has the correct grade bands', () => {
    expect(levelByKey('lower_primary')!.grades).toEqual(['Grade 1', 'Grade 2', 'Grade 3']);
    expect(levelByKey('middle_school')!.grades).toEqual([
      'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
    ]);
    expect(levelByKey('senior_school')!.grades).toEqual(['Grade 10', 'Grade 11', 'Grade 12']);
  });

  it('sources subjects from LEVEL_CONFIG', () => {
    expect(levelByKey('lower_primary')!.subjects).toContain('Mathematics');
    expect(levelByKey('senior_school')!.subjects).toContain('Biology');
  });

  it('returns undefined for an unknown key', () => {
    expect(levelByKey('nope' as never)).toBeUndefined();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/lib/marketplace/taxonomy.test.ts`
Expected: FAIL — cannot find module `./taxonomy`.

- [ ] **Step 4: Implement `taxonomy.ts`**

Create `src/lib/marketplace/taxonomy.ts`:

```ts
import { LEVEL_CONFIG } from '../../hooks/LevelConfigs';
import type { ResourceLevel } from './types';

export interface LevelTaxonomy {
  key: ResourceLevel;
  label: string;
  grades: string[];
  subjects: string[];
}

// LEVEL_CONFIG stores a display string like 'Grade 1–3'; resources need the
// explicit per-band grade list. Subjects come straight from LEVEL_CONFIG so
// they never drift from the rest of the app.
const GRADE_BANDS: Record<ResourceLevel, string[]> = {
  lower_primary: ['Grade 1', 'Grade 2', 'Grade 3'],
  middle_school: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
  senior_school: ['Grade 10', 'Grade 11', 'Grade 12'],
};

export const RESOURCE_LEVELS: LevelTaxonomy[] = (
  ['lower_primary', 'middle_school', 'senior_school'] as ResourceLevel[]
).map(key => ({
  key,
  label: LEVEL_CONFIG[key].label,
  grades: GRADE_BANDS[key],
  subjects: LEVEL_CONFIG[key].subjects,
}));

export function levelByKey(key: ResourceLevel): LevelTaxonomy | undefined {
  return RESOURCE_LEVELS.find(l => l.key === key);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/marketplace/taxonomy.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/marketplace/types.ts src/lib/marketplace/taxonomy.ts src/lib/marketplace/taxonomy.test.ts
git commit -m "feat(marketplace): resource types + level taxonomy helper"
```

---

## Task 2: Data-access layer `resources.ts`

**Files:**
- Create: `src/lib/marketplace/resources.ts`
- Test: `src/lib/marketplace/resources.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/marketplace/resources.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'firebase/firestore';
import * as st from 'firebase/storage';
import {
  createResource, setResourceStatus, deleteResource,
} from './resources';
import type { ResourceInput } from './types';

vi.mock('../firebase', () => ({ db: {}, storage: {} }));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ __col: true })),
  doc: vi.fn((_db: unknown, _c?: string, id?: string) => ({ id: id ?? 'gen-id' })),
  setDoc: vi.fn(async () => undefined),
  updateDoc: vi.fn(async () => undefined),
  deleteDoc: vi.fn(async () => undefined),
  getDoc: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  serverTimestamp: vi.fn(() => 'TS'),
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn((_s: unknown, path: string) => ({ path })),
  uploadBytes: vi.fn(async () => undefined),
  getDownloadURL: vi.fn(async () => 'https://dl/url'),
  deleteObject: vi.fn(async () => undefined),
}));

const input: ResourceInput = {
  title: 'Fractions Pack', description: 'Worksheets',
  level: 'middle_school', grade: 'Grade 5', subject: 'Mathematics',
  priceKsh: 150, status: 'published',
};

function fileOf(name: string) {
  return new File(['x'], name, { type: 'application/pdf' });
}

beforeEach(() => vi.clearAllMocks());

describe('createResource', () => {
  it('uploads files under the seller/resource path and writes the doc', async () => {
    const id = await createResource('seller1', 'Ms Jane', input, [fileOf('a.pdf')]);
    expect(id).toBe('gen-id');

    // File uploaded to marketplace/{sellerId}/{resourceId}/files/{name}
    expect(st.ref).toHaveBeenCalledWith({}, 'marketplace/seller1/gen-id/files/a.pdf');
    expect(st.uploadBytes).toHaveBeenCalledTimes(1);

    // Doc written with denormalized fields and zeroed counters.
    const [, payload] = (fs.setDoc as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(payload).toMatchObject({
      sellerId: 'seller1', sellerName: 'Ms Jane',
      title: 'Fractions Pack', level: 'middle_school',
      grade: 'Grade 5', subject: 'Mathematics', priceKsh: 150,
      status: 'published', sales: 0, views: 0, thumbnailUrl: null,
    });
    expect(payload.files).toHaveLength(1);
    expect(payload.files[0]).toMatchObject({
      name: 'a.pdf', url: 'https://dl/url',
      path: 'marketplace/seller1/gen-id/files/a.pdf',
    });
  });

  it('uploads a thumbnail when provided', async () => {
    await createResource('seller1', 'Ms Jane', input, [fileOf('a.pdf')], fileOf('t.png'));
    expect(st.ref).toHaveBeenCalledWith({}, 'marketplace/seller1/gen-id/thumb/t.png');
  });
});

describe('setResourceStatus', () => {
  it('updates status + updatedAt', async () => {
    await setResourceStatus('res1', 'draft');
    expect(fs.updateDoc).toHaveBeenCalledWith(
      { id: 'res1' }, { status: 'draft', updatedAt: 'TS' },
    );
  });
});

describe('deleteResource', () => {
  it('deletes every file, the thumbnail, then the doc', async () => {
    await deleteResource({
      id: 'res1',
      files: [
        { name: 'a', url: 'u', path: 'marketplace/s/res1/files/a', size: 1, contentType: 'x' },
        { name: 'b', url: 'u', path: 'marketplace/s/res1/files/b', size: 1, contentType: 'x' },
      ],
      thumbnailPath: 'marketplace/s/res1/thumb/t',
    });
    expect(st.deleteObject).toHaveBeenCalledTimes(3);
    expect(fs.deleteDoc).toHaveBeenCalledWith({ id: 'res1' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/marketplace/resources.test.ts`
Expected: FAIL — cannot find module `./resources`.

- [ ] **Step 3: Implement `resources.ts`**

Create `src/lib/marketplace/resources.ts`:

```ts
// Marketplace resource data-access layer. Mirrors adminData.ts: live snapshot
// subscriptions + direct Firestore/Storage writes, secured by rules.
import {
  collection, doc, setDoc, updateDoc, deleteDoc, getDoc, onSnapshot,
  query, where, orderBy, serverTimestamp, type Unsubscribe,
} from 'firebase/firestore';
import {
  ref as storageRef, uploadBytes, getDownloadURL, deleteObject,
} from 'firebase/storage';
import { db, storage } from '../firebase';
import type { MarketResource, ResourceFile, ResourceInput, ResourceStatus } from './types';

type ResourceDoc = Omit<MarketResource, 'id'>;

async function uploadFile(
  sellerId: string, resourceId: string, folder: 'files' | 'thumb', file: File,
): Promise<ResourceFile> {
  const path = `marketplace/${sellerId}/${resourceId}/${folder}/${file.name}`;
  const r = storageRef(storage, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  return { name: file.name, url, path, size: file.size, contentType: file.type };
}

/** Live subscription to a seller's own resources, newest first. */
export function subscribeSellerResources(
  sellerId: string, cb: (rows: MarketResource[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'resources'),
    where('sellerId', '==', sellerId),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...(d.data() as ResourceDoc) })));
  });
}

export async function getResource(id: string): Promise<MarketResource | null> {
  const snap = await getDoc(doc(db, 'resources', id));
  return snap.exists() ? { id: snap.id, ...(snap.data() as ResourceDoc) } : null;
}

/** Create a resource: upload files (+ optional thumbnail) then write the doc.
 *  onProgress reports coarse progress (uploads completed / total), 0..1. */
export async function createResource(
  sellerId: string,
  sellerName: string,
  input: ResourceInput,
  files: File[],
  thumbnail?: File | null,
  onProgress?: (p: number) => void,
): Promise<string> {
  const resRef = doc(collection(db, 'resources'));
  const id = resRef.id;

  const total = files.length + (thumbnail ? 1 : 0);
  let done = 0;
  const tick = () => { done += 1; onProgress?.(total ? done / total : 1); };

  const uploaded: ResourceFile[] = [];
  for (const f of files) { uploaded.push(await uploadFile(sellerId, id, 'files', f)); tick(); }

  let thumbnailUrl: string | null = null;
  let thumbnailPath: string | null = null;
  if (thumbnail) {
    const t = await uploadFile(sellerId, id, 'thumb', thumbnail);
    thumbnailUrl = t.url; thumbnailPath = t.path; tick();
  }

  await setDoc(resRef, {
    sellerId, sellerName,
    title: input.title,
    description: input.description,
    level: input.level,
    grade: input.grade,
    subject: input.subject,
    priceKsh: input.priceKsh,
    files: uploaded,
    thumbnailUrl,
    thumbnailPath,
    status: input.status,
    sales: 0,
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

export interface ResourceUpdate {
  meta: Partial<Pick<MarketResource,
    'title' | 'description' | 'level' | 'grade' | 'subject' | 'priceKsh' | 'status'>>;
  /** Existing files to keep (form removed the rest). */
  keptFiles: ResourceFile[];
  /** New files to upload and append. */
  newFiles?: File[];
  /** Storage paths of removed files to delete. */
  removedFilePaths?: string[];
  /** Replacement thumbnail (uploaded); clears the old one. */
  newThumbnail?: File | null;
  /** Remove the thumbnail without replacing it. */
  removeThumbnail?: boolean;
  /** Existing thumbnail path, deleted when replaced or removed. */
  oldThumbnailPath?: string | null;
}

/** Update a resource's metadata and file bundle. */
export async function updateResource(
  sellerId: string, id: string, u: ResourceUpdate,
): Promise<void> {
  for (const p of u.removedFilePaths ?? []) {
    await deleteObject(storageRef(storage, p)).catch(() => undefined);
  }

  const added: ResourceFile[] = [];
  for (const f of u.newFiles ?? []) added.push(await uploadFile(sellerId, id, 'files', f));

  const patch: Record<string, unknown> = {
    ...u.meta,
    files: [...u.keptFiles, ...added],
    updatedAt: serverTimestamp(),
  };

  if (u.newThumbnail) {
    if (u.oldThumbnailPath) await deleteObject(storageRef(storage, u.oldThumbnailPath)).catch(() => undefined);
    const t = await uploadFile(sellerId, id, 'thumb', u.newThumbnail);
    patch.thumbnailUrl = t.url;
    patch.thumbnailPath = t.path;
  } else if (u.removeThumbnail) {
    if (u.oldThumbnailPath) await deleteObject(storageRef(storage, u.oldThumbnailPath)).catch(() => undefined);
    patch.thumbnailUrl = null;
    patch.thumbnailPath = null;
  }

  await updateDoc(doc(db, 'resources', id), patch);
}

export async function setResourceStatus(id: string, status: ResourceStatus): Promise<void> {
  await updateDoc(doc(db, 'resources', id), { status, updatedAt: serverTimestamp() });
}

export async function deleteResource(
  resource: Pick<MarketResource, 'id' | 'files' | 'thumbnailPath'>,
): Promise<void> {
  for (const f of resource.files) {
    await deleteObject(storageRef(storage, f.path)).catch(() => undefined);
  }
  if (resource.thumbnailPath) {
    await deleteObject(storageRef(storage, resource.thumbnailPath)).catch(() => undefined);
  }
  await deleteDoc(doc(db, 'resources', resource.id));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/marketplace/resources.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/marketplace/resources.ts src/lib/marketplace/resources.test.ts
git commit -m "feat(marketplace): resource data-access layer (create/list/update/delete)"
```

---

## Task 3: Security rules + composite index

No automated test (no rules-unit-testing dependency is installed). Verification is by careful review against the spec + optional emulator check.

**Files:**
- Modify: `firestore.rules`
- Modify: `storage.rules`
- Modify: `firestore.indexes.json`

- [ ] **Step 1: Add the `resources` block to `firestore.rules`**

In `firestore.rules`, immediately after the closing `}` of the `match /sellers/{id}` block (before the `/* Everything else is denied by default. */` comment), insert:

```
    /* ── Marketplace resources ── */
    // A seller creates/edits/deletes only their own resources. Published
    // resources are world-readable (buyer browse, a later slice); drafts are
    // visible only to their owner and staff. The owner cannot be reassigned.
    match /resources/{id} {
      allow read:   if resource.data.status == 'published'
                    || isStaff()
                    || (isSeller() && request.auth.uid == resource.data.sellerId);
      allow create: if isSeller()
                    && request.auth.uid == request.resource.data.sellerId;
      allow update: if (isSeller()
                        && request.auth.uid == resource.data.sellerId
                        && request.resource.data.sellerId == resource.data.sellerId)
                    || isAdmin();
      allow delete: if (isSeller() && request.auth.uid == resource.data.sellerId)
                    || isAdmin();
    }
```

- [ ] **Step 2: Add the marketplace path to `storage.rules`**

In `storage.rules`, inside `match /b/{bucket}/o {`, add a more-specific match ABOVE the existing `match /{allPaths=**}` block:

```
    // Sellers upload resource files/thumbnails under their own prefix.
    // Public read (paid-file gating is deferred to the payments slice).
    match /marketplace/{sellerId}/{allPaths=**} {
      allow read:  if true;
      allow write: if request.auth != null
                   && request.auth.uid == sellerId
                   && request.auth.token.seller == true
                   && request.resource.size < 50 * 1024 * 1024;
    }
```

- [ ] **Step 3: Add the composite index**

`subscribeSellerResources` queries `where('sellerId','==') + orderBy('createdAt','desc')`, which requires a composite index. Replace the contents of `firestore.indexes.json` with:

```json
{
  "indexes": [
    {
      "collectionGroup": "resources",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "sellerId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

- [ ] **Step 4: Verify rules compile**

Run: `npx firebase deploy --only firestore:rules,storage --dry-run` if the Firebase CLI is available and authenticated.
If the CLI is unavailable, manually confirm: (a) braces balance in both rule files, (b) the `resources` block uses only helpers already defined at the top of `firestore.rules` (`isSeller`, `isStaff`, `isAdmin`), (c) the storage `marketplace` match sits above the catch-all.

Expected: rules parse without error (or manual checklist passes).

- [ ] **Step 5: Commit**

```bash
git add firestore.rules storage.rules firestore.indexes.json
git commit -m "feat(marketplace): firestore/storage rules + index for resources"
```

---

## Task 4: `MyResources` list page

**Files:**
- Create: `src/components/marketplace/MyResources.tsx`
- Test: `src/components/marketplace/MyResources.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/marketplace/MyResources.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { MarketResource } from '../../lib/marketplace/types';
import MyResources from './MyResources';

const setStatus = vi.fn(async () => undefined);
const del = vi.fn(async () => undefined);
let rows: MarketResource[] = [];

vi.mock('../../lib/marketplace/resources', () => ({
  subscribeSellerResources: (_id: string, cb: (r: MarketResource[]) => void) => {
    cb(rows);
    return () => undefined;
  },
  setResourceStatus: (...a: unknown[]) => setStatus(...a),
  deleteResource: (...a: unknown[]) => del(...a),
}));

vi.mock('../../store/useSellerStore', () => ({
  useSellerStore: (sel: (s: unknown) => unknown) =>
    sel({ sellerId: 'seller1', seller: { displayName: 'Ms Jane' } }),
}));

function makeRow(over: Partial<MarketResource> = {}): MarketResource {
  return {
    id: 'r1', sellerId: 'seller1', sellerName: 'Ms Jane',
    title: 'Fractions Pack', description: 'x',
    level: 'middle_school', grade: 'Grade 5', subject: 'Mathematics',
    priceKsh: 150, files: [], thumbnailUrl: null, thumbnailPath: null,
    status: 'draft', sales: 0, views: 0, createdAt: 0, updatedAt: 0, ...over,
  };
}

beforeEach(() => { rows = []; setStatus.mockClear(); del.mockClear(); });

describe('MyResources', () => {
  it('shows an empty state with a create link when there are no resources', () => {
    render(<MemoryRouter><MyResources /></MemoryRouter>);
    expect(screen.getByText(/no resources yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create.*resource/i }))
      .toHaveAttribute('href', '/seller/resources/new');
  });

  it('lists resources with title and status', () => {
    rows = [makeRow({ status: 'published' })];
    render(<MemoryRouter><MyResources /></MemoryRouter>);
    expect(screen.getByText('Fractions Pack')).toBeInTheDocument();
    expect(screen.getByText(/published/i)).toBeInTheDocument();
  });

  it('publishes a draft via the toggle', async () => {
    rows = [makeRow({ status: 'draft' })];
    render(<MemoryRouter><MyResources /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button', { name: /publish/i }));
    expect(setStatus).toHaveBeenCalledWith('r1', 'published');
  });

  it('deletes after confirm', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    rows = [makeRow()];
    render(<MemoryRouter><MyResources /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(del).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/marketplace/MyResources.test.tsx`
Expected: FAIL — cannot find module `./MyResources`.

- [ ] **Step 3: Implement `MyResources.tsx`**

Create `src/components/marketplace/MyResources.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, Pencil, Trash2, Eye, EyeOff, FileText } from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import {
  subscribeSellerResources, setResourceStatus, deleteResource,
} from '../../lib/marketplace/resources';
import type { MarketResource } from '../../lib/marketplace/types';

export default function MyResources() {
  const sellerId = useSellerStore(s => s.sellerId);
  const [rows, setRows] = useState<MarketResource[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!sellerId) return;
    return subscribeSellerResources(sellerId, setRows);
  }, [sellerId]);

  async function toggle(r: MarketResource) {
    setBusy(r.id);
    try { await setResourceStatus(r.id, r.status === 'published' ? 'draft' : 'published'); }
    finally { setBusy(null); }
  }

  async function remove(r: MarketResource) {
    if (!window.confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    setBusy(r.id);
    try { await deleteResource(r); }
    finally { setBusy(null); }
  }

  if (rows.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <FileText className="mx-auto text-[#9aa39a]" size={48} />
        <h2 className="mt-4 text-lg font-bold text-[#1f2937]">No resources yet</h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Create your first resource to start selling on the marketplace.
        </p>
        <Link to="/seller/resources/new"
          className="mt-5 inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-full px-5 py-2.5">
          <FilePlus size={17} /> Create a resource
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-extrabold text-[#1f2937]">My Resources</h1>
        <Link to="/seller/resources/new"
          className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-full px-4 py-2.5">
          <FilePlus size={17} /> New resource
        </Link>
      </div>

      <ul className="space-y-3">
        {rows.map(r => (
          <li key={r.id}
            className="flex items-center gap-4 bg-white border border-[#e8ece8] rounded-2xl p-4">
            <div className="w-14 h-14 rounded-xl bg-[#eef7ef] grid place-items-center overflow-hidden shrink-0">
              {r.thumbnailUrl
                ? <img src={r.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                : <FileText className="text-[#16a34a]" size={22} />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-bold text-[#1f2937] truncate">{r.title}</div>
              <div className="text-[12px] text-[#6b7280]">
                {r.subject} · {r.grade} · {r.files.length} file{r.files.length === 1 ? '' : 's'}
              </div>
            </div>

            <div className="text-sm font-bold text-[#1f2937] tabular-nums">
              {r.priceKsh === 0 ? 'Free' : `Ksh ${r.priceKsh}`}
            </div>

            <span className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${
              r.status === 'published'
                ? 'bg-[#dcfce7] text-[#15803d]'
                : 'bg-[#f3f4f6] text-[#6b7280]'}`}>
              {r.status}
            </span>

            <div className="flex items-center gap-1">
              <button type="button" onClick={() => toggle(r)} disabled={busy === r.id}
                title={r.status === 'published' ? 'Unpublish' : 'Publish'}
                className="w-9 h-9 grid place-items-center rounded-full hover:bg-[#eef7ef] disabled:opacity-40">
                {r.status === 'published' ? <EyeOff size={17} /> : <Eye size={17} />}
                <span className="sr-only">{r.status === 'published' ? 'Unpublish' : 'Publish'}</span>
              </button>
              <Link to={`/seller/resources/${r.id}/edit`}
                title="Edit"
                className="w-9 h-9 grid place-items-center rounded-full hover:bg-[#eef7ef]">
                <Pencil size={16} /><span className="sr-only">Edit</span>
              </Link>
              <button type="button" onClick={() => remove(r)} disabled={busy === r.id}
                title="Delete"
                className="w-9 h-9 grid place-items-center rounded-full hover:bg-red-50 text-red-600 disabled:opacity-40">
                <Trash2 size={16} /><span className="sr-only">Delete</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/marketplace/MyResources.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/marketplace/MyResources.tsx src/components/marketplace/MyResources.test.tsx
git commit -m "feat(marketplace): seller My Resources list page"
```

---

## Task 5: `ResourceForm` create/edit page

**Files:**
- Create: `src/components/marketplace/ResourceForm.tsx`
- Test: `src/components/marketplace/ResourceForm.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/marketplace/ResourceForm.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ResourceForm from './ResourceForm';

const createResource = vi.fn(async () => 'new-id');

vi.mock('../../lib/marketplace/resources', () => ({
  createResource: (...a: unknown[]) => createResource(...a),
  getResource: vi.fn(async () => null),
  updateResource: vi.fn(async () => undefined),
}));

vi.mock('../../store/useSellerStore', () => ({
  useSellerStore: (sel: (s: unknown) => unknown) =>
    sel({ sellerId: 'seller1', seller: { displayName: 'Ms Jane' } }),
}));

function renderNew() {
  return render(
    <MemoryRouter initialEntries={['/seller/resources/new']}>
      <Routes>
        <Route path="/seller/resources/new" element={<ResourceForm />} />
        <Route path="/seller/resources" element={<div>LIST</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillRequired() {
  await userEvent.type(screen.getByLabelText(/title/i), 'Fractions Pack');
  // Level defaults to lower_primary; switch to middle to expose Grade 5.
  await userEvent.selectOptions(screen.getByLabelText(/level/i), 'middle_school');
  await userEvent.selectOptions(screen.getByLabelText(/grade/i), 'Grade 5');
  await userEvent.selectOptions(screen.getByLabelText(/subject/i), 'Mathematics');
  const file = new File(['x'], 'a.pdf', { type: 'application/pdf' });
  await userEvent.upload(screen.getByLabelText(/files/i), file);
}

beforeEach(() => createResource.mockClear());

describe('ResourceForm (create)', () => {
  it('blocks submit until required fields + a file are present', async () => {
    renderNew();
    await userEvent.click(screen.getByRole('button', { name: /^publish$/i }));
    expect(createResource).not.toHaveBeenCalled();
    expect(screen.getByText(/add at least one file/i)).toBeInTheDocument();
  });

  it('changing level filters grade options', async () => {
    renderNew();
    await userEvent.selectOptions(screen.getByLabelText(/level/i), 'senior_school');
    // Grade 5 belongs to middle school, so it must not be offered here.
    expect(screen.queryByRole('option', { name: 'Grade 5' })).toBeNull();
    expect(screen.getByRole('option', { name: 'Grade 11' })).toBeInTheDocument();
  });

  it('submits a published resource', async () => {
    renderNew();
    await fillRequired();
    await userEvent.click(screen.getByRole('button', { name: /^publish$/i }));
    await waitFor(() => expect(createResource).toHaveBeenCalledTimes(1));
    const [sellerId, sellerName, input] = createResource.mock.calls[0];
    expect(sellerId).toBe('seller1');
    expect(sellerName).toBe('Ms Jane');
    expect(input).toMatchObject({
      title: 'Fractions Pack', level: 'middle_school',
      grade: 'Grade 5', subject: 'Mathematics', status: 'published',
    });
  });

  it('submits a draft with status draft', async () => {
    renderNew();
    await fillRequired();
    await userEvent.click(screen.getByRole('button', { name: /save draft/i }));
    await waitFor(() => expect(createResource).toHaveBeenCalledTimes(1));
    expect(createResource.mock.calls[0][2]).toMatchObject({ status: 'draft' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/marketplace/ResourceForm.test.tsx`
Expected: FAIL — cannot find module `./ResourceForm`.

- [ ] **Step 3: Implement `ResourceForm.tsx`**

Create `src/components/marketplace/ResourceForm.tsx`:

```tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSellerStore } from '../../store/useSellerStore';
import { RESOURCE_LEVELS, levelByKey } from '../../lib/marketplace/taxonomy';
import {
  createResource, getResource, updateResource,
} from '../../lib/marketplace/resources';
import type {
  ResourceLevel, ResourceStatus, ResourceFile,
} from '../../lib/marketplace/types';

export default function ResourceForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const sellerId = useSellerStore(s => s.sellerId);
  const sellerName = useSellerStore(s => s.seller?.displayName ?? 'Seller');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<ResourceLevel>('lower_primary');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [priceKsh, setPriceKsh] = useState(0);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [keptFiles, setKeptFiles] = useState<ResourceFile[]>([]);
  const [removedPaths, setRemovedPaths] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [oldThumbnailPath, setOldThumbnailPath] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<number | null>(null);

  const activeLevel = useMemo(() => levelByKey(level)!, [level]);

  // When the level changes, drop grade/subject selections that no longer belong.
  useEffect(() => {
    if (grade && !activeLevel.grades.includes(grade)) setGrade('');
    if (subject && !activeLevel.subjects.includes(subject)) setSubject('');
  }, [activeLevel, grade, subject]);

  // Load existing resource when editing.
  useEffect(() => {
    if (!id) return;
    getResource(id).then(r => {
      if (!r) return;
      setTitle(r.title); setDescription(r.description);
      setLevel(r.level); setGrade(r.grade); setSubject(r.subject);
      setPriceKsh(r.priceKsh); setKeptFiles(r.files);
      setOldThumbnailPath(r.thumbnailPath);
    });
  }, [id]);

  function removeKept(path: string) {
    setKeptFiles(f => f.filter(x => x.path !== path));
    setRemovedPaths(p => [...p, path]);
  }

  async function submit(status: ResourceStatus) {
    setError('');
    if (!title.trim()) { setError('Enter a title.'); return; }
    if (!grade) { setError('Choose a grade.'); return; }
    if (!subject) { setError('Choose a subject.'); return; }
    if (newFiles.length + keptFiles.length === 0) { setError('Add at least one file.'); return; }
    if (!sellerId) { setError('You must be signed in.'); return; }

    const meta = { title: title.trim(), description: description.trim(), level, grade, subject, priceKsh, status };
    setProgress(0);
    try {
      if (editing && id) {
        await updateResource(sellerId, id, {
          meta, keptFiles, newFiles, removedFilePaths: removedPaths,
          newThumbnail: thumbnail, oldThumbnailPath,
        });
      } else {
        await createResource(sellerId, sellerName, meta, newFiles, thumbnail, setProgress);
      }
      navigate('/seller/resources');
    } catch {
      setError('Upload failed. Please try again.');
      setProgress(null);
    }
  }

  const field = 'w-full bg-[#f2f5f2] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#16a34a]/30';
  const label = 'block text-sm font-bold text-[#374151] mb-1';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-extrabold text-[#1f2937] mb-5">
        {editing ? 'Edit resource' : 'Create resource'}
      </h1>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className={label}>Title</label>
          <input id="title" className={field} value={title}
            onChange={e => setTitle(e.target.value)} />
        </div>

        <div>
          <label htmlFor="description" className={label}>Description</label>
          <textarea id="description" rows={3} className={field} value={description}
            onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="level" className={label}>Level</label>
            <select id="level" className={field} value={level}
              onChange={e => setLevel(e.target.value as ResourceLevel)}>
              {RESOURCE_LEVELS.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="grade" className={label}>Grade</label>
            <select id="grade" className={field} value={grade}
              onChange={e => setGrade(e.target.value)}>
              <option value="">Select…</option>
              {activeLevel.grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="subject" className={label}>Subject</label>
            <select id="subject" className={field} value={subject}
              onChange={e => setSubject(e.target.value)}>
              <option value="">Select…</option>
              {activeLevel.subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="price" className={label}>Price (Ksh) — 0 for free</label>
          <input id="price" type="number" min={0} className={field} value={priceKsh}
            onChange={e => setPriceKsh(Math.max(0, Number(e.target.value) || 0))} />
        </div>

        {keptFiles.length > 0 && (
          <div>
            <span className={label}>Current files</span>
            <ul className="space-y-1">
              {keptFiles.map(f => (
                <li key={f.path} className="flex items-center justify-between text-sm bg-[#f2f5f2] rounded-lg px-3 py-2">
                  <span className="truncate">{f.name}</span>
                  <button type="button" className="text-red-600 text-xs font-bold"
                    onClick={() => removeKept(f.path)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label htmlFor="files" className={label}>Files {editing ? '(add more)' : ''}</label>
          <input id="files" type="file" multiple className="block w-full text-sm"
            onChange={e => setNewFiles(Array.from(e.target.files ?? []))} />
        </div>

        <div>
          <label htmlFor="thumb" className={label}>Thumbnail (optional)</label>
          <input id="thumb" type="file" accept="image/*" className="block w-full text-sm"
            onChange={e => setThumbnail(e.target.files?.[0] ?? null)} />
        </div>

        {progress !== null && (
          <div className="h-2 bg-[#eef1ee] rounded-full overflow-hidden">
            <div className="h-full bg-[#16a34a] transition-all"
              style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button type="button" onClick={() => submit('published')} disabled={progress !== null}
            className="bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-full px-6 py-2.5 disabled:opacity-50">
            Publish
          </button>
          <button type="button" onClick={() => submit('draft')} disabled={progress !== null}
            className="bg-white border border-[#d7ddd7] text-[#374151] text-sm font-bold rounded-full px-6 py-2.5 disabled:opacity-50">
            Save draft
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/marketplace/ResourceForm.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/marketplace/ResourceForm.tsx src/components/marketplace/ResourceForm.test.tsx
git commit -m "feat(marketplace): seller resource create/edit form"
```

---

## Task 6: Wire routes + seller nav

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/marketplace/SellerLayout.tsx`
- Test: `src/components/marketplace/SellerLayout.test.tsx`

- [ ] **Step 1: Add imports to `App.tsx`**

In `src/App.tsx`, after the line
`import SellerDashboard from './components/marketplace/SellerDashboard';`
add:

```ts
import MyResources from './components/marketplace/MyResources';
import ResourceForm from './components/marketplace/ResourceForm';
```

- [ ] **Step 2: Register the three routes**

In `src/App.tsx`, inside the seller route group, change:

```tsx
        <Route element={<SellerProtectedRoute><SellerLayout /></SellerProtectedRoute>}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/marketplace" element={<MarketBrowse />} />
        </Route>
```

to:

```tsx
        <Route element={<SellerProtectedRoute><SellerLayout /></SellerProtectedRoute>}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/resources" element={<MyResources />} />
          <Route path="/seller/resources/new" element={<ResourceForm />} />
          <Route path="/seller/resources/:id/edit" element={<ResourceForm />} />
          <Route path="/seller/marketplace" element={<MarketBrowse />} />
        </Route>
```

- [ ] **Step 3: Write the failing SellerLayout nav test**

Create `src/components/marketplace/SellerLayout.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SellerLayout from './SellerLayout';

vi.mock('../../store/useSellerStore', () => ({
  useSellerStore: () => ({ seller: { displayName: 'Ms Jane', type: 'teacher' }, logout: vi.fn() }),
}));

describe('SellerLayout nav', () => {
  it('links My Resources to the resources route', () => {
    render(<MemoryRouter><SellerLayout /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /my resources/i }))
      .toHaveAttribute('href', '/seller/resources');
  });

  it('links Upload Resource to the create route', () => {
    render(<MemoryRouter><SellerLayout /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /upload resource/i }))
      .toHaveAttribute('href', '/seller/resources/new');
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run src/components/marketplace/SellerLayout.test.tsx`
Expected: FAIL — "My Resources" is a `<button>` (no `href`), and there is no "Upload Resource" link yet.

- [ ] **Step 5: Wire the nav in `SellerLayout.tsx`**

In `src/components/marketplace/SellerLayout.tsx`:

(a) Add `Link` to the router import:

```tsx
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
```

(b) Make "My Resources" a real route in the `NAV` array — change:

```tsx
  { label: 'My Resources', icon: FileText },
```

to:

```tsx
  { label: 'My Resources', icon: FileText, to: '/seller/resources', real: true },
```

(c) Turn the top-bar "Upload Resource" button into a link. Change:

```tsx
            <button className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-full px-4 py-2.5 transition">
              <UploadCloud size={17} /> <span className="hidden sm:inline">Upload Resource</span>
            </button>
```

to:

```tsx
            <Link to="/seller/resources/new"
              className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-full px-4 py-2.5 transition">
              <UploadCloud size={17} /> <span>Upload Resource</span>
            </Link>
```

(Removing `hidden sm:inline` so the accessible name "Upload Resource" is always present for the test and screen readers.)

(d) Point the sidebar CTA at the create route. Change:

```tsx
            <button className="mt-3 w-full bg-white text-[#15803d] text-sm font-bold rounded-lg py-2 hover:bg-white/90 transition">
              Create Your First Resource
            </button>
```

to:

```tsx
            <Link to="/seller/resources/new"
              className="mt-3 block text-center w-full bg-white text-[#15803d] text-sm font-bold rounded-lg py-2 hover:bg-white/90 transition">
              Create Your First Resource
            </Link>
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/components/marketplace/SellerLayout.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 7: Full verification**

Run: `npm test`
Expected: all suites pass (existing + new).

Run: `npx tsc -b`
Expected: no type errors.

Run: `npm run lint`
Expected: no new lint errors in the created/modified files.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx src/components/marketplace/SellerLayout.tsx src/components/marketplace/SellerLayout.test.tsx
git commit -m "feat(marketplace): wire seller resource routes + nav"
```

---

## Self-review notes

- **Spec coverage:** data model + types (Task 1), taxonomy/level-linked dropdowns (Tasks 1 & 5), access layer create/list/update/setStatus/delete (Task 2), firestore + storage rules + index (Task 3), MyResources list (Task 4), ResourceForm create/edit (Task 5), route + nav wiring (Task 6). All spec sections mapped.
- **Type consistency:** `MarketResource`, `ResourceInput`, `ResourceFile`, `ResourceStatus`, `ResourceLevel`, `ResourceUpdate` are defined once (Tasks 1–2) and reused verbatim by the components. Access-layer function names (`subscribeSellerResources`, `createResource`, `updateResource`, `setResourceStatus`, `deleteResource`, `getResource`) match between definition, tests, and consumers.
- **Known limitation carried from spec:** paid files are publicly readable; `sales`/`views` are client-writable — both deferred to the payments/orders slices.
- **Manual test note:** rules (Task 3) have no automated coverage because `@firebase/rules-unit-testing` is not installed; verified by review/emulator instead.
```
