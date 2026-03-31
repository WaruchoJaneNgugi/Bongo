
export const LEVEL_CONFIG = {
    lower_primary: {
        label: 'Lower Primary', grades: 'Grade 1–3', emoji: '🧒',
        bg: 'linear-gradient(135deg, #172554, #2563eb)',
        route: '/level/lower-primary',
        subjects: ['Mathematics','English','Kiswahili','Science','Art & Craft','Music'],
        subjectEmojis: ['🧮','📖','🗣️','🌿','🎨','🎵'],
    },
    middle_school: {
        label: 'Middle School', grades: 'Grade 4–9', emoji: '🧠',
        bg: 'linear-gradient(135deg, #b45309, #f59e0b)',
        route: '/level/middle-school',
        subjects: ['Mathematics','English','Kiswahili','Science','Social Studies','History'],
        subjectEmojis: ['🧮','📖','🗣️','🔬','🌍','🏛️'],
    },
    senior_school: {
        label: 'Senior School', grades: 'Grade 10–12', emoji: '🎓',
        bg: 'linear-gradient(135deg, #1a2e05, #a3e635)',
        route: '/level/senior-school',
        subjects: ['Mathematics','English','Biology','Chemistry','Physics','History'],
        subjectEmojis: ['🧮','📖','🧬','🧪','⚡','🏛️'],
    },
};