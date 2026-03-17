import React from 'react';
import { useStore } from '../../store/useStore';

const ResultsOverlay: React.FC = () => {
  const { setOverlay, lastResult } = useStore();

  if (!lastResult) {
    setOverlay('dashboard');
    return null;
  }

  const { score, total, topicName, subjectName } = lastResult;
  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage === 100) return '🏆 Perfect score! Outstanding work!';
    if (percentage >= 80) return '🎉 Excellent! You\'re doing great!';
    if (percentage >= 60) return '👍 Good job! Keep practising!';
    if (percentage >= 40) return '📚 Not bad! Review the topic again.';
    return '💪 Keep going! Practice makes perfect!';
  };

  const getEmoji = () => {
    if (percentage >= 80) return '🌟';
    if (percentage >= 60) return '😊';
    if (percentage >= 40) return '📖';
    return '💪';
  };

  return (
    <div className="overlay-backdrop">
      <div className="overlay-card results-overlay">
        {/* Score circle */}
        <div className="results-score-circle">
          <div className="results-score-num">
            {score}/{total}
          </div>
          <div className="results-score-label">{percentage}%</div>
        </div>

        <h2 className="results-title">{getEmoji()} Quiz Complete!</h2>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-light)',
            textAlign: 'center',
            marginBottom: 4,
            fontWeight: 600,
          }}
        >
          {subjectName} – {topicName}
        </p>
        <p className="results-msg">{getMessage()}</p>

        {/* Breakdown */}
        <div className="results-breakdown">
          <div className="results-stat correct-stat">
            <div className="results-stat-num">{score}</div>
            <div className="results-stat-label">Correct ✅</div>
          </div>
          <div className="results-stat wrong-stat">
            <div className="results-stat-num">{total - score}</div>
            <div className="results-stat-label">Wrong ❌</div>
          </div>
        </div>

        {/* Actions */}
        <div className="results-actions">
          <button
            className="btn-retry"
            onClick={() => setOverlay('quiz')}
          >
            🔄 Retry Quiz
          </button>
          <button
            className="btn-back-subjects"
            onClick={() => setOverlay('subjects')}
          >
            📚 Back to Topics
          </button>
          <button
            className="btn-back-subjects"
            style={{ borderColor: 'var(--border)', color: 'var(--text-mid)' }}
            onClick={() => setOverlay('dashboard')}
          >
            🏠 Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsOverlay;
