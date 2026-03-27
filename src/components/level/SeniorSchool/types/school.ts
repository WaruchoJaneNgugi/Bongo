export type Grade = "10" | "11" | "12";

/** * AppView handles the navigation states. 
 * We added "TERMS" to the flow.
 */
export type AppView = "GRADES" | "TERMS" | "SUBJECTS" | "EXAM" | "RESULTS";

export interface Question {
  id: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
}

export interface Subject {
  name: string;
  questions: Question[];
}

/**
 * THE SOLUTION:
 * The old interface was [key: string]: Subject[];
 * The new interface adds a second layer for the Terms.
 */
export interface ExamData {
  [grade: string]: {
    [term: string]: Subject[];
  };
}