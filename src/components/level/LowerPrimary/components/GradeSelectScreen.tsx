import { useState } from "react";
import type { Grade } from "../types";
import "../styles/gradeSelectScreen.css";
import heroImage from "../assets/hero.png";

interface GradeSelectScreenProps {
    onContinue: (grade: Grade) => void;
}

const GRADE_OPTIONS = [
    { grade: 1 as Grade, label: "Grade 1" },
    { grade: 2 as Grade, label: "Grade 2" },
    { grade: 3 as Grade, label: "Grade 3" },
];

export default function GradeSelectScreen({ onContinue }: GradeSelectScreenProps) {
    const [selected, setSelected] = useState<Grade | null>(null);

    return (
        <div className="lower-gs-wrapper">
            <div className="lower-gs-card">

                {/* No back button on home screen */}

                <p className="lower-gs-app-title">Lower Primary</p>
                <h1 className="lower-gs-title">Select Your Grade Level</h1>
                <p className="lower-gs-subtitle">Please select your current grade level.</p>

                <div className="lower-gs-hero">
                    <img src={heroImage} alt="Two children waving with learning toys" />
                </div>

                <div className="lower-gs-options">
                    {GRADE_OPTIONS.map(({ grade, label }) => {
                        const isSelected = selected === grade;
                        return (
                            <button
                                key={grade}
                                className={`lower-gs-option ${isSelected ? "active" : ""}`}
                                onClick={() => setSelected(grade)}
                            >
                                <span>{label}</span>
                                {isSelected && <div className="lower-gs-check">✓</div>}
                            </button>
                        );
                    })}
                </div>

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