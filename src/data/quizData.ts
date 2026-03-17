export type EducationLevel = 'lower_primary' | 'middle_school' | 'senior_school';

export interface Subject {
  id: string;
  name: string;
  icon: string;
  level: EducationLevel;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
}

export interface Question {
  id: string;
  topicId: string;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correct: 'a' | 'b' | 'c' | 'd';
  explanation: string;
}

export const subjects: Subject[] = [
  { id: 'lp_math', name: 'Mathematics', icon: '🔢', level: 'lower_primary' },
  { id: 'lp_eng', name: 'English', icon: '📖', level: 'lower_primary' },
  { id: 'lp_env', name: 'Environmental Activities', icon: '🌿', level: 'lower_primary' },
  { id: 'ms_math', name: 'Mathematics', icon: '🔢', level: 'middle_school' },
  { id: 'ms_eng', name: 'English', icon: '📖', level: 'middle_school' },
  { id: 'ms_sci', name: 'Science', icon: '🔬', level: 'middle_school' },
  { id: 'ms_sst', name: 'Social Studies', icon: '🌍', level: 'middle_school' },
  { id: 'ss_math', name: 'Mathematics', icon: '🔢', level: 'senior_school' },
  { id: 'ss_eng', name: 'English', icon: '📖', level: 'senior_school' },
  { id: 'ss_bio', name: 'Biology', icon: '🧬', level: 'senior_school' },
  { id: 'ss_chem', name: 'Chemistry', icon: '⚗️', level: 'senior_school' },
  { id: 'ss_phy', name: 'Physics', icon: '⚡', level: 'senior_school' },
  { id: 'ss_his', name: 'History', icon: '📜', level: 'senior_school' },
  { id: 'ss_geo', name: 'Geography', icon: '🗺️', level: 'senior_school' },
];

export const topics: Topic[] = [
  { id: 't_lp_math_1', subjectId: 'lp_math', name: 'Addition & Subtraction' },
  { id: 't_lp_math_2', subjectId: 'lp_math', name: 'Multiplication' },
  { id: 't_lp_math_3', subjectId: 'lp_math', name: 'Shapes & Patterns' },
  { id: 't_lp_eng_1', subjectId: 'lp_eng', name: 'Alphabet & Phonics' },
  { id: 't_lp_eng_2', subjectId: 'lp_eng', name: 'Simple Sentences' },
  { id: 't_lp_env_1', subjectId: 'lp_env', name: 'Plants & Animals' },
  { id: 't_lp_env_2', subjectId: 'lp_env', name: 'Our Environment' },
  { id: 't_ms_math_1', subjectId: 'ms_math', name: 'Fractions' },
  { id: 't_ms_math_2', subjectId: 'ms_math', name: 'Decimals' },
  { id: 't_ms_math_3', subjectId: 'ms_math', name: 'Word Problems' },
  { id: 't_ms_eng_1', subjectId: 'ms_eng', name: 'Grammar' },
  { id: 't_ms_eng_2', subjectId: 'ms_eng', name: 'Comprehension' },
  { id: 't_ms_sci_1', subjectId: 'ms_sci', name: 'Living Things' },
  { id: 't_ms_sci_2', subjectId: 'ms_sci', name: 'Matter & Materials' },
  { id: 't_ms_sst_1', subjectId: 'ms_sst', name: 'Kenya Geography' },
  { id: 't_ms_sst_2', subjectId: 'ms_sst', name: 'Kenya History' },
  { id: 't_ss_math_1', subjectId: 'ss_math', name: 'Algebra' },
  { id: 't_ss_math_2', subjectId: 'ss_math', name: 'Quadratic Equations' },
  { id: 't_ss_bio_1', subjectId: 'ss_bio', name: 'Cell Biology' },
  { id: 't_ss_bio_2', subjectId: 'ss_bio', name: 'Genetics' },
  { id: 't_ss_chem_1', subjectId: 'ss_chem', name: 'Atomic Structure' },
  { id: 't_ss_chem_2', subjectId: 'ss_chem', name: 'Chemical Reactions' },
  { id: 't_ss_phy_1', subjectId: 'ss_phy', name: 'Motion & Forces' },
  { id: 't_ss_phy_2', subjectId: 'ss_phy', name: 'Electricity' },
  { id: 't_ss_his_1', subjectId: 'ss_his', name: 'Pre-Colonial Kenya' },
  { id: 't_ss_geo_1', subjectId: 'ss_geo', name: 'Physical Geography' },
];

