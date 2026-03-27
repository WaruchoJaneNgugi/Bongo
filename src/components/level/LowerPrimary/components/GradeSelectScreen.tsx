import { useState } from "react";
import type { Grade } from "../types";
import "../styles/gradeSelectScreen.css";
import heroImage from "../assets/hero.png";

interface GradeSelectScreenProps {
    onContinue: (grade: Grade) => void;
}

interface GradeOption {
    grade: Grade;
    label: string;
}

const GRADE_OPTIONS: GradeOption[] = [
    { grade: 1, label: "Grade 1" },
    { grade: 2, label: "Grade 2" },
    { grade: 3, label: "Grade 3" },
];

export default function GradeSelectScreen({ onContinue }: GradeSelectScreenProps) {
    const [selected, setSelected] = useState<Grade | null>(null);

    return (
        <div className="gs-wrapper">
            <div className="gs-card">

                {/* Back */}
                <button className="gs-back">
                    ← Back
                </button>

                {/* Heading */}
                <h1 className="gs-title">Select Your Grade Level</h1>
                <p className="gs-subtitle">
                    Please select your current grade level.
                </p>

                {/* HERO IMAGE */}
                <div className="gs-hero">
                    <img src={heroImage} alt="Two children waving with learning toys" />
                </div>

                {/* Grade buttons */}
                <div className="gs-grades">
                    {GRADE_OPTIONS.map(({ grade, label }) => {
                        const isSelected = selected === grade;

                        return (
                            <button
                                key={grade}
                                className={`gs-grade ${isSelected ? "active" : ""}`}
                                onClick={() => setSelected(grade)}
                            >
                                <span>{label}</span>

                                {isSelected && (
                                    <div className="gs-check-circle">✓</div>
                                )}
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