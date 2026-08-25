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
