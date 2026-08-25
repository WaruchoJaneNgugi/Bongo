export interface StoredAnswer { correctIndex: number; explanation?: string }

export interface GradedQuestion {
  correctIndex: number;
  chosen: number | null;
  correct: boolean;
  explanation?: string;
}

export interface GradeResult {
  score: number;
  total: number;
  perQuestion: GradedQuestion[];
}

/** Grade a learner's chosen option indexes against the stored correct answers. */
export function gradeQuiz(chosen: number[], answers: StoredAnswer[]): GradeResult {
  const perQuestion = answers.map((a, i) => {
    const pick = typeof chosen[i] === 'number' ? chosen[i] : null;
    return {
      correctIndex: a.correctIndex,
      chosen: pick,
      correct: pick === a.correctIndex,
      explanation: a.explanation,
    };
  });
  return {
    score: perQuestion.filter(q => q.correct).length,
    total: answers.length,
    perQuestion,
  };
}

/** Decide whether `uid` may access a resource's media/quiz: the owning seller,
 *  a free resource, or a paid buyer. Pure so it can be unit-tested. */
export function canAccess(
  uid: string,
  resource: { sellerId: string; priceKsh: number },
  hasPaidPurchase: boolean,
): boolean {
  return uid === resource.sellerId || resource.priceKsh <= 0 || hasPaidPurchase;
}
