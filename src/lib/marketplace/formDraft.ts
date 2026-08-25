// Local draft storage for the resource form, so an accidental refresh doesn't
// lose unsaved fields OR picked files. Uses IndexedDB because it can persist
// File/Blob objects (localStorage cannot). All calls no-op safely where
// IndexedDB is unavailable (SSR / test environments).
import type { ResourceLevel } from './types';

export interface ResourceDraft {
  fields: {
    title: string;
    description: string;
    level: ResourceLevel;
    grade: string;
    subject: string;
    priceKsh: number;
  };
  newFiles: File[];
  thumbnail: File | null;
  removedPaths: string[];
  savedAt: number;
}

const DB_NAME = 'bongo-marketplace';
const STORE = 'resource-drafts';
const VERSION = 1;

function available(): boolean {
  return typeof indexedDB !== 'undefined';
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function withStore<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(db => new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  }));
}

/** Persist the current form draft under `key` (e.g. 'new' or 'edit:<id>'). */
export async function saveDraft(key: string, draft: ResourceDraft): Promise<void> {
  if (!available()) return;
  try { await withStore('readwrite', s => s.put(draft, key)); } catch { /* best-effort */ }
}

/** Load a previously-saved draft, or null if none / unavailable. */
export async function loadDraft(key: string): Promise<ResourceDraft | null> {
  if (!available()) return null;
  try { return (await withStore<ResourceDraft | undefined>('readonly', s => s.get(key))) ?? null; }
  catch { return null; }
}

/** Remove a saved draft (after a successful save or an explicit discard). */
export async function clearDraft(key: string): Promise<void> {
  if (!available()) return;
  try { await withStore('readwrite', s => s.delete(key)); } catch { /* best-effort */ }
}
