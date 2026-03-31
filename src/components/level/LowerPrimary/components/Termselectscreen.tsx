import { useState } from "react";
import type { Grade, Term } from "../types";
import "../styles/gradeSelectScreen.css";

interface TermSelectScreenProps {
    grade: Grade;
    onContinue: (term: Term) => void;
    onBack: () => void;
}

interface TermOption {
    term: Term;
    label: string;
    emoji: string;
    desc: string;
}

const TERM_OPTIONS: TermOption[] = [
    { term: 1, label: "Term 1", emoji: "🌱", desc: "Jan – Apr  ·  Start of year" },
    { term: 2, label: "Term 2", emoji: "📘", desc: "May – Aug  ·  Mid year"      },
    { term: 3, label: "Term 3", emoji: "🏆", desc: "Sep – Nov  ·  End of year"   },
];

const GRADE_EMOJI: Record<Grade, string> = { 1: "🐣", 2: "🐥", 3: "🐓" };

export default function TermSelectScreen({ grade, onContinue, onBack }: TermSelectScreenProps) {
    const [selected, setSelected] = useState<Term | null>(null);

    return (
        <div className="lower-gs-wrapper">
            <div className="lower-gs-card">

                {/* Back */}
                <button className="lower-gs-back" onClick={onBack}>← Back</button>

                {/* Grade pill */}
                <div className="lower-ts-grade-pill">
                    <span>{GRADE_EMOJI[grade]}</span>
                    <span>Grade {grade}</span>
                </div>

                {/* Heading */}
                <h1 className="lower-gs-title">Select Your Term</h1>
                <p className="lower-gs-subtitle">Which school term are you studying?</p>

                {/* Term buttons */}
                <div className="lower-gs-options">
                    {TERM_OPTIONS.map(({ term, label, emoji, desc }) => {
                        const isSelected = selected === term;
                        return (
                            <button
                                key={term}
                                className={`lower-gs-option ${isSelected ? "active" : ""}`}
                                onClick={() => setSelected(term)}
                            >
                                <div className="lower-ts-option-inner">
                                    <span className="lower-ts-emoji">{emoji}</span>
                                    <div>
                                        <div className="lower-ts-label">{label}</div>
                                        <div className="lower-ts-desc">{desc}</div>
                                    </div>
                                </div>
                                {isSelected && <div className="lower-gs-check">✓</div>}
                            </button>
                        );
                    })}
                </div>

                {/* Continue */}
                <button
                    className="lower-gs-continue"
                    disabled={!selected}
                    onClick={() => selected && onContinue(selected)}
                >
                    Continue
                </button>

            </div>
        </div>
    );
}