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
