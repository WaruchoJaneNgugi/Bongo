import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { questions, topics, subjects } from '../../data/quizData';

type OptionKey = 'a' | 'b' | 'c' | 'd';

const QuizOverlay: React.FC = () => {
  const { setOverlay, currentTopicId, currentSubjectId, saveResult } = useStore();

  const topicQuestions = useMemo(
    () => questions.filter((q) => q.topicId === currentTopicId).slice(0, 5),
    [currentTopicId]
  );

  const topic = topics.find((t) => t.id === currentTopicId);
  const subject = subjects.find((s) => s.id === currentSubjectId);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const currentQ = topicQuestions[currentIdx];
  const progress = ((currentIdx) / topicQuestions.length) * 100;

  const handleSelect = (key: OptionKey) => {
    if (answered) return;
    setSelected(key);
    setAnswered(true);
    if (key === currentQ.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= topicQuestions.length) {
      // Save result
      saveResult({
        topicId: currentTopicId ?? '',
        topicName: topic?.name ?? '',
        subjectName: subject?.name ?? '',
        score: selected === currentQ.correct ? score : score, // already tallied
        total: topicQuestions.length,
        date: new Date().toLocaleDateString(),
      });
      setOverlay('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  // Edge case: no questions
  if (topicQuestions.length === 0) {
    return (
      <div className="overlay-backdrop" onClick={() => setOverlay('subjects')}>
        <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
          <button className="overlay-close" onClick={() => setOverlay('subjects')}>✕</button>
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚧</div>
            <h2 className="overlay-title">Coming Soon!</h2>
            <p className="overlay-subtitle">Questions for this topic are being prepared.</p>
            <button className="form-submit" onClick={() => setOverlay('subjects')}>
              Back to Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  const optionLabels: OptionKey[] = ['a', 'b', 'c', 'd'];

  const getOptionClass = (key: OptionKey) => {
    if (!answered) return 'quiz-option';
    if (key === currentQ.correct) return 'quiz-option revealed-correct';
    if (key === selected && key !== currentQ.correct) return 'quiz-option wrong';
    return 'quiz-option';
  };

  return (
    <div className="overlay-backdrop" onClick={() => setOverlay('subjects')}>
      <div
        className="overlay-card quiz-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="overlay-close" onClick={() => setOverlay('subjects')}>✕</button>

        <button className="back-btn" onClick={() => setOverlay('subjects')}>
          ← {subject?.name}
        </button>

        {/* Progress */}
        <div className="quiz-meta">
          <span className="quiz-counter">
            Question {currentIdx + 1} of {topicQuestions.length}
          </span>
          <span className="quiz-score-live">
            Score: {score}/{topicQuestions.length}
          </span>
        </div>
        <div className="quiz-progress-bar-wrap">
          <div
            className="quiz-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Topic label */}
        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: 'var(--purple-pale)',
            color: 'var(--purple-primary)',
            borderRadius: 20,
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          {topic?.name}
        </div>

        {/* Question */}
        <p className="quiz-question">{currentQ.question}</p>

        {/* Options */}
        <div className="quiz-options">
          {optionLabels.map((key) => (
            <button
              key={key}
              className={getOptionClass(key)}
              onClick={() => handleSelect(key)}
              disabled={answered}
            >
              <span className="option-label">{key.toUpperCase()}</span>
              {currentQ.options[key]}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {answered && (
          <div
            className={`quiz-explanation ${
              selected !== currentQ.correct ? 'wrong-exp' : ''
            }`}
          >
            {selected === currentQ.correct ? '✅ ' : '❌ '}
            <strong>
              {selected === currentQ.correct ? 'Correct! ' : `Correct answer: ${currentQ.options[currentQ.correct]}. `}
            </strong>
            {currentQ.explanation}
          </div>
        )}

        {/* Next button */}
        {answered && (
          <button className="quiz-next-btn" onClick={handleNext}>
            {currentIdx + 1 >= topicQuestions.length ? 'See Results →' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizOverlay;
