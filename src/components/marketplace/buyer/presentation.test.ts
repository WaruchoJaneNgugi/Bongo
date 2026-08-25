import { describe, it, expect } from 'vitest';
import { accentFor } from './presentation';

describe('accentFor', () => {
  it('returns the curated palette for a known subject', () => {
    expect(accentFor('Mathematics')).toBe('from-[#0f766e] to-[#14b8a6]');
  });

  it('is deterministic for unknown subjects', () => {
    expect(accentFor('Zulu Poetry')).toBe(accentFor('Zulu Poetry'));
  });

  it('always returns a valid gradient class', () => {
    expect(accentFor('Anything At All')).toMatch(/^from-\[#[0-9a-f]{6}\] to-\[#[0-9a-f]{6}\]$/);
  });
});
