import type { Grade, Term, Subject } from "../types";
import "../styles/examinfo.css";

export interface ExamInfoScreenProps {
    grade: Grade;
    term: Term;
    subject: Subject;
    onStart: () => void;
    onBack: () => void;
}

/** Total quiz seconds — must match QuizScreen's TOTAL_SECONDS */
const TOTAL_SECONDS: Record<Grade, Record<Term, number>> = {
    1: { 1: 120, 2: 100, 3: 90  },
    2: { 1: 100, 2: 85,  3: 75  },
    3: { 1: 90,  2: 75,  3: 60  },
};

/** Questions per term — must match TERM_SLICE in questions/index.ts */
const QUESTIONS_PER_TERM = 3;

const TERM_LABEL: Record<Term, string> = {
    1: "Term 1", 2: "Term 2", 3: "Term 3",
};

const GRADE_LABEL: Record<Grade, string> = {
    1: "Grade 1", 2: "Grade 2", 3: "Grade 3",
};

function formatTime(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (s === 0) return `${m} minute${m !== 1 ? "s" : ""}`;
    return `${m} min ${s} sec`;
}

const INSTRUCTIONS: string[] = [
    "Read each question carefully before selecting your answer.",
    "Each question has only one correct answer.",
    "You can navigate between questions using the Previous and Next buttons.",
    "You may change your answer at any time before the timer runs out.",
    "Unanswered questions will be marked as incorrect.",
    "Your results will be shown immediately after the exam.",
];

export default function ExamInfoScreen({
                                           grade,
                                           term,
                                           subject,
                                           onStart,
                                           onBack,
                                       }: ExamInfoScreenProps) {
    const totalSecs = TOTAL_SECONDS[grade][term];
    const marks     = QUESTIONS_PER_TERM; // 1 mark per question

    return (
        <div className="lower-ei-wrapper">
            <div className="lower-ei-card">

                {/* Back */}
                <button className="lower-ei-back" onClick={onBack}>← Back</button>

                {/* ── Title block ── */}
                <div className="lower-ei-header">
                    <div className="lower-ei-subject-icon">{subject.icon}</div>
                    <div className="lower-ei-title-group">
                        <h1 className="lower-ei-title">{subject.label}</h1>
                        <p className="lower-ei-subtitle">
                            {GRADE_LABEL[grade]} · {TERM_LABEL[term]}
                        </p>
                    </div>
                </div>

                <div className="lower-ei-divider" />

                {/* ── Meta row: time + marks ── */}
                <div className="lower-ei-meta-row">
                    <div className="lower-ei-meta-box">
                        <span className="lower-ei-meta-icon">⏱</span>
                        <div>
                            <div className="lower-ei-meta-label">Time Allowed</div>
                            <div className="lower-ei-meta-value">{formatTime(totalSecs)}</div>
                        </div>
                    </div>
                    <div className="lower-ei-meta-divider" />
                    <div className="lower-ei-meta-box">
                        <span className="lower-ei-meta-icon">📝</span>
                        <div>
                            <div className="lower-ei-meta-label">Total Marks</div>
                            <div className="lower-ei-meta-value">{marks} Marks</div>
                        </div>
                    </div>
                    <div className="lower-ei-meta-divider" />
                    <div className="lower-ei-meta-box">
                        <span className="lower-ei-meta-icon">❓</span>
                        <div>
                            <div className="lower-ei-meta-label">Questions</div>
                            <div className="lower-ei-meta-value">{QUESTIONS_PER_TERM}</div>
                        </div>
                    </div>
                </div>

                <div className="lower-ei-divider" />

                {/* ── Instructions ── */}
                <div className="lower-ei-instructions">
                    <h2 className="lower-ei-instructions-title">📋 Instructions</h2>
                    <ol className="lower-ei-instructions-list">
                        {INSTRUCTIONS.map((item, i) => (
                            <li key={i} className="lower-ei-instruction-item">
                                <span className="lower-ei-instruction-num">{i + 1}</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* ── Start button ── */}
                <button className="lower-ei-start-btn" onClick={onStart}>
                    Start {subject.label} Exam 🚀
                </button>

                <p className="lower-ei-start-hint">
                    The timer begins the moment you press Start
                </p>

            </div>
        </div>
    );
}