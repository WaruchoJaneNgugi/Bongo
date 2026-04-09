import type {EducationLevel} from "../../../store/useStore.ts";

export interface Topic {
    title: string;
    emoji: string;
    desc: string;
}

export interface SubjectTopics {
    subject: string;
    topics: Topic[];
}

export const TOPICS: Record<EducationLevel, Record<number, SubjectTopics[]>> = {
    lower_primary: {
        1: [
            { subject: 'Literacy', topics: [
                { title: 'Letter Recognition', emoji: '🔤', desc: 'Identify A–Z letters' },
                { title: 'Phonics Basics', emoji: '🔊', desc: 'Sounds and blending' },
                { title: 'Simple Words', emoji: '📝', desc: 'CVC word reading' },
            ]},
            { subject: 'Mathematics', topics: [
                { title: 'Counting 1–20', emoji: '🔢', desc: 'Number recognition' },
                { title: 'Addition', emoji: '➕', desc: 'Adding small numbers' },
                { title: 'Shapes', emoji: '🔷', desc: 'Basic 2D shapes' },
            ]},
            { subject: 'English', topics: [
                { title: 'Greetings', emoji: '👋', desc: 'Hello, goodbye, please' },
                { title: 'Colours', emoji: '🎨', desc: 'Name common colours' },
                { title: 'Animals', emoji: '🐘', desc: 'Farm and wild animals' },
            ]},
        ],
        2: [
            { subject: 'Literacy', topics: [
                { title: 'Reading Sentences', emoji: '📖', desc: 'Short sentence fluency' },
                { title: 'Vowels & Consonants', emoji: '🔤', desc: 'Identify vowel sounds' },
                { title: 'Story Comprehension', emoji: '📚', desc: 'Answer questions on text' },
            ]},
            { subject: 'Mathematics', topics: [
                { title: 'Counting to 100', emoji: '💯', desc: 'Skip counting & place value' },
                { title: 'Subtraction', emoji: '➖', desc: 'Take away within 20' },
                { title: 'Measurement', emoji: '📏', desc: 'Length and weight' },
            ]},
            { subject: 'Environmental', topics: [
                { title: 'My Family', emoji: '👨‍👩‍👧', desc: 'Family members & roles' },
                { title: 'Plants Around Us', emoji: '🌱', desc: 'Parts of a plant' },
                { title: 'Weather', emoji: '🌤️', desc: 'Sunny, rainy, cloudy' },
            ]},
        ],
        3: [
            { subject: 'Mathematics', topics: [
                { title: 'Multiplication', emoji: '✖️', desc: 'Times tables 1–5' },
                { title: 'Fractions', emoji: '½', desc: 'Halves and quarters' },
                { title: 'Time', emoji: '🕐', desc: 'Reading a clock' },
            ]},
            { subject: 'English', topics: [
                { title: 'Nouns & Verbs', emoji: '📝', desc: 'Parts of speech basics' },
                { title: 'Punctuation', emoji: '❗', desc: 'Full stops and commas' },
                { title: 'Creative Writing', emoji: '✍️', desc: 'Write a short story' },
            ]},
            { subject: 'Kiswahili', topics: [
                { title: 'Salamu', emoji: '🤝', desc: 'Greetings in Kiswahili' },
                { title: 'Nambari', emoji: '🔢', desc: 'Numbers 1–20' },
                { title: 'Familia', emoji: '👨‍👩‍👧', desc: 'Family vocabulary' },
            ]},
        ],
    },
    middle_school: {
        4: [
            { subject: 'Mathematics', topics: [
                { title: 'Whole Numbers', emoji: '🔢', desc: 'Place value up to millions' },
                { title: 'Fractions', emoji: '½', desc: 'Add, subtract fractions' },
                { title: 'Geometry', emoji: '📐', desc: 'Angles and triangles' },
            ]},
            { subject: 'English', topics: [
                { title: 'Grammar', emoji: '📝', desc: 'Tenses and sentence structure' },
                { title: 'Comprehension', emoji: '📖', desc: 'Reading and inference' },
                { title: 'Composition', emoji: '✍️', desc: 'Essay and letter writing' },
            ]},
            { subject: 'Science', topics: [
                { title: 'Living Things', emoji: '🌿', desc: 'Characteristics of life' },
                { title: 'Matter', emoji: '⚗️', desc: 'Solids, liquids, gases' },
                { title: 'Energy', emoji: '⚡', desc: 'Forms of energy' },
            ]},
        ],
        5: [
            { subject: 'Mathematics', topics: [
                { title: 'Decimals', emoji: '🔢', desc: 'Operations with decimals' },
                { title: 'Percentages', emoji: '💯', desc: 'Percent of a quantity' },
                { title: 'Area & Perimeter', emoji: '📐', desc: 'Calculate shapes' },
            ]},
            { subject: 'Science', topics: [
                { title: 'Human Body', emoji: '🫀', desc: 'Body systems overview' },
                { title: 'Ecosystems', emoji: '🌍', desc: 'Food chains & webs' },
                { title: 'Simple Machines', emoji: '⚙️', desc: 'Levers, pulleys, wheels' },
            ]},
            { subject: 'Social Studies', topics: [
                { title: 'Kenya Geography', emoji: '🗺️', desc: 'Counties and regions' },
                { title: 'History of Kenya', emoji: '🏛️', desc: 'Pre-colonial to independence' },
                { title: 'Civic Education', emoji: '🏛️', desc: 'Rights and responsibilities' },
            ]},
        ],
        6: [
            { subject: 'Mathematics', topics: [
                { title: 'Algebra Intro', emoji: '🔣', desc: 'Simple equations' },
                { title: 'Ratio & Proportion', emoji: '⚖️', desc: 'Comparing quantities' },
                { title: 'Statistics', emoji: '📊', desc: 'Mean, mode, median' },
            ]},
            { subject: 'English', topics: [
                { title: 'Oral Skills', emoji: '🎤', desc: 'Speaking and listening' },
                { title: 'Poetry', emoji: '🎭', desc: 'Figures of speech' },
                { title: 'Novel Study', emoji: '📚', desc: 'Character and theme' },
            ]},
            { subject: 'Science', topics: [
                { title: 'Reproduction', emoji: '🌱', desc: 'Plants and animals' },
                { title: 'Electricity', emoji: '💡', desc: 'Circuits and conductors' },
                { title: 'Environment', emoji: '♻️', desc: 'Pollution and conservation' },
            ]},
        ],
        7: [
            { subject: 'Mathematics', topics: [
                { title: 'Integers', emoji: '🔢', desc: 'Positive and negative numbers' },
                { title: 'Linear Equations', emoji: '🔣', desc: 'Solve for x' },
                { title: 'Pythagoras', emoji: '📐', desc: 'Right-angled triangles' },
            ]},
            { subject: 'Science', topics: [
                { title: 'Cells', emoji: '🔬', desc: 'Plant and animal cells' },
                { title: 'Forces', emoji: '⚡', desc: 'Push, pull, friction' },
                { title: 'Chemical Reactions', emoji: '⚗️', desc: 'Acids, bases, indicators' },
            ]},
            { subject: 'English', topics: [
                { title: 'Comprehension', emoji: '📖', desc: 'Inference and analysis' },
                { title: 'Grammar', emoji: '📝', desc: 'Clauses and phrases' },
                { title: 'Creative Writing', emoji: '✍️', desc: 'Narrative and descriptive' },
            ]},
        ],
        8: [
            { subject: 'Mathematics', topics: [
                { title: 'Quadratics', emoji: '📈', desc: 'Factorising expressions' },
                { title: 'Trigonometry', emoji: '📐', desc: 'Sin, cos, tan basics' },
                { title: 'Probability', emoji: '🎲', desc: 'Likelihood and outcomes' },
            ]},
            { subject: 'Social Studies', topics: [
                { title: 'East Africa', emoji: '🌍', desc: 'EAC member states' },
                { title: 'Climate', emoji: '🌤️', desc: 'Factors affecting climate' },
                { title: 'Trade', emoji: '🤝', desc: 'Local and international trade' },
            ]},
            { subject: 'CRE', topics: [
                { title: 'Creation', emoji: '🌟', desc: 'Biblical creation story' },
                { title: 'The Ten Commandments', emoji: '📜', desc: 'Laws of Moses' },
                { title: 'Jesus\' Teachings', emoji: '🙏', desc: 'Parables and miracles' },
            ]},
        ],
        9: [
            { subject: 'Mathematics', topics: [
                { title: 'Matrices', emoji: '🔢', desc: 'Operations on matrices' },
                { title: 'Vectors', emoji: '➡️', desc: 'Magnitude and direction' },
                { title: 'Calculus Intro', emoji: '📈', desc: 'Differentiation basics' },
            ]},
            { subject: 'Science', topics: [
                { title: 'Genetics', emoji: '🧬', desc: 'DNA and inheritance' },
                { title: 'Waves', emoji: '〰️', desc: 'Sound and light waves' },
                { title: 'Organic Chemistry', emoji: '⚗️', desc: 'Hydrocarbons intro' },
            ]},
            { subject: 'English', topics: [
                { title: 'Drama', emoji: '🎭', desc: 'Set book analysis' },
                { title: 'Argumentative Writing', emoji: '✍️', desc: 'Debate and persuasion' },
                { title: 'Vocabulary', emoji: '📚', desc: 'Idioms and proverbs' },
            ]},
        ],
    },
    senior_school: {
        10: [
            { subject: 'Mathematics', topics: [
                { title: 'Sequences & Series', emoji: '🔢', desc: 'AP, GP and sums' },
                { title: 'Logarithms', emoji: '📊', desc: 'Log rules and equations' },
                { title: 'Coordinate Geometry', emoji: '📐', desc: 'Lines and circles' },
            ]},
            { subject: 'Physics', topics: [
                { title: 'Mechanics', emoji: '⚙️', desc: 'Motion and forces' },
                { title: 'Waves', emoji: '〰️', desc: 'Properties of waves' },
                { title: 'Electricity', emoji: '⚡', desc: 'Current and resistance' },
            ]},
            { subject: 'Chemistry', topics: [
                { title: 'Atomic Structure', emoji: '⚛️', desc: 'Protons, neutrons, electrons' },
                { title: 'Bonding', emoji: '🔗', desc: 'Ionic and covalent bonds' },
                { title: 'Stoichiometry', emoji: '⚗️', desc: 'Mole calculations' },
            ]},
        ],
        11: [
            { subject: 'Mathematics', topics: [
                { title: 'Differentiation', emoji: '📈', desc: 'Rates of change' },
                { title: 'Integration', emoji: '∫', desc: 'Area under a curve' },
                { title: 'Complex Numbers', emoji: '🔣', desc: 'Real and imaginary parts' },
            ]},
            { subject: 'Biology', topics: [
                { title: 'Cell Division', emoji: '🔬', desc: 'Mitosis and meiosis' },
                { title: 'Ecology', emoji: '🌿', desc: 'Ecosystems and niches' },
                { title: 'Evolution', emoji: '🦕', desc: 'Natural selection' },
            ]},
            { subject: 'Chemistry', topics: [
                { title: 'Organic Chemistry', emoji: '⚗️', desc: 'Functional groups' },
                { title: 'Equilibrium', emoji: '⚖️', desc: 'Le Chatelier\'s principle' },
                { title: 'Electrochemistry', emoji: '⚡', desc: 'Electrolysis and cells' },
            ]},
        ],
        12: [
            { subject: 'Mathematics', topics: [
                { title: 'Statistics', emoji: '📊', desc: 'Distributions and testing' },
                { title: 'Mechanics', emoji: '⚙️', desc: 'Projectiles and moments' },
                { title: 'Numerical Methods', emoji: '🔢', desc: 'Approximation techniques' },
            ]},
            { subject: 'Physics', topics: [
                { title: 'Nuclear Physics', emoji: '☢️', desc: 'Radioactivity and decay' },
                { title: 'Quantum Mechanics', emoji: '⚛️', desc: 'Photoelectric effect' },
                { title: 'Electromagnetism', emoji: '🧲', desc: 'Fields and induction' },
            ]},
            { subject: 'Biology', topics: [
                { title: 'Genetics', emoji: '🧬', desc: 'Mendelian inheritance' },
                { title: 'Homeostasis', emoji: '🫀', desc: 'Regulation in the body' },
                { title: 'Biotechnology', emoji: '🔬', desc: 'GMOs and cloning' },
            ]},
        ],
    },
};

export function getTopicsForGrade(level: EducationLevel, grade: number): SubjectTopics[] {
    return TOPICS[level]?.[grade] ?? [];
}

export interface SearchResult {
    level: EducationLevel;
    grade: number;
    subject: string;
    topic: Topic;
    isOtherGrade: boolean;
}

export function searchAllTopics(query: string, currentLevel: EducationLevel, currentGrade: number): SearchResult[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    (Object.entries(TOPICS) as [EducationLevel, Record<number, SubjectTopics[]>][]).forEach(([level, grades]) => {
        Object.entries(grades).forEach(([gradeStr, subjectList]) => {
            const grade = Number(gradeStr);
            subjectList.forEach(({ subject, topics }) => {
                const subjectMatch = subject.toLowerCase().includes(q);
                topics.forEach(topic => {
                    if (subjectMatch || topic.title.toLowerCase().includes(q) || topic.desc.toLowerCase().includes(q)) {
                        results.push({
                            level, grade, subject, topic,
                            isOtherGrade: level !== currentLevel || grade !== currentGrade,
                        });
                    }
                });
            });
        });
    });

    // current grade first, then others
    return results.sort((a, b) => Number(a.isOtherGrade) - Number(b.isOtherGrade));
}