export const questions: Question[] = [
  // LP Math - Addition & Subtraction
  {
    id: 'q1', topicId: 't_lp_math_1', question: 'What is 7 + 5?',
    options: { a: '11', b: '12', c: '13', d: '10' }, correct: 'b',
    explanation: '7 + 5 = 12. Count up 5 from 7: 8, 9, 10, 11, 12.',
  },
  {
    id: 'q2', topicId: 't_lp_math_1', question: 'What is 15 - 8?',
    options: { a: '6', b: '8', c: '7', d: '9' }, correct: 'c',
    explanation: '15 - 8 = 7. Take away 8 from 15.',
  },
  {
    id: 'q3', topicId: 't_lp_math_1', question: 'What is 4 + 9?',
    options: { a: '12', b: '14', c: '13', d: '11' }, correct: 'c',
    explanation: '4 + 9 = 13. Count up 9 from 4.',
  },
  {
    id: 'q4', topicId: 't_lp_math_1', question: 'What is 20 - 7?',
    options: { a: '12', b: '14', c: '13', d: '15' }, correct: 'c',
    explanation: '20 - 7 = 13.',
  },
  // LP Math - Multiplication
  {
    id: 'q5', topicId: 't_lp_math_2', question: 'What is 5 × 6?',
    options: { a: '25', b: '30', c: '20', d: '35' }, correct: 'b',
    explanation: '5 × 6 = 30. Adding 5 six times: 5+5+5+5+5+5 = 30.',
  },
  {
    id: 'q6', topicId: 't_lp_math_2', question: 'What is 3 × 4?',
    options: { a: '7', b: '14', c: '12', d: '10' }, correct: 'c',
    explanation: '3 × 4 = 12. Three groups of four.',
  },
  {
    id: 'q7', topicId: 't_lp_math_2', question: 'What is 7 × 2?',
    options: { a: '12', b: '16', c: '9', d: '14' }, correct: 'd',
    explanation: '7 × 2 = 14. Seven doubled.',
  },
  {
    id: 'q8', topicId: 't_lp_math_2', question: 'What is 9 × 3?',
    options: { a: '27', b: '21', c: '24', d: '18' }, correct: 'a',
    explanation: '9 × 3 = 27.',
  },
  // MS Math - Fractions
  {
    id: 'q9', topicId: 't_ms_math_1', question: 'What is 1/2 + 1/4?',
    options: { a: '2/6', b: '3/4', c: '1/3', d: '2/4' }, correct: 'b',
    explanation: '1/2 = 2/4. So 2/4 + 1/4 = 3/4.',
  },
  {
    id: 'q10', topicId: 't_ms_math_1', question: 'Which fraction is equivalent to 2/4?',
    options: { a: '1/3', b: '3/6', c: '1/2', d: '4/6' }, correct: 'c',
    explanation: '2/4 simplifies to 1/2 by dividing both by 2.',
  },
  {
    id: 'q11', topicId: 't_ms_math_1', question: 'What is 3/5 of 20?',
    options: { a: '10', b: '15', c: '12', d: '8' }, correct: 'c',
    explanation: '3/5 × 20 = 60/5 = 12.',
  },
  {
    id: 'q12', topicId: 't_ms_math_1', question: 'What is 2/3 + 1/6?',
    options: { a: '3/9', b: '5/6', c: '3/6', d: '4/6' }, correct: 'b',
    explanation: '2/3 = 4/6. So 4/6 + 1/6 = 5/6.',
  },
  // MS Science - Living Things
  {
    id: 'q13', topicId: 't_ms_sci_1', question: 'Which of these is NOT a living thing?',
    options: { a: 'Tree', b: 'Stone', c: 'Mushroom', d: 'Butterfly' }, correct: 'b',
    explanation: 'A stone is not alive. It cannot grow, breathe, or reproduce.',
  },
  {
    id: 'q14', topicId: 't_ms_sci_1', question: 'What do plants need to make food?',
    options: { a: 'Darkness', b: 'Sunlight', c: 'Salt', d: 'Sand' }, correct: 'b',
    explanation: 'Plants use sunlight, water, and CO₂ to make food through photosynthesis.',
  },
  {
    id: 'q15', topicId: 't_ms_sci_1', question: 'What is the process by which plants make food called?',
    options: { a: 'Respiration', b: 'Digestion', c: 'Photosynthesis', d: 'Absorption' }, correct: 'c',
    explanation: 'Photosynthesis is the process plants use to make their own food using sunlight.',
  },
  // SS Bio - Cell Biology
  {
    id: 'q16', topicId: 't_ss_bio_1', question: 'What is the control center of a cell?',
    options: { a: 'Cell wall', b: 'Cytoplasm', c: 'Nucleus', d: 'Membrane' }, correct: 'c',
    explanation: 'The nucleus controls cell activities and contains DNA.',
  },
  {
    id: 'q17', topicId: 't_ss_bio_1', question: 'Which organelle is responsible for energy production?',
    options: { a: 'Ribosome', b: 'Mitochondria', c: 'Vacuole', d: 'Golgi body' }, correct: 'b',
    explanation: 'Mitochondria are the powerhouse of the cell, producing ATP energy.',
  },
  {
    id: 'q18', topicId: 't_ss_bio_1', question: 'What is the basic unit of life?',
    options: { a: 'Organ', b: 'Tissue', c: 'Cell', d: 'Molecule' }, correct: 'c',
    explanation: 'The cell is the basic structural and functional unit of all living organisms.',
  },
  // SS Physics - Motion
  {
    id: 'q19', topicId: 't_ss_phy_1', question: 'What is the SI unit of force?',
    options: { a: 'Joule', b: 'Watt', c: 'Newton', d: 'Pascal' }, correct: 'c',
    explanation: 'The Newton (N) is the SI unit of force, named after Isaac Newton.',
  },
  {
    id: 'q20', topicId: 't_ss_phy_1', question: 'What does Newton\'s first law state?',
    options: {
      a: 'F = ma',
      b: 'Objects at rest stay at rest unless acted upon',
      c: 'Every action has an equal reaction',
      d: 'Energy cannot be created',
    }, correct: 'b',
    explanation: 'Newton\'s first law: an object remains at rest or in motion unless a force acts on it.',
  },
  {
    id: 'q21', topicId: 't_ss_phy_1', question: 'A car travels 100km in 2 hours. What is its average speed?',
    options: { a: '40 km/h', b: '60 km/h', c: '50 km/h', d: '45 km/h' }, correct: 'c',
    explanation: 'Speed = Distance ÷ Time = 100 ÷ 2 = 50 km/h.',
  },
  // SS Chemistry
  {
    id: 'q22', topicId: 't_ss_chem_1', question: 'What is the atomic number of Carbon?',
    options: { a: '8', b: '12', c: '6', d: '14' }, correct: 'c',
    explanation: 'Carbon has atomic number 6, meaning it has 6 protons in its nucleus.',
  },
  {
    id: 'q23', topicId: 't_ss_chem_1', question: 'Which subatomic particle has a negative charge?',
    options: { a: 'Proton', b: 'Neutron', c: 'Electron', d: 'Nucleus' }, correct: 'c',
    explanation: 'Electrons carry a negative charge (-1) and orbit the nucleus.',
  },
  // LP Shapes
  {
    id: 'q24', topicId: 't_lp_math_3', question: 'How many sides does a triangle have?',
    options: { a: '4', b: '2', c: '3', d: '5' }, correct: 'c',
    explanation: 'A triangle has 3 sides. "Tri" means three.',
  },
  {
    id: 'q25', topicId: 't_lp_math_3', question: 'What shape has 4 equal sides?',
    options: { a: 'Rectangle', b: 'Square', c: 'Triangle', d: 'Circle' }, correct: 'b',
    explanation: 'A square has 4 equal sides and 4 right angles.',
  },
];
