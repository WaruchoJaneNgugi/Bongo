import React from 'react';
import { useStore } from '../../store/useStore';
import { subjects, topics } from '../../data/quizData';

const SubjectsOverlay: React.FC = () => {
  const { setOverlay, currentSubjectId, setCurrentTopic } = useStore();

  const subject = subjects.find((s) => s.id === currentSubjectId);
  const subjectTopics = topics.filter((t) => t.subjectId === currentSubjectId);

  const handleTopic = (topicId: string) => {
    setCurrentTopic(topicId);
    setOverlay('quiz');
  };

  return (
    <div className="overlay-backdrop" onClick={() => setOverlay('dashboard')}>
      <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
        <button className="overlay-close" onClick={() => setOverlay('dashboard')}>✕</button>

        <button className="back-btn" onClick={() => setOverlay('dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="overlay-logo">BongoQuiz</div>
        <h2 className="overlay-title">
          {subject?.icon} {subject?.name}
        </h2>
        <p className="overlay-subtitle">Choose a topic to start revising</p>

        <div className="topics-list">
          {subjectTopics.map((topic, idx) => (
            <button
              key={topic.id}
              className="topic-item"
              onClick={() => handleTopic(topic.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'var(--purple-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </span>
                <span className="topic-item-name">{topic.name}</span>
              </div>
              <span className="topic-item-arrow">→</span>
            </button>
          ))}
        </div>

        {subjectTopics.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '32px 0',
              color: 'var(--text-light)',
              fontWeight: 600,
            }}
          >
            More topics coming soon! 🚀
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsOverlay;
