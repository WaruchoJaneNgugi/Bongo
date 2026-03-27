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
        <div className="gs-wrapper">
            <div className="gs-card">

                {/* Back */}
                <button className="gs-back" onClick={onBack}>← Back</button>

                {/* Grade pill */}
                <div className="ts-grade-pill">
                    <span>{GRADE_EMOJI[grade]}</span>
                    <span>Grade {grade}</span>
                </div>

                {/* Heading */}
                <h1 className="gs-title">Select Your Term</h1>
                <p className="gs-subtitle">Which school term are you studying?</p>

                {/* Term buttons */}
                <div className="gs-grades">
                    {TERM_OPTIONS.map(({ term, label, emoji, desc }) => {
                        const isSelected = selected === term;
                        return (
                            <button
                                key={term}
                                className={`gs-grade ts-grade-btn ${isSelected ? "active" : ""}`}
                                onClick={() => setSelected(term)}
                            >
                                <div className="ts-btn-left">
                                    <span className="ts-emoji">{emoji}</span>
                                    <div>
                                        <div className="ts-label">{label}</div>
                                        <div className="ts-desc">{desc}</div>
                                    </div>
                                </div>
                                {isSelected && <div className="gs-check-circle">✓</div>}
                            </button>
                        );
                    })}
                </div>

                {/* Continue */}
                <button
                    className="gs-continue"
                    disabled={!selected}
                    onClick={() => selected && onContinue(selected)}
                >
                    Continue
                </button>

            </div>
        </div>
    );
}