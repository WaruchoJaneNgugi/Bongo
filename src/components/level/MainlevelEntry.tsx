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
import Footer from '../Footer';
import "../../styles/mainlvl.css"
import {
    BONGO_BOOKS,
    HOT_TOPICS_BG,
    HOT_TOPICS_BY_LEVEL,
    LEVEL_BANNER,
    LEVEL_SUBJECTS,
    SUBJECT_IMAGES
} from "./types/MainLevelData.ts";

export const MainLevelEntry = () => {
    const {user, setLevelSelection} = useStore();
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
        <>
        <div className="Main-lvl-Container">
            <div className="Main-lvl-Container-section">

                {/* ── Hot Topics ── */}
                <section className="hot-topics-container">
                    <h2 className="mle-section-heading">🔥 Hot Topics This Week</h2>
                    <div className="main-lvl-hot-topics-container">
                        <div className="hot-topics-track">
                            {HOT_TOPICS_BY_LEVEL[level].map((t, i) => (
                                <div className="hot-topics-div" key={`${t.title}-${i}`}
                                    style={{
                                        backgroundImage: `url(${HOT_TOPICS_BG[level]})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    } as React.CSSProperties}>
                                    <span className="hot-topic-emoji">{t.emoji}</span>
                                    <span className="hot-topic-tag">{t.tag}</span>
                                    <p className="hot-topic-title">{t.title}</p>
                                </div>
                            ))}
                        </div>
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
                                        <span className="mle-result-arrow">›</span>
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
                                        <span className="mle-result-arrow">›</span>
                                    </div>
                                ))}
                            </>
                        )}
                    </section>
                )}

                {/* ── Browse by Subject ── */}
                <section className="mle-browse-section">
                    <h2 className="mle-section-heading">📖 Browse by Subject</h2>
                    <div className="mle-browse-grid">
                        {browseTopics.map((st) => {
                            const meta = subjects.find(s => s.name === st.subject);
                            return (
                                <button
                                    key={st.subject}
                                    className="mle-browse-card"
                                    style={{'--card-grad': meta?.grad ?? 'linear-gradient(135deg,#6366f1,#a78bfa)'} as React.CSSProperties}
                                    onClick={() => setTopicsView(st)}
                                >
                                    <span className="mle-browse-card-icon">{meta?.icon ?? '📚'}</span>
                                    <span className="mle-browse-card-name">{st.subject}</span>
                                    <span className="mle-browse-card-desc">{meta?.desc ?? ''}</span>
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
                            const handleRevisionClick = () => {
                                // ensure level selections are set so dashboards can initialize correctly
                                if (level === 'middle_school') {
                                    const schoolLevel = grade <= 6 ? 'Upper Primary' : 'Junior Secondary School';
                                    setLevelSelection('middle_school', { level: schoolLevel, className: `Grade ${grade}` as any });
                                } else if (level === 'senior_school') {
                                    setLevelSelection('senior_school', { grade: String(grade) as any });
                                } else {
                                    setLevelSelection('lower_primary', { grade });
                                }
                                setSelectedSubject(st.subject);
                                setInExam(true);
                            };
                            return (
                                <div
                                    key={st.subject}
                                    onClick={handleRevisionClick}
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

                {/* ── Bongo Books ── */}
                <section className="mle-books-section">
                    <h2 className="mle-section-heading">📗 Bongo Books</h2>
                    <div className="mle-books-grid">
                        {BONGO_BOOKS[level].map((book) => (
                            <div key={book.title} className="mle-book-card"
                                style={{'--book-color': book.color, '--book-spine': book.spine} as React.CSSProperties}>
                                <div className="mle-book-spine" />
                                <div className="mle-book-cover">
                                    <div className="mle-book-cover-band" />
                                    <span className="mle-book-subject">{book.subject}</span>
                                    <span className="mle-book-title">{book.title}</span>
                                    <span className="mle-book-grade">{book.grade}</span>
                                    <span className="mle-book-logo">BongoQuiz</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Level Banner ── */}
                <section className="mle-level-banner"
                    style={{'--banner-grad': LEVEL_BANNER[level].grad} as React.CSSProperties}>
                    <span className="mle-banner-emoji">{LEVEL_BANNER[level].emoji}</span>
                    <div>
                        <p className="mle-banner-title">{LEVEL_BANNER[level].title}</p>
                        <p className="mle-banner-desc">{LEVEL_BANNER[level].desc}</p>
                    </div>
                </section>

            </div>
        </div>
        <Footer />
        </>
    );
};
