import {useState} from 'react';
import {useStore} from '../../store/useStore';
import {LowerPrimaryDashboard} from './LowerPrimaryDashboard';
import {MiddleSchoolDashboard} from './MiddleSchoolDashboard';
import {SeniorSchoolDashboard} from './SeniorSchoolDashboard';
import {TopicsView} from './TopicsView';
import {getTopicsForGrade, searchAllTopics} from './data/topicsData';
import type {SubjectTopics} from './data/topicsData';
import type {EducationLevel} from '../../store/useStore';
import type {Subject as MiddleSubject} from './MiddleSchool/types';

// Subject poster images per level
import lp_English        from './SubjectsImg/Grade1-3/English.png';
import lp_Mathematics        from './SubjectsImg/Grade1-3/Mathematics.png';
import lp_Kiswahili      from './SubjectsImg/Grade1-3/Kiswahili.png';
import lp_Religious      from './SubjectsImg/Grade1-3/Religious-ed.png';
import lp_Literacy       from './SubjectsImg/Grade1-3/Literacy.png';
import lp_Movement       from './SubjectsImg/Grade1-3/MovementCreative.png';
import lp_Environmental       from './SubjectsImg/Grade1-3/Environmental.png';
import lp_Hygiene        from './SubjectsImg/Grade1-3/HygieneNutrition.png';
import ms_Math           from './SubjectsImg/Grade4-9/Math.png';
import ms_English        from './SubjectsImg/Grade4-9/English.png';
import ms_Science        from './SubjectsImg/Grade4-9/Science.png';
import ms_SocialStudies  from './SubjectsImg/Grade4-9/SocialStudies.png';
import ms_CRE            from './SubjectsImg/Grade4-9/CRE.png';
import ss_Mathematics    from './SubjectsImg/grade10-12/Mathematics.png';
import ss_English        from './SubjectsImg/grade10-12/English.png';
import ss_Kiswahili      from './SubjectsImg/grade10-12/Kiswahili.png';
import ss_Biology        from './SubjectsImg/grade10-12/Biology.png';
import ss_Chemistry      from './SubjectsImg/grade10-12/Chemistry.png';
import ss_Physics        from './SubjectsImg/grade10-12/Physics.png';

const SUBJECT_IMAGES: Record<EducationLevel, Record<string, string>> = {
    lower_primary: {
        'Literacy':            lp_Literacy,
        'Kiswahili':           lp_Kiswahili,
        'English':             lp_English,
        'Movement & Creative': lp_Movement,
        'Hygiene & Nutrition': lp_Hygiene,
        'Mathematics': lp_Mathematics,
        'Religious Ed':lp_Religious,
        'Environmental':lp_Environmental

    },
    middle_school: {
        'Mathematics':   ms_Math,
        'English':       ms_English,
        'Science':       ms_Science,
        'Social Studies':ms_SocialStudies,
        'CRE':           ms_CRE,
    },
    senior_school: {
        'Mathematics': ss_Mathematics,
        'English':     ss_English,
        'Kiswahili':   ss_Kiswahili,
        'Biology':     ss_Biology,
        'Chemistry':   ss_Chemistry,
        'Physics':     ss_Physics,
    },
};

