import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'firebase/firestore';
import { listPublishedResources, getPublishedResource } from './catalog';

vi.mock('../firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  doc: vi.fn((_db: unknown, _c?: string, id?: string) => ({ id })),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
}));

const asMock = (fn: unknown) => fn as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

describe('listPublishedResources', () => {
  it('queries published resources newest-first and maps docs', async () => {
    asMock(fs.getDocs).mockResolvedValueOnce({
      docs: [{ id: 'r1', data: () => ({ title: 'A', status: 'published' }) }],
    });
    const rows = await listPublishedResources();
    expect(fs.where).toHaveBeenCalledWith('status', '==', 'published');
    expect(fs.orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    expect(rows).toEqual([{ id: 'r1', title: 'A', status: 'published' }]);
  });
});

describe('getPublishedResource', () => {
  it('returns null for a missing doc', async () => {
    asMock(fs.getDoc).mockResolvedValueOnce({ exists: () => false });
    expect(await getPublishedResource('x')).toBeNull();
  });

  it('returns null for a draft (not publicly visible)', async () => {
    asMock(fs.getDoc).mockResolvedValueOnce({
      exists: () => true, id: 'r1', data: () => ({ status: 'draft' }),
    });
    expect(await getPublishedResource('r1')).toBeNull();
  });

  it('returns a published resource with its id', async () => {
    asMock(fs.getDoc).mockResolvedValueOnce({
      exists: () => true, id: 'r1', data: () => ({ status: 'published', title: 'A' }),
    });
    expect(await getPublishedResource('r1')).toMatchObject({ id: 'r1', title: 'A', status: 'published' });
  });
});
