import { describe, it, expect } from 'vitest';
import { fmtDate } from './format';

describe('fmtDate', () => {
  it('renders a dash for missing timestamps', () => {
    expect(fmtDate(null)).toBe('—');
    expect(fmtDate(undefined)).toBe('—');
  });

  it('formats a Firestore Timestamp (has toDate)', () => {
    const ts = { toDate: () => new Date('2026-08-14T10:00:00Z') };
    expect(fmtDate(ts)).toContain('2026');
  });

  it('formats a plain Date and a millis number', () => {
    expect(fmtDate(new Date('2026-08-14T10:00:00Z'))).toContain('2026');
    expect(fmtDate(new Date('2026-08-14T10:00:00Z').getTime())).toContain('2026');
  });
});