import "../../styles/mainlvl.css"
const LEVEL_SUBJECTS: Record<EducationLevel, { name: string; icon: string; grad: string; desc: string }[]> = {
    lower_primary: [
        { name: 'Literacy',            icon: '📚', grad: 'linear-gradient(135deg,#f97316,#fb923c)', desc: 'Reading & Writing' },
        { name: 'Kiswahili',           icon: '🗨️', grad: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', desc: 'Lugha ya Taifa' },
        { name: 'English',             icon: '🔤', grad: 'linear-gradient(135deg,#10b981,#34d399)', desc: 'Language Skills' },
        { name: 'Mathematics',         icon: '➗', grad: 'linear-gradient(135deg,#e11d48,#fb7185)', desc: 'Numbers & Logic' },
        { name: 'Environmental',       icon: '🌍', grad: 'linear-gradient(135deg,#16a34a,#4ade80)', desc: 'Nature & Society' },
        { name: 'Hygiene & Nutrition', icon: '🍎', grad: 'linear-gradient(135deg,#0891b2,#22d3ee)', desc: 'Health & Food' },
        { name: 'Religious Ed',        icon: '🕊️', grad: 'linear-gradient(135deg,#d97706,#fbbf24)', desc: 'Values & Faith' },
        { name: 'Movement & Creative', icon: '🎭', grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)', desc: 'Art, Music & PE' },
    ],

    middle_school: [
        { name: 'Mathematics',   icon: '📊', grad: 'linear-gradient(135deg,#e11d48,#fb7185)', desc: 'Numbers & Logic' },
        { name: 'English',       icon: '📝', grad: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', desc: 'Language Skills' },
        { name: 'Science',       icon: '🔬', grad: 'linear-gradient(135deg,#10b981,#34d399)', desc: 'Experiments & Facts' },
        { name: 'Social Studies',icon: '🗺️', grad: 'linear-gradient(135deg,#f97316,#fb923c)', desc: 'People & Places' },
        { name: 'CRE',           icon: '⛪', grad: 'linear-gradient(135deg,#d97706,#fbbf24)', desc: 'Values & Faith' },
    ],

    senior_school: [
        { name: 'Mathematics', icon: '📈', grad: 'linear-gradient(135deg,#e11d48,#fb7185)', desc: 'Numbers & Logic' },
        { name: 'English',     icon: '📖', grad: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', desc: 'Language Skills' },
        { name: 'Physics',     icon: '🧲', grad: 'linear-gradient(135deg,#d97706,#fbbf24)', desc: 'Forces & Energy' },
        { name: 'Chemistry',   icon: '⚗️', grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)', desc: 'Matter & Reactions' },
        { name: 'Biology',     icon: '🧬', grad: 'linear-gradient(135deg,#16a34a,#4ade80)', desc: 'Life Sciences' },
        { name: 'Kiswahili',   icon: '💬', grad: 'linear-gradient(135deg,#0891b2,#22d3ee)', desc: 'Lugha ya Taifa' },
    ],
};

const HOT_TOPICS = [
    {
        title: 'KCPE 2025 Results',
        // emoji: '🏆',
        img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=80'
    },
    {
        title: 'CBC Curriculum Update',
        // emoji: '📋',
        img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=80'
    },
    {
        title: 'Math Olympiad Tips',
        // emoji: '🧮',
        img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=80'
    },
    {
        title: 'Science Fair 2025',
        // emoji: '🔬',
        img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=80'
    },
    {
        title: 'Reading Challenge',
        // emoji: '📖',
        img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=80'
    },
    {
        title: 'Kiswahili Week',
        // emoji: '🗣️',
        img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80'
    },
];

export const MainLevelEntry = () => {
    const {user} = useStore();
    const [inExam, setInExam] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [topicsView, setTopicsView] = useState<SubjectTopics | null>(null);
    const [query, setQuery] = useState('');

    const activeProfile = user?.profiles.find(p => p.id === user.activeProfileId);
    const level: EducationLevel = activeProfile?.educationLevel ?? 'middle_school';
    const grade = activeProfile?.grade ?? 5;
    const subjects = LEVEL_SUBJECTS[level];
    const browseTopics = subjects.map(sub => {
        // find topics for this subject in the grade's data, or nearest grade
        const gradeData = getTopicsForGrade(level, grade);
        const found = gradeData.find(st => st.subject === sub.name);
        if (found) return { subject: sub.name, topics: found.topics };
        // fallback: search other grades in same level for this subject
        for (let g = 1; g <= 12; g++) {
            const fallback = getTopicsForGrade(level, g).find(st => st.subject === sub.name);
            if (fallback) return { subject: sub.name, topics: fallback.topics };
        }
        return { subject: sub.name, topics: [] };
    });
    const searchResults = searchAllTopics(query, level, grade);
    const myResults = searchResults.filter(r => !r.isOtherGrade);
    const otherResults = searchResults.filter(r => r.isOtherGrade);

    if (inExam) {
        return (
            <div>
                <button className="mle-back-btn" onClick={() => { setInExam(false); setSelectedSubject(null); }}>
                    ← Back to Home
                </button>
                {level === 'lower_primary' && <LowerPrimaryDashboard initialSubject={selectedSubject as string } />}
                {level === 'middle_school' && <MiddleSchoolDashboard initialSubject={selectedSubject as MiddleSubject} />}
                {level === 'senior_school' && <SeniorSchoolDashboard initialSubject={selectedSubject as string } />}
            </div>
        );
    }

    if (topicsView) {
        return <TopicsView subjectData={topicsView} onBack={() => setTopicsView(null)} />;
    }

    return (
        <div className="Main-lvl-Container">
            <div className="Main-lvl-Container-section">

                {/* ── Hot Topics ── */}
                <section className="hot-topics-container">
                    <h2 className="mle-section-heading">🔥 Hot Topics This Week</h2>
                    <div className="main-lvl-hot-topics-container">
                        {HOT_TOPICS.map((t) => (
                            <div className="hot-topics-div" key={t.title}>
                                <img className="hot-topic-image" src={t.img} alt={t.title} loading="lazy" />
                                <div className="hot-topic-body">
                                    {/*<span className="hot-topic-emoji">{t.emoji}</span>*/}
                                    <p className="hot-topic-title">{t.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Search ── */}
                <div className="mle-search-wrap">
                    <span className="mle-search-icon">🔍</span>
                    <input
                        className="mle-search-input"
                        placeholder="Search subjects or topics…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    {query && <button className="mle-search-clear" onClick={() => setQuery('')}>✕</button>}
                </div>

                {/* ── Search Results ── */}
                {query.trim() && (
                    <section className="mle-search-results">
                        {myResults.length === 0 && otherResults.length === 0 && (
                            <p className="mle-no-results">No results for "{query}"</p>
                        )}
                        {myResults.length > 0 && (
                            <>
                                <p className="mle-results-label">Your Grade</p>
                                {myResults.map((r, i) => (
                                    <div key={i} className="mle-result-row">
                                        <span className="mle-result-emoji">{r.topic.emoji}</span>
                                        <div className="mle-result-text">
                                            <span className="mle-result-title">{r.topic.title}</span>
                                            <span className="mle-result-meta">{r.subject} · {r.topic.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        {otherResults.length > 0 && (
                            <>
                                <p className="mle-results-label mle-results-label--other">Other Grades</p>
                                {otherResults.map((r, i) => (
                                    <div key={i} className="mle-result-row mle-result-row--other">
                                        <span className="mle-result-emoji">{r.topic.emoji}</span>
                                        <div className="mle-result-text">
                                            <span className="mle-result-title">{r.topic.title}</span>
                                            <span className="mle-result-meta">{r.subject} · Grade {r.grade} · {r.topic.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </section>
                )}

                {/* ── Browse by Subject ── */}
                <section className="mle-browse-section">
                    <h2 className="mle-section-heading">📖 Browse by Subject</h2>
                    <div className="mle-browse-scroll">
                        {browseTopics.map((st) => {
                            const meta = subjects.find(s => s.name === st.subject);
                            return (
                                <button
                                    key={st.subject}
                                    className="mle-browse-chip"
                                    style={{'--chip-color': meta?.grad.match(/#[0-9a-f]{6}/i)?.[0] ?? '#6366f1'} as React.CSSProperties}
                                    onClick={() => setTopicsView(st)}
                                >
                                    <span className="mle-browse-chip-icon">{meta?.icon ?? '📚'}</span>
                                    <span className="mle-browse-chip-name">{st.subject}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* ── Revision ── */}
                <section className="mle-revision-section">
                    <h2 className="mle-section-heading">📚 Revision</h2>
                    <div className="mle-revision-grid">
                        {browseTopics.map((st) => {
                            const meta = subjects.find(s => s.name === st.subject);
                            const img = SUBJECT_IMAGES[level]?.[st.subject];
                            return (
                                <div
                                    key={st.subject}
                                    onClick={() => setTopicsView(st)}
                                    className="mle-subject-card"
                                    style={{'--grad': meta?.grad} as React.CSSProperties}
                                >
                                    {img
                                        ? <img src={img} alt={st.subject} className="mle-card-poster" />
                                        : <span className="mle-card-icon">{meta?.icon ?? '📚'}</span>
                                    }
                                </div>
                            );
                        })}
                    </div>
                </section>

            </div>
        </div>
    );
};
