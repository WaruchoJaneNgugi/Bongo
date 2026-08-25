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
  name: string = file.name,
): Promise<ResourceFile> {
  const path = `marketplace/${sellerId}/${resourceId}/${folder}/${name}`;
  const r = storageRef(storage, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  return { name, url, path, size: file.size, contentType: file.type };
}

function extOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
}

const BRAND = 'HighScores';

function baseName(subject: string, grade: string): string {
  const label = `${subject} ${grade}`.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim();
  return label ? `${label} - ${BRAND}` : BRAND;
}

/** Name each uploaded file after its subject + grade, keeping the extension and
 *  numbering duplicates ("Mathematics Grade 5.pdf", "Mathematics Grade 5 2.pdf").
 *  `taken` seeds already-used names (e.g. kept files when editing). */
function assignNames(
  files: File[], subject: string, grade: string, taken: string[],
): { file: File; name: string }[] {
  const base = baseName(subject, grade);
  const used = new Set(taken.map(n => n.toLowerCase()));
  return files.map(file => {
    const ext = extOf(file.name);
    let n = 1;
    let name = ext ? `${base}.${ext}` : base;
    while (used.has(name.toLowerCase())) {
      n += 1;
      name = ext ? `${base} ${n}.${ext}` : `${base} ${n}`;
    }
    used.add(name.toLowerCase());
    return { file, name };
  });
}

/** Preview the "<Subject> <Grade>" names files will be saved as (used by the form
 *  so the chips match what actually gets stored). `taken` = existing kept names. */
export function previewUploadNames(
  files: File[], subject: string, grade: string, taken: string[],
): string[] {
  return assignNames(files, subject, grade, taken).map(x => x.name);
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
  for (const { file, name } of assignNames(files, input.subject, input.grade, [])) {
    uploaded.push(await uploadFile(sellerId, id, 'files', file, name));
    tick();
  }

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
  onProgress?.(1);
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
    await deleteObject(storageRef(storage, p)).catch(e => console.warn('[resources] storage delete failed:', e));
  }

  const added: ResourceFile[] = [];
  const named = assignNames(
    u.newFiles ?? [], u.meta.subject ?? '', u.meta.grade ?? '', u.keptFiles.map(f => f.name),
  );
  for (const { file, name } of named) added.push(await uploadFile(sellerId, id, 'files', file, name));

  const patch: Record<string, unknown> = {
    ...u.meta,
    files: [...u.keptFiles, ...added],
    updatedAt: serverTimestamp(),
  };

  if (u.newThumbnail) {
    if (u.oldThumbnailPath) await deleteObject(storageRef(storage, u.oldThumbnailPath)).catch(e => console.warn('[resources] storage delete failed:', e));
    const t = await uploadFile(sellerId, id, 'thumb', u.newThumbnail);
    patch.thumbnailUrl = t.url;
    patch.thumbnailPath = t.path;
  } else if (u.removeThumbnail) {
    if (u.oldThumbnailPath) await deleteObject(storageRef(storage, u.oldThumbnailPath)).catch(e => console.warn('[resources] storage delete failed:', e));
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
    await deleteObject(storageRef(storage, f.path)).catch(e => console.warn('[resources] storage delete failed:', e));
  }
  if (resource.thumbnailPath) {
    await deleteObject(storageRef(storage, resource.thumbnailPath)).catch(e => console.warn('[resources] storage delete failed:', e));
  }
  await deleteDoc(doc(db, 'resources', resource.id));
}
