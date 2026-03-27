// components/SubjectScreen.tsx
import type { Grade, Subject } from "../types";
import { SUBJECTS } from "../data";
import "../styles/subjects.css";

export interface SubjectScreenProps {
    grade: Grade;
    onSubjectSelect: (subject: Subject) => void;
    onBack: () => void;
}

export function SubjectScreen({ onSubjectSelect, onBack }: SubjectScreenProps) {
    return (
        <div className="screen bg-dots subjects-screen">
            <div className="subjects-inner">

                {/* Header — Back + title only, no grade badge */}
                <div className="subjects-header">
                    <button className="btn btn-ghost" onClick={onBack}>← Back</button>

                    <div className="subjects-title-group">
                        <h2 className="display subjects-heading">Pick a Subject</h2>
                        <p className="subjects-heading-sub">Tap any card to begin!</p>
                    </div>
                </div>

                {/* Subject Grid */}
                <div className="subject-grid">
                    {SUBJECTS.map((subject, idx) => (
                        <button
                            key={subject.id}
                            className="subject-card"
                            data-subject={subject.id}
                            onClick={() => onSubjectSelect(subject)}
                            aria-label={`${subject.label} — ${subject.desc}`}
                        >
                            <div className="subject-card-top">
                                <span className="subject-icon">{subject.icon}</span>
                                <span className="subject-num">{idx + 1}</span>
                            </div>
                            <div className="subject-card-body">
                                <span className="display subject-name">{subject.label}</span>
                                <span className="subject-desc">{subject.desc}</span>
                                <span className="subject-arrow">→</span>
                            </div>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default SubjectScreen;