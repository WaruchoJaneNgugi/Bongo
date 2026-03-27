import { Clock, BookOpen, Play } from 'lucide-react';
import type { Subject } from '../types';

interface PreExamProps {
    subject: Subject;
    durationMinutes: number;
    questionCount: number;
    onStart: () => void;
    onBack: () => void;
}

export default function PreExam({ subject, durationMinutes, questionCount, onStart, onBack }: PreExamProps) {
    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `linear-gradient(rgba(238, 242, 255, 0.85), rgba(224, 231, 255, 0.95)), url(/betterImg1.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: -1,
            }} />
            <div className="pre-exam-container">
                <div className="card pre-exam-card">
                    <div className="pre-exam-icon-wrapper">
                        <BookOpen size={48} className="text-primary" />
                    </div>

                    <h2 className="pre-exam-title text-gradient">{subject} Exam</h2>

                    <div className="pre-exam-details">
                        <div className="detail-item">
                            <div className="detail-icon">
                                <Clock size={20} />
                            </div>
                            <div className="detail-text">
                                <span className="detail-label">Duration</span>
                                <span className="detail-value">{durationMinutes} Minutes</span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <BookOpen size={20} />
                            </div>
                            <div className="detail-text">
                                <span className="detail-label">Questions</span>
                                <span className="detail-value">{questionCount} Questions</span>
                            </div>
                        </div>
                    </div>

                    <div className="pre-exam-instructions">
                        <h3>Instructions</h3>
                        <ul>
                            <li>Ensure you have a stable internet connection.</li>
                            <li>Do not refresh the page during the exam.</li>
                            <li>The exam will auto-submit when the timer runs out.</li>
                            <li>You can navigate between questions using Next and Previous buttons.</li>
                        </ul>
                    </div>

                    <div className="pre-exam-actions">
                        <button className="btn btn-outline" onClick={onBack}>
                            Cancel
                        </button>
                        <button className="btn btn-primary btn-start" onClick={onStart}>
                            <Play size={20} />
                            <span>Start Exam</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
