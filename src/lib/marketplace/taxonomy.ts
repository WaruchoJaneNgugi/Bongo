import { LEVEL_CONFIG } from '../../hooks/LevelConfigs';
import type { ResourceLevel } from './types';

export interface LevelTaxonomy {
  key: ResourceLevel;
  label: string;
  grades: string[];
  subjects: string[];
}

// LEVEL_CONFIG stores a display string like 'Grade 1–3'; resources need the
// explicit per-band grade list. Subjects come straight from LEVEL_CONFIG so
// they never drift from the rest of the app.
const GRADE_BANDS: Record<ResourceLevel, string[]> = {
  lower_primary: ['Grade 1', 'Grade 2', 'Grade 3'],
  middle_school: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
  senior_school: ['Grade 10', 'Grade 11', 'Grade 12'],
};

export const RESOURCE_LEVELS: LevelTaxonomy[] = (
  ['lower_primary', 'middle_school', 'senior_school'] as ResourceLevel[]
).map(key => ({
  key,
  label: LEVEL_CONFIG[key].label,
  grades: GRADE_BANDS[key],
  subjects: LEVEL_CONFIG[key].subjects,
}));

export function levelByKey(key: ResourceLevel): LevelTaxonomy | undefined {
  return RESOURCE_LEVELS.find(l => l.key === key);
}
