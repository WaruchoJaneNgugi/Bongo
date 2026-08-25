import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'firebase/firestore';
import * as st from 'firebase/storage';
import {
  createResource, setResourceStatus, deleteResource,
  getResource, subscribeSellerResources, updateResource, previewUploadNames,
  mediaPath,
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
  priceKsh: 150, status: 'published', kind: 'document',
};

function fileOf(name: string) {
  return new File(['x'], name, { type: 'application/pdf' });
}

beforeEach(() => vi.clearAllMocks());

describe('createResource', () => {
  it('uploads files under the seller/resource path and writes the doc', async () => {
    const id = await createResource('seller1', 'Ms Jane', input, [fileOf('a.pdf')]);
    expect(id).toBe('gen-id');

    // Files are renamed to "<subject> <grade>.<ext>" on upload.
    expect(st.ref).toHaveBeenCalledWith({}, 'marketplace/seller1/gen-id/files/Mathematics Grade 5 - HighScores.pdf');
    expect(st.uploadBytes).toHaveBeenCalledTimes(1);

    const [, payload] = (fs.setDoc as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(payload).toMatchObject({
      sellerId: 'seller1', sellerName: 'Ms Jane',
      title: 'Fractions Pack', level: 'middle_school',
      grade: 'Grade 5', subject: 'Mathematics', priceKsh: 150,
      status: 'published', sales: 0, views: 0, thumbnailUrl: null,
    });
    expect(payload.files).toHaveLength(1);
    expect(payload.files[0]).toMatchObject({
      name: 'Mathematics Grade 5 - HighScores.pdf', url: 'https://dl/url',
      path: 'marketplace/seller1/gen-id/files/Mathematics Grade 5 - HighScores.pdf',
    });
  });

  it('writes gated media + a private quiz doc for a video resource', async () => {
    const videoInput: ResourceInput = { ...input, kind: 'video' };
    const quiz = [{ prompt: 'What is 2+2?', options: ['3', '4'] }];
    const quizAnswers = [{ correctIndex: 1, explanation: 'basic maths' }];

    const id = await createResource(
      'seller1', 'Ms Jane', videoInput, [], null, undefined,
      { media: new File(['x'], 'lesson.mp4', { type: 'video/mp4' }), quiz, quizAnswers },
    );
    expect(id).toBe('gen-id');

    const setDoc = fs.setDoc as unknown as ReturnType<typeof vi.fn>;

    // Resource doc: video kind, quiz flag, gated media (empty url + media/ path), quiz array.
    const [, payload] = setDoc.mock.calls[0];
    expect(payload).toMatchObject({ kind: 'video', hasQuiz: true, quiz });
    expect(payload.media).toMatchObject({ url: '' });
    expect(payload.media.path).toMatch(/^media\//);

    // Private answers doc written to resources/{id}/private/quiz.
    expect(fs.doc).toHaveBeenCalledWith({}, 'resources', 'gen-id', 'private', 'quiz');
    const privateCall = setDoc.mock.calls.find(([, p]) => p && 'answers' in p);
    expect(privateCall).toBeDefined();
    expect(privateCall![1]).toEqual({ answers: quizAnswers });
  });

  it('uploads a thumbnail when provided', async () => {
    await createResource('seller1', 'Ms Jane', input, [fileOf('a.pdf')], fileOf('t.png'));
    expect(st.ref).toHaveBeenCalledWith({}, 'marketplace/seller1/gen-id/thumb/t.png');
  });
});

describe('previewUploadNames', () => {
  const f = (n: string) => new File(['x'], n, { type: 'application/pdf' });

  it('names files by subject + grade + brand and numbers duplicates', () => {
    expect(previewUploadNames([f('a.pdf'), f('b.pdf')], 'Mathematics', 'Grade 5', []))
      .toEqual(['Mathematics Grade 5 - HighScores.pdf', 'Mathematics Grade 5 - HighScores 2.pdf']);
  });

  it('avoids collisions with already-kept names', () => {
    expect(previewUploadNames([f('a.pdf')], 'Biology', 'Grade 11', ['Biology Grade 11 - HighScores.pdf']))
      .toEqual(['Biology Grade 11 - HighScores 2.pdf']);
  });
});

describe('mediaPath', () => {
  it('puts media under the private media/ prefix, not marketplace/', () => {
    expect(mediaPath('s1', 'r1', 'Maths Grade 5 - HighScores.mp4'))
      .toBe('media/s1/r1/Maths Grade 5 - HighScores.mp4');
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

describe('getResource', () => {
  it('returns null when the doc does not exist', async () => {
    (fs.getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ exists: () => false });
    expect(await getResource('nope')).toBeNull();
  });

  it('returns the resource with its id when it exists', async () => {
    (fs.getDoc as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      exists: () => true, id: 'r1', data: () => ({ title: 'X', sellerId: 's1' }),
    });
    const r = await getResource('r1');
    expect(r).toMatchObject({ id: 'r1', title: 'X', sellerId: 's1' });
  });
});

describe('subscribeSellerResources', () => {
  it('queries own resources newest-first and maps docs to rows', () => {
    (fs.onSnapshot as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      (_q: unknown, cb: (snap: unknown) => void) => {
        cb({ docs: [{ id: 'r1', data: () => ({ title: 'A' }) }] });
        return () => undefined;
      },
    );
    const rows: unknown[] = [];
    const unsub = subscribeSellerResources('s1', r => rows.push(...r));
    expect(fs.where).toHaveBeenCalledWith('sellerId', '==', 's1');
    expect(fs.orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    expect(rows).toEqual([{
      id: 'r1', title: 'A',
      kind: 'document', media: null, durationSec: null, hasQuiz: false, quiz: [],
    }]);
    expect(typeof unsub).toBe('function');
  });
});

describe('updateResource', () => {
  const kept = { name: 'keep.pdf', url: 'u', path: 'marketplace/s1/r1/files/keep.pdf', size: 1, contentType: 'application/pdf' };

  it('deletes removed files, uploads new ones (renamed), and patches meta + merged files', async () => {
    await updateResource('s1', 'r1', {
      meta: { title: 'New Title', status: 'draft', subject: 'Biology', grade: 'Grade 11' },
      keptFiles: [kept],
      newFiles: [new File(['x'], 'added.pdf', { type: 'application/pdf' })],
      removedFilePaths: ['marketplace/s1/r1/files/gone.pdf'],
    });

    // removed file deleted from storage
    expect(st.ref).toHaveBeenCalledWith({}, 'marketplace/s1/r1/files/gone.pdf');
    expect(st.deleteObject).toHaveBeenCalledTimes(1);
    // new file renamed to "<subject> <grade>.<ext>" under the files/ folder
    expect(st.ref).toHaveBeenCalledWith({}, 'marketplace/s1/r1/files/Biology Grade 11 - HighScores.pdf');

    const [, patch] = (fs.updateDoc as unknown as ReturnType<typeof vi.fn>).mock.calls.at(-1)!;
    expect(patch).toMatchObject({ title: 'New Title', status: 'draft', updatedAt: 'TS' });
    expect(patch.files).toHaveLength(2); // kept + added
    expect(patch.files[0]).toMatchObject({ name: 'keep.pdf' });
    expect(patch.files[1]).toMatchObject({ name: 'Biology Grade 11 - HighScores.pdf', url: 'https://dl/url' });
  });

  it('replaces the thumbnail, deleting the old object', async () => {
    await updateResource('s1', 'r1', {
      meta: {},
      keptFiles: [kept],
      newThumbnail: new File(['x'], 'new-thumb.png', { type: 'image/png' }),
      oldThumbnailPath: 'marketplace/s1/r1/thumb/old.png',
    });
    expect(st.ref).toHaveBeenCalledWith({}, 'marketplace/s1/r1/thumb/old.png'); // old deleted
    expect(st.ref).toHaveBeenCalledWith({}, 'marketplace/s1/r1/thumb/new-thumb.png'); // new uploaded
    const [, patch] = (fs.updateDoc as unknown as ReturnType<typeof vi.fn>).mock.calls.at(-1)!;
    expect(patch).toMatchObject({ thumbnailUrl: 'https://dl/url', thumbnailPath: 'marketplace/s1/r1/thumb/new-thumb.png' });
  });
});

describe('createResource progress', () => {
  it('calls onProgress with 1 on completion even with zero files', async () => {
    const onProgress = vi.fn();
    await createResource('s1', 'Ms Jane', input, [], null, onProgress);
    expect(onProgress).toHaveBeenLastCalledWith(1);
  });
});
