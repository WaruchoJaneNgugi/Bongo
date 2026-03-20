import React, { useRef, useState } from 'react';
import { Zap } from 'lucide-react';
import { type GradeFilter, useExamStore } from '../store/UseexamStore';
import { useStore } from '../store/useStore';
import "../styles/exambrowser.css";

const GRADE_SECTIONS: { id: GradeFilter; label: string; emoji: string }[] = [
    { id: 'grade1-3',   label: 'Grade 1–3',   emoji: '🧒' },
    { id: 'grade4-6',   label: 'Grade 4–6',   emoji: '📗' },
    { id: 'grade7-9',   label: 'Grade 7–9',   emoji: '🧠' },
    { id: 'grade10-12', label: 'Grade 10–12', emoji: '🎓' },
];

/** One horizontal-scroll row for a single grade */
const GradeRow: React.FC<{
    section: typeof GRADE_SECTIONS[number];
    onCardClick: () => void;
}> = ({ section, onCardClick }) => {
    const { exams } = useExamStore();
    const [expanded, setExpanded] = useState(false);
    const rowRef = useRef<HTMLDivElement>(null);

    const gradeExams = exams.filter(e => e.grade === section.id);
    const PREVIEW_COUNT = 8;
    const visible = expanded ? gradeExams : gradeExams.slice(0, PREVIEW_COUNT);

    return (
        <div className="eb-row-section">
            {/* Section header */}
            <div className="eb-row-header">
                <h3 className="eb-row-title">
                    <span className="eb-row-emoji">{section.emoji}</span>
                    {section.label}
                    <span className="eb-row-count">{gradeExams.length}</span>
                </h3>
                <button
                    className="eb-show-all-btn"
                    onClick={() => setExpanded(prev => !prev)}
                >
                    {expanded ? 'Show less' : 'Show all'}
                </button>
            </div>

            {/* Horizontally scrolling card track */}
            <div className="eb-card-track-wrap">
                <div
                    className={`eb-card-track ${expanded ? 'eb-card-track--expanded' : ''}`}
                    ref={rowRef}
                >
                    {visible.map(exam => (
                        <div
                            key={exam.id}
                            className="exam-card game-card"
                            onClick={onCardClick}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && onCardClick()}
                        >
                            <div className="exam-card-inner">
                                <img
                                    className="exam-image"
                                    src={exam.img}
                                    alt={exam.title}
                                />
                                <div className="exam-overlay">
                                    <div className="overlay-content">
                                        <span className="exam-title">{exam.title}</span>
                                        <button className="cta-button try-button">
                                            Try Test
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ─── Main component ──────────────────────────────────────── */
const ExamBrowser: React.FC = () => {
    const { setOverlay } = useStore();
    const { exams } = useExamStore();

    return (
        <section className="eb-section">
            {/* Grade rows */}
            {GRADE_SECTIONS.map(section => (
                <GradeRow
                    key={section.id}
                    section={section}
                    onCardClick={() => setOverlay('signup')}
                />
            ))}

            {/* Unlock CTA */}
            <div className="eb-unlock">
                <button className="eb-unlock-btn" onClick={() => setOverlay('signup')}>
                    <Zap size={16} /> Sign up to unlock all {exams.length} exams free
                </button>
            </div>
        </section>
    );
};

export default ExamBrowser;