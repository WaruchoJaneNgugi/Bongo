/**
 * data/index.ts
 * Central barrel — re-exports all data constants and helpers.
 *
 * Components can import from either the specific file or here:
 *   import { SUBJECTS }   from "../data/subjects";   // specific
 *   import { SUBJECTS }   from "../data";             // barrel
 */

export { SUBJECTS, SUBJECT_IDS }           from "./subjects";
export { BADGES, getBadge }                from "./badges";
export { QUESTIONS, getQuestions }         from "./questions";
export type { QuestionBank }               from "./questions";