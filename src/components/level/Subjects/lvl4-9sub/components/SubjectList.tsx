import type { Subject } from '../types/types';
import { motion } from 'motion/react';

type Props = {
    subjects: Subject[];
    selectedGrade: number;
    onSelectSubject: (subject: Subject) => void;
    getSubjectProgress: (subjectId: string, topics: { id: string }[]) => number;
    onBack: () => void;
};

export default function SubjectList({ subjects, selectedGrade, onSelectSubject, getSubjectProgress}: Props) {
    const availableSubjects = subjects.filter(s =>
        s.topics.some(t => t.grade === selectedGrade)
    );

    return (
        <div className="mlearn-page-container mlearn-center-content">
            <div className="mlearn-page-header-container">
                <h1 className="mlearn-page-title" style={{marginBottom: 0}}>Subjects</h1>
                <p className="mlearn-page-subtitle">Grade {selectedGrade}</p>
            </div>

            {availableSubjects.length === 0 ? (
                <div className="mlearn-empty-state">
                    <h2 className="mlearn-empty-state-title">Coming Soon!</h2>
                    <p className="mlearn-empty-state-text">Topics for Grade {selectedGrade} are currently being added. Please check back later.</p>
                </div>
            ) : (
                <div className="mlearn-grid-list">
                    {availableSubjects.map((subject, index) => {
                        const Icon = subject.icon;
                        const filteredTopics = subject.topics.filter(t => t.grade === selectedGrade);
                        const progress = getSubjectProgress(subject.id, filteredTopics);

                        return (
                            <motion.button
                                key={subject.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => onSelectSubject(subject)}
                                className="mlearn-card-btn mlearn-card-btn-small"
                            >
                                <div className={`mlearn-icon-box-small ${subject.color}`}>
                                    <Icon size={24} />
                                </div>
                                <div style={{flex: 1}}>
                                    <h2 className="mlearn-card-title-small">{subject.title}</h2>
                                    <div className="mlearn-progress-container">
                                        <div className="mlearn-progress-bar-bg">
                                            <div
                                                className="mlearn-progress-bar-fill"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <span className="mlearn-progress-text">{progress}%</span>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
