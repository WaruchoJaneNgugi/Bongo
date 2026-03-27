import type {Question} from '../types';
import { calculatePercentage, getGradeFeedback } from '../utils/score';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

interface Props {
  questions: Question[];
  answers: Record<number, string>;
  onRestart: () => void;
}

export default function ResultsView({ questions, answers, onRestart }: Props) {
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const wrongAnswers = totalQuestions - correctAnswers;
  const percentage = calculatePercentage(correctAnswers, totalQuestions);
  const feedback = getGradeFeedback(percentage);

  const incorrectQuestions = questions.filter(q => answers[q.id] !== q.correctAnswer);

  return (
      <div className="max-w-2xl results-view-container">
        {/* Summary Card */}
        <div className="results-summary">
          <div className="award-icon">
            <Award />
          </div>

          <h2 className="page-title text-gradient mb-2">{feedback}</h2>
          <p className="page-subtitle mb-6">Here is how you performed.</p>

          <div className="stats-grid mb-6">
            <div className="stat-box total">
              <div className="stat-label">Total</div>
              <div className="stat-value">{totalQuestions}</div>
            </div>
            <div className="stat-box correct">
              <div className="stat-label">Correct</div>
              <div className="stat-value">{correctAnswers}</div>
            </div>
            <div className="stat-box wrong">
              <div className="stat-label">Wrong</div>
              <div className="stat-value">{wrongAnswers}</div>
            </div>
            <div className="stat-box score">
              <div className="stat-label">Score</div>
              <div className="stat-value">{percentage}%</div>
            </div>
          </div>

          <div className="sticky-mobile-btn-container">
            <button
                onClick={onRestart}
                className="btn btn-primary"
            >
              <RotateCcw size={24} className="mr-3" />
              Take Another Exam
            </button>
          </div>
        </div>

        {/* Answer Review Section */}
        {incorrectQuestions.length > 0 && (
            <div>
              <h3 className="card-title mb-6">Review Incorrect Answers</h3>
              <div>
                {incorrectQuestions.map((q, index) => (
                    <div key={q.id} className="review-item">
                      <div className="review-header">
                        <div className="review-number">
                          {index + 1}
                        </div>
                        <div>
                          <div className="review-topic">
                            Topic: {q.topic}
                          </div>
                          <h4 className="review-question">{q.question}</h4>
                        </div>
                      </div>

                      <div className="grid grid-2 mb-6">
                        <div className="answer-box wrong">
                          <div className="answer-label">
                            <XCircle size={20} className="mr-2" />
                            Your Answer
                          </div>
                          <div className="text-lg">
                            {answers[q.id] || <span className="italic text-muted">No answer provided</span>}
                          </div>
                        </div>

                        <div className="answer-box correct">
                          <div className="answer-label">
                            <CheckCircle2 size={20} className="mr-2" />
                            Correct Answer
                          </div>
                          <div className="text-lg font-bold">{q.correctAnswer}</div>
                        </div>
                      </div>

                      <div className="explanation-box">
                        <div className="explanation-label">
                          Explanation
                        </div>
                        <p className="text-lg">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}

        {incorrectQuestions.length === 0 && (
            <div className="perfect-score">
              <div className="perfect-icon">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="card-title text-emerald mb-3">Perfect Score!</h3>
              <p className="text-emerald text-lg">You answered all questions correctly. Great job!</p>
            </div>
        )}
      </div>
  );
}
