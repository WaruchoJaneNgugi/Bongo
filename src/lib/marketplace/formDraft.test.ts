import { describe, it, expect } from 'vitest';
import { saveDraft, loadDraft, clearDraft, type ResourceDraft } from './formDraft';

// jsdom does not implement IndexedDB, so this exercises the safety guard that
// keeps the form working (and never throws) where IndexedDB is unavailable.
// The real persistence round-trip is verified in the browser.
const draft: ResourceDraft = {
  fields: {
    title: 'Fractions', description: 'Worksheets',
    level: 'middle_school', grade: 'Grade 5', subject: 'Mathematics', priceKsh: 100,
  },
  newFiles: [], thumbnail: null, removedPaths: [], savedAt: 0,
};

describe('formDraft guard (no IndexedDB in this environment)', () => {
  it('does not throw and resolves to null when IndexedDB is unavailable', async () => {
    await expect(saveDraft('new', draft)).resolves.toBeUndefined();
    await expect(loadDraft('new')).resolves.toBeNull();
    await expect(clearDraft('new')).resolves.toBeUndefined();
  });
});
