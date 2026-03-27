import { useState, useEffect } from 'react';
import type { Question, Subject } from '../types';
import { ChevronRight, ChevronLeft, CheckCircle2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
    questions: Question[];
    subject: Subject;
    forceSubmit?: boolean;
    onSubmit: (answers: Record<number, string>) => void;
    onBack: () => void;
}

export default function ExamManager({ questions, forceSubmit, onSubmit }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        if (forceSubmit) {
            onSubmit(answers);
        }
    }, [forceSubmit, answers, onSubmit]);

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const isFirstQuestion = currentIndex === 0;
    const progress = (Object.keys(answers).length / questions.length) * 100;
    const hasAnsweredCurrent = !!answers[currentQuestion.id];

    const handleSelectAnswer = (answer: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    };

    const handleNext = () => {
        if (!isLastQuestion) {
            setDirection(1);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (!isFirstQuestion) {
            setDirection(-1);
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        onSubmit(answers);
    };

    const pageVariants = {
        enter: (direction: number) => ({
            rotateY: direction > 0 ? 0 : -120,
            zIndex: direction > 0 ? 0 : 10,
            filter: direction > 0 ? 'brightness(0.85)' : 'brightness(1)',
            boxShadow: direction > 0 ? 'none' : '-15px 0 25px rgba(0,0,0,0.15)',
        }),
        center: {
            rotateY: 0,
            zIndex: 1,
            filter: 'brightness(1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        },
        exit: (direction: number) => ({
            rotateY: direction > 0 ? -120 : 0,
            zIndex: direction > 0 ? 10 : 0,
            filter: direction > 0 ? 'brightness(1)' : 'brightness(0.85)',
            boxShadow: direction > 0 ? '-15px 0 25px rgba(0,0,0,0.15)' : 'none',
        }),
    };

    const pageTransition = {
        type: 'tween',
        duration: 0.6,
        ease: 'easeInOut',
    } as const;

    return (
        <div className="max-w-2xl exam-manager-container px-4">
            <div className="progress-bar" style={{ marginBottom: '0.5rem' }}>
                <div className="progress-fill" style={{ width: `${progress}%`, transition: 'width 0.3s ease' }} />
            </div>

            <div style={{ position: 'relative', perspective: '2000px', display: 'grid', flex: 1, minHeight: 0 }}>
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={pageTransition}
                        style={{
                            gridArea: '1 / 1',
                            transformOrigin: 'left center',
                            backfaceVisibility: 'hidden',
                            background: 'var(--card-bg)',
                            borderRadius: '1.5rem',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            border: '2px solid white',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                            height: '100%',
                            minHeight: 0,
                            overflowY: 'auto'
                        }}
                    >
                        <div className="question-meta" style={{ margin: 0, flexShrink: 0 }}>
                            <span>Question {currentIndex + 1} of {questions.length}</span>
                            <span>{currentQuestion.topic}</span>
                        </div>

                        <h3
                            className="question-text"
                            style={{
                                margin: 0,
                                flexShrink: 0,
                                fontSize: currentQuestion.question.length > 150 ? '1rem' : currentQuestion.question.length > 80 ? '1.125rem' : undefined
                            }}
                        >
                            {currentQuestion.question}
                        </h3>

                        <div className="options-grid" style={{ margin: 0, flexShrink: 0 }}>
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = answers[currentQuestion.id] === option;
                                const label = String.fromCharCode(65 + index);
                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleSelectAnswer(option)}
                                        className={`option-btn ${isSelected ? 'selected' : ''}`}
                                    >
                                        <div className="option-content-wrapper">
                                            <span className="option-label">({label})</span>
                                            <span className="option-text">{option}</span>
                                        </div>

                                        {/* Tick icon at the right edge */}
                                        <span className="option-tick">
                        {isSelected && <Check size={18} strokeWidth={3} />}
                      </span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="exam-footer">
                <button
                    onClick={handlePrev}
                    disabled={isFirstQuestion}
                    className="btn btn-secondary"
                >
                    <ChevronLeft size={20} className="mr-1" />
                    Previous
                </button>

                {isLastQuestion ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!hasAnsweredCurrent}
                        className="btn btn-primary"
                    >
                        <CheckCircle2 size={20} className="mr-2" />
                        Submit Exam
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        disabled={!hasAnsweredCurrent}
                        className="btn btn-primary"
                    >
                        Next
                        <ChevronRight size={20} className="ml-1" />
                    </button>
                )}
            </div>
        </div>
    );
}