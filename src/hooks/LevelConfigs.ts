
export const LEVEL_CONFIG = {
    lower_primary: {
        label: 'Lower Primary', grades: 'Grade 1–3', emoji: '🧒',
        bg: 'linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%)',
        route: '/level/lower-primary',
        subjects: ['Mathematics','English','Kiswahili','Science','Art & Craft','Music'],
        subjectEmojis: ['🧮','📖','🗣️','🌿','🎨','🎵'],
    },
    middle_school: {
        label: 'Middle School', grades: 'Grade 4–9', emoji: '🧠',
        bg: 'linear-gradient(135deg, #0d1f0d 0%, #1a3a2a 50%, #0f3460 100%)',
        route: '/level/middle-school',
        subjects: ['Mathematics','English','Kiswahili','Science','Social Studies','History'],
        subjectEmojis: ['🧮','📖','🗣️','🔬','🌍','🏛️'],
    },
    senior_school: {
        label: 'Senior School', grades: 'Grade 10–12', emoji: '🎓',
        bg: 'linear-gradient(135deg, #1a0a0a 0%, #3b0f0f 50%, #6b1a1a 100%)',
        route: '/level/senior-school',
        subjects: ['Mathematics','English','Biology','Chemistry','Physics','History'],
        subjectEmojis: ['🧮','📖','🧬','🧪','⚡','🏛️'],
    },
};