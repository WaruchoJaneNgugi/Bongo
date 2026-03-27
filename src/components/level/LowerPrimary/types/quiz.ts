/**
 * quiz.ts
 * Types related to questions, answers, and quiz results.
 */

/**
 * A single multiple-choice question.
 * `ans` is the 0-indexed position of the correct option in `opts`.
 */
export interface Question {
    /** The question text shown to the child. */
    q: string;
    /** Exactly four answer options. */
    opts: [string, string, string, string];
    /** Index of the correct option (0–3). */
    ans: 0 | 1 | 2 | 3;
}

/**
 * The record saved for each answered question during a quiz session.
 * `selected` is -1 when the timer expired before the child answered.
 */
export interface AnswerRecord {
    /** The question text (for display in the review screen). */
    q: string;
    /** Index the child selected, or -1 on timeout. */
    selected: number;
    /** Index of the correct answer. */
    correct: number;
    isCorrect: boolean;
}

/** Passed to ResultsScreen after a quiz finishes. */
export interface QuizResult {
    finalScore: number;
    total: number;
    answers: AnswerRecord[];
}