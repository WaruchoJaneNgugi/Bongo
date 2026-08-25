import type { MarketResource } from './types';

/** Fill in media/quiz fields on resources read from Firestore so legacy
 *  documents (written before this feature) behave as plain documents. */
export function normalizeResource(r: MarketResource): MarketResource {
  return {
    ...r,
    kind: r.kind ?? 'document',
    media: r.media ?? null,
    durationSec: r.durationSec ?? null,
    hasQuiz: r.hasQuiz ?? false,
    quiz: r.quiz ?? [],
  };
}
