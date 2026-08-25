import { describe, it, expect } from 'vitest';
import { gradeQuiz } from './quizGrading';

describe('gradeQuiz', () => {
  const answers = [{ correctIndex: 1, explanation: 'because' }, { correctIndex: 0 }];

  it('scores correct/incorrect and returns per-question detail', () => {
    const r = gradeQuiz([1, 2], answers);
    expect(r.score).toBe(1);
    expect(r.total).toBe(2);
    expect(r.perQuestion[0]).toEqual({ correctIndex: 1, chosen: 1, correct: true, explanation: 'because' });
    expect(r.perQuestion[1]).toEqual({ correctIndex: 0, chosen: 2, correct: false, explanation: undefined });
  });

  it('treats a missing/blank answer as incorrect', () => {
    const r = gradeQuiz([undefined as unknown as number, 0], answers);
    expect(r.score).toBe(1);
    expect(r.perQuestion[0].correct).toBe(false);
  });
});

import { canAccess } from './quizGrading';

describe('canAccess', () => {
  const res = { sellerId: 's1', priceKsh: 100 };
  it('allows the owner', () => expect(canAccess('s1', res, false)).toBe(true));
  it('allows a paid buyer', () => expect(canAccess('b1', res, true)).toBe(true));
  it('allows anyone for a free resource', () => expect(canAccess('b1', { sellerId: 's1', priceKsh: 0 }, false)).toBe(true));
  it('denies an unpaid stranger', () => expect(canAccess('b1', res, false)).toBe(false));
});
