export interface Question {
  id: number;
  subject: string;
  className: string;
  term: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type SchoolLevel = 'Upper Primary' | 'Junior Secondary School' | null;
export type ClassName = 'Grade 4' | 'Grade 5' | 'Grade 6' | 'Grade 7' | 'Grade 8' | 'Grade 9' | null;
export type Term = 'Term 1' | 'Term 2' | 'Term 3' | null;
export type Subject = 'Mathematics' | 'English' | 'Science' | 'Social Studies' | null;
