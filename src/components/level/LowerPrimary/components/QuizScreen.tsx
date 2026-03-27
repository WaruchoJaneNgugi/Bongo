// components/QuizScreen.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import type { Grade, Term, Subject, AnswerRecord, QuizResult } from "../types";
import { getQuestionsByTerm } from "../data/questions";
import ProgressBar from "./Progressbar.tsx";
import "../styles/quiz.css";

export interface QuizScreenProps {
    grade: Grade;
    term: Term;
    subject: Subject;
    onFinish: (result: QuizResult) => void;
    onBack: () => void;
}

/** Total seconds for the entire quiz session */
const TOTAL_SECONDS: Record<Grade, Record<Term, number>> = {
    1: { 1: 120, 2: 100, 3: 90  },
    2: { 1: 100, 2: 85,  3: 75  },
    3: { 1: 90,  2: 75,  3: 60  },
};

const LABELS = ["A", "B", "C", "D"] as const;

function formatTime(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export function QuizScreen({ grade, term, subject, onFinish, onBack }: QuizScreenProps) {
    const questions   = getQuestionsByTerm(grade, subject.id, term);
    const total       = questions.length;
    const totalSecs   = TOTAL_SECONDS[grade][term];

    // per-question selected answers — null means unanswered
    const [selected, setSelected] = useState<(number | null)[]>(
        () => Array(total).fill(null)
    );
    const [current,    setCurrent]    = useState(0);
    const [timeLeft,   setTimeLeft]   = useState(totalSecs);
    const [timedOut,   setTimedOut]   = useState(false);
    const [animKey,    setAnimKey]    = useState(0);

    const timedOutRef = useRef(false);

    /** Build QuizResult from current selected answers */
    const buildResult = useCallback((sel: (number | null)[]): QuizResult => {
        let score = 0;
        const answers: AnswerRecord[] = questions.map((q, i) => {
            const s         = sel[i];
            const isCorrect = s !== null && s === q.ans;
            if (isCorrect) score++;
            return { q: q.q, selected: s ?? -1, correct: q.ans, isCorrect };
        });
        return { finalScore: score, total, answers };
    }, [questions, total]);

    /** Global countdown — fires onFinish when it hits 0 */
    useEffect(() => {
        if (timedOut) return;
        if (timeLeft <= 0) {
            timedOutRef.current = true;
            setTimedOut(true);
            // 2.5 s overlay, then go to results
            setTimeout(() => {
                setSelected((sel) => {
                    onFinish(buildResult(sel));
                    return sel;
                });
            }, 2500);
            return;
        }
        const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(id);
    }, [timeLeft, timedOut, buildResult, onFinish]);

    const q       = questions[current];
    const selThis = selected[current];

    const answeredCount = selected.filter((s) => s !== null).length;
    const progressPct   = Math.round((answeredCount / total) * 100);
    const timerPct      = (timeLeft / totalSecs) * 100;
    const isUrgent      = timeLeft <= Math.floor(totalSecs * 0.2); // last 20 %

    /** Select / change answer for current question */
    const handleSelect = (idx: number) => {
        setSelected((prev) => {
            const next = [...prev];
            next[current] = idx;
            return next;
        });
    };

    const handlePrev = () => {
        if (current > 0) {
            setCurrent((c) => c - 1);
            setAnimKey((k) => k + 1);
        }
    };

    const handleNext = () => {
        if (current < total - 1) {
            setCurrent((c) => c + 1);
            setAnimKey((k) => k + 1);
        }
    };

    const handleFinish = () => {
        onFinish(buildResult(selected));
    };

    const getOptClass = (idx: number): string => {
        if (selThis === idx) return "opt-btn opt-selected";
        return "opt-btn";
    };

    return (
        <div className="screen quiz-screen">
            <div className="quiz-inner">

                {/* ── Global Timer Bar ── */}
                <div className={`quiz-global-timer ${isUrgent ? "urgent" : ""}`}>
                    <div className="quiz-timer-row">
                        <span className="quiz-timer-label">⏱ Time Remaining</span>
                        <span className={`quiz-timer-count ${isUrgent ? "urgent" : ""}`}>
              {formatTime(timeLeft)}
            </span>
                    </div>
                    <div className="quiz-timer-track">
                        <div
                            className={`quiz-timer-fill ${isUrgent ? "urgent" : ""}`}
                            style={{ width: `${timerPct}%` }}
                        />
                    </div>
                </div>

                {/* ── Top Bar ── */}
                <div className="quiz-topbar">
                    <button className="btn btn-ghost" onClick={onBack}>← Back</button>

                    <div className="quiz-progress-group">
                        <div className="quiz-progress-label">
                            <span>{subject.icon} {subject.label}</span>
                            <span>{answeredCount}/{total} answered</span>
                        </div>
                        <ProgressBar value={progressPct} height={10} />
                    </div>
                </div>

                {/* ── Question Dots ── */}
                <div className="quiz-dots">
                    {questions.map((_, i) => (
                        <button
                            key={i}
                            className={`quiz-dot ${i === current ? "active" : ""} ${selected[i] !== null ? "answered" : ""}`}
                            onClick={() => { setCurrent(i); setAnimKey((k) => k + 1); }}
                            aria-label={`Question ${i + 1}`}
                        />
                    ))}
                </div>

                {/* ── Question Card ── */}
                <div className="quiz-question-card" key={animKey}>
                    <div className="quiz-question-big-num">{current + 1}</div>
                    <p className="quiz-question-text">{q.q}</p>
                </div>

                {/* ── Options ── */}
                <div className="quiz-options" key={animKey + 100}>
                    {q.opts.map((opt, idx) => (
                        <button
                            key={idx}
                            className={getOptClass(idx)}
                            onClick={() => handleSelect(idx)}
                            aria-label={`Option ${LABELS[idx]}: ${opt}`}
                        >
                            <span className="opt-letter">{LABELS[idx]}</span>
                            <span className="opt-text">{opt}</span>
                        </button>
                    ))}
                </div>

                {/* ── Navigation ── */}
                <div className="quiz-nav-btns">
                    <button
                        className="btn btn-outline quiz-nav-prev"
                        onClick={handlePrev}
                        disabled={current === 0}
                    >
                        ← Previous
                    </button>

                    {current < total - 1 ? (
                        <button className="btn btn-primary quiz-nav-next" onClick={handleNext}>
                            Next →
                        </button>
                    ) : (
                        <button className="btn btn-primary quiz-nav-finish" onClick={handleFinish}>
                            Finish 🏆
                        </button>
                    )}
                </div>

                {/* ── Hint ── */}
                <p className="quiz-hint">You can go back and change any answer before finishing ✦</p>

            </div>

            {/* ── Time's Up Overlay ── */}
            {timedOut && (
                <div className="quiz-timeout-overlay">
                    <div className="quiz-timeout-card">
                        <div className="quiz-timeout-emoji">⏰</div>
                        <h2 className="quiz-timeout-title">Time's Up!</h2>
                        <p className="quiz-timeout-msg">
                            Calculating your results…
                        </p>
                        <div className="quiz-timeout-dots">
                            <span /><span /><span />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuizScreen;