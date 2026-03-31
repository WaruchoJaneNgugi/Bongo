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
        <div className="screen bg-dots lower-subjects-screen">
            <div className="lower-subjects-inner">

                {/* Header — Back + title only, no grade badge */}
                <div className="lower-subjects-header">
                    <button className="btn btn-ghost" onClick={onBack}>← Back</button>

                    <div className="lower-subjects-title-group">
                        <h2 className="display lower-subjects-heading">Pick a Subject</h2>
                        <p className="lower-subjects-heading-sub">Tap any card to begin!</p>
                    </div>
                </div>

                {/* Subject Grid */}
                <div className="lower-subject-grid">
                    {SUBJECTS.map((subject, idx) => (
                        <button
                            key={subject.id}
                            className="lower-subject-card"
                            data-subject={subject.id}
                            onClick={() => onSubjectSelect(subject)}
                            aria-label={`${subject.label} — ${subject.desc}`}
                        >
                            <div className="lower-subject-card-top">
                                <span className="lower-subject-icon">{subject.icon}</span>
                                <span className="lower-subject-num">{idx + 1}</span>
                            </div>
                            <div className="lower-subject-card-body">
                                <span className="display lower-subject-name">{subject.label}</span>
                                <span className="lower-subject-desc">{subject.desc}</span>
                                <span className="lower-subject-arrow">→</span>
                            </div>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default SubjectScreen;