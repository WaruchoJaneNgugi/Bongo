import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import type { GradeResult } from './types';

/** Fetch a short-lived signed URL to stream a gated resource's media. */
export async function fetchMediaUrl(resourceId: string): Promise<{ url: string }> {
  const fn = httpsCallable<{ resourceId: string }, { url: string }>(functions, 'getResourceMediaUrl');
  return (await fn({ resourceId })).data;
}

/** Submit quiz answers (0-based option indexes) for server-side grading. */
export async function submitQuiz(resourceId: string, answers: number[]): Promise<GradeResult> {
  const fn = httpsCallable<{ resourceId: string; answers: number[] }, GradeResult>(functions, 'submitVideoQuiz');
  return (await fn({ resourceId, answers })).data;
}
