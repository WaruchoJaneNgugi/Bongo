import { useState, useEffect } from 'react';
import type { Topic } from '../types/types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, BookOpen } from 'lucide-react';

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}

type Props = {
  topic: Topic;
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
};

export default function Quiz({ topic, onBack, onComplete }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showLowScorePopup, setShowLowScorePopup] = useState(false);
  const [showHighScorePopup, setShowHighScorePopup] = useState(false);

  const question = topic.quiz[currentQuestionIndex];
  const isCorrect = selectedOption === question?.correctAnswerIndex;

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === question.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < topic.quiz.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const percentage = Math.round((score / topic.quiz.length) * 100);
      if (percentage < 70) {
        setShowLowScorePopup(true);
      } else {
        setShowHighScorePopup(true);
      }
      onComplete(score, topic.quiz.length);
    }
  };

  if (isFinished) {
    const percentage = Math.round((score / topic.quiz.length) * 100);
    return (
        <div className="mlearn-quiz-finished">
          <AnimatePresence>
            {showLowScorePopup && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 50,
                      padding: '1rem'
                    }}
                >
                  <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        padding: '2rem',
                        maxWidth: '24rem',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                  >
                    <div style={{
                      width: '4rem',
                      height: '4rem',
                      backgroundColor: '#fee2e2',
                      color: '#ef4444',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem'
                    }}>
                      <BookOpen size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                      Keep Practicing!
                    </h3>
                    <p style={{ color: '#4b5563', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      You scored {percentage}%. We advise you to re-read the topic material and take the revision questions again to improve your understanding.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                      <button
                          onClick={() => {
                            setShowLowScorePopup(false);
                            onBack();
                          }}
                          className="mlearn-btn-primary"
                      >
                        Re-read Topic
                      </button>
                      <button
                          onClick={() => {
                            setShowLowScorePopup(false);
                          }}
                          style={{
                            padding: '1rem',
                            backgroundColor: '#f3f4f6',
                            color: '#4b5563',
                            fontWeight: 600,
                            borderRadius: '0.75rem',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                      >
                        View Score
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
            )}

            {showHighScorePopup && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 50,
                      padding: '1rem'
                    }}
                >
                  <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        padding: '2rem',
                        maxWidth: '24rem',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                  >
                    <div style={{
                      width: '4rem',
                      height: '4rem',
                      backgroundColor: '#dcfce3',
                      color: '#22c55e',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem'
                    }}>
                      <Trophy size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                      Congratulations!
                    </h3>
                    <p style={{ color: '#4b5563', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      You scored {percentage}%. Excellent work! You have mastered this material and are ready to move on to the next topic.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                      <button
                          onClick={() => {
                            setShowHighScorePopup(false);
                            onBack();
                          }}
                          className="mlearn-btn-primary"
                      >
                        Next Topic
                      </button>
                      <button
                          onClick={() => {
                            setShowHighScorePopup(false);
                          }}
                          style={{
                            padding: '1rem',
                            backgroundColor: '#f3f4f6',
                            color: '#4b5563',
                            fontWeight: 600,
                            borderRadius: '0.75rem',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                      >
                        View Score
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
            )}
          </AnimatePresence>

          <div className="mlearn-quiz-finished-inner">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mlearn-quiz-trophy"
            >
              <Trophy size={48} />
            </motion.div>

            <h2 className="mlearn-detail-title">Quiz Completed!</h2>
            <p className="mlearn-page-subtitle" style={{marginBottom: '2rem'}}>You have finished the revision quiz for {topic.title}.</p>

            <div className="mlearn-quiz-score-card">
              <div className="mlearn-quiz-score-value">
                {score} <span className="mlearn-quiz-score-total">/ {topic.quiz.length}</span>
              </div>
              <p className="mlearn-page-subtitle" style={{fontWeight: 500}}>
                {percentage >= 80 ? 'Excellent work!' : percentage >= 50 ? 'Good job, keep practicing!' : 'Review the topic and try again.'}
              </p>
            </div>

            <button
                onClick={onBack}
                className="mlearn-btn-primary"
            >
              Back to Topics
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="mlearn-quiz-container">
        <div className="mlearn-quiz-header">
          <button onClick={onBack} className="mlearn-btn-back" style={{marginBottom: 0}}>
            <ArrowLeft size={24} />
          </button>
          <div className="mlearn-quiz-progress-text">
            Question {currentQuestionIndex + 1} of {topic.quiz.length}
          </div>
          <div style={{width: '24px'}} /> {/* Spacer */}
        </div>

        <div className="mlearn-quiz-content">
          <div className="mlearn-quiz-content-inner">
            <div className="mlearn-progress-container" style={{marginBottom: '2rem'}}>
              <div className="mlearn-progress-bar-bg">
                <div
                    className="mlearn-progress-bar-fill"
                    style={{ width: `${(currentQuestionIndex / topic.quiz.length) * 100}%`, backgroundColor: '#2563eb' }}
                />
              </div>
            </div>

            <h2 className="mlearn-quiz-question">
              <TypewriterText text={`${currentQuestionIndex + 1}. ${question.text}`} />
            </h2>

            <div className="mlearn-quiz-options">
              {question.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrectOption = index === question.correctAnswerIndex;

                let btnClass = "mlearn-quiz-option-btn ";

                if (isAnswered) {
                  if (isCorrectOption) {
                    btnClass += "mlearn-correct";
                  } else if (isSelected) {
                    btnClass += "mlearn-incorrect";
                  } else {
                    btnClass += "mlearn-disabled";
                  }
                }

                return (
                    <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        disabled={isAnswered}
                        className={btnClass}
                    >
                      <div className="mlearn-quiz-option-content">
                  <span className={`mlearn-quiz-option-text ${isAnswered && (isCorrectOption || isSelected) ? 'mlearn-active' : ''}`}>
                    {option}
                  </span>
                        {isAnswered && isCorrectOption && <CheckCircle2 color="#22c55e" size={20} />}
                        {isAnswered && isSelected && !isCorrectOption && <XCircle color="#ef4444" size={20} />}
                      </div>
                    </button>
                );
              })}
            </div>

            <AnimatePresence>
              {isAnswered && (
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mlearn-quiz-feedback ${isCorrect ? 'mlearn-correct' : 'mlearn-incorrect'}`}
                  >
                    <p className="mlearn-quiz-feedback-title">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
                    <p className="mlearn-quiz-feedback-text">{question.explanation}</p>
                  </motion.div>
              )}
            </AnimatePresence>

            <div style={{marginTop: 'auto'}}>
              <button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  className="mlearn-btn-primary"
              >
                {currentQuestionIndex < topic.quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
