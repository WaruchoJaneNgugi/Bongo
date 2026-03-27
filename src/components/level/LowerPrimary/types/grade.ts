/**
 * grade.ts
 * Types related to CBC grade levels and school terms.
 */

/** The three supported CBC Lower Primary grades. */
export type Grade = 1 | 2 | 3;

/** The three school terms per academic year. */
export type Term = 1 | 2 | 3;

/** Human-readable grade metadata used in the UI. */
export interface GradeOption {
    grade: Grade;
    label: string;
    emoji: string;
    ages: string;
}

/** Human-readable term metadata used in the UI. */
export interface TermOption {
    term: Term;
    label: string;
    emoji: string;
    desc: string;
}