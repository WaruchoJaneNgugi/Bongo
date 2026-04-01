import { useState, useEffect } from 'react';
import { EXAM_DATA } from './SeniorSchool/data/paperDb';
import type { AppView, Grade, Subject } from './SeniorSchool/types/school';
import './SeniorSchool/styles/portal.css';
import { useStore } from '../../store/useStore';

import heroImg from './SeniorSchool/assets/chuoimage3.jpeg';

type ExtendedView = AppView | 'INSTRUCTIONS';

const SUBJECT_ICONS: Record<string, string> = {
  Mathematics: '📐', English: '📚', Kiswahili: '✍️',
  Science: '🧪', Physics: '⚡', Chemistry: '🔬',
  Biology: '🌿', 'Social Studies': '🌍', Geography: '🗺️',
  CRE: '🙏', 'Computer Studies': '💻',
};

const getIcon = (name: string) => SUBJECT_ICONS[name] ?? '📖';

export const SeniorSchoolDashboard =() =>{
  const { levelSelections, setLevelSelection } = useStore();
  const savedGrade = levelSelections.senior_school?.grade as Grade | undefined;

  const [view, setView] = useState<ExtendedView>(savedGrade ? 'TERMS' : 'GRADES');
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(savedGrade ?? null);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (view !== 'EXAM' || !selectedSubject || timeLeft <= 0 || isTimeUp) {
      if (timeLeft === 0 && view === 'EXAM') { setIsTimeUp(true); setView('RESULTS'); }
      return;
    }
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [view, timeLeft, isTimeUp, selectedSubject]);

  const calcResults = () => {
    if (!selectedSubject) return { correct: 0, total: 0, percent: 0 };
    const total = selectedSubject.questions.length;
    const correct = selectedSubject.questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
    return { correct, total, percent: total > 0 ? Math.round((correct / total) * 100) : 0 };
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const startExam = () => {
    setTimeLeft(120); setCurrentQIndex(0); setUserAnswers({}); setIsTimeUp(false); setView('EXAM');
  };

  const gradeInfo: Record<Grade, { label: string; desc: string }> = {
    '10': { label: 'Grade 10', desc: 'Form 4 · Secondary Level' },
    '11': { label: 'Grade 11', desc: 'Form 5 · Advanced Level' },
    '12': { label: 'Grade 12', desc: 'Form 6 · Final Year' },
  };

  return (
      <div className="portal-container">

        {/* ── GRADE SELECTION ── */}
        {view === 'GRADES' && (
            <div className="grade-screen-wrap">
              <div className="grade-card">
                <h1 className="grade-card-title">Select Your Grade Level</h1>
                <p className="grade-card-subtitle">Please select your current grade level.</p>

                <div className="grade-hero-banner">
                  <img src={heroImg} alt="Students" className="grade-hero-img" />
                </div>

                <div className="grade-list">
                  {(['10', '11', '12'] as Grade[]).map(g => (
                      <button
                          key={g}
                          className={`grade-list-btn ${selectedGrade === g ? 'grade-list-btn--active' : ''}`}
                          onClick={() => { setSelectedGrade(g); setLevelSelection('senior_school', { grade: g }); }}
                      >
                        <span className="grade-list-label">{gradeInfo[g].label}</span>
                        {selectedGrade === g && <span className="grade-list-check">✓</span>}
                      </button>
                  ))}
                </div>

                <button
                    className="grade-continue-btn"
                    disabled={!selectedGrade}
                    onClick={() => setView('TERMS')}
                >
                  Continue
                </button>
              </div>
            </div>
        )}

        {/* ── TERM SELECTION ── */}
        {view === 'TERMS' && (
            <div className="selection-screen">
              <header className="ep-top-bar">
                <div className="ep-top-bar-content">
                  <span className="ep-school-name">SENIOR SECONDARY SCHOOL</span>
                </div>
              </header>
              {/*<span className="back-link" onClick={() => setView('GRADES')}>← Back</span>*/}
              <h1>Select Term</h1>
              <p className="portal-tagline">Grade {selectedGrade} · Choose an academic term</p>
              <div className="button-group">
                {['TERM 1', 'TERM 2', 'TERM 3'].map((term, i) => (
                    <button key={term} className="menu-btn" onClick={() => { setSelectedTerm(term); setView('SUBJECTS'); }}>
                      <span className="menu-btn-icon">{['📅', '📆', '🗓️'][i]}</span>
                      <span className="menu-btn-label">
                  {term}
                        <small>Academic Term {i + 1}</small>
                </span>
                      <span className="menu-btn-arrow">›</span>
                    </button>
                ))}
              </div>
            </div>
        )}

        {/* ── SUBJECT SELECTION ── */}
        {view === 'SUBJECTS' && selectedGrade && selectedTerm && (
            <div className="subject-background-box">
              <span className="back-link" onClick={() => setView('TERMS')}>← Back</span>
              <div className="subject-screen-header">
                <h2 className="subject-screen-title">Choose a Subject</h2>
                <p className="subject-screen-subtitle">Grade {selectedGrade} · {selectedTerm}</p>
              </div>
              <div className="subject-grid">
                {((EXAM_DATA as any)[selectedGrade]?.[selectedTerm] || []).map((sub: any) => (
                    <div key={sub.name} className={`subject-card ${sub.questions.length === 0 ? 'subject-card--empty' : ''}`} onClick={() => { setSelectedSubject(sub); setView('INSTRUCTIONS'); }}>
                      <div className="subject-icon-box">{getIcon(sub.name)}</div>
                      <span className="subject-name">{sub.name}</span>
                      <span className="subject-q-count">{sub.questions.length > 0 ? `${sub.questions.length} questions` : 'Coming soon'}</span>
                    </div>
                ))}
              </div>
            </div>
        )}

        {/* ── INSTRUCTIONS ── */}
        {view === 'INSTRUCTIONS' && selectedSubject && selectedSubject.questions.length === 0 && (
            <div className="instructions-card">
              <div className="instr-header-group">
                <div className="book-circle">🚧</div>
                <h1 className="instr-title">{selectedSubject.name}</h1>
                <span className="instr-subject-badge">Coming Soon</span>
              </div>
              <div className="instructions-box">
                <ul>
                  <li>Questions for this subject are not yet available.</li>
                  <li>Check back soon — content is being added regularly.</li>
                </ul>
              </div>
              <div className="instr-actions">
                <button className="start-exam-btn" onClick={() => setView('SUBJECTS')}>← Back to Subjects</button>
              </div>
            </div>
        )}

        {view === 'INSTRUCTIONS' && selectedSubject && selectedSubject.questions.length > 0 && (
            <div className="instructions-card">
              <div className="instr-header-group">
                <div className="book-circle">{getIcon(selectedSubject.name)}</div>
                <h1 className="instr-title">{selectedSubject.name}</h1>
                <span className="instr-subject-badge">📋 Exam Instructions</span>
              </div>

              <div className="instr-stats-row">
                <div className="instr-stat-pill">
                  <span className="stat-icon-blue">🕒</span>
                  <div className="stat-text">
                    <small>Duration</small>
                    <strong>2 Minutes</strong>
                  </div>
                </div>
                <div className="instr-stat-pill">
                  <span className="stat-icon-blue">📝</span>
                  <div className="stat-text">
                    <small>Questions</small>
                    <strong>{selectedSubject.questions.length} MCQs</strong>
                  </div>
                </div>
              </div>

              <div className="instructions-box">
                <ul>
                  <li>Ensure you have a stable internet connection before starting.</li>
                  <li>Do not refresh or close the page during the exam.</li>
                  <li>The exam auto-submits when the timer reaches zero.</li>
                  <li>Navigate between questions using the Next and Previous buttons.</li>
                </ul>
              </div>

              <div className="instr-actions">
                <button className="cancel-btn" onClick={() => setView('SUBJECTS')}>Cancel</button>
                <button className="start-exam-btn" onClick={startExam}>▶ Start Exam</button>
              </div>
            </div>
        )}


        {/* ── EXAM ── */}
        {view === 'EXAM' && selectedSubject && (() => {
          const q = selectedSubject.questions[currentQIndex];
          const total = selectedSubject.questions.length;
          const progress = ((currentQIndex + 1) / total) * 100;
          return (
              <div className="question-card">
                <header className="exam-header">
                  <div className="exam-header-left">
                    <span className="subject-title">{selectedSubject.name}</span>
                    <div className="exam-progress-bar-wrap">
                      <div className="exam-progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className={`timer-badge ${timeLeft < 20 ? 'timer-warning' : ''}`}>
                    <span className="timer-dot" />
                    {fmt(timeLeft)}
                  </div>
                </header>

                <div className="exam-content">
                  <span className="q-number-label">Question {currentQIndex + 1} of {total}</span>
                  <h2 className="question-text">{q?.text}</h2>
                  <div className="options-grid">
                    {(['A', 'B', 'C', 'D'] as const).map(letter => (
                        <button
                            key={letter}
                            onClick={() => setUserAnswers({ ...userAnswers, [q.id]: letter })}
                            className={`option-btn ${userAnswers[q.id] === letter ? 'selected' : ''}`}
                        >
                          <span className="option-letter">{letter}</span>
                          <span className="option-text">{(q.options as any)[letter]}</span>
                        </button>
                    ))}
                  </div>
                </div>

                <footer className="exam-footer">
                  <button className="nav-btn prev" disabled={currentQIndex === 0} onClick={() => setCurrentQIndex(p => p - 1)}>
                    ← Prev
                  </button>
                  <div className="exam-footer-center">
                    {selectedSubject.questions.map((_, i) => (
                        <div
                            key={i}
                            className={`q-dot ${i === currentQIndex ? 'current' : userAnswers[selectedSubject.questions[i].id] ? 'answered' : ''}`}
                            onClick={() => setCurrentQIndex(i)}
                        />
                    ))}
                  </div>
                  {currentQIndex < total - 1 ? (
                      <button className="nav-btn next" onClick={() => setCurrentQIndex(p => p + 1)}>Next →</button>
                  ) : (
                      <button className="nav-btn finish" onClick={() => setView('RESULTS')}>Submit ✓</button>
                  )}
                </footer>
              </div>
          );
        })()}

        {/* ── RESULTS ── */}
        {view === 'RESULTS' && selectedSubject && (() => {
          const { correct, total, percent } = calcResults();
          return (
              <div className="results-wrapper">
                <div className="results-card">
                  <div className="results-top">
                    <div className="results-badge">{percent >= 70 ? '🏆' : percent >= 50 ? '👍' : '📚'}</div>
                    <h1>{percent >= 70 ? 'Well Done!' : percent >= 50 ? 'Good Effort!' : 'Keep Practicing!'}</h1>
                    <p className="results-subtitle">
                      <span>Grade {selectedGrade}</span>
                      <span>{selectedSubject.name}</span>
                      <span>{selectedTerm}</span>
                    </p>
                  </div>

                  <div className="score-summary-flex">
                    <div className="score-circle-outer" style={{ '--pct': percent } as any}>
                      <div className="score-circle-inner">
                        <span className="score-big-text">{percent}%</span>
                        <span className="score-label">Score</span>
                      </div>
                    </div>
                    <div className="stats-column">
                      <div className="stat-pill correct">✓ {correct} Correct</div>
                      <div className="stat-pill incorrect">✗ {total - correct} Incorrect</div>
                      <p className="total-text">{total} total questions</p>
                    </div>
                  </div>

                  <div className="results-actions">
                    <button className="try-again-btn" onClick={startExam}>🔄 Try Again</button>
                    <button className="new-subject-btn" onClick={() => setView('SUBJECTS')}>📚 New Subject</button>
                  </div>
                </div>

                <div className="results-card review-card-container">
                  <h3 className="review-title">📋 Question Review</h3>
                  <div className="review-list">
                    {selectedSubject.questions.map((q, idx) => (
                        <div key={q.id} className={`review-box ${userAnswers[q.id] === q.correctAnswer ? 'is-correct' : 'is-wrong'}`}>
                          <p>
                            <span className="status-icon">{userAnswers[q.id] === q.correctAnswer ? '✅' : '❌'}</span>
                            <span><strong>Q{idx + 1}:</strong> {q.text}</span>
                          </p>
                          {userAnswers[q.id] !== q.correctAnswer && (
                              <div className="correct-answer-hint">
                                Correct answer: <span className="purple-hint">{q.correctAnswer}</span>
                              </div>
                          )}
                        </div>
                    ))}
                  </div>
                </div>
              </div>
          );
        })()}

      </div>
  );
}
