/**
 * data/questions/index.ts
 * Assembles per-grade question banks. Supports term-based slicing.
 *
 * Each subject has 7 questions ordered easy → hard:
 *   Term 1 → questions 0-2  (first 3 — simplest, start of grade)
 *   Term 2 → questions 2-4  (middle 3)
 *   Term 3 → questions 4-6  (last 3  — most challenging)
 */

import type { Grade, Term, SubjectId, Question } from "../../types";

import grade1 from "./grade1";
import grade2 from "./grade2";
import grade3 from "./grade3";

export type QuestionBank = Record<Grade, Record<SubjectId, Question[]>>;

export const QUESTIONS: QuestionBank = { 1: grade1, 2: grade2, 3: grade3 };

/** All questions for a grade + subject (used in results review). */
export const getQuestions = (grade: Grade, subjectId: SubjectId): Question[] =>
    QUESTIONS[grade][subjectId];

const TERM_SLICE: Record<Term, [number, number]> = {
    1: [0, 3],   // first 3 — easiest
    2: [2, 5],   // middle 3
    3: [4, 7],   // last 3  — hardest
};

/** Questions filtered to a specific term's difficulty range. */
export const getQuestionsByTerm = (
    grade: Grade,
    subjectId: SubjectId,
    term: Term,
): Question[] => {
    const [start, end] = TERM_SLICE[term];
    return QUESTIONS[grade][subjectId].slice(start, end);
};