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
